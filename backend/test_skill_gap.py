import unittest
from starlette.testclient import TestClient
from app.main import app


class TestSkillGapEngine(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_evaluation_scenario_skill_gap(self):
        payload = {
            "resume_skills": ["Python", "C++", "SQL", "Git", "React", "REST APIs", "HTML", "CSS"],
            "job_skills": ["Python", "FastAPI", "REST APIs", "SQL", "PostgreSQL", "Git", "Docker", "AWS"],
            "job_title": "Junior Backend Developer"
        }
        response = self.client.post("/api/analysis/skill-gap", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Verify matched skills
        self.assertEqual(data["matched_skills"], ["Git", "Python", "REST APIs", "SQL"])
        
        # Verify missing skills
        self.assertEqual(data["missing_skills"], ["AWS", "Docker", "FastAPI", "PostgreSQL"])
        
        # Verify partial skills (e.g. C++, React, etc.)
        self.assertIn("React", data["partial_skills"])
        self.assertIn("C++", data["partial_skills"])

        # Verify direct match percentage is 50% (4 of 8)
        self.assertEqual(data["match_percentage"], 50)

        # Verify career readiness score is 72%
        self.assertEqual(data["career_readiness_score"], 72)
        self.assertIn("On Track", data["score_status"])
        self.assertGreater(len(data["recommendations"]), 0)

    def test_demo_analysis_endpoint(self):
        response = self.client.get("/api/analysis/demo")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["career_readiness_score"], 72)
        self.assertIn("Python", data["matched_skills"])
        self.assertIn("FastAPI", data["missing_skills"])

    def test_perfect_match(self):
        payload = {
            "resume_skills": ["Python", "Docker", "AWS"],
            "job_skills": ["Python", "Docker", "AWS"]
        }
        response = self.client.post("/api/analysis/skill-gap", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["match_percentage"], 100)
        self.assertEqual(data["career_readiness_score"], 100)
        self.assertEqual(len(data["missing_skills"]), 0)


if __name__ == "__main__":
    unittest.main()
