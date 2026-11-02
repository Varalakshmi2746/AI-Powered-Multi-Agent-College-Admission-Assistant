import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, aiAPI } from '../services/api';
import CollegeCard from '../components/CollegeCard';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Sparkles,
  GraduationCap,
  Target,
  IndianRupee,
  Bot,
  Scale,
  Compass,
  ArrowRight,
  BookmarkCheck,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, studentProfile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [appRes, recRes] = await Promise.all([
          applicationAPI.getMyApplications(),
          aiAPI.getRecommendations({}),
        ]);

        if (appRes.data.success) {
          setApplications(appRes.data.applications);
        }
        if (recRes.data.success) {
          setRecommendations(recRes.data.recommendations || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Prepare chart data for applications status
  const statusCounts = {};
  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  const pieData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));
  const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-accent-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-brand-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>Multi-Agent Admission Command Center</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-brand-100 text-sm max-w-xl leading-relaxed">
              Your academic profile is synced with the 6 specialized AI agents.
              Track your college shortlists, review eligibility cutoffs, and explore AP EAPCET counselling options below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition"
            >
              Edit Profile
            </Link>
            <Link
              to="/recommendations"
              className="px-5 py-2.5 rounded-xl bg-white text-brand-900 hover:bg-brand-50 font-bold text-xs shadow-md transition"
            >
              Run AI Recommendations
            </Link>
          </div>
        </div>
      </div>

      {/* Academic Highlights Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Intermediate Marks</span>
            <GraduationCap className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {studentProfile?.intermediateMarks || 85}%
          </div>
          <div className="text-[11px] text-slate-400">Class 12 Board Percentage</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Entrance Exam Rank</span>
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700">
            {studentProfile?.entranceExamRank?.toLocaleString() || '8,500'}
          </div>
          <div className="text-[11px] text-slate-400">{studentProfile?.entranceExamName || 'AP EAPCET'} ({studentProfile?.category || 'OC'})</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Preferred Branch</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 truncate">
            {studentProfile?.preferredCourse?.replace('Engineering', 'Engg') || 'Computer Science'}
          </div>
          <div className="text-[11px] text-slate-400">{studentProfile?.preferredCity || 'Andhra Pradesh'}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Annual Budget</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            ₹{(studentProfile?.annualBudget || 180000).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Hostel {studentProfile?.hostelRequired ? 'Included' : 'Not Required'}</div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/recommendations"
          className="p-4 bg-white hover:bg-brand-50 border border-slate-200/80 rounded-2xl text-left transition group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-800">Recommendations</div>
          <div className="text-xs text-slate-500 mt-1">Multi-agent evaluated colleges</div>
        </Link>

        <Link
          to="/eligibility"
          className="p-4 bg-white hover:bg-purple-50 border border-slate-200/80 rounded-2xl text-left transition group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Target className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-800">Eligibility Checker</div>
          <div className="text-xs text-slate-500 mt-1">Reach, Match & Safer tiers</div>
        </Link>

        <Link
          to="/fees"
          className="p-4 bg-white hover:bg-emerald-50 border border-slate-200/80 rounded-2xl text-left transition group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-800">Fee Analysis</div>
          <div className="text-xs text-slate-500 mt-1">Tuition, hostel & JVD aid</div>
        </Link>

        <Link
          to="/chatbot"
          className="p-4 bg-white hover:bg-pink-50 border border-slate-200/80 rounded-2xl text-left transition group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Bot className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-800">AI Coordinator Chat</div>
          <div className="text-xs text-slate-500 mt-1">Ask any admission query</div>
        </Link>
      </div>

      {/* Applications & Shortlists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BookmarkCheck className="w-5 h-5 text-brand-600" />
                <span>My Application Tracker ({applications.length})</span>
              </h2>
              <p className="text-xs text-slate-500">Shortlisted colleges for AP Web Counselling</p>
            </div>
            <Link to="/recommendations" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              + Add More
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm">No colleges shortlisted yet.</p>
              <Link
                to="/recommendations"
                className="inline-block text-xs font-bold text-brand-600 hover:underline"
              >
                Browse Recommended Colleges
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {app.counsellingPhase || 'Phase 1'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                      {app.collegeId?.name || 'Selected College'}
                    </h4>
                    <div className="text-xs text-slate-500">
                      Branch: <span className="font-semibold">{app.branchName}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200">
                      {app.status}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {app.applicationNumber}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Distribution Visual */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Application Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Pipeline across admission lifecycle</p>

            {pieData.length > 0 ? (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={40}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                Shortlist colleges to view status charts
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Web Options Deadline:</span>
              <span className="font-semibold text-slate-700">Upcoming AP Round</span>
            </div>
            <div className="flex justify-between">
              <span>Verification Status:</span>
              <span className="font-semibold text-emerald-600">Online HLC Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top AI Recommendations Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span>Top AI Recommended Colleges for You</span>
            </h2>
            <p className="text-xs text-slate-500">
              Filtered for AP EAPCET Rank {studentProfile?.entranceExamRank?.toLocaleString() || '8,500'} and {studentProfile?.preferredCourse || 'Computer Science'}
            </p>
          </div>
          <Link
            to="/recommendations"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>View All Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto" />
            <span className="text-xs text-slate-400 mt-2 block">Running multi-agent synthesis...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((rec, i) => (
              <CollegeCard key={i} college={rec} recommendationData={rec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
