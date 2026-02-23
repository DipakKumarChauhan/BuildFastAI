import google.generativeai as genai
import time
from app.core.logger import logger
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

EMBED_MODEL = "models/gemini-embedding-001"
# EMBED_MODEL = "models/text-embedding-004"
# CHAT_MODEL = "gemini-2.5-flash"
CHAT_MODEL = "gemini-2.5-flash-lite"

def generate_embedding(text:str):
    response = genai.embed_content(
        model=EMBED_MODEL,
        content=text,
        output_dimensionality=768  # Reduce from 3072 to 768 for Pinecone compatibility
    )
    return response["embedding"]


def generate_chat_response(prompt: str) -> str:
    start = time.time()

    model = genai.GenerativeModel(CHAT_MODEL)

    # response = model.generate_content(prompt)

    # latency = time.time() - start
    # logger.info(f"[LLM] response_time={latency:.2f}s model={CHAT_MODEL}")

    # return response.text
    try:
        response = model.generate_content(prompt)
        text = response.text if response and response.text else ""

    except Exception:
        logger.exception("LLM generation failed")
        text = "Sorry, I couldn't generate a response."

    finally:
        latency = time.time() - start
        logger.info(f"[LLM] response_time={latency:.2f}s model={CHAT_MODEL}")

    return text

def stream_chat_response(prompt: str,sources: list[str]=None):
    model = genai.GenerativeModel(CHAT_MODEL)

    response = model.generate_content(
        prompt,
        stream=True
    )

    for chunk in response:
        if chunk.text:
            # yield chunk.text
            # for token in chunk.text.split(" "):
            #     yield token + " "
            for char in chunk.text:
                yield char

    if sources:
        yield "\n\nSources:\n"
        for src in sources:
            yield f"- {src}\n"            