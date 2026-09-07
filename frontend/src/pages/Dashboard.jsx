import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Milestone, 
  Bot, 
  Sparkles,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ScoreCard from '../components/ScoreCard';
import SkillCard from '../components/SkillCard';
import RoadmapItem from '../components/RoadmapItem';
import ProgressBar from '../components/ProgressBar';
import { useDemo } from '../context/DemoContext';
import { calculateSkillGap } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeData, setActiveData, isDemoActive, toggleRoadmapItem } = useDemo();
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const fetchRealGap = async () => {
      setCalculating(true);
      try {
        const resumeSkills = activeData.skills?.allDetected || ['Python', 'SQL', 'Git', 'React', 'REST APIs'];
        const jobSkills = ['Python', 'FastAPI', 'REST APIs', 'SQL', 'PostgreSQL', 'Git', 'Docker', 'AWS'];
        const result = await calculateSkillGap({
          resume_skills: resumeSkills,
          job_skills: jobSkills,
          job_title: activeData.targetJobTitle || 'Junior Backend Developer'
        });

        setActiveData(prev => ({
          ...prev,
          readinessScore: result.career_readiness_score,
          scoreStatus: result.score_explanation,
          skills: {
            ...prev.skills,
            matched: result.matched_skills,
            partial: result.partial_skills,
            missing: result.missing_skills
          }
        }));
      } catch (err) {
        console.warn('Using existing dashboard state, backend error:', err);
      } finally {
        setCalculating(false);
      }
    };

    fetchRealGap();
  }, []);

  const completedCount = activeData.roadmap.filter(i => i.completed).length;
  const totalRoadmapItems = activeData.roadmap.length;
  const nextSkill = activeData.roadmap.find(i => !i.completed);


  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Candidate Dashboard</h1>
            <p className="text-[11px] sm:text-xs text-slate-500">Personalized career readiness and skill benchmark overview</p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {calculating && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Synchronizing
              </span>
            )}
            {isDemoActive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] sm:text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Demo Candidate:</span> {activeData.candidateName}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Session</span>
              </span>
            )}
          </div>
        </header>


        {/* Dashboard Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Career Readiness Score Card */}
          <ScoreCard 
            score={activeData.readinessScore}
            jobTitle={activeData.targetJobTitle}
            statusText={activeData.scoreStatus}
          />

          {/* Quick Info Grid: Resume & Target Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {activeData.uploadedAt}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{activeData.resumeTitle}</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Detected {activeData.skills.allDetected.length} competencies across languages, frameworks, and tools.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {activeData.skills.allDetected.slice(0, 6).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {activeData.skills.allDetected.length > 6 && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-medium">
                      +{activeData.skills.allDetected.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/resume"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  View Parsed Resume <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400 font-mono">Parsed via PyMuPDF</span>
              </div>
            </div>

            {/* Target Job Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Target Role
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{activeData.targetJobTitle}</h3>
                <p className="text-xs text-slate-500 mb-4">
                  {activeData.targetCompany} • Requires 8 essential backend proficiencies
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Requirement Coverage</span>
                    <span className="text-slate-900">{activeData.skills.matched.length} of 8 Met</span>
                  </div>
                  <ProgressBar value={activeData.skills.matched.length} max={8} color="indigo" showPercentage={false} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/analysis"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                >
                  Change Target Job / Description <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400 font-mono">Real-time benchmark</span>
              </div>
            </div>
          </div>

          {/* Skill Gap Analysis Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Skill Gap Breakdown</h3>
                <p className="text-xs text-slate-500">Categorized comparison between your resume and job requirements</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  {activeData.skills.matched.length} Matched
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  {activeData.skills.partial.length} Partial
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  {activeData.skills.missing.length} Missing
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Matched Skills */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  Matched Skills ({activeData.skills.matched.length})
                </span>
                {activeData.skills.matched.map(skill => (
                  <SkillCard key={skill} name={skill} status="matched" description="Verified in your experience" />
                ))}
              </div>

              {/* Partial Skills */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                  Partial / Transferable ({activeData.skills.partial.length})
                </span>
                {activeData.skills.partial.map(skill => (
                  <SkillCard key={skill} name={skill} status="partial" description="Foundational concepts detected" />
                ))}
              </div>

              {/* Missing Skills */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
                  Actionable Missing Skills ({activeData.skills.missing.length})
                </span>
                {activeData.skills.missing.map(skill => (
                  <SkillCard key={skill} name={skill} status="missing" description="Required for target position" />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section: Roadmap Preview + AI Assistant Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roadmap Preview (2 columns) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Personalized Learning Roadmap</h3>
                    <p className="text-xs text-slate-500">Sequential milestones designed to eliminate skill gaps</p>
                  </div>
                  <Link
                    to="/roadmap"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    View Full Roadmap <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="mb-4">
                  <ProgressBar 
                    value={completedCount} 
                    max={totalRoadmapItems} 
                    label={`Roadmap Progress: ${completedCount} of ${totalRoadmapItems} Milestones Completed`} 
                    color="emerald"
                  />
                </div>

                <div className="space-y-3">
                  {activeData.roadmap.slice(0, 3).map((item) => (
                    <RoadmapItem key={item.id} item={item} onToggle={toggleRoadmapItem} />
                  ))}
                </div>
              </div>

              {nextSkill && (
                <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Milestone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs text-blue-900">
                      <strong>Next Step:</strong> Learn {nextSkill.skill} ({nextSkill.timeEstimate})
                    </span>
                  </div>
                  <Link to="/roadmap" className="text-xs font-bold text-blue-700 hover:underline">
                    Start Milestone
                  </Link>
                </div>
              )}
            </div>

            {/* AI Assistant Card (1 column) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 mb-4">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">Ask Your Career Copilot</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Get personalized answers tailored to your specific {activeData.targetJobTitle} goals and missing competencies.
                </p>

                <div className="space-y-2 mb-6">
                  {[
                    "What should I learn first?",
                    "Why is Docker important for backend?",
                    "What project should I build?"
                  ].map((question) => (
                    <button
                      key={question}
                      onClick={() => navigate('/chatbot')}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-medium transition-colors border border-white/5"
                    >
                      "{question}"
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to="/chatbot"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Launch AI Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
