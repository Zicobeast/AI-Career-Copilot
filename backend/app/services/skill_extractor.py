import re
from typing import List, Set

# Controlled dictionary of technical skills and synonyms for accurate extraction
TECHNICAL_SKILLS_CATALOG = {
    # Programming Languages
    "Python": [r"\bpython\b", r"\bpython3\b"],
    "C++": [r"\bc\+\+\b", r"\bcpp\b"],
    "C": [r"\bc\b(?!\+\+|#)"],
    "C#": [r"\bc#\b", r"\bcsharp\b"],
    "Java": [r"\bjava\b(?!\s*script)"],
    "JavaScript": [r"\bjavascript\b", r"\bjs\b", r"\bes6\b", r"\becmascript\b"],
    "TypeScript": [r"\btypescript\b", r"\bts\b"],
    "Go": [r"\bgolang\b", r"\bgo\s+language\b"],
    "Rust": [r"\brust\b"],
    "Ruby": [r"\bruby\b"],
    "PHP": [r"\bphp\b"],
    "Swift": [r"\bswift\b"],
    "Kotlin": [r"\bkotlin\b"],
    "SQL": [r"\bsql\b"],
    "HTML": [r"\bhtml\b", r"\bhtml5\b"],
    "CSS": [r"\bcss\b", r"\bcss3\b"],
    "Bash": [r"\bbash\b", r"\bshell\s+scripting\b"],

    # Frameworks & Libraries
    "React": [r"\breact\b", r"\breact\.?js\b"],
    "Next.js": [r"\bnext\.?js\b", r"\bnextjs\b"],
    "Vue.js": [r"\bvue\b", r"\bvue\.?js\b"],
    "Angular": [r"\bangular\b", r"\bangularjs\b"],
    "Node.js": [r"\bnode\b", r"\bnode\.?js\b", r"\bnodejs\b"],
    "Express": [r"\bexpress\b", r"\bexpress\.?js\b"],
    "FastAPI": [r"\bfastapi\b"],
    "Flask": [r"\bflask\b"],
    "Django": [r"\bdjango\b"],
    "Spring Boot": [r"\bspring\s*boot\b", r"\bspring\s*framework\b"],
    "Tailwind CSS": [r"\btailwind\b", r"\btailwind\s*css\b"],
    "Bootstrap": [r"\bbootstrap\b"],
    "Redux": [r"\bredux\b"],
    "GraphQL": [r"\bgraphql\b"],
    "REST APIs": [r"\brest\s*apis?\b", r"\brestful\b", r"\brestful\s*apis?\b"],

    # Databases & Storage
    "PostgreSQL": [r"\bpostgres\b", r"\bpostgresql\b"],
    "MySQL": [r"\bmysql\b"],
    "SQLite": [r"\bsqlite\b", r"\bsqlite3\b"],
    "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
    "Redis": [r"\bredis\b"],
    "Cassandra": [r"\bcassandra\b"],
    "Firebase": [r"\bfirebase\b", r"\bfirestore\b"],

    # DevOps, Cloud & Tools
    "Docker": [r"\bdocker\b", r"\bcontainerization\b"],
    "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
    "AWS": [r"\baws\b", r"\bamazon\s+web\s+services\b", r"\bec2\b", r"\bs3\b"],
    "Google Cloud": [r"\bgcp\b", r"\bgoogle\s+cloud\b"],
    "Azure": [r"\bazure\b", r"\bmicrosoft\s+azure\b"],
    "Git": [r"\bgit\b(?!\s*hub|\s*lab)"],
    "GitHub": [r"\bgithub\b"],
    "GitLab": [r"\bgitlab\b"],
    "CI/CD": [r"\bci\s*/\s*cd\b", r"\bcontinuous\s+integration\b"],
    "Linux": [r"\blinux\b", r"\bunix\b"],
    "Postman": [r"\bpostman\b"],
    "Kafka": [r"\bkafka\b"],
    "RabbitMQ": [r"\brabbitmq\b"],

    # Architecture & Concepts
    "Microservices": [r"\bmicroservices?\b"],
    "Agile": [r"\bagile\b", r"\bscrum\b"],
    "Unit Testing": [r"\bunit\s+testing\b", r"\bpytest\b", r"\bjest\b"],

    # Data & Machine Learning
    "Pandas": [r"\bpandas\b"],
    "NumPy": [r"\bnumpy\b"],
    "Scikit-learn": [r"\bscikit-learn\b", r"\bsklearn\b"],
    "TensorFlow": [r"\btensorflow\b"],
    "PyTorch": [r"\bpytorch\b"],
    "Machine Learning": [r"\bmachine\s+learning\b", r"\bml\b"]
}


def extract_skills_from_text(text: str) -> List[str]:
    """
    Extract technical skills from freeform text using dictionary pattern matching.
    Returns a sorted list of unique standardized skill names.
    """
    if not text:
        return []

    lower_text = text.lower()
    found_skills: Set[str] = set()

    for skill_name, patterns in TECHNICAL_SKILLS_CATALOG.items():
        for pattern in patterns:
            if re.search(pattern, lower_text, re.IGNORECASE):
                found_skills.add(skill_name)
                break

    # Natural sorting
    return sorted(list(found_skills), key=lambda s: s.lower())
