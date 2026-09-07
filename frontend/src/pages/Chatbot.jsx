import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Send, ArrowRight } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { Link } from 'react-router-dom';

export default function Chatbot() {
  const { activeData } = useDemo();
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: `Hello ${activeData.candidateName}! I've reviewed your resume against ${activeData.targetJobTitle}. You matched on ${activeData.skills.matched.join(', ')}, but need to master ${activeData.skills.missing.slice(0, 2).join(' and ')}. What would you like guidance on?`
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'copilot',
        text: `Based on your profile, I recommend prioritizing ${activeData.skills.missing[0] || 'FastAPI'} first. It builds directly on your existing Python experience!`
      }]);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 p-8 max-w-4xl flex flex-col h-screen">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Career Assistant</h1>
            <p className="text-xs text-slate-500">Contextual career advice based on your current gap analysis</p>
          </div>
          <Link to="/dashboard" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
            Back to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg p-4 rounded-2xl text-sm leading-relaxed ${
                m.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="pt-4 border-t border-slate-200 flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your skills, roadmap, or interview prep..."
            className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button type="submit" className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center gap-1.5">
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
