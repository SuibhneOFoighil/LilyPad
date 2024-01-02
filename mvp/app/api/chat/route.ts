import { NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { SupabaseFilterRPCCall, SupabaseVectorStore } from "langchain/vectorstores/supabase";
import {
  RunnableSequence
} from "langchain/schema/runnable";
import { BytesOutputParser} from "langchain/schema/output_parser";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { Document } from "langchain/dist/document";

export const runtime = "edge";

function combineDocuments(documents: Document[]) {
  const serializedDocs = documents.map(
    (doc, i) => {
      const title = doc.metadata["title"]
      const author = doc.metadata["author"]
      const content = doc.pageContent
      return `[${i+1}] from "${title}" by ${author}: \n "${content}"`
    }
  )
  return serializedDocs.join('\n\n');
}
/**
 * This handler initializes and calls a retrieval chain. It composes the chain using
 * LangChain Expression Language. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#conversational-retrieval-chain
 */
export async function POST(req: NextRequest) {
  console.log("POST request received");
  try {
    const body = await req.json();

    console.log("request body", body)

    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;
    const requestedIds: string[] = body.itemIds ?? [];
    const requestedIdsString = `(${requestedIds.join(',')})`;
    // console.log("requestedIdsString", requestedIdsString);
    const idFilterFN: SupabaseFilterRPCCall = (rpc) =>
      rpc.filter("metadata->>video_id", "in", requestedIdsString);

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.2
    });

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );

    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    // multi-query retrieval
    const retriever = MultiQueryRetriever.fromLLM({
      llm: model,
      retriever: vectorstore.asRetriever(
        5, // number of documents to retrieve
        idFilterFN // metadata filter function
      ),
      // verbose: true,
    });

    const documents = await retriever.getRelevantDocuments(currentMessageContent);
    const context = combineDocuments(documents)

    console.log("Context: ", context);

    const prompt = PromptTemplate.fromTemplate(`Take a deep breath. This is very important for my career.
    
    % Role %
    You are an expert teacher. You want to help your students understand the provided material.

    % Formatting Instructions %
    If you reference the quotes, only cite the numbers and always cite them individually in your response, like so: 'I have always supported dogs [1][2].' or 'I have always supported dogs [1] and cats [2].'
    Limit your reponse to 300 words or less.

    -----
    Ready?
  
    Student's Question:  {question}

    Material: {context}
    
    Your Answer:`);

    const answerChain = RunnableSequence.from([
      prompt,
      model,
      new BytesOutputParser(),
    ]);

    const stream  = await answerChain.stream({
      context: context,
      question: currentMessageContent,
    });

    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc, i) => {
          return {
            citationNumber: i + 1,
            pageContent: doc.pageContent.slice(0, 50) + "...",
            metadata: doc.metadata,
          };
        }),
      ),
    ).toString("base64");

    return new StreamingTextResponse(stream, {
      headers: {
        "x-message-index": (previousMessages.length + 1).toString(),
        "x-sources": serializedSources,
      },
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const messages = body.messages ?? [];
//     const previousMessages = messages.slice(0, -1);
//     const currentMessageContent = messages[messages.length - 1].content;

//     // post to flask server
//     const flaskServer = 'http://localhost:3000/api/chat/qa';

//     // Create a new request to the flask server
//     const flaskRequest = new Request(flaskServer, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//         messages: previousMessages, 
//         query: currentMessageContent 
//       }),
//     });

//     // Fetch the flask server
//     const flaskResponse = await fetch(flaskRequest);
//     const flaskResponseJson = await flaskResponse.json();
//     const stream = flaskResponseJson.stream;
    
//     // Respond with the stream
//     return stream;
//   } catch (error) {
//     // Handle the error here
//     console.error(error);
//     throw error;
//   }
// }