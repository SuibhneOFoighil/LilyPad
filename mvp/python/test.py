import os
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, BytesOutputParser
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import SupabaseVectorStore
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from supabase import create_client, Client
from load import load_documents_from_youtube_url
from tqdm import tqdm
from dotenv import load_dotenv

def load_test_data():
    urls = [
        'https://www.youtube.com/watch?v=xLNL6hSCPhc',
        'https://www.youtube.com/watch?v=Cer_pxh4tRY',
        'https://www.youtube.com/watch?v=SedGB8m2XLM',
        'https://www.youtube.com/watch?v=ky5ZB-mqZKM'
    ]

    docs = []
    for url in tqdm(urls):
        docs_url = load_documents_from_youtube_url(url)
        docs.extend(docs_url)

    # create the open-source embedding function
    embeddings = OpenAIEmbeddings()

    # create the supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # create the vectorstore
    vector_store = SupabaseVectorStore.from_documents(
        docs,
        embeddings,
        client=supabase,
        table_name="documents",
        query_name="match_documents"
    )

    query = "What did the president say about Ketanji Brown Jackson"
    matched_docs = vector_store.similarity_search(query)
    print(matched_docs[0].page_content)

def test_qa_response():

    # Get the path to the directory this file is in
    BASEDIR = os.path.abspath(os.path.dirname(__file__))

    # change to parent directory
    os.chdir(BASEDIR + "/..")

    # load the environment variables
    load_dotenv('.env.local')

    # print the environment variables
    print(os.environ["SUPABASE_URL"])
    print(os.environ["SUPABASE_KEY"])

    client: Client = create_client(
        supabase_url=os.environ["SUPABASE_URL"],
        supabase_key=os.environ["SUPABASE_KEY"]
    )
    embeddings = OpenAIEmbeddings()
    vectorstore = SupabaseVectorStore(
        embedding=embeddings,
        client=client,
        table_name="documents",
        query_name="match_documents"
    )
    retriever = vectorstore.as_retriever()
    template = """Answer the question based only on the following context:
    {context}

    Question: {question}
    """
    prompt = ChatPromptTemplate.from_template(template)
    model = ChatOpenAI()
    output_parser = BytesOutputParser()

    setup_and_retrieval = RunnableParallel(
        {"context": retriever, "question": RunnablePassthrough()}
    )

    chain = setup_and_retrieval | prompt | model | output_parser

    respose = chain.stream("What did the president say about Ketanji Brown Jackson")

    for r in respose:
        print(r)
    

    

if __name__ == "__main__":
    # load_test_data()
    test_qa_response()