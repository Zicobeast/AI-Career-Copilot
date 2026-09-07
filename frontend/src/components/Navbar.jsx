import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, Menu, X } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isDemoActive, startDemo } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTryDemo = () => {
    startDemo();
    setMobileMenuOpen(false);
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
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
          <Link to="/roadmap" className="hover:text-blue-600 transition-colors">Roadmap</Link>
          <Link to="/chatbot" className="hover:text-blue-600 transition-colors">AI Assistant</Link>
        </nav>

        {/* Right CTA Actions (Desktop) */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={handleTryDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Try Demo</span>
          </button>
          
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all hover:translate-y-[-0.5px] focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            <span>Analyze Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu hamburger button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-700">
            <Link 
              to="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Dashboard
            </Link>
            <Link 
              to="/resume" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Resume Parsing
            </Link>
            <Link 
              to="/analysis" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Skill Analysis
            </Link>
            <Link 
              to="/roadmap" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Personalized Roadmap
            </Link>
            <Link 
              to="/chatbot" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              AI Career Assistant
            </Link>
          </nav>
          
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={handleTryDemo}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Try Demo Candidate</span>
            </button>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl"
            >
              <span>Analyze Resume</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

