import uuid
from typing import Dict, List, Optional
from app.schemas.roadmap import (
    RoadmapItemSchema,
    RoadmapGenerateResponse
)

# Detailed curriculum repository for technical skills
CURRICULUM_CATALOG = {
    "FastAPI": {
        "description": "Learn API routing, Pydantic schemas, dependency injection, and high-performance asynchronous Python backend fundamentals.",
        "difficulty": "Intermediate",
        "time_estimate": "1.5 Weeks",
        "prerequisites": ["Python", "REST APIs"]
    },
    "PostgreSQL": {
        "description": "Learn relational databases, SQL queries, indexes, schema migrations, and ACID transaction guarantees.",
        "difficulty": "Intermediate",
        "time_estimate": "2 Weeks",
        "prerequisites": ["SQL"]
    },
    "Docker": {
        "description": "Learn containers, write multi-stage Dockerfiles, configure volumes, and orchestrate services with Docker Compose.",
        "difficulty": "Intermediate",
        "time_estimate": "1 Week",
        "prerequisites": ["Linux CLI"]
    },
    "AWS": {
        "description": "Learn basic cloud deployment, manage virtual instances with Amazon EC2, S3 object storage, and secure IAM credentials.",
        "difficulty": "Advanced",
        "time_estimate": "2 Weeks",
        "prerequisites": ["Docker", "Networking"]
    },
    "Kubernetes": {
        "description": "Learn container orchestration, pods, deployments, services, ingress controllers, and config maps.",
        "difficulty": "Advanced",
        "time_estimate": "2.5 Weeks",
        "prerequisites": ["Docker"]
    },
    "CI/CD": {
        "description": "Build automated GitHub Actions pipelines to run tests, lint code, and continuously deploy releases.",
        "difficulty": "Intermediate",
        "time_estimate": "1 Week",
        "prerequisites": ["Git"]
    },
    "Redis": {
        "description": "Implement in-memory caching, pub/sub messaging, and session stores to optimize API response times.",
        "difficulty": "Intermediate",
        "time_estimate": "1 Week",
        "prerequisites": ["Databases"]
    },
    "MongoDB": {
        "description": "Model NoSQL document schemas, aggregation pipelines, and distributed replication.",
        "difficulty": "Intermediate",
        "time_estimate": "1.5 Weeks",
        "prerequisites": ["JSON"]
    },
    "TypeScript": {
        "description": "Master static typing, interfaces, generics, and strict compile-time checks in modern web applications.",
        "difficulty": "Intermediate",
        "time_estimate": "1.5 Weeks",
        "prerequisites": ["JavaScript"]
    },
    "React": {
        "description": "Master component lifecycles, functional hooks, state management, and modern component design.",
        "difficulty": "Intermediate",
        "time_estimate": "2 Weeks",
        "prerequisites": ["JavaScript", "HTML/CSS"]
    }
}

# Domain-based priority hierarchy for logical learning progression
DOMAIN_ORDER = [
    "Programming Languages",
    "Frameworks & Libraries",
    "Databases & Storage",
    "Cloud & DevOps",
    "Tools & Architecture"
]

# Active roadmap in-memory storage (keyed by roadmap_id or "roadmap_current")
ACTIVE_ROADMAPS: Dict[str, List[RoadmapItemSchema]] = {}


def generate_roadmap_items(missing_skills: List[str], job_title: str) -> List[RoadmapItemSchema]:
    """
    Generate sequential, ordered learning milestones based on missing skills.
    Ensures logical flow: Frameworks -> Databases -> DevOps -> Cloud -> Capstone.
    """
    # Priority sorting dictionary
    priority_map = {
        "FastAPI": 10,
        "Django": 11,
        "Flask": 12,
        "Express": 13,
        "Node.js": 14,
        "Spring Boot": 15,
        "SQL": 20,
        "PostgreSQL": 21,
        "MySQL": 22,
        "MongoDB": 23,
        "Redis": 24,
        "Docker": 30,
        "CI/CD": 31,
        "Kubernetes": 32,
        "AWS": 40,
        "Google Cloud": 41,
        "Azure": 42
    }

    # Sort missing skills logically
    sorted_skills = sorted(
        missing_skills,
        key=lambda s: priority_map.get(s, 50)
    )

    items: List[RoadmapItemSchema] = []
    item_id = 1

    for skill in sorted_skills:
        meta = CURRICULUM_CATALOG.get(skill, {
            "description": f"Master core syntax, architectural design patterns, and industry best practices for {skill}.",
            "difficulty": "Intermediate",
            "time_estimate": "1.5 Weeks",
            "prerequisites": []
        })

        number_str = f"{item_id:02d}"
        items.append(RoadmapItemSchema(
            id=item_id,
            number=number_str,
            skill=skill,
            description=meta["description"],
            difficulty=meta["difficulty"],
            time_estimate=meta["time_estimate"],
            completed=False,
            prerequisites=meta.get("prerequisites", [])
        ))
        item_id += 1

    # Add final Capstone Milestone
    capstone_title = f"Build & Deploy {job_title} Capstone"
    items.append(RoadmapItemSchema(
        id=item_id,
        number=f"{item_id:02d}",
        skill=capstone_title,
        description=f"Build and deploy an enterprise-grade REST API application integrating {', '.join(sorted_skills[:3]) if sorted_skills else 'core stack'} with comprehensive testing and cloud hosting.",
        difficulty="Advanced",
        time_estimate="2.5 Weeks",
        completed=False,
        prerequisites=sorted_skills[:2] if sorted_skills else []
    ))

    return items


