import React, { useState, useEffect } from 'react';
import { comparisonAPI, collegeAPI } from '../services/api';
import { useColleges } from '../context/CollegeContext';
import {
  Scale,
  Award,
  IndianRupee,
  Briefcase,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function CollegeComparisonPage() {
  const { selectedForCompare, toggleCompare, clearCompare, colleges: allColleges } = useColleges();
  const [comparedData, setComparedData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState('');

  const fetchComparison = async () => {
    if (selectedForCompare.length < 2) {
      setComparedData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await comparisonAPI.compare(selectedForCompare);
      if (res.data.success) {
        setComparedData(res.data.colleges || []);
        setSummary(res.data.comparisonSummary || null);
      }
    } catch (err) {
      console.error('Failed to compare colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If fewer than 2 colleges are selected initially, auto-select AUCE and VRSEC for demo
    if (selectedForCompare.length < 2 && allColleges.length >= 2) {
      toggleCompare(allColleges[0]._id);
      toggleCompare(allColleges[3]._id);
    }
  }, [allColleges]);

  useEffect(() => {
    fetchComparison();
  }, [selectedForCompare]);

  const handleAddCollege = (e) => {
    e.preventDefault();
    if (selectedToAdd) {
      toggleCompare(selectedToAdd);
      setSelectedToAdd('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-600">
            <Scale className="w-4 h-4" />
            <span>Agent 4: College Comparison Agent</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Side-by-Side College Comparison
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze institutional strengths, placements, expenditure, and trade-offs.
          </p>
        </div>

        {selectedForCompare.length > 0 && (
          <button
            onClick={clearCompare}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl flex items-center space-x-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {/* College Add Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Add College ({selectedForCompare.length}/4 selected):
        </span>
        <select
          value={selectedToAdd}
          onChange={(e) => setSelectedToAdd(e.target.value)}
          className="flex-1 max-w-sm px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="">Select an Andhra Pradesh college to add...</option>
          {allColleges.map((c) => (
            <option
              key={c._id}
              value={c._id}
              disabled={selectedForCompare.includes(c._id)}
            >
              {c.name} ({c.code})
            </option>
          ))}
        </select>
        <button
          onClick={handleAddCollege}
          disabled={!selectedToAdd}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* AI Comparison Summary Card */}
      {summary && (
        <div className="bg-gradient-to-r from-brand-900 to-indigo-900 rounded-3xl p-6 text-white shadow-md space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-accent-300">
            <Sparkles className="w-4 h-4" />
            <span>AI Comparison Verdict & Strategic Advice</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-bold text-brand-200 block">Most Budget Friendly:</span>
              <span className="text-white font-semibold text-sm">{summary.mostBudgetFriendly}</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-bold text-brand-200 block">Highest Placement Packages:</span>
              <span className="text-white font-semibold text-sm">{summary.highestAvgPlacement}</span>
            </div>
          </div>
          <p className="text-xs text-brand-100 leading-relaxed pt-1">
            {summary.recommendationTip}
          </p>
        </div>
      )}

      {/* Comparison Matrix Table */}
      {selectedForCompare.length < 2 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Scale className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">Select at least 2 colleges to compare</h3>
          <p className="text-xs text-slate-500">
            Use the dropdown selector above or click "Compare" on any college card.
          </p>
        </div>
      ) : loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto" />
          <span className="text-xs text-slate-400">Synthesizing institutional metrics...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-slate-400 w-48">
                    Parameters
                  </th>
                  {comparedData.map((col) => (
                    <th key={col.id} className="py-4 px-6 font-bold text-slate-900 min-w-[240px]">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-brand-900">{col.code}</span>
                        <button
                          onClick={() => toggleCompare(col.id)}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-xs text-slate-700 mt-0.5 line-clamp-1">{col.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{col.city}, {col.district}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* Institution Type */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-bold text-slate-500">Institution Type</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6 text-slate-700 font-medium">
                      {col.type}
                    </td>
                  ))}
                </tr>

                {/* Accreditation & NIRF */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-bold text-slate-500">Accreditation</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded font-bold bg-brand-50 text-brand-700">
                          NAAC {col.naacGrade}
                        </span>
                        <div className="text-[11px] text-slate-400 font-medium">{col.nirfRank}</div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Placements */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-bold text-slate-500">Placement Record</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6">
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-emerald-600 text-sm">
                          {col.placementStats?.averagePackageLPA} LPA (Avg)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Highest: {col.placementStats?.highestPackageLPA} LPA
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Fees */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-bold text-slate-500">Annual Tuition Fee</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6 font-extrabold text-slate-900 text-sm">
                      ₹{col.fee.tuition?.toLocaleString()} / yr
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-bold text-slate-500">Hostel & Living</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6 text-slate-700">
                      ₹{(col.fee.hostel + col.fee.mess)?.toLocaleString()} / yr
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50/50 bg-brand-50/20">
                  <td className="py-3 px-6 font-extrabold text-brand-900">Total Annual Expense</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6 font-extrabold text-brand-700 text-base">
                      ₹{col.fee.totalAnnual?.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Historical CSE Cutoff */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-bold text-slate-500">CSE Benchmark Cutoff</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6 font-mono font-bold text-slate-800">
                      ~{col.cutoffCSE?.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Advantages / Pros */}
                <tr className="hover:bg-slate-50/50 align-top">
                  <td className="py-3 px-6 font-bold text-slate-500">Advantages (Pros)</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6 space-y-1.5">
                      {col.pros?.map((p, i) => (
                        <div key={i} className="flex items-start space-x-1.5 text-[11px] text-emerald-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>

                {/* Considerations / Cons */}
                <tr className="hover:bg-slate-50/50 align-top">
                  <td className="py-3 px-6 font-bold text-slate-500">Considerations (Cons)</td>
                  {comparedData.map((col) => (
                    <td key={col.id} className="py-3 px-6 space-y-1.5">
                      {col.cons?.map((c, i) => (
                        <div key={i} className="flex items-start space-x-1.5 text-[11px] text-amber-800 font-medium">
                          <XCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
