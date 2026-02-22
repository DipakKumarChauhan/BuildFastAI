from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.rag_service import rag_chat_stream
from app.services.chat_history_service import (
    save_chat_message,
    get_recent_chat_history,
    get_or_create_session_id
)
from app.db.session import get_db
from fastapi.responses import StreamingResponse


router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    mode: str = "chat"
    session_id: str | None = None


class SessionRequest(BaseModel):
    session_id: str


@router.post("/chat")
def chat_stream(req: ChatRequest, mode: str = "chat", db: Session = Depends(get_db)):

    # Get or create session ID
    session_id = get_or_create_session_id(req.session_id)
    
    # Get recent chat history
    history = get_recent_chat_history(session_id, db)
    
    # Collect the full response for saving
    full_response = ""

    def event_generator():
        nonlocal full_response
        try:
            for token in rag_chat_stream(req.message, mode=mode, history=history, session_id=session_id):
                full_response += token
                yield token
            
            # Save the chat message after streaming is complete
            if full_response:
                try:
                    save_chat_message(
                        session_id=session_id,
                        user_message=req.message,
                        assistant_message=full_response,
                        db=db
                    )
                except Exception as e:
                    # Log error but don't fail the request
                    print(f"Failed to save chat history: {str(e)}")
        except Exception as e:
            # If streaming fails, still try to save what we have
            if full_response:
                try:
                    save_chat_message(
                        session_id=session_id,
                        user_message=req.message,
                        assistant_message=full_response or "Error occurred",
                        db=db
                    )
                except:
                    pass
            raise

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


@router.post("/chat/history")
def get_chat_history(req: SessionRequest, db: Session = Depends(get_db)):
    """Get chat history for a session."""
    history = get_recent_chat_history(req.session_id, db)
    return {"history": history, "session_id": req.session_id}