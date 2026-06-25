"""
Test Script — rank_candidates() with multiple real resumes
Natarajan S — AI Processing Module
Run: python test_ranking.py
"""

import json
import sys
import os

# Add ai_module to path so we can import scorer
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

# ─── Sample Job Description ───────────────────────────────────────────────────
JOB_DESCRIPTION = """
Position: Python Backend Developer
Company: TechStartup Pvt Ltd

Requirements:
- 2+ years of experience in Python development
- Strong knowledge of FastAPI or Django
- Experience with REST API design
- SQL/PostgreSQL database skills
- Familiarity with Docker and cloud deployment
- Good understanding of Git and version control

Nice to have:
- React or any frontend framework
- AWS or GCP experience
- Knowledge of microservices architecture
"""

# ─── 5 Sample Resumes (different skill levels) ───────────────────────────────
RESUMES = [
    {
        "filename": "arun_kumar.pdf",
        "text": """
Arun Kumar
Email: arun@gmail.com | Phone: 9876543210
Education: B.E. Computer Science, Anna University, 2021

Experience:
- 3 years as Python Backend Developer at XYZ Startup
- Built REST APIs using FastAPI and PostgreSQL
- Deployed services on AWS EC2 using Docker

Skills: Python, FastAPI, PostgreSQL, Docker, AWS, Git, React
Projects:
- Resume Parser Tool using Python and NLP
- E-commerce REST API with FastAPI
Certifications: AWS Cloud Practitioner
"""
    },
    {
        "filename": "priya_sharma.pdf",
        "text": """
Priya Sharma
Email: priya@gmail.com | Phone: 9123456780
Education: B.Tech Information Technology, VIT University, 2022

Experience:
- 1.5 years as Junior Python Developer at ABC Solutions
- Worked on Django-based web applications
- Basic SQL queries and database management

Skills: Python, Django, MySQL, HTML, CSS, Git
Projects:
- Student Management System using Django
- Library Management Web App
"""
    },
    {
        "filename": "rahul_verma.pdf",
        "text": """
Rahul Verma
Email: rahul@gmail.com | Phone: 9988776655
Education: B.Sc Computer Science, Delhi University, 2023

Experience: Fresher — No work experience

Skills: C, C++, Java, basic Python
Projects:
- Calculator App in Java
- Snake Game in C++
"""
    },
    {
        "filename": "sneha_iyer.pdf",
        "text": """
Sneha Iyer
Email: sneha@gmail.com | Phone: 9765432100
Education: M.Tech Software Engineering, IIT Madras, 2020

Experience:
- 4 years as Senior Backend Developer at DataCorp
- Designed and built microservices using FastAPI and Python
- Managed PostgreSQL and Redis databases
- Deployed full stack on GCP using Docker and Kubernetes
- Led a team of 3 junior developers

Skills: Python, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, GCP, Git, React, Microservices
Projects:
- Real-time analytics pipeline
- Multi-tenant SaaS backend platform
Certifications: Google Cloud Professional, Python Institute PCEP
"""
    },
    {
        "filename": "vikram_nair.pdf",
        "text": """
Vikram Nair
Email: vikram@gmail.com | Phone: 9345678901
Education: B.E. Electronics and Communication, Anna University, 2021

Experience:
- 2 years as Software Developer at Infosys
- Worked on Python automation scripts
- Some exposure to Flask REST APIs
- Basic AWS S3 usage

Skills: Python, Flask, AWS S3, Git, Selenium, SQL
Projects:
- Test automation framework using Selenium and Python
- Internal reporting tool using Flask
"""
    }
]

# ─── Run the Test ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("   RANK CANDIDATES TEST — 5 Resumes")
    print("=" * 60)

    try:
        from scorer import rank_candidates

        print(f"\n📋 Job: Python Backend Developer")
        print(f"👥 Resumes to rank: {len(RESUMES)}")
        print(f"\n⏳ Sending all resumes to Gemini API...")
        print("   (This will take ~30-60 seconds for 5 resumes)\n")

        results = rank_candidates(JOB_DESCRIPTION, RESUMES)

        if "error" in results:
            print(f"❌ Error: {results['error']}")
        else:
            candidates = results.get("ranked_candidates", [])
            print(f"✅ Ranking complete!\n")
            print(f"Total     : {results.get('total', 0)}")
            print(f"🟢 Strong  : {results.get('strong_matches', 0)}")
            print(f"🟡 Partial : {results.get('partial_matches', 0)}")
            print(f"🔴 Weak    : {results.get('weak_matches', 0)}")
            if results.get("failed_files"):
                print(f"⚠️  Failed  : {results.get('failed_files')}")

            print("\n" + "─" * 60)
            print("RANKED RESULTS")
            print("─" * 60)

            for c in candidates:
                color = "🟢" if c.get("rating_color") == "GREEN" else \
                        "🟡" if c.get("rating_color") == "YELLOW" else "🔴"
                print(f"\nRank {c.get('rank')} {color}  {c.get('candidate_name')}")
                print(f"  Score      : {c.get('match_score')}/100")
                print(f"  Rating     : {c.get('rating')}")
                print(f"  Recommend  : {c.get('hire_recommendation')}")
                matched = c.get("skills", {}).get("matched", [])
                missing = c.get("skills", {}).get("missing", [])
                print(f"  Matched    : {', '.join(matched[:4])}")
                if missing:
                    print(f"  Missing    : {', '.join(missing[:3])}")
                print(f"  Reasoning  : {c.get('reasoning', '')[:120]}...")

            print("\n" + "=" * 60)
            print("✅ rank_candidates() test PASSED with real Gemini API!")
            print("=" * 60)

            # Save full JSON output to file for reference
            with open("ranking_output.json", "w") as f:
                json.dump(results, f, indent=2)
            print("\n📄 Full JSON saved to ranking_output.json")

    except ImportError:
        print("❌ Could not import scorer.py")
        print("   Make sure you run this from inside your ai_module folder!")
        print("   cd C:\\Users\\natar\\AI-Resume-Screener\\ai_module")
        print("   python test_ranking.py")
