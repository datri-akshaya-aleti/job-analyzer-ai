from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from sqlalchemy.orm import Session
from utils.resume_parser import parse_resume
from ml.skill_extractor import analyze_resume
from ml.ats_scorer import calculate_ats_score
from ml.job_matcher import match_jobs_to_resume
from utils.job_api_client import fetch_jobs
from models.db_models import Analysis, get_db
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
import shutil
import os
import json

router = APIRouter(prefix="/resume", tags=["Resume"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SECRET_KEY = "jobanalyzer_secret_key_2024"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

def get_user_id(token: str = Depends(oauth2_scheme)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except:
        return None

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files allowed")
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    parsed = parse_resume(file_path)
    analysis = analyze_resume(parsed["raw_text"])
    return {
        "filename": file.filename,
        "email": parsed["email"],
        "phone": parsed["phone"],
        "word_count": parsed["word_count"],
        "skills": analysis["skills"],
        "skills_count": analysis["skills_count"],
        "experience_years": analysis["experience_years"]
    }

@router.post("/analyze")
async def analyze(file: UploadFile = File(...), job_description: str = Form("")):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files allowed")
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    parsed = parse_resume(file_path)
    analysis = analyze_resume(parsed["raw_text"])
    ats = calculate_ats_score(parsed["raw_text"], job_description)
    return {
        "filename": file.filename,
        "email": parsed["email"],
        "phone": parsed["phone"],
        "skills": analysis["skills"],
        "experience_years": analysis["experience_years"],
        "ats_score": ats["ats_score"],
        "level": ats["level"],
        "missing_keywords": ats["missing_keywords"],
        "common_keywords": ats["common_keywords"],
        "suggestion": ats["suggestion"]
    }

@router.post("/full-analysis")
async def full_analysis(
    file: UploadFile = File(...),
    job_description: str = Form(""),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files allowed")
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    parsed = parse_resume(file_path)
    analysis = analyze_resume(parsed["raw_text"])
    ats = calculate_ats_score(parsed["raw_text"], job_description)
    jobs = await fetch_jobs(analysis["skills"], country="in")
    matched_jobs = match_jobs_to_resume(parsed["raw_text"], jobs)
    if user_id:
        new_analysis = Analysis(
            user_id=user_id,
            filename=file.filename,
            skills=json.dumps(analysis["skills"]),
            ats_score=float(ats["ats_score"]),
            level=str(ats["level"]),
            suggestion=str(ats["suggestion"]),
            missing_keywords=json.dumps(ats["missing_keywords"]),
            job_description=job_description
        )
        db.add(new_analysis)
        db.commit()
    return {
        "filename": file.filename,
        "email": parsed["email"],
        "phone": parsed["phone"],
        "skills": analysis["skills"],
        "experience_years": analysis["experience_years"],
        "ats_score": ats["ats_score"],
        "level": ats["level"],
        "missing_keywords": ats["missing_keywords"],
        "suggestion": ats["suggestion"],
        "matched_jobs": matched_jobs[:5]
    }

@router.get("/history")
async def get_history(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id)
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Please login first!")
    analyses = db.query(Analysis).filter(
        Analysis.user_id == user_id
    ).order_by(Analysis.created_at.desc()).all()
    return {
        "history": [
            {
                "id": a.id,
                "filename": a.filename,
                "ats_score": a.ats_score,
                "level": a.level,
                "skills": json.loads(a.skills) if a.skills else [],
                "missing_keywords": json.loads(a.missing_keywords) if a.missing_keywords else [],
                "suggestion": a.suggestion,
                "created_at": str(a.created_at)
            }
            for a in analyses
        ]
    }