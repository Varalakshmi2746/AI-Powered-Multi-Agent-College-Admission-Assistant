import React from 'react';
import { ShieldCheck, Target, AlertTriangle, XCircle } from 'lucide-react';

export default function EligibilityBadge({ category, score, showScore = true }) {
  if (category === 'Safer') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Safer Option</span>
        {showScore && score && <span className="opacity-75">({score}%)</span>}
      </span>
    );
  }

  if (category === 'Match') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
        <Target className="w-3.5 h-3.5 text-blue-600" />
        <span>Match Option</span>
        {showScore && score && <span className="opacity-75">({score}%)</span>}
      </span>
    );
  }

  if (category === 'Reach') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>Reach Option</span>
        {showScore && score && <span className="opacity-75">({score}%)</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
      <XCircle className="w-3.5 h-3.5 text-slate-500" />
      <span>{category || 'Standard'}</span>
    </span>
  );
}
