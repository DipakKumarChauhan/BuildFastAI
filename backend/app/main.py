from fastapi import FastAPI
from app.core.config import settings
from app.core.logger import setup_logger, logger

from sqlalchemy import text
from app.db.database import SessionLocal
from app.db.database import engine
from app.db import models

# Try to initialize database, but don't fail if connection fails
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database initialized successfully")
except Exception as e:
    logger.warning(f"Failed to initialize database on startup: {str(e)}")
    logger.warning("Application will continue without database connection")

##### Router Imports
from app.routers import health
from app.routers import process
from app.routers import chat
from app.routers import generate_flashcard


setup_logger()

app = FastAPI(title=settings.APP_NAME)


# Register routers
app.include_router(health.router)
app.include_router(process.router)
app.include_router(chat.router)
app.include_router(generate_flashcard.router)


@app.on_event("startup")
async def check_db():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        logger.info("Database connection verified")
    except Exception as e:
        logger.warning(f"Failed to verify database connection on startup: {str(e)}")
        logger.warning("Application will continue without database connection")

@app.on_event("startup")
async def startup_event():
    logger.info("Application starting...")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutting down...")