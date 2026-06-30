import spacy

_nlp = None

def get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp
SKILLS_LIST = [
    "python", "java", "javascript", "typescript", "c++", "c#", "r",
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "matplotlib", "seaborn",
    "fastapi", "flask", "django", "react", "nodejs",
    "sql", "mysql", "postgresql", "mongodb", "sqlite",
    "git", "github", "docker", "kubernetes", "aws", "azure",
    "data analysis", "data science", "artificial intelligence",
    "excel", "power bi", "tableau",
    "html", "css", "rest api", "json"
]

def extract_skills(text: str) -> list:
    text_lower = text.lower()
    found_skills = []
    for skill in SKILLS_LIST:
        if skill in text_lower:
            found_skills.append(skill)
    return found_skills

def extract_experience_years(text: str) -> int:
    import re
    matches = re.findall(r'(\d+)\+?\s*years?\s*of\s*experience', text.lower())
    if matches:
        return max([int(m) for m in matches])
    return 0

def analyze_resume(text: str) -> dict:
    skills = extract_skills(text)
    experience_years = extract_experience_years(text)
    nlp = get_nlp()
    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    
    return {
        "skills": skills,
        "skills_count": len(skills),
        "experience_years": experience_years,
        "entities": entities[:10]
    }