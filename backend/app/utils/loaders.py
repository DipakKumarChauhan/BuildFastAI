# from youtube_transcript_api import YouTubeTranscriptApi
# import re

# def extract_video_id(url:str)->str:
#     """
#     Supports Multiple YouTube URL formats:
#     """
#     pattern = r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})"
#     match = re.search(pattern,url)

#     if not match:
#         raise ValueError("Invalid YouTube URL")
    
#     return match.group(1)

# def extract_text_from_youtube(url:str)->str:
#     video_id = extract_video_id(url)

#     api = YouTubeTranscriptApi()   # create instance
#     # transcript = api.get_transcript(video_id)
#     transcript = api.fetch(video_id)

#     # transcript = YouTubeTranscriptApi.get_transcript(video_id)
#     text = " ".join([entry.text for entry in transcript])

#     print(len(text))

#     return text

#  ################ Version 2 ################

# from youtube_transcript_api import YouTubeTranscriptApi
# import subprocess
# import glob
# import os
# import re


# def extract_video_id(url: str) -> str:
#     """
#     Supports multiple YouTube URL formats
#     """
#     pattern = r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})"
#     match = re.search(pattern, url)

#     if not match:
#         raise ValueError("Invalid YouTube URL")

#     return match.group(1)


# def extract_text_from_youtube(url: str) -> str:
#     """
#     Extract subtitles using yt-dlp instead of YouTube API.
#     Works on cloud platforms like Render.
#     """

#     video_id = extract_video_id(url)

#     output_template = f"video_{video_id}.%(ext)s"

#     #  Download subtitles only (NO video)
#     subprocess.run([
#         "yt-dlp",
#         "--write-auto-subs",
#         "--sub-lang", "en.*,en",
#         "--skip-download",
#         "--sub-format", "vtt",
#         "-o", output_template,
#         url
#     ], check=True)

#     # Find downloaded subtitle file
#     subtitle_files = glob.glob(f"video_{video_id}*.vtt")

#     if not subtitle_files:
#         raise Exception("No subtitles available for this video.")

#     subtitle_path = subtitle_files[0]

#     text_lines = []

#     #  Convert VTT → plain text
#     with open(subtitle_path, "r", encoding="utf-8") as f:
#         for line in f:
#             line = line.strip()

#             # Skip timestamps & metadata
#             if (
#                 not line
#                 or "-->" in line
#                 or line.startswith("WEBVTT")
#             ):
#                 continue

#             text_lines.append(line)

#     # Cleanup temporary subtitle file
#     os.remove(subtitle_path)
#     print(len(text_lines))

#     return " ".join(text_lines)

#  ################ Version 3 ################

import subprocess
import tempfile
import glob
import os
import re


def extract_video_id(url: str) -> str:
    pattern = r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})"
    match = re.search(pattern, url)

    if not match:
        raise ValueError("Invalid YouTube URL")

    return match.group(1)

#####################################

# def extract_text_from_youtube(url: str) -> str:
#     video_id = extract_video_id(url)

#     # ✅ create temporary directory
#     with tempfile.TemporaryDirectory() as temp_dir:

#         output_template = os.path.join(
#             temp_dir,
#             f"video_{video_id}.%(ext)s"
#         )

#         # Download subtitles only
#         subprocess.run([
#             "yt-dlp",
#             "--write-auto-subs",
#             "--sub-lang", "en.*,en",
#             "--skip-download",
#             "--sub-format", "vtt",
#             "-o", output_template,
#             url
#         ], check=True)

#         # Find subtitle file inside temp folder
#         subtitle_files = glob.glob(
#             os.path.join(temp_dir, "*.vtt")
#         )

#         if not subtitle_files:
#             raise Exception("No subtitles available")

#         subtitle_path = subtitle_files[0]

#         text_lines = []

#         with open(subtitle_path, "r", encoding="utf-8") as f:
#             for line in f:
#                 line = line.strip()

#                 if (
#                     not line
#                     or "-->" in line
#                     or line.startswith("WEBVTT")
#                 ):
#                     continue

#                 text_lines.append(line)

#         # ✅ No manual delete needed!
#         # TemporaryDirectory auto deletes everything

#         return " ".join(text_lines)

##############################
def extract_text_from_youtube(url: str) -> str:
    video_id = extract_video_id(url)

    with tempfile.TemporaryDirectory() as temp_dir:

        output_template = os.path.join(
            temp_dir,
            f"video_{video_id}.%(ext)s"
        )

        # ✅ UPDATED yt-dlp COMMAND
        result = subprocess.run(
    [
        "yt-dlp",

        # ⭐ MOST IMPORTANT: try multiple clients
        "--extractor-args",
        "youtube:player_client=tv,android",

        # subtitle options
        "--write-auto-subs",
        "--write-subs",
        "--skip-download",
        "--sub-format", "vtt",

        # ⭐ improves success on cloud providers
        "--geo-bypass",
        "--no-check-certificates",

        # avoid IPv6 issues on Render
        "--force-ipv4",

        "-o", output_template,
        url
    ],
    capture_output=True,
    text=True
)

        if result.returncode != 0:
            raise Exception(
                f"Subtitle download failed:\n{result.stderr}"
            )

        subtitle_files = glob.glob(
            os.path.join(temp_dir, "*.vtt")
        )

        if not subtitle_files:
            raise Exception("No subtitles available")

        subtitle_path = subtitle_files[0]

        text_lines = []

        with open(subtitle_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()

                if (
                    not line
                    or "-->" in line
                    or line.startswith("WEBVTT")
                ):
                    continue

                text_lines.append(line)

        return " ".join(text_lines)