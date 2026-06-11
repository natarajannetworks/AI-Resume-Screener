from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def generate_pdf_report(candidate_list, output_file="reports/candidates.pdf"):
    doc = SimpleDocTemplate(output_file)
    styles = getSampleStyleSheet()

    content = []

    for candidate in candidate_list:
        text = f"""
Name: {candidate['name']}
Skills: {', '.join(candidate['skills'])}
Experience: {candidate['experience']}
Education: {candidate['education']}
-------------------------
"""
        content.append(Paragraph(text, styles["Normal"]))
        content.append(Spacer(1, 12))

    doc.build(content)
    print("PDF report generated:", output_file)