from fastapi import APIRouter
from app.services.flashcard_service import generate_flashcards
from pydantic import BaseModel


class FlashcardRequest(BaseModel):
    topic: str
router = APIRouter()


class QuizRequest(BaseModel):
    topic: str
    quiz_count: int

@router.post("/generate-flashcards")
def flashcards(req: FlashcardRequest):
    cards = generate_flashcards(req.topic)
    return {"flashcards": cards}

from app.services.quiz_service import generate_quiz


@router.post("/generate-quiz")
def quiz(req: QuizRequest):
    questions = generate_quiz(req.topic, req.quiz_count)
    return {"quiz": questions}