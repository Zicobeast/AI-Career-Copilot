import React from 'react';
import Sidebar from '../components/Sidebar';
import RoadmapItem from '../components/RoadmapItem';
import ProgressBar from '../components/ProgressBar';
import { useDemo } from '../context/DemoContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Roadmap() {
  const { activeData, toggleRoadmapItem } = useDemo();
  const completed = activeData.roadmap.filter(i => i.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Personalized Learning Roadmap</h1>
            <p className="text-xs text-slate-500">Step-by-step milestones to achieve 100% job readiness</p>
          </div>
          <Link to="/dashboard" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
            Back to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <ProgressBar value={completed} max={activeData.roadmap.length} label={`Progress: ${completed} of ${activeData.roadmap.length} Completed`} color="emerald" />
          <div className="space-y-3 mt-6">
            {activeData.roadmap.map(item => (
              <RoadmapItem key={item.id} item={item} onToggle={toggleRoadmapItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
