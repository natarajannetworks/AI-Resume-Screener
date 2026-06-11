
from parser.pdf_parser import extract_text_from_pdf
import os

resumes_folder = "resumes"

for file in os.listdir(resumes_folder):
    if file.endswith(".pdf"):
        path = os.path.join(resumes_folder, file)

        print("\n==============================")
        print("FILE:", file)
        print("==============================")

        text = extract_text_from_pdf(path)
        print(text)  