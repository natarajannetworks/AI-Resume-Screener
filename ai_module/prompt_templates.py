# prompt_templates.py
# Member 3 - AI + Resume Processing
# UPGRADED VERSION - Competition Level
# Smart prompts with weighted scoring, confidence levels, and detailed analysis

def get_resume_scoring_prompt(job_description: str, resume_text: str) -> str:
    """
    UPGRADED: Smart prompt with weighted scoring breakdown.
    Scores resume across 4 categories for accurate ranking.
    """
    return f"""
You are an expert HR analyst and senior technical recruiter with 15+ years of experience.

Carefully analyze the resume against the job description and provide a detailed, accurate evaluation.

SCORING BREAKDOWN (Total: 100 points):
- Skills Match     : 40 points (required skills carry more weight than optional ones)
- Experience       : 30 points (relevance + years of experience)
- Education        : 20 points (degree relevance + institution quality)
- Projects/Achieve : 10 points (relevant projects, certifications, achievements)

RATING SYSTEM:
- 80 to 100 : Strong Match   (GREEN)
- 50 to 79  : Partial Match  (YELLOW)
- 0  to 49  : Weak Match     (RED)

Job Description:
\"\"\"
{job_description}
\"\"\"

Resume:
\"\"\"
{resume_text}
\"\"\"

Respond ONLY in the following JSON format. No explanation outside the JSON:

{{
  "candidate_name": "Full name of candidate",
  "email": "email if found, else null",
  "phone": "phone if found, else null",
  "education": {{
    "degree": "Highest degree",
    "field": "Field of study",
    "institution": "College/University name",
    "year": "Graduation year if mentioned"
  }},
  "experience_years": 0,
  "experience_summary": "One line summary of their experience",
  "skills": {{
    "matched": ["skills that match the JD"],
    "missing": ["required skills not found in resume"],
    "additional": ["extra skills candidate has beyond JD requirements"]
  }},
  "projects": ["project1", "project2"],
  "certifications": ["cert1", "cert2"],
  "score_breakdown": {{
    "skills_score": 0,
    "experience_score": 0,
    "education_score": 0,
    "projects_score": 0
  }},
  "match_score": 0,
  "rating": "Strong Match or Partial Match or Weak Match",
  "rating_color": "GREEN or YELLOW or RED",
  "confidence": "High or Medium or Low",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "reasoning": "3-4 line detailed explanation of the score and hiring recommendation",
  "hire_recommendation": "Strongly Recommend or Recommend or Consider or Not Recommended"
}}
"""


def get_comparison_prompt(job_description: str, candidate_1: dict, candidate_2: dict) -> str:
    """
    UPGRADED: Deep comparison with hiring recommendation and decision matrix.
    """
    return f"""
You are a senior HR analyst comparing two candidates for a job position.

Perform a detailed side-by-side comparison and provide a clear hiring recommendation.

Job Description:
\"\"\"
{job_description}
\"\"\"

Candidate 1:
{candidate_1}

Candidate 2:
{candidate_2}

Respond ONLY in the following JSON format:

{{
  "better_candidate": "Name of the stronger candidate",
  "decision_confidence": "High or Medium or Low",
  "reason": "Why this candidate is better in 2-3 lines",
  "candidate_1": {{
    "name": "candidate 1 name",
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "unique_value": "What makes this candidate unique",
    "hire_recommendation": "Strongly Recommend or Recommend or Consider or Not Recommended"
  }},
  "candidate_2": {{
    "name": "candidate 2 name",
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "unique_value": "What makes this candidate unique",
    "hire_recommendation": "Strongly Recommend or Recommend or Consider or Not Recommended"
  }},
  "comparison_matrix": {{
    "skills": "Candidate 1 or Candidate 2 or Tie",
    "experience": "Candidate 1 or Candidate 2 or Tie",
    "education": "Candidate 1 or Candidate 2 or Tie",
    "projects": "Candidate 1 or Candidate 2 or Tie"
  }},
  "final_recommendation": "2-3 line final hiring advice for the manager"
}}
"""


def get_bulk_summary_prompt(job_description: str, ranked_candidates: list) -> str:
    """
    NEW: Generates an executive summary for all ranked candidates.
    Perfect for the export report.
    """
    candidates_summary = "\n".join([
        f"Rank {c.get('rank', '?')}: {c.get('candidate_name', 'Unknown')} — Score: {c.get('match_score', 0)}/100 — Rating: {c.get('rating', 'N/A')}"
        for c in ranked_candidates
    ])

    return f"""
You are an HR analytics expert preparing an executive summary report.

Job Description:
\"\"\"
{job_description}
\"\"\"

Ranked Candidates:
{candidates_summary}

Respond ONLY in the following JSON format:

{{
  "total_candidates": 0,
  "strong_matches": 0,
  "partial_matches": 0,
  "weak_matches": 0,
  "top_candidate": "Name of rank 1 candidate",
  "top_candidate_score": 0,
  "overall_talent_quality": "Excellent or Good or Average or Poor",
  "executive_summary": "3-4 line summary of the candidate pool for the hiring manager",
  "hiring_advice": "Practical hiring advice based on the results"
}}
"""
