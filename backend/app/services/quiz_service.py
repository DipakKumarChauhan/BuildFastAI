from app.services.rag_service import retrieve_context
from app.core.llm_client import generate_chat_response
import json


# QUIZ_COUNT = 7


def build_quiz_prompt(contexts: list[str],QUIZ_COUNT: int):

    context_block = "\n\n".join(contexts)

    prompt = f"""
You are an AI learning assistant.

Using ONLY the provided context, generate {QUIZ_COUNT} multiple-choice quiz questions.

Return STRICT JSON ONLY in this format:

[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "...",
    "explanation": "...",
    "difficulty": "easy | medium | hard"
  }}
]

Rules:
- Each question must test understanding.
- Exactly 4 options per question.
- correct_answer must match one option exactly.
- No markdown or extra text.

Context:
{context_block}
"""

    return prompt


def generate_quiz(topic: str, quiz_count: int):

    contexts, _ = retrieve_context(topic)

    prompt = build_quiz_prompt(contexts, quiz_count)

    response = generate_chat_response(prompt)

    # JSON recovery
    try:
        quiz = json.loads(response)
    except Exception:
        start = response.find("[")
        end = response.rfind("]") + 1
        quiz = json.loads(response[start:end])

    return quiz