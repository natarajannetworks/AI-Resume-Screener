from scorer import score_resume

job_description = """
Looking for a Python Developer with FastAPI, SQL, REST API and Docker skills.
Minimum 2 years experience.
"""

resume1 = """
Arun Kumar
3 years experience in Python, FastAPI, PostgreSQL and REST APIs.
"""

resume2 = """
Priya Sharma
2 years experience in Java, Spring Boot and MySQL.
"""

resume3 = """
Rahul Verma
Fresher. Knows Python and HTML.
"""

result1 = score_resume(job_description, resume1)
result2 = score_resume(job_description, resume2)
result3 = score_resume(job_description, resume3)

print(result1["candidate_name"], result1["match_score"])
print(result2["candidate_name"], result2["match_score"])
print(result3["candidate_name"], result3["match_score"])
from excel_report import generate_excel_report

candidate_list = []

for rank, candidate in enumerate(ranked_candidates, start=1):
    candidate_list.append({
        "Rank": rank,
        "Name": candidate["candidate_name"],
        "Match Score": candidate["match_score"],
        "Rating": candidate.get("rating", ""),
        "Recommendation": candidate.get("hire_recommendation", "")
    })

generate_excel_report(candidate_list)