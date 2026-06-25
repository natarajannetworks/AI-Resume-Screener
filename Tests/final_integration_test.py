# final_integration_test.py
from ai_module.scorer import rank_candidates
import json

def run_test():
    print("=" * 60)
    print("   AI RESUME SCREENER - REAL DATA INTEGRATION TEST")
    print("=" * 60)

    # 1. THE JOB DESCRIPTION
    job_description = """
    We are looking for a Python Backend Developer with 2+ years of experience.
    Key skills: Python, SQL, REST APIs, and Machine Learning.
    Knowledge of FastAPI or Flask is a plus.
    """

    # 2. THE REAL TEXT FROM MYTHILI (Member 4)
    resumes = [
        {
            "filename": "Resume1.pdf",
            "text": """ARUN KUMAR 
Email: arunkumar@gmail.com 
Phone: 9876543210 
EDUCATION: B.Tech in Computer Science Engineering, 2022 
SKILLS: Python, SQL, Machine Learning, Git, Pandas, NumPy 
EXPERIENCE: Software Developer Intern, XYZ Technologies, 3 Years 
PROJECTS: AI Resume Screener, Student Management System 
CERTIFICATIONS: Python Programming, Machine Learning Fundamentals"""
        },
        {
            "filename": "Resume2.pdf",
            "text": """RAVI TEJA 
Email: raviteja@gmail.com 
Phone: 9876501234 
EDUCATION: B.Tech Information Technology, 2023 
SKILLS: Python, JavaScript, React, HTML, CSS 
EXPERIENCE: Frontend Developer, 2 Years 
PROJECTS: E-Commerce Website, Portfolio Website 
CERTIFICATIONS: React Development, JavaScript Essentials"""
        },
        {
            "filename": "Resume3.pdf",
            "text": """SNEHA REDDY 
Email: sneha@gmail.com 
Phone: 9876511111 
EDUCATION: B.Tech Electronics and Communication, 2021 
SKILLS: Java, Spring Boot, MySQL, REST API 
EXPERIENCE: Backend Developer, 4 Years 
PROJECTS: Hospital Management System, Inventory Management System 
CERTIFICATIONS: Java Programming, Spring Framework"""
        }
    ]

    # 3. RUN THE AI SCORING
    print("\n🤖 Sending real extracted text to Gemini 2.5 Flash...")
    results = rank_candidates(job_description, resumes)

    # 4. PRINT SUMMARY
    print("\n" + "─" * 60)
    print("🏆 INTEGRATED SYSTEM RANKING")
    print("─" * 60)
    
    for c in results['ranked_candidates']:
        color = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(c['rating_color'], "⚪")
        print(f"Rank {c['rank']} {color} {c['candidate_name']} - Score: {c['match_score']}/100")
        print(f"       Experience: {c['experience_years']} Years")
        print(f"       Advice: {c['hire_recommendation']}")
        print(f"       Reason: {c['reasoning'][:100]}...")
        print("-" * 40)

if __name__ == "__main__":
    run_test()