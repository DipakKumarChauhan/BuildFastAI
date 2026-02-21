import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_embedding(text:str):
    response = genai.embed_content(
        model="models/gemini-embedding-001",
        content=text,
        output_dimensionality=768  # Reduce from 3072 to 768 for Pinecone compatibility
    )
    return response["embedding"]