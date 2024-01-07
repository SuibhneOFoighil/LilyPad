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
import type { Document } from "langchain/dist/document";

import type { Item, CitedItem } from "@/types/client";

export const runtime = "edge";

function combineDocuments(documents: Document[]) {
  const serializedDocs = documents.map(
    (doc, i) => {
      const metadata = doc.metadata
      const content = doc.pageContent
      const {
        name,
        author,
        course
      } = metadata
      return `[${i+1}] from "${name}" taught by ${author} in ${course}: \n "${content}"`
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
  // console.log("POST request received");
  try {
    const body = await req.json();

    // console.log("request body", body)

    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;
    const requestedIds: string[] = body.itemIds ?? [];
    const requestedIdsString = `(${requestedIds.join(',')})`;
    // console.log("requestedIdsString", requestedIdsString);

    const idFilterFN: SupabaseFilterRPCCall = (rpc) =>
      rpc.filter("metadata->>item_id", "in", requestedIdsString);

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
    
    // get additional information about items (is this going to work?)
    const item_ids: number[] = documents.map((doc) => doc.metadata.item_id)
    const items_lookup: Record<number, any> = {} 
    item_ids.map(async (id) => {
      if (!(id in items_lookup)) {
        console.log("searching for item_id =", id);
        const { data, error } = await client.from("items").select("*").eq("id", id);
        if (error) {
          console.log(error);
        }
        else {
          console.log("recieved:", data);
          items_lookup[id] = data;
        }
      }
    })
    console.log(items_lookup)
    // add item information to documents
    documents.map((doc) => {
      const item_id = doc.metadata.item_id
      const item_data = items_lookup[item_id]
      doc.metadata = {...doc.metadata, item_data}
    })

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
          const { id, pageNumber } = doc.metadata;
          // const url = `https://www.youtube.com/embed/${video_id}?autoplay=1&start=${timestamp}`;
          // grab details about item from items table
          const {
            name,
            sourceUrl,
            author,
            courseName,
            summary
          } = items_lookup[id]
          const citation: CitedItem = {
            id,
            name,
            author,
            sourceUrl,
            courseName,
            pageNumber,
            documentContent: doc.pageContent,
            citationNumber: i + 1,
          };
          return citation;
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