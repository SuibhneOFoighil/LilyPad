import os

from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import SupabaseVectorStore
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

from flask import Flask, jsonify, request
from flask_cors import CORS

from supabase import create_client, Client

from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv("../.env.local")
client: Client = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_KEY"]
)
embeddings = OpenAIEmbeddings()
vector_store = SupabaseVectorStore(
    embedding=embeddings,
    client=client,
    table_name="documents",
    query_name="match_documents"
)

@app.route("/api/chat/qa", methods=["POST"])
def QAresponse() -> str:
    """Returns a response to a question based on a context."""

    try:
        query_arg = request.args.get("query")
        retriever = vectorstore.as_retriever()
        prompt = ChatPromptTemplate.from_template(template)
        model = ChatOpenAI()
        output_parser = BytesOutputParser()

        setup_and_retrieval = RunnableParallel(
            {"context": retriever, "question": RunnablePassthrough()}
        )

        chain = setup_and_retrieval | prompt | model | output_parser

        stream = chain.stream(query_arg)
        
        return jsonify({
            "stream": stream
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)