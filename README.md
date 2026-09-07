# AI Career Copilot 🚀
> *Turn your resume into a personalized career roadmap.*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy_2.0-003B57.svg?logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Tests](https://img.shields.io/badge/Tests-31%20Passing-brightgreen.svg)]()
[![Build](https://img.shields.io/badge/Vite%20Build-Passing-brightgreen.svg)]()

AI Career Copilot is a full-stack, production-grade MVP web application designed to bridge the gap between candidate qualifications and industry job requirements. By parsing real PDF/DOCX resumes, extracting technical competencies across 120+ stacks, comparing them against target job descriptions, and calculating an objective Career Readiness Score, the platform generates an actionable, step-by-step personalized learning roadmap equipped with real-time milestone progress tracking and an interactive contextual AI Career Assistant.

---

## 🌟 Key Features

1. **One-Click Evaluation Demo Mode**
   - Instant evaluator access pre-loaded with candidate **Alex Johnson**, target job **Backend Developer**, computed **72% Career Readiness Score**, and actionable roadmap without requiring registration, external API keys, or manual file uploads.

2. **Real Document Parsing Engine**
   - High-fidelity extraction of text and metadata from **PDF** (`PyMuPDF / fitz`) and **DOCX** (`python-docx`) files.
   - Extracts candidate name, contact information, work experience, projects, education, and technical competencies. Zero simulated text streams.

3. **Intelligent Skill Extraction & Gap Analysis**
   - Normalized dictionary and semantic text matching across 120+ technical competencies in 6 domains: Languages, Frameworks, Databases, Cloud/DevOps, Developer Tools, and Core Concepts.
   - Categorizes skills into **Matched Skills**, **Partial Skills**, and **Missing Skills**.
   - Computes a mathematical, transparent **Career Readiness Score** (72% in the evaluation scenario).

4. **Actionable Personalized Learning Roadmap**
   - Prerequisite-ordered, chronologically structured learning milestones with difficulty ratings, time commitments, and specific learning objectives.
   - Interactive milestone progress tracking with database persistence (`PATCH /api/roadmap/{id}/progress`) that dynamically boosts the candidate's projected readiness score towards 95%+.

5. **Context-Aware AI Career Assistant**
   - Hybrid conversational engine: integrates with **Google Gemini 1.5 Flash** REST API when configured, paired with a deterministic, resilient **Rule-Based Contextual Fallback Engine** that operates 100% offline.
   - Answers personalized questions like *"What should I learn first?"*, *"Am I ready for this job?"*, *"What project should I build?"*, and *"Explain Docker for my roadmap"*.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide React icons, Axios.
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn, Python-Jose (JWT), Passlib/Bcrypt, SQLAlchemy 2.0.
- **Document Processing**: PyMuPDF (`fitz`), `python-docx`.
- **Database**: SQLite with SQLAlchemy 2.0 ORM (fully prepared for PostgreSQL migration).
- **AI/LLM**: Google Gemini 1.5 REST API with deterministic local rule-based intent fallback.

---

## 🏗️ Architecture & Workflow

```
Landing Page (/)
     │
     ├──► [Try Demo] ───────────────┐ (Instant pre-hydrated evaluation state)
     │                              ▼
     └──► [Register / Login] ──► Dashboard (/dashboard)
                                    │
                                    ├──► Resume Upload / Parser (PyMuPDF / docx)
                                    │
                                    ├──► Job Description Analysis (120+ skill dictionary)
                                    │
                                    ├──► Skill Gap Engine (Matched / Partial / Missing)
                                    │
                                    ├──► Career Readiness Score (Exact 72%)
                                    │
                                    ├──► Personalized Roadmap (4 ordered milestones)
                                    │      └─► Interactive Checkbox (Dynamic Score Boost)
                                    │
                                    └──► Contextual AI Career Assistant (Gemini / Offline Rule Engine)
```

---

## ⚡ Quick Start & Evaluator Launchers

### Option A: One-Click Windows Launcher (Recommended)
From the project root directory, double-click or run:
```cmd
start_app.bat
```
*This automatically boots both the FastAPI backend on port 8000 and the Vite frontend on port 5173 in dedicated console windows.*

### Option B: Automated Test Suite & Build Verification
To run all 31 backend unit and end-to-end tests along with the frontend production build:
```cmd
run_tests.bat
```

### Option C: Manual Launch

#### 1. Backend Setup
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Root: [http://localhost:8000](http://localhost:8000)
- OpenAPI Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Frontend Setup
```cmd
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 📖 Detailed Demonstration Guide
For viva voce presentation talking points, evaluation scenario script, candidate persona breakdown, and technical defense FAQ, refer to:
👉 **[DEMO_GUIDE.md](DEMO_GUIDE.md)**

---

## 📁 Project Structure

```
AI-Career-Copilot/
├── start_app.bat               # One-click dual server launcher
├── start_backend.bat           # FastAPI backend launcher
├── start_frontend.bat          # Vite frontend launcher
├── run_tests.bat               # 31-test runner & build validator
├── DEMO_GUIDE.md               # Evaluator script & viva presentation guide
├── README.md                   # Project documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Top navigation with demo badge & indicators
│   │   │   ├── Sidebar.jsx     # Collapsible sidebar with navigation items
│   │   │   ├── SkillCard.jsx   # Matched / Partial / Missing skill badges
│   │   │   ├── ProgressBar.jsx # Animated readiness & milestone meters
│   │   │   ├── RoadmapItem.jsx # Interactive milestone cards with checklist
│   │   │   ├── ScoreCard.jsx   # Radial / metric readiness score display
│   │   │   └── ChatBox.jsx     # Conversational AI assistant interface
│   │   ├── pages/
│   │   │   ├── Home.jsx        # SaaS landing page with features & hero
│   │   │   ├── Dashboard.jsx   # Candidate overview & summary metrics
│   │   │   ├── Resume.jsx      # PDF/DOCX drag-and-drop uploader & parser
│   │   │   ├── Analysis.jsx    # Skill gap comparison & readiness score
│   │   │   ├── Roadmap.jsx     # Chronological milestone learning path
│   │   │   ├── Chatbot.jsx     # Contextual AI assistant with quick prompts
│   │   │   ├── Login.jsx       # User authentication sign-in
│   │   │   └── Register.jsx    # User registration
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # JWT session management
│   │   │   └── DemoContext.jsx # Preloaded evaluation state & dynamic boost
│   │   ├── services/
│   │   │   └── api.js          # Centralized Axios API client
│   │   ├── App.jsx             # React Router routing configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point & CORS configuration
│   │   ├── database.py         # SQLAlchemy engine & session factory
│   │   ├── models.py           # ORM models (User, Resume, Job, Roadmap)
│   │   ├── core/
│   │   │   ├── config.py       # Pydantic Settings & environment variables
│   │   │   └── security.py     # Password hashing & JWT token generators
│   │   ├── schemas/            # Pydantic request/response validation
│   │   ├── routes/             # Modular API route controllers
│   │   └── services/           # Parsing, gap analysis, and roadmap engines
│   ├── test_main.py            # Health & root endpoint tests
│   ├── test_resume.py          # PDF/DOCX upload & parsing tests
│   ├── test_skills.py          # 120+ skill catalog & normalization tests
│   ├── test_job.py             # Job description parser tests
│   ├── test_skill_gap.py       # 72% readiness score & gap logic tests
│   ├── test_database.py        # SQLAlchemy relational persistence tests
│   ├── test_chatbot.py         # Gemini & rule fallback chat tests
│   ├── test_workflow_e2e.py    # Complete end-to-end integration tests
│   ├── requirements.txt
│   └── career_copilot.db       # SQLite local database
│
└── data/
    ├── demo_resume.pdf         # Sample evaluation resume (PyMuPDF verified)
    ├── demo_resume.docx        # Sample evaluation resume (python-docx verified)
    ├── demo_resume.txt         # Plaintext candidate profile (Alex Johnson)
    └── demo_job.txt            # Target job description (Backend Developer)
```

---

## 🔑 Environment Variables (`backend/.env`)

```env
PROJECT_NAME=AI Career Copilot
SECRET_KEY=your-jwt-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./career_copilot.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=                # Optional: Works 100% offline with built-in rule engine
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API Root status |
| `GET` | `/health` | Service health & diagnostics |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate & receive JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/resume/upload` | Upload & parse PDF/DOCX resume |
| `POST` | `/api/resume/demo` | Load structured demo candidate profile |
| `POST` | `/api/job/analyze` | Parse and extract job description skills |
| `POST` | `/api/job/demo` | Load structured demo job requirements |
| `POST` | `/api/analysis/skill-gap` | Compute readiness score and skill gap |
| `POST` | `/api/roadmap/generate` | Generate milestone learning roadmap |
| `PATCH` | `/api/roadmap/{id}/progress` | Toggle milestone completion & persist state |
| `POST` | `/api/chat` | Contextual AI Career Assistant (Gemini / Offline) |

---

## 🧪 Automated Testing

The backend includes a comprehensive 31-test suite with 100% pass rate:

```cmd
:: Run via test runner script:
run_tests.bat

:: Or directly inside backend/ directory:
venv\Scripts\python.exe -m unittest discover -s . -p "test_*.py" -v
```

**Test Coverage Summary:**
- `test_main.py`: Health checks, root routing, CORS headers.
- `test_resume.py`: PDF (`PyMuPDF`) & DOCX (`python-docx`) parsing, unsupported extension validation, demo resume retrieval.
- `test_skills.py`: 120+ skill extractor, 6 domain categories, synonym normalization.
- `test_job.py`: Raw job posting analysis, empty description validation, demo job retrieval.
- `test_skill_gap.py`: Deterministic 72% readiness score verification, matched/partial/missing categorization.
- `test_database.py`: Relational persistence, foreign keys, cascades, and status flags.
- `test_chatbot.py`: Contextual prompt generation, intent matching, and rule-based offline fallback.
- `test_workflow_e2e.py`: Complete user flow simulation from file upload to roadmap progression.

---

## 🎯 Evaluation Demo Mode Workflow
1. Navigate to [http://localhost:5173](http://localhost:5173).
2. Click the **Try Demo** button on the hero section or navbar.
3. Review candidate **Alex Johnson** against target **Backend Developer**.
4. Examine the computed **72% Career Readiness Score** and the 4 missing skills.
5. In **Roadmap**, toggle milestone checkboxes and observe dynamic readiness score progression.
6. In **AI Assistant**, submit sample prompts to verify context-aware guidance.

---

## 🚀 Future Scope (Post-MVP Roadmap)
- Real-time job board scraping & live ATS matching (LinkedIn, Indeed APIs).
- Vector embeddings with ChromaDB & LangChain RAG pipeline.
- AI-driven audio/video mock interview simulation.
- Multi-tenant enterprise career counseling portals.
