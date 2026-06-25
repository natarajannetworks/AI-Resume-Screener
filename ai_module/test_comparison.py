# test_comparison.py
import json
import os
from scorer import compare_candidates

def run_comparison_test():
    print("=" * 60)
    print("   COMPARE CANDIDATES TEST — Head-to-Head Analysis")
    print("=" * 60)

    sample_jd = "Python Developer with 2+ years experience in FastAPI and AWS."

    # Using the two top candidates from our previous test
    candidate_a = {
        "candidate_name": "Arun Kumar",
        "match_score": 96,
        "experience_years": 3,
        "skills": ["Python", "FastAPI", "Docker", "AWS", "React"],
        "reasoning": "Strong match in core backend technologies."
    }

    candidate_b = {
        "candidate_name": "Sneha Iyer",
        "match_score": 94,
        "experience_years": 4,
        "skills": ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
        "reasoning": "Highly experienced with strong background."
    }

    print(f"Comparing: {candidate_a['candidate_name']} vs {candidate_b['candidate_name']}...")
    
    try:
        # Calling your real function
        comparison = compare_candidates(sample_jd, candidate_a, candidate_b)
        
        print("\n🏆 COMPARISON RESULT:")
        print("-" * 30)
        
        # Checking if it's the real API result or an error
        if "error" in comparison:
            print(f"❌ Error: {comparison['error']}")
        else:
            print(f"Winner          : {comparison.get('winner', 'N/A')}")
            print(f"Comparison Summary: {comparison.get('comparison_summary', 'N/A')}")
            
            print("\nKey Differences:")
            diffs = comparison.get('key_differences', [])
            for d in diffs:
                print(f" • {d}")
                
            print(f"\nFinal Verdict: {comparison.get('final_verdict', 'N/A')}")
            
    except Exception as e:
        print(f"❌ Test Failed: {str(e)}")

if __name__ == "__main__":
    run_comparison_test()