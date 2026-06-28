from fastapi import APIRouter, HTTPException
from utils.job_api_client import fetch_jobs
from utils.youtube_client import get_interview_videos, get_company_prep_videos
from pydantic import BaseModel

router = APIRouter(prefix="/jobs", tags=["Jobs"])

class JobSearchRequest(BaseModel):
    skills: list
    country: str = "in"

@router.post("/recommend")
async def recommend_jobs(request: JobSearchRequest):
    if not request.skills:
        raise HTTPException(status_code=400, detail="Skills list cannot be empty")
    
    jobs = await fetch_jobs(request.skills, request.country)
    
    if not jobs:
        return {"message": "No jobs found", "jobs": []}
    
    return {
        "total": len(jobs),
        "skills_used": request.skills[:5],
        "jobs": jobs
    }

@router.get("/search/{keyword}")
async def search_jobs(keyword: str, country: str = "in"):
    jobs = await fetch_jobs([keyword], country)
    
    if not jobs:
        return {"message": "No jobs found", "jobs": []}
    
    return {
        "total": len(jobs),
        "keyword": keyword,
        "jobs": jobs
    }

@router.get("/prep/{job_title}")
async def get_job_prep(job_title: str, company: str = ""):
    videos = await get_interview_videos(job_title, company)
    company_videos = await get_company_prep_videos(company, job_title) if company else []
    
    return {
        "job_title": job_title,
        "company": company,
        "interview_videos": videos,
        "company_videos": company_videos,
        "interview_tips": get_interview_tips(job_title),
        "hiring_process": get_hiring_process(company)
    }

def get_interview_tips(job_title: str) -> list:
    general_tips = [
        "Research the company thoroughly before the interview",
        "Prepare STAR method answers (Situation, Task, Action, Result)",
        "Practice coding problems on LeetCode if it's a technical role",
        "Prepare questions to ask the interviewer",
        "Review your resume and be ready to explain every point"
    ]
    
    tech_tips = [
        "Practice Data Structures and Algorithms",
        "Review System Design concepts",
        "Know your tech stack inside out",
        "Practice explaining your projects clearly",
        "Be ready for live coding sessions"
    ]
    
    job_lower = job_title.lower()
    if any(word in job_lower for word in ["developer", "engineer", "data", "ml", "ai", "analyst"]):
        return general_tips + tech_tips
    
    return general_tips

def get_hiring_process(company: str) -> list:
    default_process = [
        "📋 Application Review — HR screens your resume",
        "📞 Phone/Video Screening — Initial call with HR (15-30 mins)",
        "💻 Technical Round 1 — Coding or technical assessment",
        "🧠 Technical Round 2 — Deep technical interview",
        "👥 HR Round — Culture fit and salary discussion",
        "📄 Offer Letter — Final offer and negotiation"
    ]
    return default_process