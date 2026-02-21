import uuid
from app.utils.loader import extract_text_from_pdf
from app.utils.chunker import chunk_text
from app.core.llm_client import generate_embedding
from app.core.pinecone_client import index
from app.db.models import Document, Chunk
from sqlalchemy.orm import Session


def process_pdf(file_path: str, filename: str, db: Session):

    # 1. Extract text
    text = extract_text_from_pdf(file_path)

    # 2. Create document record
    document = Document(
        title=filename,
        source_type="pdf"
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # 3. Chunk text
    chunks = chunk_text(text)

    vectors = []

    # 4. Generate embeddings + prepare pinecone vectors
    for i, chunk in enumerate(chunks):
        vector_id = str(uuid.uuid4())

        embedding = generate_embedding(chunk)

        vectors.append({
            "id": vector_id,
            "values": embedding,
            "metadata": {
                "document_id": document.id,
                "chunk_index": i,
                "source": "pdf",
                "title": filename
            }
        })

        db.add(Chunk(
            document_id=document.id,
            pinecone_vector_id=vector_id,
            text_preview=chunk[:200]
        ))

    # 5. Store vectors
    index.upsert(vectors=vectors)

    db.commit()

    return document.id