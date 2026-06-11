def extract_structured_data(text):
    data = {
        "name": "",
        "skills": [],
        "education": "",
        "experience": ""
    }

    # predefined skill list (important for clean extraction)
    skill_keywords = [
        "python", "sql", "java", "javascript", "react",
        "html", "css", "machine learning", "git",
        "numpy", "pandas", "mysql", "spring", "rest api"
    ]

    lines = text.split("\n")

    for line in lines:
        line = line.strip()

        if not line:
            continue

        lower_line = line.lower()

        # ---------------- NAME ----------------
        # assumes name is first ALL CAPS meaningful line
        if data["name"] == "" and line.isupper() and len(line.split()) <= 3:
            data["name"] = line

        # ---------------- EXPERIENCE ----------------
        if "years" in lower_line:
            data["experience"] = line

        # ---------------- EDUCATION ----------------
        if "b.tech" in lower_line or "engineering" in lower_line:
            data["education"] = line

        # ---------------- SKILLS ----------------
        for skill in skill_keywords:
            if skill in lower_line:
                data["skills"].append(skill)

    # remove duplicates from skills
    data["skills"] = list(set(data["skills"]))

    return data