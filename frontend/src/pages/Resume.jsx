import React from 'react';
import Sidebar from '../components/Sidebar';
import { FileText, ArrowRight } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { Link } from 'react-router-dom';

export default function Resume() {
  const { activeData } = useDemo();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Resume Management</h1>
            <p className="text-xs text-slate-500">Upload PDF/DOCX resumes for structured extraction</p>
          </div>
          <Link to="/dashboard" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
            Back to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Active Resume</h2>
          <p className="text-sm text-slate-600 mb-4">{activeData.resumeTitle} (Uploaded: {activeData.uploadedAt})</p>
          <div className="flex flex-wrap gap-2">
            {activeData.skills.allDetected.map(s => (
              <span key={s} className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
