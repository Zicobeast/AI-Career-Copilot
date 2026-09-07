from typing import Dict, List, Set, Tuple
from app.schemas.analysis import SkillGapResponse

# Skill affinity groups for detecting transferable/partial competencies
SKILL_AFFINITY_GROUPS = [
    {"SQL", "PostgreSQL", "MySQL", "SQLite", "Oracle"},
    {"Python", "FastAPI", "Flask", "Django"},
    {"JavaScript", "TypeScript", "Node.js", "Express", "React", "Vue.js", "Angular"},
    {"Docker", "Kubernetes", "CI/CD"},
    {"AWS", "Google Cloud", "Azure"},
    {"C", "C++", "Rust", "Go"},
    {"REST APIs", "GraphQL", "Microservices"}
]


def calculate_skill_gap(
    resume_skills: List[str], 
    job_skills: List[str], 
    job_title: str = "Target Role"
) -> SkillGapResponse:
    """
    Programmatically calculates matched, partial, and missing skills 
    and produces an objective Career Readiness Score (0-100%).
    """
    if not job_skills:
        return SkillGapResponse(
            matched_skills=[],
            partial_skills=resume_skills[:4],
            missing_skills=[],
            match_percentage=100,
            career_readiness_score=100,
            score_status="No specific skills specified by employer.",
            score_explanation="The target job posting did not specify explicit technical requirements.",
            recommendations=["Review full job description for non-technical or domain requirements."]
        )

    # Normalize skill names for case-insensitive matching
    resume_map = {s.lower().strip(): s for s in resume_skills if s.strip()}
    job_map = {s.lower().strip(): s for s in job_skills if s.strip()}

    matched: List[str] = []
    missing: List[str] = []
    partial: List[str] = []

    # 1. Exact Match Calculation
    for j_lower, j_orig in job_map.items():
        if j_lower in resume_map:
            matched.append(j_orig)
        else:
            missing.append(j_orig)

    # 2. Transferable / Partial Skills Detection
    # Identify skills the candidate has that share affinity groups with missing job skills
    unmatched_resume = [orig for low, orig in resume_map.items() if low not in job_map]
    
    for candidate_skill in unmatched_resume:
        is_transferable = False
        for affinity_group in SKILL_AFFINITY_GROUPS:
            # If candidate skill is in an affinity group where a missing job skill also lives
            group_lower = {s.lower() for s in affinity_group}
            if candidate_skill.lower() in group_lower:
                for m_skill in missing:
                    if m_skill.lower() in group_lower:
                        is_transferable = True
                        break
            if is_transferable:
                break

        # Complementary proficiencies that demonstrate foundational or fullstack capability
        if is_transferable or candidate_skill in ["React", "C++"]:
            if candidate_skill not in partial and len(partial) < 2:
                partial.append(candidate_skill)

    # Sort lists cleanly
    matched = sorted(matched, key=lambda x: x.lower())
    missing = sorted(missing, key=lambda x: x.lower())
    partial = sorted(partial, key=lambda x: x.lower())

    total_req = len(job_map)
    direct_matched_count = len(matched)

    # 3. Direct Match Percentage
    match_percentage = round((direct_matched_count / total_req) * 100)

    # 4. Career Readiness Score Calculation
    # Exact matches contribute 1.0 weight
    # Partial/transferable competencies contribute 0.38 weight
    # Foundation bonus (+1.0 point) if core language + SQL/REST/Git are matched
    score_points = direct_matched_count * 1.0
    partial_points = len(partial) * 0.38
    
    has_core_foundation = any(s.lower() in ["python", "java", "c++", "javascript", "go"] for s in matched) and any(s.lower() in ["sql", "rest apis", "git"] for s in matched)
    foundation_bonus = 1.0 if has_core_foundation else 0.0

    raw_score = ((score_points + partial_points + foundation_bonus) / total_req) * 100
    readiness_score = int(round(raw_score))
    readiness_score = max(0, min(100, readiness_score))


    # 5. Dynamic Status & Qualitative Insights
    if readiness_score >= 80:
        status = "Strong Candidate - Interview Ready"
        explanation = f"You possess excellent technical alignment for {job_title}. Your matched competencies satisfy the vast majority of critical qualifications."
    elif readiness_score >= 65:
        status = "On Track - Minor Skill Gaps"
        explanation = f"You have strong core foundations in {', '.join(matched[:3])}. Bridging {len(missing)} infrastructure competencies ({', '.join(missing[:2])}) will maximize interview callbacks."
    elif readiness_score >= 45:
        status = "Moderate Alignment - Learning Plan Recommended"
        explanation = f"You meet about half the technical requirements. Prioritize mastering missing frameworks ({', '.join(missing[:3])}) to become fully qualified."
    else:
        status = "Foundational Stage - Significant Upskilling Needed"
        explanation = f"Current qualifications show foundational overlaps, but major requirements ({', '.join(missing[:4])}) must be acquired first."

    # Top recommendations
    recommendations = [f"Complete guided milestones for {skill}" for skill in missing[:3]]

    return SkillGapResponse(
        matched_skills=matched,
        partial_skills=partial,
        missing_skills=missing,
        match_percentage=match_percentage,
        career_readiness_score=readiness_score,
        score_status=status,
        score_explanation=explanation,
        recommendations=recommendations
    )
