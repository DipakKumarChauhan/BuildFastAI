from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    source_type = Column(String)
    workspace_id = Column(String, default="demo_workspace")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String)
    pinecone_vector_id = Column(String)
    text_preview = Column(Text)


class Chat(Base):
    __tablename__ = "chats"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String)
    user_message = Column(Text)
    assistant_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())