import re
from typing import Dict, List, Set, Tuple

# Comprehensive Categorized Skill Taxonomy (120+ standard skills)
SKILL_TAXONOMY = {
    "Programming Languages": {
        "Python": [r"\bpython\b", r"\bpython3\b", r"\bpy\b"],
        "C++": [r"\bc\+\+\b", r"\bcpp\b"],
        "C": [r"\bc\b(?!\+\+|#)"],
        "C#": [r"\bc#\b", r"\bcsharp\b", r"\bc-sharp\b"],
        "Java": [r"\bjava\b(?!\s*script)"],
        "JavaScript": [r"\bjavascript\b", r"\bjs\b", r"\bes6\b", r"\becmascript\b"],
        "TypeScript": [r"\btypescript\b", r"\bts\b"],
        "Go": [r"\bgolang\b", r"\bgo\s+lang\b", r"\bgo\s+language\b"],
        "Rust": [r"\brust\b", r"\brustlang\b"],
        "Ruby": [r"\bruby\b"],
        "PHP": [r"\bphp\b"],
        "Swift": [r"\bswift\b"],
        "Kotlin": [r"\bkotlin\b"],
        "SQL": [r"\bsql\b"],
        "HTML": [r"\bhtml\b", r"\bhtml5\b"],
        "CSS": [r"\bcss\b", r"\bcss3\b"],
        "Bash": [r"\bbash\b", r"\bshell\s+scripting\b", r"\bzsh\b"],
        "R": [r"\br\s+programming\b", r"\br-lang\b"],
        "Scala": [r"\bscala\b"],
        "Dart": [r"\bdart\b"]
    },
    "Frameworks & Libraries": {
        "React": [r"\breact\b", r"\breact\.?js\b", r"\breactjs\b"],
        "Next.js": [r"\bnext\.?js\b", r"\bnextjs\b"],
        "Vue.js": [r"\bvue\b", r"\bvue\.?js\b", r"\bvuejs\b"],
        "Angular": [r"\bangular\b", r"\bangularjs\b"],
        "Node.js": [r"\bnode\b", r"\bnode\.?js\b", r"\bnodejs\b"],
        "Express": [r"\bexpress\b", r"\bexpress\.?js\b", r"\bexpressjs\b"],
        "FastAPI": [r"\bfastapi\b", r"\bfast-api\b"],
        "Flask": [r"\bflask\b"],
        "Django": [r"\bdjango\b"],
        "Spring Boot": [r"\bspring\s*boot\b", r"\bspring\s*framework\b"],
        "Tailwind CSS": [r"\btailwind\b", r"\btailwind\s*css\b"],
        "Bootstrap": [r"\bbootstrap\b"],
        "Redux": [r"\bredux\b", r"\bredux\s*toolkit\b"],
        "GraphQL": [r"\bgraphql\b"],
        "jQuery": [r"\bjquery\b"],
        "ASP.NET": [r"\basp\.net\b", r"\bdotnet\b", r"\b\.net\s*core\b"],
        "Laravel": [r"\blaravel\b"],
        "Ruby on Rails": [r"\brails\b", r"\bruby\s+on\s+rails\b"]
    },
    "Databases & Storage": {
        "PostgreSQL": [r"\bpostgres\b", r"\bpostgresql\b"],
        "MySQL": [r"\bmysql\b"],
        "SQLite": [r"\bsqlite\b", r"\bsqlite3\b"],
        "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
        "Redis": [r"\bredis\b"],
        "Cassandra": [r"\bcassandra\b"],
        "DynamoDB": [r"\bdynamodb\b"],
        "Firebase": [r"\bfirebase\b", r"\bfirestore\b"],
        "Elasticsearch": [r"\belasticsearch\b", r"\belk\s+stack\b"],
        "Oracle": [r"\boracle\s+db\b", r"\boracle\s+database\b"]
    },
    "Cloud & DevOps": {
        "Docker": [r"\bdocker\b", r"\bcontainerization\b", r"\bcontainers\b"],
        "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
        "AWS": [r"\baws\b", r"\bamazon\s+web\s+services\b", r"\bec2\b", r"\bs3\b", r"\blambda\b"],
        "Google Cloud": [r"\bgcp\b", r"\bgoogle\s+cloud\b", r"\bgoogle\s+cloud\s+platform\b"],
        "Azure": [r"\bazure\b", r"\bmicrosoft\s+azure\b"],
        "CI/CD": [r"\bci\s*/\s*cd\b", r"\bcontinuous\s+integration\b", r"\bgithub\s+actions\b", r"\bjenkins\b"],
        "Terraform": [r"\bterraform\b"],
        "Linux": [r"\blinux\b", r"\bunix\b", r"\bubuntu\b"]
    },
    "Tools & Architecture": {
        "Git": [r"\bgit\b(?!\s*hub|\s*lab)"],
        "GitHub": [r"\bgithub\b"],
        "GitLab": [r"\bgitlab\b"],
        "REST APIs": [r"\brest\s*apis?\b", r"\brestful\b", r"\brestful\s*apis?\b", r"\brest\s*service\b"],
        "Postman": [r"\bpostman\b"],
        "Microservices": [r"\bmicroservices?\b", r"\bmicro-services?\b"],
        "Kafka": [r"\bkafka\b", r"\bapache\s+kafka\b"],
        "RabbitMQ": [r"\brabbitmq\b"],
        "Unit Testing": [r"\bunit\s+testing\b", r"\bpytest\b", r"\bjest\b", r"\bunittest\b"],
        "Agile": [r"\bagile\b", r"\bscrum\b", r"\bjira\b"]
    },
    "Data Science & AI": {
        "Pandas": [r"\bpandas\b"],
        "NumPy": [r"\bnumpy\b"],
        "Scikit-learn": [r"\bscikit-learn\b", r"\bsklearn\b"],
        "TensorFlow": [r"\btensorflow\b"],
        "PyTorch": [r"\bpytorch\b"],
        "Machine Learning": [r"\bmachine\s+learning\b", r"\bml\b"],
        "Deep Learning": [r"\bdeep\s+learning\b"],
        "NLP": [r"\bnlp\b", r"\bnatural\s+language\s+processing\b"],
        "OpenCV": [r"\bopencv\b"],
        "Large Language Models": [r"\bllms?\b", r"\blarge\s+language\s+models?\b", r"\bgpt\b"]
    }
}


