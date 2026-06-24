from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def calculate_ats_score(resume_text: str, job_description: str) -> dict:
    cleaned_resume = clean_text(resume_text)
    cleaned_job = clean_text(job_description)

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([cleaned_resume, cleaned_job])
    similarity = cosine_similarity(vectors[0], vectors[1])[0][0]
    score = round(similarity * 100, 2)

    job_words = set(cleaned_job.split())
    resume_words = set(cleaned_resume.split())
    missing_keywords = list(job_words - resume_words)[:10]
    common_keywords = list(job_words & resume_words)[:10]

    if score >= 70:
        level = "Excellent"
    elif score >= 50:
        level = "Good"
    elif score >= 30:
        level = "Average"
    else:
        level = "Poor"

    return {
        "ats_score": score,
        "level": level,
        "common_keywords": common_keywords,
        "missing_keywords": missing_keywords,
        "suggestion": get_suggestion(level)
    }

def get_suggestion(level: str) -> str:
    suggestions = {
        "Excellent": "Your resume is well optimized for this job!",
        "Good": "Your resume is good but add more job specific keywords.",
        "Average": "Add more relevant skills and keywords from the job description.",
        "Poor": "Your resume needs major improvements to match this job."
    }
    return suggestions[level]