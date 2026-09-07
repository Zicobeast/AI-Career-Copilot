import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isDemoActive, startDemo } = useDemo();

  const handleTryDemo = () => {
    startDemo();
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
              AI Career Copilot
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5">
              Personalized Career Roadmap
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTryDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Try Demo</span>
          </button>
          
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all hover:translate-y-[-0.5px]"
          >
            <span>Analyze Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
