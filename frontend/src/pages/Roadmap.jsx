import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Milestone, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  Bot, 
  Layers,
  ChevronRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import { useDemo } from '../context/DemoContext';
import { updateRoadmapItemProgress } from '../services/api';

export default function Roadmap() {
  const { activeData, setActiveData, toggleRoadmapItem } = useDemo();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

  const handleToggle = async (itemId) => {
    // 1. Optimistic update via DemoContext
    toggleRoadmapItem(itemId);

    // 2. Real API update to backend PATCH endpoint
    try {
      const currentItem = activeData.roadmap.find(i => i.id === itemId);
      const nextState = !currentItem?.completed;
      await updateRoadmapItemProgress(itemId, nextState);
    } catch (err) {
      console.warn('Backend progress update sync notice:', err);
    }
  };

  const totalItems = activeData.roadmap.length;
  const completedCount = activeData.roadmap.filter(i => i.completed).length;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const filteredItems = activeData.roadmap.filter(item => {
    if (filter === 'completed') return item.completed;
    if (filter === 'pending') return !item.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Personalized Learning Roadmap</h1>
            <p className="text-xs text-slate-500">Sequential milestone path designed to eliminate your technical skill gaps</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI About Roadmap</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-8">
          {/* Progress Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                  <Milestone className="w-3.5 h-3.5" />
                  <span>Target Role: {activeData.targetJobTitle}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Curriculum Progress Overview</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete these sequential milestones to reach 100% interview qualification.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center shrink-0">
                <span className="text-3xl font-black text-emerald-700 block leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mt-1 block">
                  {completedCount} of {totalItems} Milestones
                </span>
              </div>
            </div>

            <ProgressBar 
              value={completedCount} 
              max={totalItems} 
              label="Learning Path Completion" 
              color="emerald" 
            />

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: 'all', label: `All (${totalItems})` },
                { id: 'pending', label: `In Progress (${totalItems - completedCount})` },
                { id: 'completed', label: `Completed (${completedCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sequential Milestones List */}
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (

                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.completed
                      ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Interactive Checkbox */}
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="mt-1 focus:outline-none shrink-0"
                      title={item.completed ? "Mark incomplete" : "Mark milestone complete"}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 transition-transform active:scale-90" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400 hover:text-blue-600 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <span className="text-xs font-mono font-black text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">
                          {item.number}
                        </span>
                        <h3 className={`text-base font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {item.skill}
                        </h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          item.difficulty === 'Beginner' ? 'bg-blue-100 text-blue-800' :
                          item.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.difficulty}
                        </span>
                        {item.completed && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100/80">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Est. Duration: <strong className="text-slate-700">{item.timeEstimate || item.time_estimate || '1.5 Weeks'}</strong>
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          High Priority Qualification
                        </span>
                        {item.prerequisites && item.prerequisites.length > 0 && (
                          <span className="text-[11px] text-slate-400">
                            Prerequisites: {item.prerequisites.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
                <Milestone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 mb-1">No milestones found</h4>
                <p className="text-xs text-slate-500 mb-4">There are no items matching your current filter criteria.</p>
                <button
                  onClick={() => setFilter('all')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  Reset filter to All
                </button>
              </div>
            )}
          </div>


          {/* Bottom Action */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <h3 className="text-base font-bold mb-1">Need guided study recommendations?</h3>
              <p className="text-xs text-slate-300">
                Ask your AI Career Copilot for tutorial links, project milestones, or mock interview questions.
              </p>
            </div>
            <Link
              to="/chatbot"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <span>Chat with Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
