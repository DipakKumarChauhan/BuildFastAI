from youtube_transcript_api import YouTubeTranscriptApi
import re

def extract_video_id(url:str)->str:
    """
    Supports Multiple YouTube URL formats:
    """
    pattern = r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})"
    match = re.search(pattern,url)

    if not match:
        raise ValueError("Invalid YouTube URL")
    
    return match.group(1)

def extract_text_from_youtube(url:str)->str:
    video_id = extract_video_id(url)

    api = YouTubeTranscriptApi()   # ✅ create instance
    # transcript = api.get_transcript(video_id)
    transcript = api.fetch(video_id)

    # transcript = YouTubeTranscriptApi.get_transcript(video_id)
    text = " ".join([entry.text for entry in transcript])

    return text