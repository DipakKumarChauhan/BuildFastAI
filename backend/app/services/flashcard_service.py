from app.services.rag_service import retrieve_context
from app.core.llm_client import generate_chat_response
import json


FLASHCARD_COUNT = 12


def build_flashcard_prompt(contexts: list[str]):

    context_block = "\n\n".join(contexts)

    prompt = f"""
You are an AI learning assistant.

Using ONLY the provided context, generate {FLASHCARD_COUNT} study flashcards.

Return STRICT JSON ONLY in this format:

[
  {{
    "question": "...",
    "answer": "...",
    "difficulty": "easy | medium | hard"
  }}
]

Rules:
- Questions must test key concepts.
- Answers must be concise.
- No explanations outside JSON.
- Do not include markdown.

Context:
{context_block}
"""

    return prompt


def generate_flashcards(query_hint: str):

    # retrieve representative chunks
    contexts, _ = retrieve_context(query_hint)

    prompt = build_flashcard_prompt(contexts)

    response = generate_chat_response(prompt)

    # attempt JSON parsing
    try:
        flashcards = json.loads(response)
    except Exception:
        # simple recovery if model adds text
        start = response.find("[")
        end = response.rfind("]") + 1
        flashcards = json.loads(response[start:end])

    return flashcards