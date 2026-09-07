import React from 'react';
import { CheckCircle2, Circle, Clock, Flame } from 'lucide-react';

export default function RoadmapItem({ item, onToggle }) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      item.completed 
        ? 'bg-emerald-50/40 border-emerald-200' 
        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
    }`}>
      <div className="flex items-start gap-4">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggle && onToggle(item.id)}
          className="mt-0.5 focus:outline-none"
          title={item.completed ? "Mark incomplete" : "Mark complete"}
        >
          {item.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 transition-transform active:scale-90" />
          ) : (
            <Circle className="w-5 h-5 text-slate-400 hover:text-blue-600 transition-colors" />
          )}
        </button>

        {/* Milestone Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-black text-slate-400 font-mono">{item.number}</span>
            <h4 className={`text-sm font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
              {item.skill}
            </h4>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              item.difficulty === 'Beginner' ? 'bg-blue-50 text-blue-700' :
              item.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
              'bg-purple-50 text-purple-700'
            }`}>
              {item.difficulty}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {item.description}
          </p>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {item.timeEstimate}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              High Priority
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
