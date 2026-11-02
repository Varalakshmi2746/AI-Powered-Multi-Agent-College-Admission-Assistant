import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CollegeCard from '../components/CollegeCard';
import {
  Sparkles,
  Bot,
  Filter,
  Search,
  CheckCircle,
  ShieldCheck,
  Target,
  AlertTriangle,
  RotateCw,
  Cpu,
} from 'lucide-react';

export default function RecommendationsPage() {
  const { studentProfile } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [agentSummaries, setAgentSummaries] = useState(null);
  const [coordinatorVerdict, setCoordinatorVerdict] = useState('');
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState('All'); // All, Match, Safer, Reach
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.getRecommendations({});
      if (res.data.success) {
        setRecommendations(res.data.recommendations || []);
        setAgentSummaries(res.data.agentSummaries || null);
        setCoordinatorVerdict(res.data.coordinatorVerdict || '');
      }
    } catch (err) {
      console.error('Failed to fetch AI recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Filtered list
  const filtered = recommendations.filter((col) => {
    const matchesTab = activeTab === 'All' || col.category === activeTab;
    const matchesSearch =
      !searchQuery ||
      col.collegeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.district?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch =
      selectedBranch === 'All' ||
      col.branch?.toLowerCase().includes(selectedBranch.toLowerCase());

    return matchesTab && matchesSearch && matchesBranch;
  });

  const saferCount = recommendations.filter((r) => r.category === 'Safer').length;
  const matchCount = recommendations.filter((r) => r.category === 'Match').length;
  const reachCount = recommendations.filter((r) => r.category === 'Reach').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-600">
            <Cpu className="w-4 h-4" />
            <span>Multi-Agent LangGraph Synthesis</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Personalized College Recommendations
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Synchronized analysis for AP EAPCET Rank{' '}
            <strong className="text-slate-800 font-bold">
              {studentProfile?.entranceExamRank?.toLocaleString() || '8,500'}
            </strong>{' '}
            ({studentProfile?.category || 'OC'}) in{' '}
            <strong className="text-slate-800 font-bold">
              {studentProfile?.preferredCourse || 'Computer Science and Engineering'}
            </strong>
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* AI Coordinator Verdict Card */}
      {coordinatorVerdict && (
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-accent-300" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-accent-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Agent 6: Coordinator Verdict</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-100 font-medium">
                {coordinatorVerdict}
              </p>

              {/* Agent mini-summaries */}
              {agentSummaries && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 mt-3 border-t border-white/10 text-xs text-brand-100">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="font-bold text-white block mb-0.5">Finder Agent:</span>
                    <span className="line-clamp-2">{agentSummaries.finderAgent}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="font-bold text-white block mb-0.5">Eligibility Agent:</span>
                    <span className="line-clamp-2">{agentSummaries.eligibilityAgent}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="font-bold text-white block mb-0.5">Fee Analysis Agent:</span>
                    <span className="line-clamp-2">{agentSummaries.feeAgent}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Category Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Tier Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Options ({recommendations.length})
            </button>

            <button
              onClick={() => setActiveTab('Match')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'Match'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Match ({matchCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('Safer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'Safer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safer Safety ({saferCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('Reach')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                activeTab === 'Reach'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reach Aspirational ({reachCount})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filtered.length} of {recommendations.length} institutions
          </div>
        </div>

        {/* Search & Branch Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by college name, city (e.g. Visakhapatnam, Vijayawada)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="All">All Engineering Branches</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Data Science">Artificial Intelligence & Data Science</option>
              <option value="Machine Learning">AI & Machine Learning</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics & Communication</option>
            </select>
          </div>
        </div>
      </div>

      {/* College Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">Consulting Multi-Agent LangGraph System...</h3>
          <p className="text-xs text-slate-400">
            Agents are evaluating historical AP EAPCET cutoffs, tuition fees, and campus amenities.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Target className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">No matching colleges for these filters</h3>
          <p className="text-xs text-slate-500">
            Try switching category tabs or clearing your search keywords.
          </p>
          <button
            onClick={() => {
              setActiveTab('All');
              setSearchQuery('');
              setSelectedBranch('All');
            }}
            className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-100 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, index) => (
            <CollegeCard key={index} college={item} recommendationData={item} />
          ))}
        </div>
      )}
    </div>
  );
}
