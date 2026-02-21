#!/usr/bin/env python3
"""List available Google Generative AI models"""
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

print("\n" + "="*70)
print("AVAILABLE GOOGLE GENERATIVE AI MODELS")
print("="*70 + "\n")

# List all models
for model in genai.list_models():
    print(f"Model: {model.name}")
    print(f"  Display Name: {model.display_name}")
    print(f"  Description: {model.description[:100]}..." if len(model.description) > 100 else f"  Description: {model.description}")
    print(f"  Supported Methods: {', '.join(model.supported_generation_methods)}")
    print()

print("="*70)
print("EMBEDDING MODELS (support embedContent method)")
print("="*70 + "\n")

# List only embedding models
embedding_models = [m for m in genai.list_models() if 'embedContent' in m.supported_generation_methods]
for model in embedding_models:
    print(f"✓ {model.name}")
    print(f"  Display Name: {model.display_name}")
    print()

if not embedding_models:
    print("No embedding models found!")

print("="*70 + "\n")
