from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    DATABASE_URL: str
    PINECONE_API_KEY: str
    PINECONE_INDEX: str
    GEMINI_API_KEY: str
    
    class Config:
        env_file = ".env"


settings = Settings()