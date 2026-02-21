from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.ingestion_service import process_pdf
import shutil
import os

router = APIRouter()


@router.post("/process-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document_id = process_pdf(temp_path, file.filename, db)

    os.remove(temp_path)

    return {"document_id": document_id}