# test_summary.py (Updated)
import json
from scorer import generate_executive_summary

def run_summary_test():
    print("=" * 60)
    print("   EXECUTIVE SUMMARY TEST — Candidate Pool Report")
    print("=" * 60)

    sample_jd = "Python Developer with 2+ years experience in FastAPI and AWS."
    ranked_candidates = [
        {"candidate_name": "Arun Kumar", "match_score": 96, "rating": "Strong Match", "skills": ["Python", "FastAPI", "AWS"]},
        {"candidate_name": "Sneha Iyer", "match_score": 94, "rating": "Strong Match", "skills": ["Python", "Django", "AWS"]},
        {"candidate_name": "Vikram Nair", "match_score": 56, "rating": "Partial Match", "skills": ["Python", "Flask"]},
        {"candidate_name": "Priya Sharma", "match_score": 53, "rating": "Partial Match", "skills": ["Django", "SQL"]},
        {"candidate_name": "Rahul Verma", "match_score": 20, "rating": "Weak Match", "skills": ["Java", "C++"]}
    ]

    print("Generating report for the hiring manager...")

    try:
        report = generate_executive_summary(sample_jd, ranked_candidates)
        
        # PRINT THE FULL RAW JSON SO WE CAN SEE EVERYTHING
        print("\n--- RAW AI RESPONSE ---")
        print(json.dumps(report, indent=2))
        print("-" * 30)
            
    except Exception as e:
        print(f"❌ Test Failed: {str(e)}")

if __name__ == "__main__":
    run_summary_test()