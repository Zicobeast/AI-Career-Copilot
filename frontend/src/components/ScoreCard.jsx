import React from 'react';
import { Target, CheckCircle } from 'lucide-react';

export default function ScoreCard({ score = 72, jobTitle = 'Backend Developer', statusText = '' }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Circular Progress Gauge */}
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-blue-600 transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{score}%</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Match</span>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Target Role: {jobTitle}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Career Readiness Score</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md">
            {statusText || "You are on the right track! Focus on missing backend infrastructure competencies."}
          </p>
        </div>
      </div>

      {/* Quick stats badge */}
      <div className="w-full md:w-auto p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex md:flex-col justify-around gap-3 shrink-0">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">Status</span>
          <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
            <CheckCircle className="w-4 h-4" /> Interview Ready
          </span>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">Est. Completion</span>
          <span className="text-sm font-bold text-slate-800">4-6 Weeks</span>
        </div>
      </div>
    </div>
  );
}
