import unittest
from starlette.testclient import TestClient
from app.main import app



class TestJobAnalysis(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_demo_job_endpoint(self):
        response = self.client.post("/api/job/demo")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["job_title"], "Junior Backend Developer")
        self.assertEqual(data["company"], "CloudScale Systems")
        self.assertTrue(data["is_demo"])
        
        # Verify mandatory evaluation skills
        required = data["required_skills"]
        for skill in ["Python", "FastAPI", "SQL", "PostgreSQL", "Git", "Docker", "AWS"]:
            self.assertIn(skill, required)

    def test_custom_job_analysis(self):
        payload = {
            "job_title": "Full Stack Engineer",
            "company": "NextGen Labs",
            "description": "We are hiring a Full Stack Engineer proficient in React, TypeScript, Node.js, Express, MongoDB, and Docker with strong CI/CD practices."
        }
        response = self.client.post("/api/job/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["job_title"], "Full Stack Engineer")
        self.assertEqual(data["company"], "NextGen Labs")
        self.assertIn("React", data["required_skills"])
        self.assertIn("TypeScript", data["required_skills"])
        self.assertIn("MongoDB", data["required_skills"])
        self.assertIn("Docker", data["required_skills"])
        self.assertIn("CI/CD", data["required_skills"])

    def test_empty_job_description_validation(self):
        payload = {
            "job_title": "Backend Dev",
            "company": "Acme",
            "description": "short"
        }
        response = self.client.post("/api/job/analyze", json=payload)
        self.assertEqual(response.status_code, 422)  # Pydantic min_length=10 validation


if __name__ == "__main__":
    unittest.main()
