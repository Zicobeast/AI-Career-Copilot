import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Crosshair, 
  Milestone, 
  Bot, 
  Compass
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';

export default function Sidebar() {
  const { isDemoActive, activeData } = useDemo();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/resume', label: 'Resume', icon: FileText, badge: 'Active' },
    { to: '/analysis', label: 'Skill Analysis', icon: Crosshair },
    { to: '/roadmap', label: 'Roadmap', icon: Milestone },
    { to: '/chatbot', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm tracking-tight leading-none">
              AI Career Copilot
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              SaaS Career Platform
            </div>
          </div>
        </Link>
      </div>

      {/* Mode Badge */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isDemoActive ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          <span className="font-semibold text-slate-700">
            {isDemoActive ? 'Demo Mode Active' : 'Workspace Mode'}
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
          {isDemoActive ? 'Preloaded' : 'Standard'}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="p-3 flex-1 space-y-1">
        <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            {activeData.candidateName ? activeData.candidateName.split(' ').map(n => n[0]).join('') : 'AJ'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {activeData.candidateName}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {activeData.targetJobTitle}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
