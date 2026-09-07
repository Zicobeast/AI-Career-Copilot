import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Compass,
  FileText,
  Target,
  RefreshCw
} from 'lucide-react';
import { checkHealth, checkRoot } from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    connected: false,
    data: null,
    error: null,
    timestamp: null
  });

  const testConnection = async () => {
    setBackendStatus(prev => ({ ...prev, loading: true, error: null }));
    const startTime = performance.now();
    try {
      const data = await checkHealth();
      const elapsed = Math.round(performance.now() - startTime);
      setBackendStatus({
        loading: false,
        connected: true,
        data: { ...data, latency: elapsed },
        error: null,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      setBackendStatus({
        loading: false,
        connected: false,
        data: null,
        error: err.message || 'Unable to connect to FastAPI backend at http://127.0.0.1:8000',
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Banner */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2">
                AI Career Copilot
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  MVP v1.0
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              backendStatus.loading 
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : backendStatus.connected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                backendStatus.loading 
                  ? 'bg-amber-500 animate-pulse' 
                  : backendStatus.connected 
                    ? 'bg-emerald-500' 
                    : 'bg-rose-500'
              }`}></span>
              {backendStatus.loading 
                ? 'Connecting to API...' 
                : backendStatus.connected 
                  ? 'Backend Connected' 
                  : 'Backend Offline'}
            </div>
            <button 
              onClick={testConnection} 
              disabled={backendStatus.loading}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh connection"
            >
              <RefreshCw className={`w-4 h-4 ${backendStatus.loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 3: Frontend & Backend Interconnection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
            Turn your resume into a personalized <span className="text-blue-600">career roadmap</span>.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            AI Career Copilot bridges the gap between your current technical skills and target industry job requirements through real document parsing, objective gap analysis, and dynamic learning milestones.
          </p>
        </div>

        {/* Backend Connection Diagnostics Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                backendStatus.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">FastAPI Backend Diagnostics</h2>
                <p className="text-sm text-slate-500">Live communication with http://127.0.0.1:8000/health</p>
              </div>
            </div>
            <button
              onClick={testConnection}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${backendStatus.loading ? 'animate-spin' : ''}`} />
              Test API Connection
            </button>
          </div>

          <div className="pt-6">
            {backendStatus.loading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
                <p className="text-sm text-slate-500">Checking backend status...</p>
              </div>
            ) : backendStatus.connected ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900">Active Connection Established</h3>
                    <p className="text-sm text-emerald-700 mt-0.5">
                      The React frontend is successfully sending HTTP requests and receiving JSON responses from the FastAPI backend.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Service</span>
                    <span className="text-sm font-bold text-slate-800">{backendStatus.data?.service || 'FastAPI'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Status</span>
                    <span className="text-sm font-bold text-emerald-600 capitalize">{backendStatus.data?.status}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Latency</span>
                    <span className="text-sm font-bold text-slate-800">{backendStatus.data?.latency} ms</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Last Checked</span>
                    <span className="text-sm font-bold text-slate-800">{backendStatus.timestamp}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                  <div className="text-slate-400 mb-1">// Raw response from GET /health</div>
                  <pre>{JSON.stringify(backendStatus.data, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-rose-900">Cannot Reach FastAPI Backend</h3>
                    <p className="text-sm text-rose-700 mt-1">
                      {backendStatus.error}
                    </p>
                    <div className="mt-3 p-3 bg-white/80 rounded-lg border border-rose-200 text-xs text-slate-700 font-mono">
                      uvicorn app.main:app --reload --port 8000
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Real Resume Parsing</h3>
            <p className="text-sm text-slate-600">
              Direct upload of PDF and DOCX documents with structured text and competency extraction via PyMuPDF.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Objective Gap Analysis</h3>
            <p className="text-sm text-slate-600">
              Deterministic skill comparison engine calculating matched, partial, and missing competencies with readiness scores.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Dynamic Roadmap & AI</h3>
            <p className="text-sm text-slate-600">
              Step-by-step ordered learning milestones with state persistence and context-aware AI Career Assistant.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        AI Career Copilot &copy; 2026. Built with React, Tailwind CSS, FastAPI, and SQLAlchemy.
      </footer>
    </div>
  );
}

export default App;
