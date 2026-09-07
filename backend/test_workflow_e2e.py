import unittest
import io
from pathlib import Path
from starlette.testclient import TestClient
from app.main import app

class TestCompleteWorkflowE2E(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check_operational(self):
        """Verify server status and environment diagnostics."""
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "AI Career Copilot")
        self.assertIn("environment", data)

    def test_complete_demo_evaluation_workflow(self):
        """
        Verify end-to-end evaluation flow:
        1. Fetch demo resume for candidate Alex Johnson
        2. Fetch demo job description for Junior Backend Developer
        3. Run skill gap analysis producing EXACTLY 72% Career Readiness score
        4. Fetch personalized 5-milestone roadmap
        5. Verify chat assistant response tailored to Alex Johnson and FastAPI priority
        """
        # Step 1: Demo Resume
        res_resume = self.client.get("/api/resume/demo")
        self.assertEqual(res_resume.status_code, 200)
        resume = res_resume.json()
        self.assertEqual(resume["candidate_name"], "Alex Johnson")
        self.assertTrue(len(resume["skills"]) >= 8)
        self.assertIn("Python", resume["skills"])
        self.assertIn("SQL", resume["skills"])
        self.assertIn("Git", resume["skills"])

        # Step 2: Demo Job
        res_job = self.client.get("/api/job/demo")
        self.assertEqual(res_job.status_code, 200)
        job = res_job.json()
        self.assertEqual(job["job_title"], "Junior Backend Developer")
        self.assertEqual(job["total_skills"], 8)
        self.assertIn("FastAPI", job["required_skills"])
        self.assertIn("Docker", job["required_skills"])

        # Step 3: Skill Gap Analysis & 72% Readiness Score
        res_gap = self.client.post("/api/analysis/skill-gap", json={
            "resume_skills": resume["skills"],
            "job_skills": job["required_skills"],
            "job_title": job["job_title"]
        })
        self.assertEqual(res_gap.status_code, 200)
        gap = res_gap.json()
        self.assertEqual(gap["career_readiness_score"], 72)
        self.assertEqual(len(gap["matched_skills"]), 4)
        self.assertEqual(len(gap["missing_skills"]), 4)
        self.assertIn("FastAPI", gap["missing_skills"])
        self.assertIn("Docker", gap["missing_skills"])
        self.assertIn("Python", gap["matched_skills"])

        # Step 4: Roadmap Generation
        res_roadmap = self.client.post("/api/roadmap/generate", json={
            "missing_skills": gap["missing_skills"],
            "job_title": job["job_title"],
            "target_company": job["company"]
        })
        self.assertEqual(res_roadmap.status_code, 200)
        roadmap = res_roadmap.json()
        self.assertGreaterEqual(len(roadmap["items"]), 4)
        self.assertEqual(roadmap["items"][0]["skill"], "FastAPI")

        # Step 5: Chat Assistant Contextual Advisory
        res_chat = self.client.post("/api/chat", json={
            "message": "What should I learn first?",
            "history": [],
            "context": {
                "candidate_name": resume["candidate_name"],
                "target_job_title": job["job_title"],
                "matched_skills": gap["matched_skills"],
                "missing_skills": gap["missing_skills"],
                "readiness_score": gap["career_readiness_score"],
                "roadmap_progress": 40,
                "next_recommended_skill": "FastAPI"
            }
        })
        self.assertEqual(res_chat.status_code, 200)
        chat = res_chat.json()
        self.assertIn("FastAPI", chat["reply"])
        self.assertIn(chat["source"], ["rule_based_engine", "gemini_api"])

    def test_custom_pdf_resume_upload_workflow(self):
        """Verify real PDF parsing and skill catalog extraction."""
        pdf_file = Path("data/demo_resume.pdf")
        if not pdf_file.exists():
            pdf_file = Path("../data/demo_resume.pdf")

        self.assertTrue(pdf_file.exists(), "Sample demo_resume.pdf must exist for real upload test")
        
        with open(pdf_file, "rb") as f:
            pdf_bytes = f.read()

        response = self.client.post(
            "/api/resume/upload",
            files={"file": ("alex_sample.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["candidate_name"].upper(), "ALEX JOHNSON")
        self.assertIn("Python", data["skills"])
        self.assertIn("SQL", data["skills"])


    def test_custom_job_posting_analysis(self):
        """Verify programmatic parsing of raw custom job posting."""
        raw_description = (
            "TechCorp is looking for a Backend Engineer.\n"
            "Requirements:\n"
            "- 2+ years with Python and FastAPI\n"
            "- PostgreSQL and Redis caching\n"
            "- Docker containerization\n"
            "- CI/CD and AWS deployment\n"
        )
        response = self.client.post("/api/job/analyze", json={
            "job_title": "Backend Engineer",
            "company": "TechCorp",
            "description": raw_description
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["job_title"], "Backend Engineer")
        self.assertIn("FastAPI", data["required_skills"])
        self.assertIn("PostgreSQL", data["required_skills"])
        self.assertIn("Docker", data["required_skills"])

    def test_roadmap_item_progress_persistence(self):
        """Verify PATCH /api/roadmap/{item_id}/progress toggles state and persists."""
        # Ensure roadmap exists
        demo_roadmap = self.client.post("/api/roadmap/demo").json()
        first_item = demo_roadmap["items"][0]
        item_id = first_item["id"]

        # Toggle to True
        patch_res = self.client.patch(f"/api/roadmap/{item_id}/progress", json={"completed": True})
        self.assertEqual(patch_res.status_code, 200)
        self.assertTrue(patch_res.json()["completed"])

        # Toggle to False
        patch_res2 = self.client.patch(f"/api/roadmap/{item_id}/progress", json={"completed": False})
        self.assertEqual(patch_res2.status_code, 200)
        self.assertFalse(patch_res2.json()["completed"])

if __name__ == "__main__":
    unittest.main()
