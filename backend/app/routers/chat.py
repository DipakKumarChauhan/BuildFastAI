from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_service import rag_chat
from app.services.rag_service import rag_chat_stream
from fastapi.responses import StreamingResponse


router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    mode: str = "chat"


# @router.post("/chat")
# def chat(req: ChatRequest):
#     response = rag_chat(req.message)
#     return response

@router.post("/chat")
def chat_stream(req: ChatRequest, mode: str = "chat"):

    def event_generator():
        for token in rag_chat_stream(req.message, mode=mode):
            yield token

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )