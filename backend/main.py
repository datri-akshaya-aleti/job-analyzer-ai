from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from routers import resume
from routers import jobs
from routers import auth

app = FastAPI(
    title="Job Analyzer API",
    description="AI powered resume analyzer and job recommender",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(jobs.router)

@app.get("/")
def home():
    return {"message": "Welcome to Job Analyzer API"}

@app.get("/health")
def health_check():
    return {"status": "running"}