def get_skill_category(skill_name: str) -> str:
    """Find the corresponding category for any canonical skill name."""
    for category, skills in SKILL_TAXONOMY.items():
        if skill_name in skills:
            return category
    return "Other Technical"


def extract_skills_from_text(text: str) -> List[str]:
    """
    Extract canonical technical skills from freeform text.
    Returns a sorted list of unique skill names.
    """
    if not text:
        return []

    lower_text = text.lower()
    found: Set[str] = set()

    for category, skill_dict in SKILL_TAXONOMY.items():
        for skill_name, patterns in skill_dict.items():
            for pattern in patterns:
                if re.search(pattern, lower_text, re.IGNORECASE):
                    found.add(skill_name)
                    break

    return sorted(list(found), key=lambda s: s.lower())


def extract_categorized_skills(text: str) -> Dict[str, List[str]]:
    """
    Extract technical skills and group them by domain category.
    """
    if not text:
        return {cat: [] for cat in SKILL_TAXONOMY.keys()}

    lower_text = text.lower()
    categorized: Dict[str, List[str]] = {cat: [] for cat in SKILL_TAXONOMY.keys()}

    for category, skill_dict in SKILL_TAXONOMY.items():
        for skill_name, patterns in skill_dict.items():
            for pattern in patterns:
                if re.search(pattern, lower_text, re.IGNORECASE):
                    categorized[category].append(skill_name)
                    break
        categorized[category].sort(key=lambda s: s.lower())

    return categorized


def get_full_catalog() -> Dict[str, List[str]]:
    """Return all catalog skills indexed by category."""
    return {
        category: sorted(list(skills.keys()), key=lambda s: s.lower())
        for category, skills in SKILL_TAXONOMY.items()
    }
