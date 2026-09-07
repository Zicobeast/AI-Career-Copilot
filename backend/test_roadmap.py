import unittest
from starlette.testclient import TestClient
from app.main import app


class TestRoadmapEngine(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_demo_roadmap_endpoint(self):
        response = self.client.get("/api/roadmap/demo")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total_items"], 5)
        self.assertEqual(data["completed_items"], 2)
        self.assertEqual(data["progress_percentage"], 40)
        
        # Verify specific milestone items
        skills = [item["skill"] for item in data["items"]]
        self.assertIn("FastAPI", skills)
        self.assertIn("PostgreSQL", skills)
        self.assertIn("Docker", skills)
        self.assertIn("AWS", skills)
        self.assertIn("Build Backend Project", skills)

    def test_generate_custom_roadmap(self):
        payload = {
            "missing_skills": ["Docker", "Kubernetes", "AWS"],
            "job_title": "DevOps Engineer"
        }
        response = self.client.post("/api/roadmap/generate", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["job_title"], "DevOps Engineer")
        # 3 missing + 1 capstone
        self.assertEqual(data["total_items"], 4)
        self.assertEqual(data["completed_items"], 0)
        self.assertEqual(data["progress_percentage"], 0)
        self.assertEqual(data["items"][0]["number"], "01")
        self.assertIn("Capstone", data["items"][-1]["skill"])

    def test_toggle_milestone_progress(self):
        # First ensure roadmap is initialized
        self.client.get("/api/roadmap/demo")
        
        # Toggle item 3 (Docker) to completed
        response = self.client.patch("/api/roadmap/3/progress", json={"completed": True})
        self.assertEqual(response.status_code, 200)
        item = response.json()
        self.assertEqual(item["id"], 3)
        self.assertTrue(item["completed"])

        # Toggle item 3 back to incomplete
        response = self.client.patch("/api/roadmap/3/progress", json={"completed": False})
        self.assertEqual(response.status_code, 200)
        item = response.json()
        self.assertFalse(item["completed"])


if __name__ == "__main__":
    unittest.main()
