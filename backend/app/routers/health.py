from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/health/db")
def db_health_check(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).fetchone()
        return {"database": "connected", "result": result[0]}
    except Exception as e:
        return {"database": "disconnected", "error": str(e)}