import json
import unittest
from app.database import SessionLocal, engine, Base
from app.models import (
    ResumeModel,
    JobDescriptionModel,
    SkillAnalysisModel,
    RoadmapModel,
    RoadmapItemModel
)


class TestDatabasePersistence(unittest.TestCase):
    def setUp(self):
        # Ensure all tables exist
        Base.metadata.create_all(bind=engine)
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_resume_persistence(self):
        resume = ResumeModel(
            candidate_name="Alex Johnson",
            email="alex@example.com",
            phone="+1 555-1234",
            filename="alex_resume.pdf",
            file_size_kb=128.4,
            skills_json=json.dumps(["Python", "SQL", "Git", "React"]),
            education_json=json.dumps(["B.Tech Computer Science"]),
            experience_json=json.dumps(["Intern at TechNova"]),
            projects_json=json.dumps(["Student Portal"]),
            is_demo=True
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)

        self.assertIsNotNone(resume.id)
        fetched = self.db.query(ResumeModel).filter_by(id=resume.id).first()
        self.assertEqual(fetched.candidate_name, "Alex Johnson")
        self.assertIn("Python", fetched.skills)

    def test_job_persistence(self):
        job = JobDescriptionModel(
            job_title="Junior Backend Developer",
            company="CloudScale Systems",
            description="Looking for Python and FastAPI developers.",
            required_skills_json=json.dumps(["Python", "FastAPI", "SQL", "Docker"]),
            total_skills=4,
            is_demo=True
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        self.assertIsNotNone(job.id)
        fetched = self.db.query(JobDescriptionModel).filter_by(id=job.id).first()
        self.assertEqual(fetched.company, "CloudScale Systems")
        self.assertIn("FastAPI", fetched.required_skills)

    def test_analysis_persistence(self):
        analysis = SkillAnalysisModel(
            job_title="Junior Backend Developer",
            matched_skills_json=json.dumps(["Python", "SQL", "Git"]),
            missing_skills_json=json.dumps(["FastAPI", "Docker", "AWS"]),
            career_readiness_score=72,
            score_status="On Track - Minor Skill Gaps"
        )
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)

        self.assertIsNotNone(analysis.id)
        fetched = self.db.query(SkillAnalysisModel).filter_by(id=analysis.id).first()
        self.assertEqual(fetched.career_readiness_score, 72)

    def test_roadmap_relational_persistence(self):
        roadmap = RoadmapModel(
            job_title="Junior Backend Developer",
            total_items=2,
            completed_items=1,
            progress_percentage=50
        )
        self.db.add(roadmap)
        self.db.commit()
        self.db.refresh(roadmap)

        item1 = RoadmapItemModel(
            roadmap_id=roadmap.id,
            number="01",
            skill="FastAPI",
            description="Learn API routing and Pydantic",
            difficulty="Intermediate",
            time_estimate="1.5 Weeks",
            completed=True
        )
        item2 = RoadmapItemModel(
            roadmap_id=roadmap.id,
            number="02",
            skill="Docker",
            description="Containerize microservices",
            difficulty="Intermediate",
            time_estimate="1 Week",
            completed=False
        )
        self.db.add_all([item1, item2])
        self.db.commit()

        # Query relation
        fetched = self.db.query(RoadmapModel).filter_by(id=roadmap.id).first()
        self.assertEqual(len(fetched.items), 2)
        self.assertEqual(fetched.items[0].skill, "FastAPI")
        self.assertTrue(fetched.items[0].completed)


if __name__ == "__main__":
    unittest.main()
