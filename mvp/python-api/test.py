import os
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import SupabaseVectorStore
from supabase import create_client, Client
from YouTubeLoader import load_documents_from_youtube_url
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
    supabase: Client = create_client(
        os.getenv('SUPABASE_URL'),
        os.getenv('SUPABASE_KEY')
    )

    # create the vectorstore
    vector_store = SupabaseVectorStore.from_documents(
        docs,
        embeddings,
        client=supabase,
        table_name="documents",
        query_name="match_documents"
    )

def create_item_tables():
    # create the supabase client
    supabase: Client = create_client(
        os.getenv('SUPABASE_URL'),
        os.getenv('SUPABASE_KEY')
    )

    supabase.table('items').insert([
        {
            "id": 1,
            "title": "Token Cost Reduction through LLMLingua's Prompt Compression",
            "author": "AIAnytime",
            "type": "video",
            "source": {
                "type": "youtube",
                "url": "https://www.youtube.com/watch?v=xLNL6hSCPhc",
                "metadata": {
                    "video_id": "xLNL6hSCPhc",
                }
            }
        },
        {
            "id": 2,
            "title": "Decoding RAG: Algorithms That Power Vector Databases",
            "author": "AIAnytime",
            "type": "video",
            "source": {
                "type": "youtube",
                "url": "https://www.youtube.com/watch?v=Cer_pxh4tRY",
                "metadata": {
                    "video_id": "Cer_pxh4tRY",
                }
            }
        },
        {
            "id": 3,
            "title": "I used LLaMA 2 70B to rebuild GPT Banker...and its AMAZING (LLM RAG)",
            "author": "Nicholas Renotte",
            "type": "video",
            "source": {
                "type": "youtube",
                "url": "https://www.youtube.com/watch?v=SedGB8m2XLM",
                "metadata": {
                    "video_id": "SedGB8m2XLM",
                }
            }
        },
        {
            "id": 4,
            "title": "AI influencers are getting filthy rich... let's build one",
            "author": "Fireship",
            "type": "video",
            "source": {
                "type": "youtube",
                "url": "https://www.youtube.com/watch?v=ky5ZB-mqZK",
                "metadata": {
                    "video_id": "ky5ZB-mqZK",
                }
            }
        },
    ]).execute()

def clear_tables():
    print("Clearing tables...")
    # create the supabase client
    supabase: Client = create_client(
        os.getenv('SUPABASE_URL'),
        os.getenv('SUPABASE_KEY')
    )

    supabase.table('items').delete().neq('title',"...").execute()
    supabase.table('documents').delete().neq('content', "...").execute()

from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader
from unstructured.cleaners.core import clean_extra_whitespace
from  langchain.schema import Document
import json
from typing import Iterable

def save_docs_to_jsonl(array:Iterable[Document], file_path:str)->None:
    with open(file_path, 'w') as jsonl_file:
        for doc in array:
            jsonl_file.write(doc.json() + '\n')

def load_docs_from_jsonl(file_path)->Iterable[Document]:
    array = []
    with open(file_path, 'r') as jsonl_file:
        for line in jsonl_file:
            data = json.loads(line)
            obj = Document(**data)
            array.append(obj)
    return array
    
def load_course_files():
    """ Loads the course files from the test-files directory. """
    # create the supabase client
    supabase: Client = create_client(
        os.getenv('SUPABASE_URL'),
        os.getenv('SUPABASE_KEY')
    )

    loader = DirectoryLoader(
        path='test-files',
        show_progress=True,
        loader_cls=UnstructuredFileLoader,
        loader_kwargs={
            "mode": "elements",
            "post_processors": [clean_extra_whitespace]
        }
    )

    docs = loader.load_and_split()

    print("Loaded", len(docs), "documents.")

    # save documents to local filestore
    save_docs_to_jsonl(docs, 'test-files/docs.jsonl')

    
if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    load_dotenv('../.env.local')
    # load_test_data()
    # create_item_tables()
    # clear_tables()
    load_course_files()