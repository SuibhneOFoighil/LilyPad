import { NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse } from "ai";

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

import type { ItemCitation } from "@/types/client";
import { supabase as client } from "../client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // console.log("POST request received");
  try {
    const body = await req.json();

    // console.log("request body", body)
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;
    const requestedIds: number[] = body.itemIds ?? [];
    const requestedIdsString = `(${requestedIds.join(',')})`;
    console.log("requestedIdsString", requestedIdsString);

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.2
    });

    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    const idFilterFN: SupabaseFilterRPCCall = (rpc) =>
      rpc.filter("metadata->>item_id", "in", requestedIdsString);

    // multi-query retrieval
    const retriever = MultiQueryRetriever.fromLLM({
      llm: model,
      retriever: vectorstore.asRetriever(
        5, // number of documents to retrieve
        idFilterFN // metadata filter function
      ),
      verbose: true,
    });

    const documents = await retriever.getRelevantDocuments(currentMessageContent) 
    addMetadata(documents)
    const context = combineDocuments(documents);
    
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

    const stream = await answerChain.stream({
      context: context,
      question: currentMessageContent,
    });

    const serializedCitations = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          const { item_id, page_number, citation_number } = doc.metadata;
          const citation : ItemCitation = { item_id, page_number, citation_number };
          return citation;
        })
      ),
    ).toString("base64");

    return new StreamingTextResponse(stream, {
      headers: {
        "x-message-index": (previousMessages.length + 1).toString(),
        "x-citations": serializedCitations,
      },
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function addMetadata(documents: Document[]) : void {
  // add citation_number to documents
  documents.map((doc, i) => {
    const citation_number = i + 1
    const metadata = {...doc.metadata, citation_number}
    documents[i] = {...doc, metadata}
  });
}

function combineDocuments(documents: Document[] | undefined) : string {
  if (!documents) {
    return "SORRY, NO DOCUMENTS FOUND. TRY AND BE HELPFUL."
  }
  const serializedDocs = documents.map(
    (doc) => {
      const content = doc.pageContent
      const { citation_number } = doc.metadata
      return `[${citation_number}]: "${content}"`
    }
  )
  return serializedDocs.join('\n\n');
}

// async function addItemMetadata(documents:Document[]) : Promise<Document[] | undefined> {
  //   const item_ids = documents.map((doc) => doc.metadata.item_id)
  //   try {
  //     // 1. query supabase for items
  //     const {data, error} = await client.from("items").select("*").in("id", item_ids)
  //     if (error) {
  //       console.log(error);
  //     }
  //     else {
  //       // 2. add item metadata to documents
  //       const items_lookup: Record<number, any> = {}
  //       data.map((item) => {
  //         const id = item.id
  //         items_lookup[id] = item
  //       })
  
  //       // 3. return documents
  //       return documents.map((doc) => {
  //         const item_id = doc.metadata.item_id
  //         const item_data = items_lookup[item_id]
  //         const metadata = {...doc.metadata, item_data}
  //         return {...doc, metadata}
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }