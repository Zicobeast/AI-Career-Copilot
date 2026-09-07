import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Send, ArrowRight, Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { Link } from 'react-router-dom';
import { sendChatMessage } from '../services/api';

export default function Chatbot() {
  const { activeData } = useDemo();
  const messagesEndRef = useRef(null);

  const initialGreeting = `Hello ${activeData?.candidateName || 'there'}! I'm your AI Career Copilot. Based on your target role of ${activeData?.targetJobTitle || 'Junior Backend Developer'} and readiness score of ${activeData?.readinessScore || 72}%, I've mapped out your skill gaps. What would you like guidance on?`;

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: initialGreeting,
      source: 'rule_based_engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followups: [
        'What should I learn first?',
        'Am I ready for this job?',
        'Why should I learn Docker?',
        'What project should I build?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFollowups, setActiveFollowups] = useState([
    'What should I learn first?',
    'Am I ready for this job?',
    'Why should I learn Docker?',
    'What project should I build?'
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Build context object
    const context = {
      candidate_name: activeData?.candidateName || 'Alex Johnson',
      target_job_title: activeData?.targetJobTitle || 'Junior Backend Developer',
      resume_skills: activeData?.skills?.allDetected || ['Python', 'SQL', 'Git', 'REST APIs'],
      matched_skills: activeData?.skills?.matched || ['Python', 'SQL', 'Git', 'REST APIs'],
      missing_skills: activeData?.skills?.missing || ['FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
      readiness_score: activeData?.readinessScore || 72,
      roadmap_progress: activeData?.roadmap ? Math.round((activeData.roadmap.filter(i => i.completed).length / activeData.roadmap.length) * 100) : 40,
      next_recommended_skill: activeData?.skills?.missing?.[0] || 'FastAPI'
    };

    // Format history for backend
    const historyPayload = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await sendChatMessage({
        message: query,
        history: historyPayload,
        context: context
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.reply,
        source: response.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followups: response.suggested_followups || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (response.suggested_followups && response.suggested_followups.length > 0) {
        setActiveFollowups(response.suggested_followups);
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback response in case backend unreachable
      const fallbackMsg = {
        role: 'assistant',
        content: `Based on your profile for **${context.target_job_title}**, you should prioritize **${context.next_recommended_skill}** first. It bridges your most critical gap while building directly upon your Python foundation.`,
        source: 'rule_based_engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followups: ['What project should I build?', 'Am I ready for this job?']
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chipText) => {
    handleSendMessage(chipText);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl flex flex-col h-screen min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0 gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900">AI Career Assistant</h1>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Live Context
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate max-w-xs sm:max-w-md">
              Tuned to {activeData?.targetJobTitle || 'Junior Backend Developer'} ({activeData?.readinessScore || 72}% match)
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs hover:border-blue-300 shrink-0"
          >
            <span className="hidden sm:inline">Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>


        {/* Message Log */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line prose-sm">{m.content}</div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/30 text-[11px] opacity-75">
                  <span>{m.timestamp}</span>
                  {m.source && (
                    <span className="font-mono text-[10px] tracking-wide">
                      {m.source === 'gemini_api' ? '⚡ Gemini 1.5' : '🛡️ Rule Engine'}
                    </span>
                  )}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-slate-400 text-xs py-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/50 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                Copilot is analyzing your profile...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Followup Chips */}
        {activeFollowups.length > 0 && !isLoading && (
          <div className="py-2 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Quick suggestions:</span>
            {activeFollowups.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleChipClick(chip)}
                className="text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="pt-2 border-t border-slate-200 flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about your skills, roadmap milestones, resume bullets, or interview prep..."
            className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
