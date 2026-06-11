from parser.pdf_parser import extract_text_from_pdf
from parser.structured_parser import extract_structured_data
import os

resumes_folder = "resumes"

for file in os.listdir(resumes_folder):
    if file.endswith(".pdf"):
        path = os.path.join(resumes_folder, file)

        print("\n==============================")
        print("FILE:", file)
        print("==============================")

        # Step 1: PDF → Text
        text = extract_text_from_pdf(path)

        # Step 2: Text → Structured Data
        data = extract_structured_data(text)

        print(data)