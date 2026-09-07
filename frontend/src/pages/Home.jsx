import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Target, 
  Milestone, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useDemo } from '../context/DemoContext';

export default function Home() {
  const navigate = useNavigate();
  const { startDemo } = useDemo();

  const handleTryDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI-Powered Career Readiness & Skill Gap Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.15]">
              Turn your resume into a personalized{' '}
              <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">
                career roadmap
              </span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8">
              Stop guessing if you qualify. AI Career Copilot extracts technical skills from your resume, benchmarks them against actual target job descriptions, computes your objective readiness score, and builds a customized learning roadmap.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:translate-y-[-1px]"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button
                onClick={handleTryDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Try Instant Demo (Preloaded)</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real PDF/DOCX Parsing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Programmatic Gap Engine
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Dummy Data
              </span>
            </div>
          </div>

          {/* SaaS Dashboard Preview Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-4 sm:p-6 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-slate-400 font-mono ml-2">app.career-copilot.ai/dashboard</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Evaluation Sandbox
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Career Readiness</span>
                <div className="text-3xl font-black text-blue-600 mt-1">72%</div>
                <p className="text-xs text-slate-600 mt-1">Target: Junior Backend Developer</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Skill Alignment</span>
                <div className="text-sm font-bold text-slate-800 mt-1">4 Matched / 4 Missing</div>
                <div className="flex gap-1 mt-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Python</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">SQL</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">Docker</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Next Recommended Milestone</span>
                <div className="text-sm font-bold text-slate-800 mt-1">03 - Docker Containers</div>
                <p className="text-xs text-slate-500 mt-1">Est. 1 Week • High Impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
              Engineered Capabilities
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              A Complete System for Career Acceleration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Resume Parsing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct PDF and DOCX structural extraction using PyMuPDF and python-docx. Extracts work experience, education, and technical stacks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Skill Gap Detection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Deterministic matching against 100+ industry frameworks. Categorizes competencies into matched, partial, and missing skills.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Milestone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Personalized Roadmap</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dynamic milestone planner ordering your missing skills by prerequisite hierarchy, difficulty ratings, and estimated completion time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Career Assistant</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Context-aware conversational assistant that analyzes your exact gap results, recommending targeted project ideas and study paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
              Workflow
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              From Raw Resume to Structured Growth in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Upload your PDF or DOCX file or choose the one-click demo resume.' },
              { step: '02', title: 'Choose Target Job', desc: 'Specify job title or paste the target job description to match against.' },
              { step: '03', title: 'Discover Skill Gaps', desc: 'View programmatic alignment score, missing technologies, and partial overlaps.' },
              { step: '04', title: 'Follow Your Roadmap', desc: 'Execute milestone tasks, check off completed skills, and track progress live.' }
            ].map((s) => (
              <div key={s.step} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs relative">
                <span className="text-3xl font-black text-blue-100 font-mono block mb-2">{s.step}</span>
                <h4 className="text-base font-bold text-slate-900 mb-1">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold text-slate-800">AI Career Copilot - Personalized Career Roadmap MVP</p>
          <p>&copy; 2026 AI Career Copilot. Fast, deterministic, and production-ready.</p>
        </div>
      </footer>
    </div>
  );
}
