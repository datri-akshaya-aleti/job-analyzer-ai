import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

SKILL_KEYWORDS = [
    "python", "java", "javascript", "typescript", "c++", "c#", "r", "sql",
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    "fastapi", "flask", "django", "react", "nodejs", "html", "css",
    "postgresql", "mongodb", "mysql", "sqlite", "git", "docker", "aws",
    "data analysis", "data science", "artificial intelligence", "excel",
    "power bi", "tableau", "rest api", "json", "agile", "communication"
]

EDUCATION_KEYWORDS = [
    "bachelor", "master", "phd", "degree", "b.tech", "m.tech", "bsc", "msc",
    "computer science", "information technology", "engineering", "graduate",
    "university", "college", "gpa", "cgpa"
]

EXPERIENCE_KEYWORDS = [
    "experience", "years", "worked", "internship", "project", "developed",
    "built", "designed", "implemented", "managed", "led", "created",
    "deployed", "maintained", "collaborated", "achieved"
]

def calculate_keyword_score(resume_text: str, job_text: str) -> dict:
    resume_lower = resume_text.lower()
    job_lower = job_text.lower()

    job_words = set(job_lower.split())
    resume_words = set(resume_lower.split())

    common = job_words & resume_words
    missing = job_words - resume_words

    important_missing = [w for w in missing if len(w) > 4][:10]
    important_common = [w for w in common if len(w) > 4][:10]

    score = min((len(common) / max(len(job_words), 1)) * 100, 100)
    return {
        "score": round(score, 2),
        "common": important_common,
        "missing": important_missing
    }

def calculate_skills_score(resume_text: str, job_text: str) -> dict:
    resume_lower = resume_text.lower()
    job_lower = job_text.lower()

    job_skills = [s for s in SKILL_KEYWORDS if s in job_lower]
    resume_skills = [s for s in SKILL_KEYWORDS if s in resume_lower]

    if not job_skills:
        return {"score": 50, "found": resume_skills, "missing": []}

    matched = [s for s in job_skills if s in resume_skills]
    missing = [s for s in job_skills if s not in resume_skills]

    score = (len(matched) / len(job_skills)) * 100
    return {
        "score": round(score, 2),
        "found": matched,
        "missing": missing
    }

def calculate_education_score(resume_text: str, job_text: str) -> dict:
    resume_lower = resume_text.lower()
    job_lower = job_text.lower()

    job_edu = [e for e in EDUCATION_KEYWORDS if e in job_lower]
    resume_edu = [e for e in EDUCATION_KEYWORDS if e in resume_lower]

    if not job_edu:
        return {"score": 70}

    matched = [e for e in job_edu if e in resume_edu]
    score = (len(matched) / len(job_edu)) * 100
    return {"score": min(round(score, 2), 100)}

def calculate_experience_score(resume_text: str) -> dict:
    resume_lower = resume_text.lower()

    exp_found = [e for e in EXPERIENCE_KEYWORDS if e in resume_lower]
    years_match = re.findall(r'(\d+)\+?\s*years?', resume_lower)
    years = max([int(y) for y in years_match], default=0) if years_match else 0

    base_score = min((len(exp_found) / len(EXPERIENCE_KEYWORDS)) * 100, 100)

    if years >= 3:
        base_score = min(base_score + 20, 100)
    elif years >= 1:
        base_score = min(base_score + 10, 100)

    return {"score": round(base_score, 2), "years": years}

def calculate_semantic_score(resume_text: str, job_text: str) -> float:
    try:
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([
            clean_text(resume_text),
            clean_text(job_text)
        ])
        similarity = cosine_similarity(vectors[0], vectors[1])[0][0]
        return round(float(similarity) * 100, 2)
    except:
        return 0.0

def get_improvement_tips(skills_missing: list, keywords_missing: list, experience_score: float) -> list:
    tips = []

    if skills_missing:
        tips.append(f"Add these missing skills to your resume: {', '.join(skills_missing[:5])}")

    if keywords_missing:
        tips.append(f"Include these keywords from the job description: {', '.join(keywords_missing[:5])}")

    if experience_score < 40:
        tips.append("Add more details about your projects and work experience using action verbs like 'developed', 'built', 'implemented'")

    if not tips:
        tips.append("Your resume is well optimized! Keep applying!")

    return tips

def calculate_ats_score(resume_text: str, job_description: str) -> dict:
    keyword_result = calculate_keyword_score(resume_text, job_description)
    skills_result = calculate_skills_score(resume_text, job_description)
    education_result = calculate_education_score(resume_text, job_description)
    experience_result = calculate_experience_score(resume_text)
    semantic_score = calculate_semantic_score(resume_text, job_description)

    keyword_score = keyword_result["score"]
    skills_score = skills_result["score"]
    education_score = education_result["score"]
    experience_score = experience_result["score"]

    final_score = round(
        (semantic_score * 0.30) +
        (skills_score * 0.35) +
        (keyword_score * 0.20) +
        (education_score * 0.05) +
        (experience_score * 0.10),
        2
    )

    if final_score >= 75:
        level = "Excellent"
    elif final_score >= 55:
        level = "Good"
    elif final_score >= 35:
        level = "Average"
    else:
        level = "Poor"

    tips = get_improvement_tips(
        skills_result["missing"],
        keyword_result["missing"],
        experience_score
    )

    return {
        "ats_score": final_score,
        "level": level,
        "breakdown": {
            "semantic_match": semantic_score,
            "skills_match": skills_score,
            "keyword_match": keyword_score,
            "education_match": education_score,
            "experience_match": experience_score
        },
        "skills_found": skills_result["found"],
        "skills_missing": skills_result["missing"],
        "common_keywords": keyword_result["common"],
        "missing_keywords": keyword_result["missing"],
        "improvement_tips": tips,
        "suggestion": tips[0] if tips else "Keep improving!"
    }