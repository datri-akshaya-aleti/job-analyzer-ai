import httpx
import os
from dotenv import load_dotenv

load_dotenv()

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs"

async def fetch_jobs(skills: list, country: str = "in") -> list:
    if not skills:
        return []
    
    query = " ".join(skills[:3])
    
    url = f"{ADZUNA_BASE_URL}/{country}/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": 10,
        "what": query,
        "content-type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            data = response.json()
    except Exception as e:
        print(f"Error fetching jobs: {e}")
        return []
    
    jobs = []
    for job in data.get("results", []):
        jobs.append({
            "title": job.get("title", ""),
            "company": job.get("company", {}).get("display_name", ""),
            "location": job.get("location", {}).get("display_name", ""),
            "description": job.get("description", "")[:200],
            "salary_min": job.get("salary_min", "Not disclosed"),
            "salary_max": job.get("salary_max", "Not disclosed"),
            "apply_url": job.get("redirect_url", ""),
            "created": job.get("created", "")
        })
    
    return jobs