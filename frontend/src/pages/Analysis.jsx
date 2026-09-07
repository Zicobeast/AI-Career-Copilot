import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Layers, 
  Building, 
  Search,
  RefreshCw,
  Terminal,
  Target
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { analyzeJob, getDemoJob } from '../services/api';
import { useDemo } from '../context/DemoContext';

export default function Analysis() {
  const navigate = useNavigate();
  const { activeData, setActiveData } = useDemo();

  const [jobTitle, setJobTitle] = useState(activeData.targetJobTitle || 'Junior Backend Developer');
  const [company, setCompany] = useState(activeData.targetCompany || 'CloudScale Systems');
  const [description, setDescription] = useState(
    'CloudScale Systems is looking for a Junior Backend Developer to build scalable RESTful microservices.\n\n' +
    'Key Requirements:\n' +
    '- Strong proficiency in Python and FastAPI for API development.\n' +
    '- Solid experience with SQL and relational database design (PostgreSQL).\n' +
    '- Version control with Git and GitHub.\n' +
    '- Containerization with Docker and deployment onto AWS cloud infrastructure.\n' +
    '- Experience with REST APIs, testing, and Linux environments.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobResult, setJobResult] = useState({
    job_title: activeData.targetJobTitle,
    company: activeData.targetCompany,
    required_skills: ['Python', 'FastAPI', 'REST APIs', 'SQL', 'PostgreSQL', 'Git', 'Docker', 'AWS'],
    categorized_skills: {
      'Programming Languages': ['Python', 'SQL'],
      'Frameworks & Libraries': ['FastAPI', 'REST APIs'],
      'Databases & Storage': ['PostgreSQL'],
      'Cloud & DevOps': ['AWS', 'Docker'],
      'Tools & Architecture': ['Git']
    },
    total_skills: 8,
    description_snippet: 'CloudScale Systems is seeking a Junior Backend Developer with experience in Python, FastAPI, PostgreSQL, Docker, and AWS.',
    is_demo: activeData.isDemo
  });

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!description.trim()) {
      setError('Please paste or enter a job description to analyze.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await analyzeJob({
        job_title: jobTitle,
        company: company,
        description: description
      });

      setJobResult(data);

      // Update global context so Dashboard and Roadmap reflect target job
      setActiveData(prev => ({
        ...prev,
        targetJobTitle: data.job_title,
        targetCompany: data.company
      }));
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to analyze job description.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemoJob = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getDemoJob();
      setJobTitle(data.job_title);
      setCompany(data.company);
      setDescription(
        'CloudScale Systems is looking for a Junior Backend Developer.\n\n' +
        'Requirements:\n' +
        '- Python, FastAPI, REST APIs\n' +
        '- SQL, PostgreSQL relational databases\n' +
        '- Git version control\n' +
        '- Docker containers\n' +
        '- AWS cloud fundamentals'
      );
      setJobResult(data);
      setActiveData(prev => ({
        ...prev,
        targetJobTitle: data.job_title,
        targetCompany: data.company
      }));
    } catch (err) {
      setError('Unable to load demo target job from API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Job Description & Skill Analysis</h1>
            <p className="text-[11px] sm:text-xs text-slate-500">Benchmark your technical profile against target career roles</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLoadDemoJob}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span className="hidden sm:inline">Use Demo Job</span>
              <span className="sm:hidden">Demo</span>
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </div>
        </header>


        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <strong className="font-bold block">Analysis Error</strong>
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-xs font-bold text-rose-600 hover:text-rose-900">
                Dismiss
              </button>
            </div>
          )}

          {/* Form & Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Target Role Parameters</h2>
                    <p className="text-[11px] text-slate-500">Provide job title & paste job posting text</p>
                  </div>
                </div>

                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Junior Backend Developer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hiring Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. CloudScale Systems"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Job Description / Requirements
                      </label>
                      <button
                        type="button"
                        onClick={handleLoadDemoJob}
                        className="text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        Insert Demo Job
                      </button>
                    </div>
                    <textarea
                      rows={9}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Paste the full job posting, key responsibilities, or technical requirements..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white leading-relaxed resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing Job Description...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Analyze Job Requirements</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Extracted Requirements Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              {jobResult ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                        <Target className="w-3.5 h-3.5" />
                        <span>Target Benchmark</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{jobResult.job_title}</h2>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {jobResult.company}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center shrink-0">
                      <span className="text-2xl font-black text-blue-600 block leading-none">
                        {jobResult.total_skills}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                        Required Skills
                      </span>
                    </div>
                  </div>

                  {/* Overview Snippet */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-semibold mb-1">Extracted Summary:</strong>
                    {jobResult.description_snippet}
                  </div>

                  {/* Categorized Skills Breakdown */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      Required Skills by Technical Domain
                    </h3>

                    <div className="space-y-4">
                      {jobResult.categorized_skills && Object.keys(jobResult.categorized_skills).length > 0 ? (
                        Object.entries(jobResult.categorized_skills).map(([category, skills]) => (
                          <div key={category} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                              {category} ({skills.length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {skills.map(s => (
                                <span
                                  key={s}
                                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {jobResult.required_skills.map(s => (
                            <span key={s} className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ready for Gap Analysis Card */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Requirements extracted. Ready for real skill gap comparison against Alex Johnson's resume.</span>
                    </div>

                    <Link
                      to="/dashboard"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:translate-y-[-0.5px] shrink-0"
                    >
                      <span>Proceed to Dashboard & Gap Engine</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Enter job requirements or click "Use Demo Job" to begin analysis.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
