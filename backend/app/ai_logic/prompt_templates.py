# prompt_templates.py
# Member 3 - AI + Resume Processing
# Version: Strict Technical Evaluation Edition (More Precise Scoring)

def get_resume_scoring_prompt(job_description: str, resume_text: str) -> str:
    """
    High-precision prompt with strict grading rules.
    Prevents score inflation and ensures core skills are prioritized.
    """
    return f"""
You are an Elite Technical Recruiter with a reputation for being extremely thorough and critical. 
Your goal is to provide a realistic "Fit Score" that a human expert would agree with.

STRICT EVALUATION RULES:
1. THE 100 RULE: Do not award 100/100 unless the candidate meets ALL requirements AND brings extra value (like top-tier certifications, leadership, or rare niche expertise). A standard "Perfect Match" should be 94-96.
2. CORE SKILL PENALTY: If a specific technology mentioned as a requirement in the Job Description (e.g., FastAPI, Kubernetes) is missing from the resume, the 'skills_score' MUST be capped at 20/40. Do NOT give full credit for "similar" tools (like Flask) if the JD asks for a specific one.
3. EXPERIENCE CAP: If the JD asks for 2+ years and the candidate has 0 years (Fresher), the 'experience_score' MUST be below 5/30. No exceptions.
4. HONESTY: Be critical. If a resume is vague, assume the skill level is low.

SCORING BREAKDOWN (Total: 100 points):
- Skills Match     : 40 points (Strictly evaluate Mandatory vs Preferred skills)
- Experience       : 30 points (Relevance of past roles + Years of experience)
- Education        : 20 points (Degree relevance + College prestige)
- Projects/Achieve : 10 points (Real-world impact, Github links, Certifications)

RATING SYSTEM:
- 90 to 100 : Elite Match    (GREEN - Rare)
- 80 to 89  : Strong Match   (GREEN - Good fit)
- 50 to 79  : Partial Match  (YELLOW - Needs training/interview)
- 0  to 49  : Weak Match     (RED - Not suitable)

Job Description:
\"\"\"
{job_description}
\"\"\"

Resume:
\"\"\"
{resume_text}
\"\"\"

Respond ONLY with valid JSON. No markdown, no code fences, no text outside the JSON:

{{
  "candidate_name": "Full name",
  "email": "email or null",
  "phone": "phone or null",
  "education": {{
    "degree": "Degree name",
    "field": "Field",
    "institution": "University",
    "year": "Year"
  }},
  "experience_years": 0,
  "experience_summary": "Concise summary of career history",
  "skills": {{
    "matched": ["Specific tech matched"],
    "missing": ["Required tech missing"],
    "additional": ["Bonus tech found"]
  }},
  "projects": ["Significant projects only"],
  "certifications": ["Verified certs"],
  "score_breakdown": {{
    "skills_score": 0,
    "experience_score": 0,
    "education_score": 0,
    "projects_score": 0
  }},
  "match_score": 0,
  "rating": "Elite Match/Strong Match/Partial Match/Weak Match",
  "rating_color": "GREEN/YELLOW/RED",
  "confidence": "High/Medium/Low",
  "strengths": ["Crucial strength 1", "Crucial strength 2"],
  "weaknesses": ["Specific technical gap 1", "Specific technical gap 2"],
  "reasoning": "Be brutally honest. Why is this person a risk or a win for the company?",
  "hire_recommendation": "Strongly Recommend/Recommend/Consider/Not Recommended"
}}
"""


def get_comparison_prompt(job_description: str, candidate_1: dict, candidate_2: dict) -> str:
    """
    Force the AI to pick a winner based on technical nuances.
    """
    return f"""
Compare these two candidates for the role of {job_description}. 
You must choose the one who will be productive on 'Day 1' with minimal training.

Candidate 1: {candidate_1}
Candidate 2: {candidate_2}

Respond ONLY with valid JSON:
{{
  "better_candidate": "Name",
  "decision_confidence": "High/Medium/Low",
  "reason": "Specific technical reason why X is better than Y",
  "comparison_matrix": {{
    "skills": "Name of winner",
    "experience": "Name of winner",
    "cultural_fit_estimate": "Name of winner"
  }},
  "final_recommendation": "Executive advice for the CEO."
}}
"""


def get_bulk_summary_prompt(job_description: str, ranked_candidates: list) -> str:
    """
    Aggregated report of the candidate pool quality.
    """
    candidates_summary = "\n".join([
        f"{c.get('candidate_name')} (Score: {c.get('match_score')})"
        for c in ranked_candidates
    ])

    return f"""
Analyze this pool of {len(ranked_candidates)} candidates for the JD: {job_description}.

Candidates:
{candidates_summary}

Respond ONLY with valid JSON:
{{
  "total_candidates": {len(ranked_candidates)},
  "talent_pool_rating": "Elite/Strong/Average/Poor",
  "top_recommendation": "Name",
  "executive_summary": "Brief overview of the pool quality.",
  "hiring_advice": "Should we hire from this pool or keep searching?"
}}
"""