import React, { useState, useEffect } from 'react';
import { feeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  IndianRupee,
  Home,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  TrendingDown,
  Building,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function FeeAnalysisPage() {
  const { studentProfile } = useAuth();
  const [budget, setBudget] = useState(studentProfile?.annualBudget || 180000);
  const [hostelRequired, setHostelRequired] = useState(
    studentProfile?.hostelRequired !== undefined ? studentProfile.hostelRequired : true
  );

  const [colleges, setColleges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFeeAnalysis = async () => {
    setLoading(true);
    try {
      const res = await feeAPI.analyze({
        annualBudget: budget,
        hostelRequired,
      });
      if (res.data.success) {
        setColleges(res.data.colleges || []);
        setStats(res.data.stats || null);
      }
    } catch (err) {
      console.error('Failed to analyze fees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeAnalysis();
  }, [budget, hostelRequired]);

  // Chart data: Top 6 colleges for comparison
  const barChartData = colleges.slice(0, 7).map((c) => ({
    name: c.collegeCode || c.collegeName.slice(0, 10),
    tuition: c.tuitionFee,
    hostel: c.hostelRent + c.messFee,
    other: c.otherExpenses,
    total: c.totalAnnualCost,
    budget: budget,
  }));

  // Average breakdown across all colleges
  const avgTuition = Math.round(colleges.reduce((a, b) => a + b.tuitionFee, 0) / (colleges.length || 1));
  const avgHostel = Math.round(colleges.reduce((a, b) => a + b.hostelRent + b.messFee, 0) / (colleges.length || 1));
  const avgOther = Math.round(colleges.reduce((a, b) => a + b.otherExpenses, 0) / (colleges.length || 1));

  const pieData = [
    { name: 'Tuition Fee', value: avgTuition, color: '#4f46e5' },
    { name: 'Hostel & Food', value: avgHostel, color: '#9333ea' },
    { name: 'Misc & Books', value: avgOther, color: '#10b981' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-600">
          <IndianRupee className="w-4 h-4" />
          <span>Agent 3: Fee Analysis Agent</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Fee & Financial Budget Analysis
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Evaluate annual educational expenditure, room & board expenses, and state scholarship viability.
        </p>
      </div>

      {/* AP Government JVD Scheme Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-widest text-brand-200">
            Andhra Pradesh Welfare Scheme
          </span>
          <h3 className="font-bold text-lg text-white">Jagananna Vidya Deevena (JVD) Full Tuition Reimbursement</h3>
          <p className="text-xs text-brand-100 max-w-2xl leading-relaxed">
            Students securing convener quota seats with valid household income or white ration cards receive 100% tuition reimbursement directly through government welfare portals.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold shrink-0">
          State Subsidized Quota
        </div>
      </div>

      {/* Interactive Budget Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Annual Budget</span>
            <div className="text-2xl font-extrabold text-slate-900">
              ₹{Number(budget).toLocaleString()} / year
            </div>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition">
            <input
              type="checkbox"
              checked={hostelRequired}
              onChange={(e) => setHostelRequired(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
            />
            <span className="text-xs font-bold text-slate-700 flex items-center">
              <Home className="w-4 h-4 mr-1 text-brand-600" />
              Include Hostel & Mess Rent
            </span>
          </label>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 font-medium mb-1">
            <span>₹40,000 (Govt Subsidized)</span>
            <span>Adjust Target Budget</span>
            <span>₹4,50,000 (Deemed Univ)</span>
          </div>
          <input
            type="range"
            min="40000"
            max="450000"
            step="10000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>
      </div>

      {/* Stats Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Within Budget</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {stats.affordableCount} Colleges
            </div>
            <span className="text-[11px] text-slate-500">100% affordable</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Over Budget</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {stats.overBudgetCount} Colleges
            </div>
            <span className="text-[11px] text-slate-500">Requires loan/aid</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Min Annual Cost</span>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">
              ₹{stats.minAnnualCost.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">AUCE / JNTUK Govt</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Avg Annual Cost</span>
            <div className="text-2xl font-extrabold text-brand-700 mt-1">
              ₹{stats.avgAnnualCost.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">Across AP colleges</span>
          </div>
        </div>
      )}

      {/* Visual Charts Grid with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Annual Cost vs. Student Budget</h3>
            <p className="text-xs text-slate-500">Side-by-side component expenditure for major AP institutions</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => `₹${val.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="tuition" name="Tuition Fee" fill="#4f46e5" stackId="a" />
                <Bar dataKey="hostel" name="Hostel & Food" fill="#9333ea" stackId="a" />
                <Bar dataKey="other" name="Other Fees" fill="#10b981" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Expense Breakdown</h3>
            <p className="text-xs text-slate-500 mb-2">Average allocation of education budget</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={38}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </span>
                  <span className="font-bold text-slate-800">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* College Fee Comparison Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Complete Institutional Fee Details</h3>
          <span className="text-xs text-slate-400 font-medium">Ranked by lowest total annual expense</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3 px-6">College</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Tuition/Year</th>
                <th className="py-3 px-4">Hostel & Mess</th>
                <th className="py-3 px-4">Total Annual</th>
                <th className="py-3 px-4">Budget Variance</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {colleges.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-6 font-semibold text-slate-800">
                    <div className="font-bold text-slate-900">{c.collegeName}</div>
                    <div className="text-[11px] text-slate-400">{c.city}, {c.district}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.type}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{c.tuitionFee.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    ₹{(c.hostelRent + c.messFee).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-brand-700 text-sm">
                    ₹{c.totalAnnualCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.variance >= 0 ? (
                      <span className="text-emerald-700 font-bold">
                        +₹{c.variance.toLocaleString()} under
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold">
                        -₹{Math.abs(c.variance).toLocaleString()} over
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        c.isAffordable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.budgetStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
