import React from 'react';

export default function ProgressBar({ value = 0, max = 100, label = '', showPercentage = true, color = 'blue' }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  
  const colorMap = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-600'
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-600">
          <span>{label}</span>
          {showPercentage && <span className="font-semibold text-slate-800">{percentage}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${selectedColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
