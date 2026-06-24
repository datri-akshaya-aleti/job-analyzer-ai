from fastapi import APIRouter, HTTPException
from utils.job_api_client import fetch_jobs
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