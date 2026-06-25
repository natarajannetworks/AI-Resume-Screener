from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def generate_pdf_report(candidate_list, output_file="reports/candidates.pdf"):
    doc = SimpleDocTemplate(output_file)
    styles = getSampleStyleSheet()

    content = []

    for candidate in candidate_list:
        name = candidate.get("name", "Unknown")
        skills = candidate.get("skills", [])
        skills_text = ", ".join(skills) if isinstance(skills, list) else str(skills)
        experience = candidate.get("experience", candidate.get("totalExperience", "—"))
        rank = candidate.get("rank", "")
        score = candidate.get("score", "")
        recommendation = candidate.get("recommendation", "")

        text = f"""
Rank: {rank}  |  Score: {score}/100  |  Recommendation: {recommendation}<br/>
Name: {name}<br/>
Skills: {skills_text}<br/>
Experience: {experience}
-------------------------
"""
        content.append(Paragraph(text, styles["Normal"]))
        content.append(Spacer(1, 12))

    doc.build(content)
    print("PDF report generated:", output_file)