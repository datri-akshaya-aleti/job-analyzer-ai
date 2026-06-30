from sentence_transformers import SentenceTransformer, util
import torch

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def match_jobs_to_resume(resume_text: str, jobs: list) -> list:
    if not jobs:
        return []

    model = get_model()
    resume_embedding = model.encode(resume_text, convert_to_tensor=True)

    scored_jobs = []
    for job in jobs:
        job_text = f"{job['title']} {job['description']}"
        job_embedding = model.encode(job_text, convert_to_tensor=True)

        similarity = util.cos_sim(resume_embedding, job_embedding)
        score = round(float(similarity[0][0]) * 100, 2)

        job_with_score = job.copy()
        job_with_score["match_score"] = score
        job_with_score["match_level"] = get_match_level(score)
        scored_jobs.append(job_with_score)

    scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    return scored_jobs

def get_match_level(score: float) -> str:
    if score >= 70:
        return "Excellent Match"
    elif score >= 50:
        return "Good Match"
    elif score >= 30:
        return "Average Match"
    else:
        return "Low Match"