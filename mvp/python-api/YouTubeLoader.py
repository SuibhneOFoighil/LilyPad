from urllib.parse import parse_qs, urlparse
from langchain.docstore.document import Document
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional

ALLOWED_SCHEMAS = {"http", "https"}
ALLOWED_NETLOCK = {
    "youtu.be",
    "m.youtube.com",
    "youtube.com",
    "www.youtube.com",
    "www.youtube-nocookie.com",
    "vid.plus",
}

def _parse_video_id(url: str) -> Optional[str]:
    """Parse a youtube url and return the video id if valid, otherwise None."""
    parsed_url = urlparse(url)

    if parsed_url.scheme not in ALLOWED_SCHEMAS:
        return None

    if parsed_url.netloc not in ALLOWED_NETLOCK:
        return None

    path = parsed_url.path

    if path.endswith("/watch"):
        query = parsed_url.query
        parsed_query = parse_qs(query)
        if "v" in parsed_query:
            ids = parsed_query["v"]
            video_id = ids if isinstance(ids, str) else ids[0]
        else:
            return None
    else:
        path = parsed_url.path.lstrip("/")
        video_id = path.split("/")[-1]

    if len(video_id) != 11:  # Video IDs are 11 characters long
        return None

    return video_id

def extract_video_id(youtube_url: str) -> str:
    """Extract video id from common YT urls."""
    video_id = _parse_video_id(youtube_url)
    if not video_id:
        raise ValueError(
            f"Could not determine the video ID for the URL {youtube_url}"
        )
    return video_id

def get_video_transcript(video_id: str) -> str:
    """Get the transcript for a given video ID."""
    transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=["en", "en-US", "en-GB"])
    return transcript

def _get_video_info(video_id: str) -> dict:
    """Get important video information.

    Components are:
        - title
        - description
        - thumbnail url,
        - publish_date
        - channel_author
        - and more.
    """
    try:
        from pytube import YouTube

    except ImportError:
        raise ImportError(
            "Could not import pytube python package. "
            "Please install it with `pip install pytube`."
        )
    yt = YouTube(f"https://www.youtube.com/watch?v={video_id}")
    video_info = {
        "title": yt.title or "Unknown",
        "description": yt.description or "Unknown",
        "view_count": yt.views or 0,
        "thumbnail_url": yt.thumbnail_url or "Unknown",
        "publish_date": yt.publish_date.strftime("%Y-%m-%d %H:%M:%S")
        if yt.publish_date
        else "Unknown",
        "length": yt.length or 0,
        "author": yt.author or "Unknown",
    }
    return video_info

def load_documents_from_youtube_url(url: str, length=30) -> list[Document]:
    """Load a transcript from a YouTube URL."""
    video_id = extract_video_id(url)
    transcript = get_video_transcript(video_id)
    video_info = _get_video_info(video_id)
    title = video_info['title']
    author = video_info['author']
    docs = []
    start = 0
    end = start + length
    lines = []
    for i, segment in enumerate(transcript):
        if segment['start'] > end:
            text = ' '.join(lines)
            timestamp = int(transcript[i-len(lines)]['start'])
            new_chunk = Document(page_content=text, metadata={
                'timestamp': timestamp,
                'video_id': video_id,
                "title": title,
                "author": author
            })
            docs.append(new_chunk)
            start = segment['start']
            end = start + length
            lines = [segment['text']]
        else:
            lines.append(segment['text'])

    print(f"Loaded {len(docs)} documents from {url}")
    return docs
