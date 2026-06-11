import pandas as pd

def generate_excel_report(candidate_list, output_file="reports/candidates.xlsx"):
    df = pd.DataFrame(candidate_list)
    df.to_excel(output_file, index=False)
    print("Excel report generated:", output_file)