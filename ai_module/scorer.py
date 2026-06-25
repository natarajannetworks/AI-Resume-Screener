import os
import json
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

# 1. LOAD CONFIG
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

print("\n" + "═"*50)
print("🚀 MISTRAL BATCH-PROCESSOR: ONLINE")
print(f"✅ Model: mistral-large-2411 (High Speed)")
print(f"✅ Status: API Key {'Detected' if MISTRAL_API_KEY else 'MISSING'}")
print("═"*50 + "\n")

MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"

# CHANGED: Using mistral-large-2411 for higher Rate Limits (1.0 RPS vs 0.03 RPS)
MODEL = "mistral-small-latest" 

# 2. IMPORT PROMPT TEMPLATES
try:
    from app.ai_logic.prompt_templates import (
        get_resume_scoring_prompt, get_comparison_prompt, get_bulk_summary_prompt
    )
except ImportError:
    from prompt_templates import (
        get_resume_scoring_prompt, get_comparison_prompt, get_bulk_summary_prompt
    )

# ─────────────────────────────────────────────
# CORE UTILITIES (Robustness & Error Handling)
# ─────────────────────────────────────────────

def safe_parse_json(text: str) -> dict:
    """Handles potential AI formatting errors and ensures valid JSON."""
    if not text:
        return {"error": "Empty response from AI", "match_score": 0}

    try:
        # Step 1: Clean Markdown JSON blocks
        cleaned = text.strip()
        if "```json" in cleaned:
            cleaned = cleaned.split("```json")[1].split("```")[0].strip()
        elif "```" in cleaned:
            cleaned = cleaned.split("```")[1].strip()
        
        data = json.loads(cleaned)

        # Step 2: Validate Score
        try:
            data["match_score"] = int(data.get("match_score", 0))
        except:
            data["match_score"] = 0

        return data

    except Exception as e:
        print(f"⚠️ JSON Parse Error: {e}")
        return {
            "error": "Parse Error",
            "match_score": 0,
            "reasoning": "The AI provided an incompatible format."
        }

def call_mistral_api(prompt: str) -> str:
    """Standardized API caller with Rate Limit detection."""
    if not MISTRAL_API_KEY:
        return json.dumps({"error": "MISTRAL_API_KEY missing in .env"})

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {MISTRAL_API_KEY}"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a professional HR data analyst. Always respond in valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"}
    }

    try:
        response = requests.post(MISTRAL_URL, headers=headers, json=payload, timeout=45)
        
        # Handle Rate Limiting (Error 429)
        if response.status_code == 429:
            print("🕒 Rate limit reached. Waiting briefly...")
            return json.dumps({"error": "AI Service Busy (Rate Limit hit)."})
        
        response.raise_for_status()
        data = response.json()
        return data['choices'][0]['message']['content']
    except Exception as e:
        print(f"❌ API Error: {e}")
        return json.dumps({"error": f"Connection failed: {str(e)}"})

# ─────────────────────────────────────────────
# EXPORTED LOGIC
# ─────────────────────────────────────────────

def score_resume(job_description: str, resume_text: str) -> dict:
    """Scores a single resume with Skill Inference logic."""
    if not job_description or not resume_text:
        return {"error": "Missing input data", "match_score": 0}
        
    prompt = get_resume_scoring_prompt(job_description, resume_text)
    raw_response = call_mistral_api(prompt)
    result = safe_parse_json(raw_response)
    
    if "error" in result and result.get("match_score") == 0:
        result["rating_color"], result["rating"] = "GRAY", "Error"
        return result

    # Standardize Ratings
    score = result.get("match_score", 0)
    if score >= 80:
        result["rating_color"], result["rating"] = "GREEN", "Strong Match"
    elif score >= 50:
        result["rating_color"], result["rating"] = "YELLOW", "Partial Match"
    else:
        result["rating_color"], result["rating"] = "RED", "Weak Match"
        
    return result

def rank_candidates(job_description: str, resumes: list) -> dict:
    """
    Ranks 20+ resumes using a 2-second delay.
    Total time for 20 resumes: ~45-60 seconds.
    """
    scored = []
    total = len(resumes)
    
    print(f"🚀 Starting analysis of {total} candidates...")
    
    for i, r in enumerate(resumes):
        filename = r.get("filename", f"Candidate_{i+1}")
        # Using '\r' to create a clean progress bar in terminal
        print(f"  ⏳ [{i+1}/{total}] Analyzing: {filename}", end="\r")
        
        res = score_resume(job_description, r.get("text", ""))
        res["filename"] = filename
        scored.append(res)
        
        # Safe delay for mistral-large-2411 on Free Tier
        if i < total - 1:
            time.sleep(2.0) 
        
    # Sort by score
    ranked = sorted(scored, key=lambda x: x.get("match_score", 0), reverse=True)
    for i, c in enumerate(ranked):
        c["rank"] = i + 1
        
    print(f"\n✅ Analysis Complete. {total} candidates ranked.")
    return {"ranked_candidates": ranked}

def compare_candidates(jd, c1, c2):
    return safe_parse_json(call_mistral_api(get_comparison_prompt(jd, c1, c2)))

def generate_executive_summary(jd, ranked):
    return safe_parse_json(call_mistral_api(get_bulk_summary_prompt(jd, ranked)))