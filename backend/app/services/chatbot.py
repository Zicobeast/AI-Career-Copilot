import json
import logging
from datetime import datetime, timezone
from typing import List, Optional, Tuple
import urllib.request
import urllib.error

from app.core.config import settings
from app.schemas.chat import ChatContext, ChatMessage, ChatResponse

logger = logging.getLogger(__name__)


def generate_rule_based_reply(message: str, context: Optional[ChatContext]) -> Tuple[str, List[str]]:
    msg_lower = message.lower().strip()
    
    name = context.candidate_name if context and context.candidate_name else "Candidate"
    target_job = context.target_job_title if context and context.target_job_title else "Junior Backend Developer"
    matched = context.matched_skills if context and context.matched_skills else ["Python", "Git", "REST APIs", "SQL"]
    missing = context.missing_skills if context and context.missing_skills else ["FastAPI", "Docker", "PostgreSQL", "Redis"]
    score = context.readiness_score if context and context.readiness_score is not None else 72
    progress = context.roadmap_progress if context and context.roadmap_progress is not None else 40
    next_skill = context.next_recommended_skill if context and context.next_recommended_skill else (missing[0] if missing else "FastAPI")

    matched_str = ", ".join(matched) if matched else "your current technical stack"
    missing_str = ", ".join(missing) if missing else "upcoming domain skills"
    primary_missing = missing[0] if missing else "FastAPI"
    secondary_missing = missing[1] if len(missing) > 1 else "Docker"

    if any(k in msg_lower for k in ["learn first", "priority", "start with", "next step", "what should i learn"]):
        reply = (
            f"Based on your target role of **{target_job}** and your current readiness score of **{score}%**, "
            f"you should prioritize **{primary_missing}** first.\n\n"
            f"**Why {primary_missing}?**\n"
            f"- It directly complements your existing foundation in {matched[0] if matched else 'core languages'}.\n"
            f"- It bridges the most critical gap highlighted in job descriptions for {target_job}.\n"
            f"- Once completed, your readiness score is projected to climb from **{score}%** towards **85%**.\n\n"
            f"After {primary_missing}, proceed to **{secondary_missing}** to build containerization and deployment confidence."
        )
        followups = [
            f"How do I practice {primary_missing}?",
            "What project should I build?",
            "Am I ready for interviews right now?"
        ]
        return reply, followups

    if any(k in msg_lower for k in ["am i ready", "ready for this job", "chances", "qualify", "score"]):
        reply = (
            f"You are currently **{score}% career ready** for the **{target_job}** role!\n\n"
            f"**Your Strengths:** You already match key employer requirements: **{matched_str}**.\n"
            f"**Key Growth Areas:** Closing gaps in **{missing_str}** will make your candidacy stand out against other applicants.\n\n"
            f"You currently have strong foundational competencies. Completing the top 2 milestones in your roadmap will transition you from viable candidate to high-confidence hire."
        )
        followups = [
            "What should I learn first?",
            "How can I improve my resume?",
            "What projects impress recruiters?"
        ]
        return reply, followups

    if "docker" in msg_lower or "container" in msg_lower:
        reply = (
            f"**Why Docker is essential for {target_job}:**\n\n"
            f"1. **Environment Parity**: Modern engineering teams require services that run identically on local machines, staging, and cloud production environments.\n"
            f"2. **Microservice Readiness**: Employers value developers who package applications with clear `Dockerfile` and `docker-compose.yml` configurations.\n"
            f"3. **Practical Next Step**: Create a multi-container setup containing your backend API and a PostgreSQL database. That demonstrates immediate production readiness!"
        )
        followups = [
            "What project should I build with Docker?",
            "How do I explain Docker on my resume?",
            "What should I learn next?"
        ]
        return reply, followups

    if any(k in msg_lower for k in ["project", "portfolio", "build", "practice", "github"]):
        reply = (
            f"To demonstrate mastery for **{target_job}**, build a **Production-Grade REST API service** integrating both your strengths and missing skills:\n\n"
            f"**Recommended Project: Scalable Task Management & Analytics Service**\n"
            f"- **Stack**: {primary_missing} + {secondary_missing} + PostgreSQL\n"
            f"- **Core Features**: JWT authentication, CRUD operations, database migrations, and rate-limiting.\n"
            f"- **DevOps**: Write a clean `Dockerfile` and a `docker-compose.yml` file, plus GitHub Actions CI pipeline.\n"
            f"- **Resume Impact**: Demonstrates end-to-end engineering rigor, not just syntax tutorials."
        )
        followups = [
            "How do I present this project on my resume?",
            "What interview questions will they ask about it?",
            "What should I learn first?"
        ]
        return reply, followups

    if any(k in msg_lower for k in ["resume", "cv", "ats", "bullet point", "improve"]):
        reply = (
            f"Here are 3 high-impact ways to optimize your resume for **{target_job}**:\n\n"
            f"1. **Quantify Achievements**: Use Google's XYZ formula: *'Accomplished [X] as measured by [Y], by doing [Z]'* (e.g., *'Optimized SQL query performance by 35% through indexing and caching'*).\n"
            f"2. **Feature High-Demand Keywords**: Prominently display your matched skills (**{matched_str}**) in your Technical Skills section.\n"
            f"3. **Add In-Progress Learning**: Include a 'Currently Exploring / In Progress' bullet highlighting **{primary_missing}** and **{secondary_missing}** to signal active growth to recruiters."
        )
        followups = [
            "Am I ready for this job?",
            "What project should I build?",
            "What should I learn first?"
        ]
        return reply, followups

    if any(k in msg_lower for k in ["interview", "prep", "question", "technical interview"]):
        reply = (
            f"For **{target_job}** technical interviews, anticipate questions across three core pillars:\n\n"
            f"1. **Core Language & APIs**: Explain REST principles, status codes (201, 400, 401, 403, 404, 500), and async execution in Python.\n"
            f"2. **Database & Optimization**: SQL joins, indexing strategies, ACID properties, and N+1 query troubleshooting.\n"
            f"3. **System Architecture**: How containerization with Docker solves deployment issues and how Redis handles caching."
        )
        followups = [
            "What should I learn first?",
            "What project should I build?",
            "Am I ready for this job?"
        ]
        return reply, followups

    if any(k in msg_lower for k in ["hi", "hello", "hey", "help", "who are you"]):
        reply = (
            f"Hello {name}! I am your **AI Career Copilot**.\n\n"
            f"I have reviewed your resume against the target role **{target_job}**. "
            f"You currently have an impressive readiness score of **{score}%** with **{len(matched)} matched core skills** and **{len(missing)} roadmap gaps**.\n\n"
            f"Ask me anything about prioritizing your learning roadmap, project ideas, resume optimization, or interview preparation!"
        )
        followups = [
            "What should I learn first?",
            "Am I ready for this job?",
            "What project should I build?"
        ]
        return reply, followups

    reply = (
        f"Regarding your preparation for **{target_job}**: "
        f"your profile reflects solid foundations in **{matched_str}** with an overall readiness score of **{score}%**.\n\n"
        f"To maximize your hiring trajectory, focus your immediate efforts on mastering **{primary_missing}** and **{secondary_missing}**. "
        f"Consistent hands-on project building will bridge this gap faster than passive tutorials."
    )
    followups = [
        "What should I learn first?",
        "What project should I build?",
        "Am I ready for this job?"
    ]
    return reply, followups


