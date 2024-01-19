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

import type { FileCitation } from "@/types/client";
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
    const requestedFileIds = body.selectedFileIds ?? [];
    const requestedCourseIds = body.selectedCourseIds ?? [];

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.2
    });

    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    const idFilterFN: SupabaseFilterRPCCall = await get_filter_fn(requestedFileIds, requestedCourseIds);

    // multi-query retrieval
    const retriever = MultiQueryRetriever.fromLLM({
      llm: model,
      retriever: vectorstore.asRetriever(
        3, // number of documents to retrieve
        idFilterFN // metadata filter function
      ),
      // verbose: true,
    });

    const documents = await retriever.getRelevantDocuments(currentMessageContent) 
    addMetadata(documents)
    const context = combineDocuments(documents);

    // console.log("Context: ", context);

    const prompt = PromptTemplate.fromTemplate(`Take a deep breath. This is very important for my career.
    
    % Role %
    You are an expert teacher. You want to help your students understand the provided material.

    % Formatting Instructions %
    If you reference the quotes, only cite the numbers and always cite them individually in your response, like so: 'I have always supported dogs [1][2].' or 'I have always supported dogs [1] and cats [2].'
    Limit your reponse to 100 words or less.

    -----
    Ready?
  
    Student's Question:  {question}

    Material: {context}
    
    Your Answer in 100 words or less:`);

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
          const citation : FileCitation = {
            file_id: item_id,
            number: citation_number,
            page_number,
            doc_content: doc.pageContent,
          };
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

async function get_filter_fn(requestedFileIds: number[], requestedCourseIds: number[]) : Promise<SupabaseFilterRPCCall> {

  if (requestedFileIds.length === 0 && requestedCourseIds.length === 0) {
    return (rpc) => rpc;
  }

  let requestedFileIdsString = `(${requestedFileIds.join(',')})`;

  if (requestedCourseIds.length > 0) {

    let requestedIdsSet = new Set<number>(requestedFileIds);
    
    // get all file_ids associated with requested course_ids
    const { data: courseFileIds, error } = await client
      .from("courses")
      .select("file_ids")
      .in("id", requestedCourseIds);

    // console.log("courseFileIds", courseFileIds);

    courseFileIds?.forEach((course) => {
      const fileIds = course.file_ids;
      fileIds.forEach((fileId: number) => requestedIdsSet.add(fileId));
    });

    // console.log("requestedIdsSet", requestedIdsSet);

    const allReqFileIds = Array.from(requestedIdsSet);
    requestedFileIdsString = `(${allReqFileIds.join(',')})`;
  }

  // console.log("requestedFileIdsString", requestedFileIdsString);

  // TODO: change item_id to file_id
  const idFilterFN: SupabaseFilterRPCCall = (rpc) => rpc.filter("metadata->>item_id", "in", requestedFileIdsString);
  return idFilterFN;
}