def create_roadmap(
    missing_skills: List[str],
    job_title: str = "Backend Developer",
    target_company: str = "CloudScale Systems"
) -> RoadmapGenerateResponse:
    """Create and persist a roadmap for the current session."""
    items = generate_roadmap_items(missing_skills, job_title)
    roadmap_id = "roadmap_current"
    ACTIVE_ROADMAPS[roadmap_id] = items

    completed_count = sum(1 for item in items if item.completed)
    total_count = len(items)
    percentage = round((completed_count / total_count) * 100) if total_count > 0 else 0

    return RoadmapGenerateResponse(
        roadmap_id=roadmap_id,
        job_title=job_title,
        total_items=total_count,
        completed_items=completed_count,
        progress_percentage=percentage,
        items=items
    )


def update_roadmap_item_progress(item_id: int, completed: bool, roadmap_id: str = "roadmap_current") -> Optional[RoadmapItemSchema]:
    """Toggle or update completion state of an individual roadmap milestone."""
    if roadmap_id not in ACTIVE_ROADMAPS or not ACTIVE_ROADMAPS[roadmap_id]:
        # Initialize default evaluation roadmap if empty
        get_demo_roadmap_data()

    items = ACTIVE_ROADMAPS[roadmap_id]
    for item in items:
        if item.id == item_id:
            item.completed = completed
            return item
    return None


def get_demo_roadmap_data() -> RoadmapGenerateResponse:
    """Returns evaluation demo roadmap with FastAPI and PostgreSQL already marked completed."""
    demo_items = [
        RoadmapItemSchema(
            id=1,
            number="01",
            skill="FastAPI",
            description="Learn API routing, Pydantic data schemas, and backend fundamentals.",
            difficulty="Intermediate",
            time_estimate="1.5 Weeks",
            completed=True,
            prerequisites=["Python", "REST APIs"]
        ),
        RoadmapItemSchema(
            id=2,
            number="02",
            skill="PostgreSQL",
            description="Learn relational databases, schema design, and SQL queries.",
            difficulty="Intermediate",
            time_estimate="2 Weeks",
            completed=True,
            prerequisites=["SQL"]
        ),
        RoadmapItemSchema(
            id=3,
            number="03",
            skill="Docker",
            description="Learn containers, multi-stage Dockerfiles, and deployment basics.",
            difficulty="Intermediate",
            time_estimate="1 Week",
            completed=False,
            prerequisites=["Linux"]
        ),
        RoadmapItemSchema(
            id=4,
            number="04",
            skill="AWS",
            description="Learn basic cloud deployment, Amazon EC2, S3 storage, and IAM security.",
            difficulty="Advanced",
            time_estimate="2 Weeks",
            completed=False,
            prerequisites=["Docker"]
        ),
        RoadmapItemSchema(
            id=5,
            number="05",
            skill="Build Backend Project",
            description="Build and deploy a production-style REST API integrating FastAPI, PostgreSQL, and Docker.",
            difficulty="Advanced",
            time_estimate="2.5 Weeks",
            completed=False,
            prerequisites=["FastAPI", "PostgreSQL"]
        )
    ]

    roadmap_id = "roadmap_current"
    ACTIVE_ROADMAPS[roadmap_id] = demo_items

    completed_count = sum(1 for item in demo_items if item.completed)
    total_count = len(demo_items)
    percentage = round((completed_count / total_count) * 100)

    return RoadmapGenerateResponse(
        roadmap_id=roadmap_id,
        job_title="Junior Backend Developer",
        total_items=total_count,
        completed_items=completed_count,
        progress_percentage=percentage,
        items=demo_items
    )
