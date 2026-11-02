import React, { useState, useEffect } from 'react';
import { eligibilityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EligibilityBadge from '../components/EligibilityBadge';
import {
  Target,
  GraduationCap,
  Award,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export default function EligibilityCheckerPage() {
  const { studentProfile } = useAuth();

  const [rank, setRank] = useState(studentProfile?.entranceExamRank || 8500);
  const [marks, setMarks] = useState(studentProfile?.intermediateMarks || 85);
  const [category, setCategory] = useState(studentProfile?.category || 'OC');
  const [course, setCourse] = useState(studentProfile?.preferredCourse || 'Computer Science and Engineering');

  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await eligibilityAPI.check({
        rank: Number(rank),
        intermediateMarks: Number(marks),
        category,
        course,
      });
      if (res.data.success) {
        setResults(res.data.results || []);
        setSummary(res.data.summary || null);
      }
    } catch (err) {
      console.error('Failed to run eligibility check:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-600">
          <Target className="w-4 h-4" />
          <span>Agent 2: Admission Eligibility Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Admission Eligibility Checker
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Objective cutoff analysis across Andhra Pradesh engineering colleges based on previous AP EAPCET counselling benchmarks.
        </p>
      </div>

      {/* Mandatory Statutory Non-Guarantee Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Official Counselling Notice & Non-Guarantee Disclaimer:</span>
          <p className="leading-relaxed">
            Historical cutoff ranks serve exclusively as comparative benchmarks. Admission in Andhra Pradesh engineering colleges depends on annual candidate seat matrices, category reservations (OC, BC-A/B/C/D/E, SC, ST, EWS), local area quotas (AU/SVU region), and web choices frozen by candidates. <strong>Admission is never guaranteed.</strong>
          </p>
        </div>
      </div>

      {/* Input Simulator Panel */}
      <form onSubmit={runCheck} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
          <Info className="w-4 h-4 text-brand-600" />
          <span>Simulate Rank & Academic Scores</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              AP EAPCET Rank
            </label>
            <input
              type="number"
              min="1"
              required
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Intermediate (%) Marks
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reservation Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold bg-white"
            >
              <option value="OC">Open Competition (OC)</option>
              <option value="BCA">BC-A Category</option>
              <option value="BCB">BC-B Category</option>
              <option value="BCC">BC-C Category</option>
              <option value="BCD">BC-D Category</option>
              <option value="BCE">BC-E Category</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="ST">Scheduled Tribe (ST)</option>
              <option value="EWS">EWS Quota</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Engineering Branch
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold bg-white"
            >
              <option value="Computer Science and Engineering">Computer Science (CSE)</option>
              <option value="Artificial Intelligence and Data Science">AI & Data Science (AI&DS)</option>
              <option value="Artificial Intelligence and Machine Learning">AI & Machine Learning (AIML)</option>
              <option value="Information Technology">Information Technology (IT)</option>
              <option value="Electronics and Communication Engineering">Electronics & Communication (ECE)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5"
          >
            <span>{loading ? 'Analyzing Criteria...' : 'Evaluate Eligibility'}</span>
          </button>
        </div>
      </form>

      {/* Summary Scorecard */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200/80 p-5 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {summary.saferCount}
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950">Safer Institutions</div>
              <div className="text-xs text-emerald-800">Your rank significantly exceeds cutoff</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200/80 p-5 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {summary.matchCount}
            </div>
            <div>
              <div className="text-sm font-bold text-blue-950">Match Institutions</div>
              <div className="text-xs text-blue-800">Rank falls within competitive cutoff range</div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 p-5 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {summary.reachCount}
            </div>
            <div>
              <div className="text-sm font-bold text-amber-950">Reach Aspirational</div>
              <div className="text-xs text-amber-800">Target for sliding / later rounds</div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analysis Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Detailed Institutional Eligibility Breakdown</h3>
          <span className="text-xs text-slate-400 font-medium">{results.length} colleges assessed</span>
        </div>

        <div className="divide-y divide-slate-100">
          {results.map((item, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50/70 transition space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                      {item.collegeCode}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{item.collegeName}</h4>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.city}, {item.district} • Branch: <strong className="text-slate-700">{item.branch}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <EligibilityBadge category={item.statusCategory} score={item.probabilityScore} />
                </div>
              </div>

              {/* Explanation box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Eligibility Agent Explanation: </span>
                  <span>{item.explanation}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 pt-1">
                <div>
                  <span className="text-slate-400">Benchmark Cutoff:</span>{' '}
                  <span className="font-bold text-slate-800">{item.categoryCutoff?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400">Your Rank:</span>{' '}
                  <span className="font-bold text-slate-800">{item.studentRank?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400">Category:</span>{' '}
                  <span className="font-bold text-slate-800">{item.studentCategory}</span>
                </div>
                <div>
                  <span className="text-slate-400">NAAC Grade:</span>{' '}
                  <span className="font-bold text-brand-700">{item.naacGrade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
