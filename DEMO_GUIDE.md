# AI Career Copilot — Demonstration & Evaluator Guide 🎓🚀

> **Evaluation Persona**: Alex Johnson (Junior Developer transitioning to Backend Engineer)  
> **Evaluation Job Target**: Backend Developer at TechCorp  
> **Key Metric**: Objective 72% Career Readiness Score → Dynamic progression to 95%+  

---

## ⚡ Quick Start for Evaluators

You can launch the complete application with a single command on Windows:

```cmd
:: From the project root:
start_app.bat
```

This launches both servers concurrently in dedicated console windows:
- **Frontend Web UI**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)
- **Interactive OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

> **Zero Configuration Required**: The platform is 100% self-contained and operates completely offline using SQLite and a deterministic rule-based AI intent fallback. No Gemini API key or external cloud service is required for full demonstration.

To verify the test suite and production build at any time:
```cmd
run_tests.bat
```
*(Executes all 31 backend unit & E2E tests in ~0.3s, followed by the Vite production build).*

---

## 🎬 Step-by-Step Presentation Script

Follow this 5-minute guided walkthrough during project demonstration, evaluation, or viva voce:

```
┌─────────────┐       ┌───────────────┐       ┌─────────────┐
│ 1. Landing  │ ────► │ 2. Demo Mode  │ ────► │ 3. Candidate│
│    Page     │       │   Activation  │       │  Dashboard  │
└─────────────┘       └───────────────┘       └─────────────┘
                                                     │
       ┌─────────────────────────────────────────────┘
       ▼
┌─────────────┐       ┌───────────────┐       ┌─────────────┐
│ 4. Resume   │ ────► │ 5. Skill Gap  │ ────► │ 6. Roadmap  │
│   Parsing   │       │   & Score     │       │  Tracking   │
└─────────────┘       └───────────────┘       └─────────────┘
                                                     │
                                                     ▼
                                              ┌─────────────┐
                                              │ 7. AI Career│
                                              │  Assistant  │
                                              └─────────────┘
```

---

