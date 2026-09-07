import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function SkillCard({ name, status = 'matched', description = '' }) {
  const configs = {
    matched: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800',
      icon: CheckCircle2,
      label: 'Matched'
    },
    partial: {
      border: 'border-amber-200',
      bg: 'bg-amber-50/70',
      text: 'text-amber-800',
      badge: 'bg-amber-100 text-amber-800',
      icon: HelpCircle,
      label: 'Partial'
    },
    missing: {
      border: 'border-rose-200',
      bg: 'bg-rose-50/70',
      text: 'text-rose-800',
      badge: 'bg-rose-100 text-rose-800',
      icon: AlertCircle,
      label: 'Missing'
    }
  };

  const current = configs[status] || configs.matched;
  const Icon = current.icon;

  return (
    <div className={`p-3.5 rounded-xl border ${current.border} ${current.bg} flex items-center justify-between transition-all hover:shadow-xs`}>
      <div className="flex items-center space-x-2.5">
        <Icon className={`w-4 h-4 ${current.text} shrink-0`} />
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{name}</h4>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${current.badge} uppercase tracking-wider`}>
        {current.label}
      </span>
    </div>
  );
}
