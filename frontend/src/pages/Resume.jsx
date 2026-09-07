import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  GraduationCap, 
  Code, 
  ExternalLink,
  RefreshCw,
  FolderArchive,
  Layers
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import { uploadResume, getDemoResume } from '../services/api';
import { useDemo } from '../context/DemoContext';

export default function Resume() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { activeData, setActiveData } = useDemo();

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [parsedResult, setParsedResult] = useState({
    candidate_name: activeData.candidateName,
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    links: ['github.com/alexjohnson', 'linkedin.com/in/alexjohnson'],
    education: [
      'Bachelor of Technology in Computer Science (2021 - 2025)',
      'CGPA: 8.7/10.0 • State University of Technology'
    ],
    experience: [
      'Software Engineering Intern at TechNova Solutions (June 2024 - Aug 2024)',
      'Assisted in developing internal REST APIs and maintaining relational database schemas.'
    ],
    projects: [
      'Student Management System (Python, SQLite, HTML/CSS)',
      'React Developer Portfolio (React, Tailwind CSS, Vite)'
    ],
    skills: activeData.skills.allDetected,
    filename: activeData.resumeTitle,
    file_size_kb: 142.5,
    is_demo: activeData.isDemo
  });

  const handleFile = async (file) => {
    if (!file) return;

    const validExtensions = ['.pdf', '.docx', '.doc'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setError(`Invalid format '${file.name}'. Please upload a valid PDF (.pdf) or Word (.docx) document.`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(15);

    try {
      const data = await uploadResume(file, (percent) => {
        setProgress(Math.min(90, Math.max(15, percent)));
      });

      setProgress(100);
      setParsedResult(data);

      // Update shared global state
      setActiveData(prev => ({
        ...prev,
        candidateName: data.candidate_name || 'Uploaded Candidate',
        resumeTitle: data.filename,
        uploadedAt: 'Just now',
        skills: {
          ...prev.skills,
          allDetected: data.skills || []
        }
      }));

    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to parse resume document.';
      setError(msg);
    } finally {
      setTimeout(() => setUploading(false), 500);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadDemo = async () => {
    setError(null);
    setUploading(true);
    setProgress(30);
    try {
      const data = await getDemoResume();
      setProgress(100);
      setParsedResult(data);
      setActiveData(prev => ({
        ...prev,
        candidateName: data.candidate_name,
        resumeTitle: data.filename,
        uploadedAt: 'Just now',
        skills: {
          ...prev.skills,
          allDetected: data.skills
        }
      }));
    } catch (err) {
      setError('Unable to load demo resume from backend.');
    } finally {
      setTimeout(() => setUploading(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Resume Management</h1>
            <p className="text-[11px] sm:text-xs text-slate-500">Upload PDF or DOCX documents for automated structure & skill extraction</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleLoadDemo}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span className="hidden sm:inline">Use Demo Resume</span>
              <span className="sm:hidden">Demo</span>
            </button>
            <Link
              to="/analysis"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all"
            >
              <span>Analyze Job</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>


        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <strong className="font-bold block">Document Parsing Error</strong>
                <span>{error}</span>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-xs font-bold text-rose-600 hover:text-rose-900"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragOver 
                ? 'border-blue-500 bg-blue-50/60 scale-[1.005]' 
                : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50 shadow-xs'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Drag and drop your resume file here
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              Supports standard ATS PDF (.pdf) and Microsoft Word (.docx) files up to 10MB.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs hover:bg-slate-800 transition-colors">
              <FileText className="w-3.5 h-3.5" />
              <span>Browse Files from Computer</span>
            </div>

            {uploading && (
              <div className="mt-6 max-w-md mx-auto">
                <ProgressBar value={progress} label="Parsing resume structure via PyMuPDF..." color="blue" />
              </div>
            )}
          </div>

          {/* Parsed Resume Details Card */}
          {parsedResult && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {parsedResult.candidate_name ? parsedResult.candidate_name.split(' ').map(n => n[0]).join('') : 'AJ'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {parsedResult.candidate_name}
                      {parsedResult.is_demo && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Demo Profile
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {parsedResult.email || 'No email detected'} • {parsedResult.phone || 'No phone detected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
                    {parsedResult.filename} ({parsedResult.file_size_kb} KB)
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Detected Skills Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-600" />
                      Extracted Technical Skills ({parsedResult.skills?.length || 0})
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">Standardized via Technical Taxonomy Engine</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {parsedResult.skills && parsedResult.skills.length > 0 ? (
                      parsedResult.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200/80 shadow-2xs hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">No technical skills detected in text layer.</p>
                    )}
                  </div>
                </div>


                {/* Grid for Education, Experience & Projects */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  {/* Education */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
                      <GraduationCap className="w-4 h-4 text-blue-600" /> Education
                    </h4>
                    {parsedResult.education && parsedResult.education.length > 0 ? (
                      <ul className="space-y-2 text-xs text-slate-600">
                        {parsedResult.education.map((edu, idx) => (
                          <li key={idx} className="pb-1 border-b border-slate-200/50 last:border-none">
                            {edu}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400">Education details extracted.</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
                      <Briefcase className="w-4 h-4 text-blue-600" /> Experience
                    </h4>
                    {parsedResult.experience && parsedResult.experience.length > 0 ? (
                      <ul className="space-y-2 text-xs text-slate-600">
                        {parsedResult.experience.map((exp, idx) => (
                          <li key={idx} className="pb-1 border-b border-slate-200/50 last:border-none">
                            {exp}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400">Work history extracted.</p>
                    )}
                  </div>

                  {/* Projects */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
                      <Layers className="w-4 h-4 text-blue-600" /> Key Projects
                    </h4>
                    {parsedResult.projects && parsedResult.projects.length > 0 ? (
                      <ul className="space-y-2 text-xs text-slate-600">
                        {parsedResult.projects.map((proj, idx) => (
                          <li key={idx} className="pb-1 border-b border-slate-200/50 last:border-none">
                            {proj}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400">Technical projects extracted.</p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resume successfully parsed and ready for job benchmark</span>
                  </div>

                  <Link
                    to="/analysis"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:translate-y-[-0.5px]"
                  >
                    <span>Proceed to Skill Gap Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
