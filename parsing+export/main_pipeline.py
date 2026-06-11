from parser.pdf_parser import extract_text_from_pdf
from parser.structured_parser import extract_structured_data
from exports.excel_report import generate_excel_report
from exports.pdf_report import generate_pdf_report
import os

resumes_folder = "resumes"
all_candidates = []

for file in os.listdir(resumes_folder):
    if file.endswith(".pdf"):
        path = os.path.join(resumes_folder, file)

        text = extract_text_from_pdf(path)
        data = extract_structured_data(text)

        all_candidates.append(data)

# EXPORT
generate_excel_report(all_candidates)
generate_pdf_report(all_candidates)

print("Pipeline executed successfully")