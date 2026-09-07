import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider } from './context/DemoContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import Analysis from './pages/Analysis';
import Roadmap from './pages/Roadmap';
import Chatbot from './pages/Chatbot';

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  );
}
