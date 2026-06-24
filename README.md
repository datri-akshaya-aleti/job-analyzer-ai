# 🎯 Job Analyzer AI

An AI-powered full-stack web application that analyzes resumes, calculates ATS scores, and recommends live job listings based on your skills.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue)

---

## ✨ Features

- 📄 **Resume Upload** — Upload PDF or DOCX resume
- 🔍 **Skill Extraction** — Automatically extracts skills using spaCy NLP
- 📊 **ATS Score** — Calculates match score using TF-IDF and Cosine Similarity
- 💡 **Improvement Suggestions** — Shows missing keywords to improve resume
- 💼 **Job Recommendations** — Live job listings matched using Sentence-BERT
- 🔗 **Apply Button** — Direct link to apply on company website
- 🔐 **Authentication** — Register/Login with JWT tokens
- 🗄️ **Database** — Analysis history saved to PostgreSQL

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Axios
- CSS Animations (Neural Network Background)

### Backend
- Python
- FastAPI
- Uvicorn

### Machine Learning
- spaCy — Named Entity Recognition
- scikit-learn — TF-IDF + Cosine Similarity (ATS Score)
- Sentence-BERT — Semantic Job Matching
- PyMuPDF — PDF Parsing
- python-docx — DOCX Parsing

### Database
- PostgreSQL
- SQLAlchemy

### APIs
- Adzuna API — Live job listings

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11
- Node.js
- PostgreSQL

### Backend Setup
```bash
cd job-analyzer
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cd backend
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the root folder:
ADZUNA_APP_ID=your_app_id

ADZUNA_APP_KEY=your_app_key

DATABASE_URL=postgresql://postgres:password@localhost:5432/jobanalyzer

SECRET_KEY=your_secret_key

---

## 📸 Screenshots

### Home Page
![Home](screenshots/home.png)

### ATS Score Results
![Results](screenshots/results.png)

---

## 🧠 How It Works

1. User uploads resume (PDF/DOCX)
2. PyMuPDF/python-docx extracts text
3. spaCy NLP identifies skills and entities
4. TF-IDF + Cosine Similarity calculates ATS score
5. Adzuna API fetches live job listings
6. Sentence-BERT matches resume to jobs semantically
7. Results displayed with improvement suggestions

---

## 👨‍💻 Author

**Dhathri Akshaya**
- GitHub: [@dhathri-akshaya](https://github.com/dhathri-akshaya)
- LinkedIn: [Add your LinkedIn]

---

## 📝 License

This project is open source and available under the MIT License.