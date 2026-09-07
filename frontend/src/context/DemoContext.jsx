import React, { createContext, useContext, useState } from 'react';

const DemoContext = createContext();

export const demoData = {
  isDemo: true,
  candidateName: 'Alex Johnson',
  resumeTitle: 'Alex_Johnson_Software_Engineer_Resume.pdf',
  uploadedAt: 'Today, 2:45 PM',
  targetJobTitle: 'Junior Backend Developer',
  targetCompany: 'CloudScale Systems',
  readinessScore: 72,
  scoreStatus: "You are on the right track! Focus on missing backend infrastructure competencies.",
  skills: {
    matched: ['Python', 'SQL', 'Git', 'REST APIs'],
    partial: ['React', 'C++'],
    missing: ['FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    allDetected: ['Python', 'C++', 'SQL', 'Git', 'React', 'REST APIs', 'HTML', 'CSS']
  },
  roadmap: [
    { id: 1, number: '01', skill: 'FastAPI', description: 'Learn modern Python API routing, Pydantic schemas, and backend fundamentals.', difficulty: 'Intermediate', timeEstimate: '1.5 Weeks', completed: true },
    { id: 2, number: '02', skill: 'PostgreSQL', description: 'Master relational schema modeling, foreign keys, indexes, and transactions.', difficulty: 'Intermediate', timeEstimate: '2 Weeks', completed: true },
    { id: 3, number: '03', skill: 'Docker', description: 'Containerize microservices, build multi-stage Dockerfiles, and compose services.', difficulty: 'Intermediate', timeEstimate: '1 Week', completed: false },
    { id: 4, number: '04', skill: 'AWS Cloud Basics', description: 'Deploy server workloads, configure Amazon EC2, S3 storage, and basic IAM security.', difficulty: 'Advanced', timeEstimate: '2 Weeks', completed: false },
    { id: 5, number: '05', skill: 'Production REST Project', description: 'Build and deploy an enterprise-grade backend API with comprehensive test coverage.', difficulty: 'Advanced', timeEstimate: '2.5 Weeks', completed: false }
  ]
};

export const DemoProvider = ({ children }) => {
  const [activeData, setActiveData] = useState(demoData);
  const [isDemoActive, setIsDemoActive] = useState(false);

  const startDemo = () => {
    setIsDemoActive(true);
    setActiveData(demoData);
  };

  const resetToReal = () => {
    setIsDemoActive(false);
  };

  const toggleRoadmapItem = (itemId) => {
    setActiveData(prev => ({
      ...prev,
      roadmap: prev.roadmap.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  return (
    <DemoContext.Provider value={{ activeData, isDemoActive, startDemo, resetToReal, toggleRoadmapItem, setActiveData }}>
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
