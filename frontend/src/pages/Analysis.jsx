import React from 'react';
import Sidebar from '../components/Sidebar';
import { Crosshair, ArrowRight } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { Link } from 'react-router-dom';

export default function Analysis() {
  const { activeData } = useDemo();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Job Description & Skill Gap</h1>
            <p className="text-xs text-slate-500">Benchmark your technical profile against target roles</p>
          </div>
          <Link to="/dashboard" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
            Back to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Target Job: {activeData.targetJobTitle}</h2>
          <p className="text-sm text-slate-600 mb-4">{activeData.targetCompany} • Readiness Score: {activeData.readinessScore}%</p>
        </div>
      </div>
    </div>
  );
}
