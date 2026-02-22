from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models import Chat
from app.core.logger import logger
import uuid

# Context window configuration
MAX_HISTORY_MESSAGES = 10  # Maximum number of previous messages to include
MAX_CONTEXT_TOKENS = 2000  # Approximate token limit for conversation history


def save_chat_message(
    session_id: str,
    user_message: str,
    assistant_message: str,
    db: Session
) -> str:
    """Save a chat message to the database."""
    try:
        chat = Chat(
            session_id=session_id,
            user_message=user_message,
            assistant_message=assistant_message
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)
        logger.info(f"[Chat History] Saved message for session {session_id}")
        return chat.id
    except Exception as e:
        logger.error(f"[Chat History] Failed to save message: {str(e)}")
        db.rollback()
        raise


def get_recent_chat_history(session_id: str, db: Session, limit: int = MAX_HISTORY_MESSAGES) -> list[dict]:
    """Retrieve recent chat history for a session."""
    try:
        chats = db.query(Chat).filter(
            Chat.session_id == session_id
        ).order_by(
            desc(Chat.created_at)
        ).limit(limit).all()
        
        # Reverse to get chronological order (oldest first)
        history = []
        for chat in reversed(chats):
            history.append({
                "user": chat.user_message,
                "assistant": chat.assistant_message
            })
        
        logger.info(f"[Chat History] Retrieved {len(history)} messages for session {session_id}")
        return history
    except Exception as e:
        logger.error(f"[Chat History] Failed to retrieve history: {str(e)}")
        return []


def format_conversation_history(history: list[dict]) -> str:
    """Format conversation history into a string for the prompt."""
    if not history:
        return ""
    
    formatted = "Previous conversation:\n"
    for i, msg in enumerate(history, 1):
        formatted += f"\nUser: {msg['user']}\nAssistant: {msg['assistant']}\n"
    
    return formatted


def get_or_create_session_id(session_id: str | None) -> str:
    """Generate a session ID if one is not provided."""
    if not session_id:
        return str(uuid.uuid4())
    return session_id
