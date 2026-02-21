from fastapi import FastAPI
from app.core.config import settings
from app.core.logger import setup_logger, logger


##### Router Imports
from app.routers import health

setup_logger()

app = FastAPI(title=settings.APP_NAME)


# Register routers
app.include_router(health.router)


@app.on_event("startup")
async def startup_event():
    logger.info("Application starting...")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutting down...")