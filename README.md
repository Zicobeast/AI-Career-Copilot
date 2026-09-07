# AI Career Copilot 🚀
> *Turn your resume into a personalized career roadmap.*

AI Career Copilot is a full-stack, production-grade MVP web application designed to bridge the gap between candidate qualifications and industry job requirements. By parsing resumes, extracting technical competencies, comparing them against target job descriptions, and calculating an objective Career Readiness Score, the platform generates an actionable step-by-step personalized learning roadmap equipped with real-time progress tracking and an interactive contextual AI Career Assistant.

---

## 🌟 Key Features

1. **Dual Experience Modes**
   - **Authenticated Flow**: Complete JWT-based registration, login, state persistence, and private user roadmaps.
   - **One-Click Demo Mode**: Immediate evaluation access pre-loaded with comprehensive candidate and job data without needing to sign up or upload documents.

2. **Real Document Parsing**
   - Direct upload and extraction of PDF (PyMuPDF) and DOCX (python-docx) files.
   - Zero mock data in parsing: extracts actual text layers, structure, contact info, experience, and projects.

3. **Intelligent Skill Extraction & Gap Analysis**
   - Normalized dictionary and semantic text matching across 100+ modern tech stacks.
   - Programmatic categorization into **Matched Skills**, **Partial Skills**, and **Missing Skills**.
   - Transparent Career Readiness Score algorithm.

4. **Actionable Personalized Roadmap**
   - Step-by-step ordered learning milestones with difficulty ratings, time estimates, and actionable guidance.
   - Interactive checkbox progress tracking persisted directly in the database.

5. **Context-Aware Career Chatbot**
   - Hybrid AI engine: uses Gemini LLM API when configured, with a resilient rule-based contextual fallback engine when offline or unauthenticated.
   - Answers contextual queries like *What should I learn first?*, *Am I ready for this job?*, and *What project should I build?*.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide React icons, Axios.
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn, Python-Jose (JWT), Passlib/Bcrypt.
- **Document Processing**: PyMuPDF (fitz), python-docx.
- **Database**: SQLite with SQLAlchemy 2.0 ORM (designed for seamless PostgreSQL migration).
- **AI/LLM**: Google Gemini API (with robust local rule-based fallback).

---

## 🏗️ Architecture & Workflow

`
Landing Page
     │
     ├──► [Try Demo] ───────────────┐
     │                              ▼
     └──► [Register / Login] ──► Dashboard ──► Resume Upload / Parser (PyMuPDF/docx)
                                    │
                                    ├──► Job Description Analysis
                                    │
                                    ├──► Skill Gap Engine (Matched / Partial / Missing)
                                    │
                                    ├──► Career Readiness Score (0-100%)
                                    │
                                    ├──► Personalized Roadmap Generator
                                    │
                                    └──► Contextual AI Career Assistant
`

---

## 📁 Project Structure

`
AI-Career-Copilot/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── RoadmapItem.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   └── ChatBox.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Resume.jsx
│   │   │   ├── Analysis.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── resume.py
│   │   │   ├── job.py
│   │   │   ├── analysis.py
│   │   │   └── roadmap.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── resume.py
│   │   │   ├── job.py
│   │   │   ├── analysis.py
│   │   │   ├── roadmap.py
│   │   │   └── chatbot.py
│   │   └── services/
│   │       ├── resume_parser.py
│   │       ├── skill_extractor.py
│   │       ├── job_analyzer.py
│   │       ├── skill_gap.py
│   │       ├── roadmap.py
│   │       └── chatbot.py
│   ├── uploads/
│   ├── requirements.txt
│   └── .env.example
│
├── data/
│   ├── demo_resume.txt
│   └── demo_job.txt
├── README.md
├── .gitignore
└── LICENSE
`

---

## ⚡ Quick Start Guide

### 1. Backend Setup
`ash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
`

### 2. Frontend Setup
`ash
cd ../frontend
npm install
npm run dev
`
Open http://localhost:5173 in your browser.

---

## 🔑 Environment Variables (ackend/.env)

`env
PROJECT_NAME=AI Career Copilot
SECRET_KEY=your-jwt-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./career_copilot.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=" # Optional: Works offline with built-in rule engine
`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | API Root status |
| GET | /health | Service health & diagnostics |
| POST | /api/auth/register | Register new user account |
| POST | /api/auth/login | Authenticate & receive JWT token |
| GET | /api/auth/me | Fetch authenticated user profile |
| POST | /api/resume/upload | Upload & parse PDF/DOCX resume |
| POST | /api/resume/demo | Load structured demo resume |
| POST | /api/job/analyze | Parse and extract job description skills |
| POST | /api/job/demo | Load structured demo job requirements |
| POST | /api/analysis/skill-gap | Compute readiness score and skill gap |
| POST | /api/roadmap/generate | Generate milestone learning roadmap |
| PATCH | /api/roadmap/{id}/progress | Toggle milestone completion state |
| POST | /api/chat | Contextual AI Career Assistant |

---

## 🎯 Demo Mode Instructions
For immediate evaluation without registration:
1. Navigate to http://localhost:5173.
2. Click the **Try Demo** button on the hero section or navbar.
3. Observe the preloaded candidate skills (Python, SQL, React, etc.) against the target **Backend Developer** job.
4. Review the computed **72% Career Readiness Score**, missing skills breakdown (FastAPI, PostgreSQL, Docker, AWS), and actionable roadmap.
5. Interact with the **AI Career Assistant** tab to ask questions directly.

---

## 🚀 Future Scope (Major Project Roadmap)
- Real-time job board scraping & live ATS matching (LinkedIn, Indeed APIs).
- Vector embeddings with ChromaDB & LangChain RAG pipeline.
- AI-driven audio/video mock interview simulation.
- Multi-tenant enterprise career counseling portals.
