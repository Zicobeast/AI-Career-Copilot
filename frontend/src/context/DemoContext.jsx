import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDemoResume, getDemoJob, getDemoSkillGap, getDemoRoadmap } from '../services/api';

const DemoContext = createContext();

export const demoData = {
  isDemo: true,
  candidateName: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 234-5678',
  resumeTitle: 'Alex_Johnson_Software_Engineer_Resume.pdf',
  uploadedAt: 'Evaluation Ready',
  targetJobTitle: 'Junior Backend Developer',
  targetCompany: 'CloudScale Systems',
  readinessScore: 72,
  scoreStatus: "4 matched out of 8 required skills (50%). Foundational skills in React, C++ give +10% bonus. Solid foundation for Junior Backend Developer!",
  skills: {
    matched: ['Python', 'SQL', 'Git', 'REST APIs'],
    partial: ['React', 'C++'],
    missing: ['FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    allDetected: ['Python', 'C++', 'SQL', 'Git', 'React', 'REST APIs', 'HTML', 'CSS']
  },
  roadmap: [
    { 
      id: 1, 
      number: '01', 
      skill: 'FastAPI', 
      description: 'Learn modern Python API routing, Pydantic schemas, and backend fundamentals.', 
      difficulty: 'Intermediate', 
      timeEstimate: '1.5 Weeks', 
      completed: true,
      prerequisites: ['Python', 'REST APIs']
    },
    { 
      id: 2, 
      number: '02', 
      skill: 'PostgreSQL', 
      description: 'Master relational schema modeling, foreign keys, indexes, and transactions.', 
      difficulty: 'Intermediate', 
      timeEstimate: '2 Weeks', 
      completed: true,
      prerequisites: ['SQL']
    },
    { 
      id: 3, 
      number: '03', 
      skill: 'Docker', 
      description: 'Containerize microservices, build multi-stage Dockerfiles, and compose services.', 
      difficulty: 'Intermediate', 
      timeEstimate: '1 Week', 
      completed: false,
      prerequisites: ['Linux Basics']
    },
    { 
      id: 4, 
      number: '04', 
      skill: 'AWS Cloud Basics', 
      description: 'Deploy server workloads, configure Amazon EC2, S3 storage, and basic IAM security.', 
      difficulty: 'Advanced', 
      timeEstimate: '2 Weeks', 
      completed: false,
      prerequisites: ['Docker']
    },
    { 
      id: 5, 
      number: '05', 
      skill: 'Production REST Project', 
      description: 'Build and deploy an enterprise-grade backend API with comprehensive test coverage.', 
      difficulty: 'Advanced', 
      timeEstimate: '2.5 Weeks', 
      completed: false,
      prerequisites: ['FastAPI', 'PostgreSQL', 'Docker']
    }
  ]
};

export const DemoProvider = ({ children }) => {
  const [activeData, setActiveData] = useState(demoData);
  const [isDemoActive, setIsDemoActive] = useState(true); // Default active for immediate college evaluation

  // One-click demo initialization function
  const startDemo = async () => {
    setIsDemoActive(true);
    setActiveData(demoData);

    // Try synchronizing with backend demo endpoints if backend is up
    try {
      const [resumeRes, jobRes, gapRes, roadmapRes] = await Promise.allSettled([
        getDemoResume(),
        getDemoJob(),
        getDemoSkillGap(),
        getDemoRoadmap()
      ]);

      const updated = { ...demoData };

      if (resumeRes.status === 'fulfilled' && resumeRes.value) {
        updated.candidateName = resumeRes.value.candidate_name || updated.candidateName;
        updated.email = resumeRes.value.email || updated.email;
        updated.phone = resumeRes.value.phone || updated.phone;
        updated.resumeTitle = resumeRes.value.filename || updated.resumeTitle;
        if (resumeRes.value.skills) {
          updated.skills.allDetected = resumeRes.value.skills;
        }
      }

      if (jobRes.status === 'fulfilled' && jobRes.value) {
        updated.targetJobTitle = jobRes.value.job_title || updated.targetJobTitle;
        updated.targetCompany = jobRes.value.company || updated.targetCompany;
      }

      if (gapRes.status === 'fulfilled' && gapRes.value) {
        updated.readinessScore = gapRes.value.career_readiness_score || updated.readinessScore;
        updated.scoreStatus = gapRes.value.score_explanation || updated.scoreStatus;
        if (gapRes.value.matched_skills) updated.skills.matched = gapRes.value.matched_skills;
        if (gapRes.value.partial_skills) updated.skills.partial = gapRes.value.partial_skills;
        if (gapRes.value.missing_skills) updated.skills.missing = gapRes.value.missing_skills;
      }

      if (roadmapRes.status === 'fulfilled' && roadmapRes.value && roadmapRes.value.items) {
        updated.roadmap = roadmapRes.value.items.map((item, idx) => ({
          id: item.id || idx + 1,
          number: item.number || String(idx + 1).padStart(2, '0'),
          skill: item.skill,
          description: item.description,
          difficulty: item.difficulty,
          timeEstimate: item.time_estimate || '1.5 Weeks',
          completed: item.completed ?? (idx < 2),
          prerequisites: item.prerequisites || []
        }));
      }

      setActiveData(updated);
    } catch (err) {
      console.info('Running offline demo mode fallback:', err);
      setActiveData(demoData);
    }
  };

  const resetToReal = () => {
    setIsDemoActive(false);
    setActiveData({
      isDemo: false,
      candidateName: 'Candidate User',
      email: '',
      phone: '',
      resumeTitle: 'No resume uploaded yet',
      uploadedAt: 'Awaiting upload',
      targetJobTitle: 'Junior Backend Developer',
      targetCompany: 'CloudScale Systems',
      readinessScore: 0,
      scoreStatus: 'Upload a resume and job description to calculate your readiness score.',
      skills: {
        matched: [],
        partial: [],
        missing: [],
        allDetected: []
      },
      roadmap: []
    });
  };

  const toggleRoadmapItem = (itemId) => {
    setActiveData(prev => {
      const nextRoadmap = prev.roadmap.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      const completedCount = nextRoadmap.filter(i => i.completed).length;
      const totalCount = nextRoadmap.length;
      // Dynamically reflect readiness score boost as milestones are checked off!
      // Completing milestones increases readiness from 72% towards 95%
      const baseScore = 72;
      const additionalBoost = totalCount > 0 ? Math.round((completedCount / totalCount) * 23) : 0;
      const newScore = Math.min(100, baseScore + additionalBoost);

      return {
        ...prev,
        readinessScore: prev.isDemo ? newScore : prev.readinessScore,
        roadmap: nextRoadmap
      };
    });
  };

  return (
    <DemoContext.Provider value={{ 
      activeData, 
      isDemoActive, 
      startDemo, 
      resetToReal, 
      toggleRoadmapItem, 
      setActiveData 
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
