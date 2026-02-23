from fastapi import APIRouter, UploadFile, File, Depends, HTTPException

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.ingestion_service import process_pdf
from pydantic import BaseModel
from app.services.ingestion_service import process_youtube
import shutil
import os

class VideoRequest(BaseModel):
    url: str

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

# @router.post("/process-video")
# def process_video(req: VideoRequest, db: Session = Depends(get_db)):
#     document_id = process_youtube(req.url, db)
#     return {"document_id": document_id}

@router.post("/process-video")
def process_video(req: VideoRequest, db: Session = Depends(get_db)):
    try:
        document_id = process_youtube(req.url, db)
        return {"document_id": document_id}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Video processing failed: {str(e)}"
        )