def call_gemini_api(message: str, history: List[ChatMessage], context: Optional[ChatContext]) -> Optional[str]:
    api_key = settings.GEMINI_API_KEY.strip() if settings.GEMINI_API_KEY else ""
    if not api_key:
        return None

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        context_prompt = (
            f"You are AI Career Copilot, an empathetic, expert career advisor and technical mentor. "
            f"Candidate: {context.candidate_name if context else 'Candidate'}\n"
            f"Target Role: {context.target_job_title if context else 'Junior Backend Developer'}\n"
            f"Readiness Score: {context.readiness_score if context else 72}%\n"
            f"Matched Skills: {', '.join(context.matched_skills) if context and context.matched_skills else 'Python, Git, SQL, REST APIs'}\n"
            f"Missing Skills: {', '.join(context.missing_skills) if context and context.missing_skills else 'FastAPI, Docker, PostgreSQL, Redis'}\n"
            f"Provide concise, actionable, and encouraging career advice."
        )

        contents = []
        for h in history[-4:]:
            contents.append({
                "role": "user" if h.role == "user" else "model",
                "parts": [{"text": h.content}]
            })
        
        contents.append({
            "role": "user",
            "parts": [{"text": f"Context: {context_prompt}\n\nQuestion: {message}"}]
        })

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 600,
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts and "text" in parts[0]:
                    return parts[0]["text"].strip()

    except Exception as e:
        logger.warning(f"Gemini API request failed or timed out: {e}. Falling back to rule-based engine.")

    return None


def get_chat_response(message: str, history: List[ChatMessage], context: Optional[ChatContext]) -> ChatResponse:
    gemini_reply = call_gemini_api(message, history, context)
    
    if gemini_reply:
        followups = [
            "What should I learn next?",
            "What project should I build?",
            "How do I prepare for interviews?"
        ]
        return ChatResponse(
            reply=gemini_reply,
            source="gemini_api",
            timestamp=datetime.now(timezone.utc).isoformat(),
            suggested_followups=followups
        )

    reply, followups = generate_rule_based_reply(message, context)
    return ChatResponse(
        reply=reply,
        source="rule_based_engine",
        timestamp=datetime.now(timezone.utc).isoformat(),
        suggested_followups=followups
    )
