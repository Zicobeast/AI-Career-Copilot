import unittest
from starlette.testclient import TestClient
from app.main import app

class TestSystemEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertEqual(data["service"], "AI Career Copilot")
        self.assertEqual(data["documentation"], "/docs")

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "AI Career Copilot")
        self.assertIn("environment", data)
        self.assertIn("http://localhost:5173", data["environment"]["cors_allowed_origins"])

if __name__ == "__main__":
    unittest.main()
