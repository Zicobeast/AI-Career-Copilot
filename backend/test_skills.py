import unittest
from starlette.testclient import TestClient
from app.main import app


class TestSkillExtraction(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_extract_skills_categorization(self):
        payload = {
            "text": "Looking for a software engineer skilled in Python, React, PostgreSQL, Docker, AWS and Git with experience in REST APIs."
        }
        response = self.client.post("/api/skills/extract", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total_count"], 7)
        self.assertIn("Python", data["skills"])
        self.assertIn("React", data["skills"])
        self.assertIn("PostgreSQL", data["skills"])
        self.assertIn("Docker", data["skills"])
        self.assertIn("AWS", data["skills"])
        self.assertIn("Git", data["skills"])
        self.assertIn("REST APIs", data["skills"])

        # Check categorization
        self.assertIn("Python", data["categorized"]["Programming Languages"])
        self.assertIn("React", data["categorized"]["Frameworks & Libraries"])
        self.assertIn("PostgreSQL", data["categorized"]["Databases & Storage"])
        self.assertIn("Docker", data["categorized"]["Cloud & DevOps"])

    def test_synonym_normalization(self):
        payload = {
            "text": "Strong experience with k8s clusters, postgres database, and golang backend services."
        }
        response = self.client.post("/api/skills/extract", json=payload)
        self.assertEqual(response.status_code, 200)
        skills = response.json()["skills"]
        self.assertIn("Kubernetes", skills)
        self.assertIn("PostgreSQL", skills)
        self.assertIn("Go", skills)

    def test_skills_catalog(self):
        response = self.client.get("/api/skills/catalog")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total_catalog_skills"], 50)
        self.assertIn("Programming Languages", data["categories"])
        self.assertIn("Frameworks & Libraries", data["categories"])


if __name__ == "__main__":
    unittest.main()
