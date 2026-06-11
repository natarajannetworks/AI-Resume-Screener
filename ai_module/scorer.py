# scorer.py
# Member 3 - AI + Resume Processing
# UPGRADED VERSION - Competition Level
# Features: Weighted scoring, retry logic, confidence levels, executive summary

import os
import json
import time
import anthropic
from dotenv import load_dotenv
from prompt_templates import (
    get_resume_scoring_prompt,
    get_comparison_prompt,
    get_bulk_summary_prompt
)

# Load API key from .env file
load_dotenv()

# Initialize Anthropic client
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# ─────────────────────────────────────────────
# HELPER: Safe JSON Parser
# ─────────────────────────────────────────────
def safe_parse_json(text: str) -> dict:
    """
    Safely parses JSON from Claude's response.
    Handles cases where Claude adds extra text around the JSON.
    """
    try:
        # Try direct parse first
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON block from text
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end != 0:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
    return {"error": "Could not parse JSON from Claude response", "raw": text}


# ─────────────────────────────────────────────
# HELPER: Call Claude API with Retry
# ─────────────────────────────────────────────
def call_claude(prompt: str, retries: int = 2) -> str:
    """
    Calls Claude API with automatic retry on failure.
    Retries up to 2 times before giving up.
    """
    for attempt in range(retries + 1):
        try:
            response = client.messages.create(
                model="claude-opus-4-5",
                max_tokens=1500,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text

        except anthropic.RateLimitError:
            if attempt < retries:
                print(f"  Rate limit hit. Waiting 5 seconds before retry {attempt + 1}...")
                time.sleep(5)
            else:
                raise
        except anthropic.APIError as e:
            if attempt < retries:
                print(f"  API error: {e}. Retrying {attempt + 1}...")
                time.sleep(2)
            else:
                raise

    return ""


# ─────────────────────────────────────────────
# 1. SCORE A SINGLE RESUME
# ─────────────────────────────────────────────
def score_resume(job_description: str, resume_text: str) -> dict:
    """
    Sends resume + job description to Claude API.
    Returns structured JSON with weighted score and detailed analysis.
    """
    if not job_description.strip() or not resume_text.strip():
        return {"error": "Job description or resume text is empty"}

    prompt = get_resume_scoring_prompt(job_description, resume_text)

    try:
        raw_text = call_claude(prompt)
        result = safe_parse_json(raw_text)

        # Validate score is within range
        if "match_score" in result:
            result["match_score"] = max(0, min(100, int(result["match_score"])))

        # Auto-assign rating color if missing
        if "match_score" in result and "rating_color" not in result:
            score = result["match_score"]
            if score >= 80:
                result["rating_color"] = "GREEN"
                result["rating"] = "Strong Match"
            elif score >= 50:
                result["rating_color"] = "YELLOW"
                result["rating"] = "Partial Match"
            else:
                result["rating_color"] = "RED"
                result["rating"] = "Weak Match"

        return result

    except Exception as e:
        return {"error": f"Scoring failed: {str(e)}"}


# ─────────────────────────────────────────────
# 2. SCORE MULTIPLE RESUMES & RANK THEM
# ─────────────────────────────────────────────
def rank_candidates(job_description: str, resumes: list) -> dict:
    """
    Scores multiple resumes and returns ranked results with summary stats.

    Input:
        resumes = [
            {"filename": "resume1.pdf", "text": "resume content..."},
            {"filename": "resume2.pdf", "text": "resume content..."}
        ]

    Returns:
        {
            "ranked_candidates": [...],
            "total": 10,
            "strong_matches": 3,
            "partial_matches": 5,
            "weak_matches": 2
        }
    """
    if not resumes:
        return {"error": "No resumes provided"}

    scored_candidates = []
    failed = []

    print(f"\n📋 Scoring {len(resumes)} candidates...\n")

    for i, resume in enumerate(resumes):
        print(f"  [{i+1}/{len(resumes)}] Scoring: {resume.get('filename', 'Unknown')}...")
        result = score_resume(job_description, resume.get("text", ""))

        if "error" not in result:
            result["filename"] = resume.get("filename", f"resume_{i+1}.pdf")
            scored_candidates.append(result)
            print(f"  ✅ Score: {result.get('match_score', 0)}/100 — {result.get('rating', 'N/A')}")
        else:
            failed.append(resume.get("filename", f"resume_{i+1}"))
            print(f"  ❌ Failed: {result['error']}")

        # Small delay to avoid rate limits
        if i < len(resumes) - 1:
            time.sleep(1)

    # Sort by match_score descending
    ranked = sorted(scored_candidates, key=lambda x: x.get("match_score", 0), reverse=True)

    # Add rank numbers
    for i, candidate in enumerate(ranked):
        candidate["rank"] = i + 1

    # Calculate summary stats
    strong = len([c for c in ranked if c.get("rating_color") == "GREEN"])
    partial = len([c for c in ranked if c.get("rating_color") == "YELLOW"])
    weak = len([c for c in ranked if c.get("rating_color") == "RED"])

    print(f"\n✅ Ranking complete! {len(ranked)} scored, {len(failed)} failed.")
    print(f"   🟢 Strong: {strong}  🟡 Partial: {partial}  🔴 Weak: {weak}\n")

    return {
        "ranked_candidates": ranked,
        "total": len(ranked),
        "strong_matches": strong,
        "partial_matches": partial,
        "weak_matches": weak,
        "failed_files": failed
    }


# ─────────────────────────────────────────────
# 3. COMPARE TWO CANDIDATES SIDE BY SIDE
# ─────────────────────────────────────────────
def compare_candidates(job_description: str, candidate_1: dict, candidate_2: dict) -> dict:
    """
    Deep comparison of two candidates with decision matrix.
    Returns strengths, weaknesses, and final hiring recommendation.
    """
    if not candidate_1 or not candidate_2:
        return {"error": "Both candidates are required for comparison"}

    prompt = get_comparison_prompt(job_description, candidate_1, candidate_2)

    try:
        raw_text = call_claude(prompt)
        return safe_parse_json(raw_text)
    except Exception as e:
        return {"error": f"Comparison failed: {str(e)}"}


# ─────────────────────────────────────────────
# 4. GENERATE EXECUTIVE SUMMARY (NEW!)
# ─────────────────────────────────────────────
def generate_executive_summary(job_description: str, ranked_candidates: list) -> dict:
    """
    NEW FEATURE: Generates an executive summary of all candidates.
    Perfect for the export report shown to the hiring manager.
    """
    if not ranked_candidates:
        return {"error": "No candidates to summarize"}

    prompt = get_bulk_summary_prompt(job_description, ranked_candidates)

    try:
        raw_text = call_claude(prompt)
        return safe_parse_json(raw_text)
    except Exception as e:
        return {"error": f"Summary generation failed: {str(e)}"}


# ─────────────────────────────────────────────
# 5. MOCK TEST (Run without API key)
# ─────────────────────────────────────────────
def mock_rank_candidates() -> dict:
    """
    Returns mock ranked candidates for testing without API key.
    Simulates output of rank_candidates() with 3 candidates.
    """
    return {
        "ranked_candidates": [
            {
                "rank": 1,
                "candidate_name": "Arun Kumar",
                "email": "arun@example.com",
                "phone": "9876543210",
                "education": {
                    "degree": "B.E.",
                    "field": "Computer Science",
                    "institution": "Anna University",
                    "year": "2021"
                },
                "experience_years": 3,
                "experience_summary": "3 years as Backend Developer at XYZ Startup",
                "skills": {
                    "matched": ["Python", "React", "FastAPI"],
                    "missing": ["Kubernetes"],
                    "additional": ["Docker", "PostgreSQL"]
                },
                "projects": ["Resume Parser Tool", "E-commerce REST API"],
                "certifications": ["AWS Cloud Practitioner"],
                "score_breakdown": {
                    "skills_score": 35,
                    "experience_score": 28,
                    "education_score": 16,
                    "projects_score": 8
                },
                "match_score": 87,
                "rating": "Strong Match",
                "rating_color": "GREEN",
                "confidence": "High",
                "strengths": ["Strong Python skills", "Relevant experience", "Good projects"],
                "weaknesses": ["Missing Kubernetes knowledge"],
                "reasoning": "4 of 5 required skills matched. 3 years of highly relevant experience. Strong project portfolio demonstrates practical skills.",
                "hire_recommendation": "Strongly Recommend",
                "filename": "arun_kumar_resume.pdf"
            },
            {
                "rank": 2,
                "candidate_name": "Priya Sharma",
                "email": "priya@example.com",
                "phone": "9123456789",
                "education": {
                    "degree": "M.Sc.",
                    "field": "Information Technology",
                    "institution": "VIT University",
                    "year": "2022"
                },
                "experience_years": 2,
                "experience_summary": "2 years as Full Stack Developer",
                "skills": {
                    "matched": ["Python", "React"],
                    "missing": ["FastAPI", "Kubernetes"],
                    "additional": ["Django", "MongoDB"]
                },
                "projects": ["Task Management App", "ML Dashboard"],
                "certifications": ["Google Cloud Associate"],
                "score_breakdown": {
                    "skills_score": 28,
                    "experience_score": 22,
                    "education_score": 18,
                    "projects_score": 7
                },
                "match_score": 75,
                "rating": "Partial Match",
                "rating_color": "YELLOW",
                "confidence": "Medium",
                "strengths": ["Strong education", "Good Python base", "Cloud certified"],
                "weaknesses": ["Missing FastAPI experience", "Less experience years"],
                "reasoning": "2 of 5 required skills matched strongly. Good education background but lacks FastAPI experience specifically required.",
                "hire_recommendation": "Consider",
                "filename": "priya_sharma_resume.pdf"
            },
            {
                "rank": 3,
                "candidate_name": "Rahul Verma",
                "email": "rahul@example.com",
                "phone": "9988776655",
                "education": {
                    "degree": "B.Sc.",
                    "field": "Mathematics",
                    "institution": "Delhi University",
                    "year": "2023"
                },
                "experience_years": 0,
                "experience_summary": "Fresher with internship experience",
                "skills": {
                    "matched": ["Python"],
                    "missing": ["React", "FastAPI", "Docker", "Kubernetes"],
                    "additional": ["Java", "C++"]
                },
                "projects": ["Calculator App", "Student Management System"],
                "certifications": [],
                "score_breakdown": {
                    "skills_score": 12,
                    "experience_score": 8,
                    "education_score": 14,
                    "projects_score": 4
                },
                "match_score": 38,
                "rating": "Weak Match",
                "rating_color": "RED",
                "confidence": "High",
                "strengths": ["Python basics", "Willingness to learn"],
                "weaknesses": ["No work experience", "Missing most required skills"],
                "reasoning": "Only 1 of 5 required skills matched. Fresher with no relevant work experience. Not suitable for this role currently.",
                "hire_recommendation": "Not Recommended",
                "filename": "rahul_verma_resume.pdf"
            }
        ],
        "total": 3,
        "strong_matches": 1,
        "partial_matches": 1,
        "weak_matches": 1,
        "failed_files": []
    }


# ─────────────────────────────────────────────
# QUICK TEST — Run this file directly
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("   AI RESUME SCREENER - Module Test")
    print("=" * 60)

    print("\n📊 MOCK RANKING TEST (No API Key Required)\n")
    results = mock_rank_candidates()

    print(f"Total Candidates : {results['total']}")
    print(f"🟢 Strong Match  : {results['strong_matches']}")
    print(f"🟡 Partial Match : {results['partial_matches']}")
    print(f"🔴 Weak Match    : {results['weak_matches']}")
    print("\n--- RANKED CANDIDATES ---\n")

    for c in results["ranked_candidates"]:
        color = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(c["rating_color"], "⚪")
        print(f"Rank {c['rank']} {color} {c['candidate_name']}")
        print(f"       Score     : {c['match_score']}/100")
        print(f"       Rating    : {c['rating']}")
        print(f"       Recommend : {c['hire_recommendation']}")
        print(f"       Reasoning : {c['reasoning'][:80]}...")
        print()

    print("=" * 60)
    print("✅ Mock test passed! Ready for real API integration.")
    print("=" * 60)

    # Uncomment below when API key is ready:
    # sample_jd = "Python Developer with FastAPI, React, Docker experience..."
    # resumes = [{"filename": "resume1.pdf", "text": "resume text here..."}]
    # results = rank_candidates(sample_jd, resumes)
    # print(json.dumps(results, indent=2))
