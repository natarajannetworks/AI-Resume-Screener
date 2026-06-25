# Quick script to list available Gemini models for your API key
import os
from dotenv import load_dotenv
load_dotenv()

from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Available models that support generateContent:\n")
for model in client.models.list():
    if "generateContent" in getattr(model, "supported_actions", []) or True:
        print(f"  - {model.name}")
