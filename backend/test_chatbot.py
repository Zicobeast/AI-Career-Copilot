import unittest
from starlette.testclient import TestClient
from app.main import app

class TestChatbotEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)



    def test_chat_rule_based_fallback(self):
        payload = {
            "message": "What should I learn first?",
            "history": [],
            "context": {
                "candidate_name": "Alex Johnson",
                "target_job_title": "Junior Backend Developer",
                "matched_skills": ["Python", "Git", "REST APIs", "SQL"],
                "missing_skills": ["FastAPI", "Docker", "PostgreSQL", "Redis"],
                "readiness_score": 72,
                "roadmap_progress": 40,
                "next_recommended_skill": "FastAPI"
            }
        }
        response = self.client.post("/api/chat", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("reply", data)
        self.assertIn("FastAPI", data["reply"])
        self.assertIn(data["source"], ["rule_based_engine", "gemini_api"])
        self.assertGreater(len(data["suggested_followups"]), 0)

    def test_chat_readiness_intent(self):
        payload = {
            "message": "Am I ready for this job?",
            "history": [],
            "context": {
                "candidate_name": "Alex Johnson",
                "target_job_title": "Junior Backend Developer",
                "matched_skills": ["Python", "Git", "REST APIs", "SQL"],
                "missing_skills": ["FastAPI", "Docker", "PostgreSQL", "Redis"],
                "readiness_score": 72
            }
        }
        response = self.client.post("/api/chat", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("72%", data["reply"])
        self.assertIn("Junior Backend Developer", data["reply"])

    def test_chat_docker_intent(self):
        payload = {
            "message": "Why do I need Docker?",
            "history": [],
            "context": {
                "target_job_title": "Junior Backend Developer",
                "missing_skills": ["Docker"]
            }
        }
        response = self.client.post("/api/chat", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Docker", data["reply"])
        self.assertTrue("Environment Parity" in data["reply"] or "container" in data["reply"].lower())

if __name__ == "__main__":
    unittest.main()