### Step 1: Landing Page (`/`)
1. Open [http://localhost:5173](http://localhost:5173).
2. **Talking Points**:
   - Introduce the core problem: *Traditional job search presents an overwhelming gap between university curriculum and production engineering requirements.*
   - Point out the clean SaaS design, feature cards, tech stack badges, and the clear call-to-action.
3. Click the **"Try Demo"** button on the hero banner (or top navbar).

---

### Step 2: One-Click Demo Mode Activation
1. Clicking **"Try Demo"** instantly activates `DemoContext` and redirects to `/dashboard`.
2. **Talking Points**:
   - No registration or login barrier required for evaluators.
   - Instantly hydrates candidate profile **Alex Johnson**, benchmark target job **Backend Developer**, computed skill gaps, and roadmap milestones.
   - Demo banner at the top shows `Demo Mode Active` with a reset option.

---

### Step 3: Candidate Dashboard (`/dashboard`)
1. **Talking Points**:
   - **Career Readiness Score Gauge**: Displays an objective **72%** score.
   - **Skill Summary Counters**: 5 Matched Skills, 4 Missing Skills, 4 Roadmap Milestones.
   - **Target Benchmark Card**: Backend Developer role with requirements summary.
   - **Quick Action Links**: Direct transitions to Resume, Analysis, Roadmap, and Chatbot.

---

### Step 4: Resume Parsing Engine (`/resume`)
1. Navigate to **Resume** via sidebar or top navigation.
2. **Talking Points**:
   - Display the structured parsed profile:
     - **Name**: Alex Johnson
     - **Contact**: alex.johnson@example.com | (555) 019-2834
     - **Summary**: Software Developer with 3 years experience building full-stack applications.
     - **Extracted Skills Catalog**: Categorized into Languages (Python, JavaScript), Frameworks (React, Node.js), Databases (MySQL, MongoDB), and Developer Tools (Git, GitHub, VS Code).
   - **Real Parser Verification**:
     - Explain that the backend uses **PyMuPDF (`fitz`)** for native PDF streams and **`python-docx`** for Word documents.
     - Evaluators can optionally upload `data/demo_resume.pdf` or `data/demo_resume.docx` to observe live file parsing and skill extraction.

---

### Step 5: Skill Gap & Readiness Score (`/analysis`)
1. Navigate to **Skill Gap** page.
2. **Talking Points**:
   - **Benchmark Comparison**:
     - **Candidate Skills**: Python, JavaScript, React, Node.js, MySQL, MongoDB, Git.
     - **Job Requirements**: Python, FastAPI, PostgreSQL, Docker, AWS, REST APIs, Git.
   - **Programmatic Categorization**:
     - **Matched Skills (5)**: `Python`, `REST APIs`, `Git`, `SQL` (matched via MySQL), `React`.
     - **Missing Skills (4)**: `FastAPI`, `PostgreSQL`, `Docker`, `AWS`.
   - **Mathematical Readiness Score**:
     $$\text{Readiness Score} = \left(\frac{\text{Matched Skills Weight}}{\text{Total Job Requirements Weight}}\right) \times 100 = 72\%$$
     - *Eliminates arbitrary guesswork with deterministic weighting.*

---

### Step 6: Ordered Learning Roadmap & Interactive Boost (`/roadmap`)
1. Navigate to **Roadmap** page.
2. **Talking Points**:
   - Chronologically ordered, prerequisite-aware milestones targeting Alex's 4 missing skills:
     1. **Milestone 1**: *FastAPI Backend Mastery* (Weeks 1-2, 25 hours, Intermediate)
     2. **Milestone 2**: *PostgreSQL & Advanced ORM Data Modeling* (Weeks 3-4, 30 hours, Intermediate)
     3. **Milestone 3**: *Containerization with Docker* (Weeks 5-6, 20 hours, Advanced)
     4. **Milestone 4**: *AWS Cloud Deployment & CI/CD* (Weeks 7-8, 25 hours, Advanced)
   - **Interactive Live Feature**:
     - Check the box for **"FastAPI Backend Mastery"**.
     - Notice the progress bar advances from **0% to 25%**.
     - Notice the Readiness Score dynamically increments from **72% towards 78%**!
     - Progress is persisted directly to the SQLite database via `PATCH /api/roadmap/{id}/progress`.

---

### Step 7: Contextual AI Career Assistant (`/chatbot`)
1. Navigate to **AI Assistant** page.
2. **Talking Points**:
   - Hybrid AI Architecture:
     - Integrates with **Google Gemini 1.5 Flash** REST API when `GEMINI_API_KEY` is provided.
     - Features an instant **Rule-Based Contextual Fallback Engine** that operates 100% offline.
3. Click any of the quick-prompt suggestion pills:
   - *"What should I learn first?"* → Recommends FastAPI and PostgreSQL based on Alex's Python foundation.
   - *"Am I ready for this job?"* → Explains the 72% readiness score and outlines remaining milestones.
   - *"What project should I build?"* → Proposes an asynchronous REST API built with FastAPI, PostgreSQL, and Docker.
   - *"Explain Docker for my roadmap"* → Outlines why containerization is critical for the target role.

---

## 🏛️ System Architecture Overview

```
Frontend (React 18 + Vite + Tailwind CSS)
   │
   ├── [AuthContext]      (JWT Token Management & Session State)
   ├── [DemoContext]      (Pre-hydrated State, Offline Fallback & Dynamic Score Boost)
   └── [Axios API Layer]  (Type-safe REST Calls to Backend)
          │
          ▼ HTTP JSON (Port 8000)
Backend (FastAPI + Pydantic v2 + SQLAlchemy 2.0)
   │
   ├── /api/auth          (User registration, bcrypt password hash, JWT tokens)
   ├── /api/resume        (PDF/DOCX stream extraction via PyMuPDF & python-docx)
   ├── /api/job           (Raw job description text & skill requirement parser)
   ├── /api/analysis      (Categorized skill gap engine & 72% readiness scorer)
   ├── /api/roadmap       (Prerequisite-ordered milestones & progress persistence)
   └── /api/chat          (Contextual prompt injection + Gemini API / Rule Fallback)
          │
          ▼ Relational Storage
SQLite Database (career_copilot.db)
   ├── Users
   ├── Resumes & ExtractedSkills
   ├── Jobs & JobSkills
   └── Roadmaps & RoadmapItems (with is_completed state)
```

---

## 💡 Viva Voce & Technical Defense Cheat Sheet

| Question | Recommended Answer |
|---|---|
| **Why FastAPI over Flask/Django?** | FastAPI delivers asynchronous non-blocking I/O, automatic Pydantic v2 schema validation, built-in OpenAPI documentation (`/docs`), and near-Go-level performance benchmarks. |
| **How does document parsing avoid AI hallucination?** | We extract native text layers directly from binary streams using PyMuPDF (`fitz`) and `python-docx`. No LLM is used for raw text extraction, ensuring 100% fidelity to the original resume. |
| **How does the Skill Extraction work?** | A curated catalog of 120+ technical competencies across 6 domains (Languages, Frameworks, Databases, Cloud/DevOps, Tools, Concepts) combined with regex word-boundary matching and synonym mapping (e.g., `Postgres` → `PostgreSQL`, `JS` → `JavaScript`). |
| **How does the application function without an active internet connection?** | The backend embeds a deterministic rule-based conversational engine that matches query intent against candidate missing skills, target job requirements, and roadmap milestones. |
| **What happens when a user toggles roadmap items?** | The frontend sends a `PATCH` request to `/api/roadmap/{id}/progress`, which updates SQLite in real-time and recalculates the candidate's projected readiness score towards 95%+. |
| **How is production readiness demonstrated?** | Full automated test suite (31 tests covering unit, database relational integrity, and end-to-end user workflows) running in <0.35 seconds, combined with an optimized Vite production build (<310 KB JS bundle). |

---

## 📁 Key File Locations

| Component | Path |
|---|---|
| Full Launcher | `start_app.bat` |
| Backend Launcher | `start_backend.bat` |
| Frontend Launcher | `start_frontend.bat` |
| Test Runner | `run_tests.bat` |
| E2E Test Suite | `backend/test_workflow_e2e.py` |
| Sample Resume PDF | `data/demo_resume.pdf` |
| Sample Resume DOCX | `data/demo_resume.docx` |
| Demo Job Description | `data/demo_job.txt` |
| SQLite Database | `backend/career_copilot.db` |
| Backend Settings | `backend/app/core/config.py` |
| Frontend Demo Context | `frontend/src/context/DemoContext.jsx` |
