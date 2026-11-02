import React, { useState } from 'react';
import { useColleges } from '../context/CollegeContext';
import { useAuth } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import EligibilityBadge from './EligibilityBadge';
import {
  MapPin,
  Award,
  IndianRupee,
  Briefcase,
  Check,
  Plus,
  Bookmark,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function CollegeCard({ college, recommendationData = null }) {
  const { selectedForCompare, toggleCompare } = useColleges();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);

  const collegeId = college._id || college.id || college.collegeId;
  const isCompared = selectedForCompare.includes(collegeId);

  // Extract fee details safely
  const tuitionFee =
    college.tuitionFee ||
    college.feeDetails?.tuitionFeePerYear ||
    recommendationData?.tuitionFee ||
    70000;
  const totalAnnual =
    college.totalAnnualExpense ||
    college.feeDetails?.totalEstimatedAnnual ||
    recommendationData?.totalAnnualExpense ||
    180000;
  const avgPlacement =
    college.placementStats?.averagePackageLPA ||
    college.placementAvgLPA ||
    6.2;
  const highestPlacement =
    college.placementStats?.highestPackageLPA ||
    college.placementHighestLPA ||
    35.0;

  const handleShortlist = async () => {
    if (!user) {
      alert('Please sign in to shortlist this college into your dashboard applications!');
      return;
    }
    setShortlistLoading(true);
    try {
      await applicationAPI.applyOrShortlist({
        collegeId,
        branchName: recommendationData?.branch || 'Computer Science and Engineering',
        status: 'Saved / Draft',
        notes: 'Shortlisted from college recommendations.',
      });
      setShortlisted(true);
    } catch (err) {
      console.error('Failed to shortlist:', err);
    } finally {
      setShortlistLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image & Quick Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={
            college.imageUrl ||
            'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
          }
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm border border-white/20">
            {college.code || 'ENGG'}
          </span>

          {recommendationData?.category && (
            <EligibilityBadge
              category={recommendationData.category}
              score={recommendationData.confidenceScore}
            />
          )}
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center space-x-1.5 text-xs text-brand-200 font-medium mb-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {college.city}, {college.district}
            </span>
          </div>
          <h3 className="font-bold text-base line-clamp-1 leading-snug drop-shadow-sm">
            {college.name}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Accreditation & Type */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
            {college.type || 'Autonomous'}
          </span>
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded">
              <Award className="w-3 h-3 mr-1" />
              NAAC {college.naacGrade || 'A+'}
            </span>
            <span className="text-slate-400 font-medium">NIRF {college.nirfRank || 'Ranked'}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <div>
            <div className="text-slate-400 text-[11px] font-medium flex items-center">
              <IndianRupee className="w-3 h-3 mr-0.5 text-slate-500" />
              Est. Annual Expense
            </div>
            <div className="font-extrabold text-slate-800 text-sm mt-0.5">
              ₹{totalAnnual.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">Tuition: ₹{tuitionFee.toLocaleString()}/yr</div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px] font-medium flex items-center">
              <Briefcase className="w-3 h-3 mr-0.5 text-slate-500" />
              Placements (Avg / Max)
            </div>
            <div className="font-extrabold text-emerald-600 text-sm mt-0.5">
              {avgPlacement} LPA
            </div>
            <div className="text-[10px] text-slate-500">Highest: {highestPlacement} LPA</div>
          </div>
        </div>

        {/* AI Agent Reasoning snippet if provided */}
        {recommendationData?.reasons && recommendationData.reasons.length > 0 && (
          <div className="bg-brand-50/60 p-2.5 rounded-lg border border-brand-100/70 text-xs text-brand-900">
            <span className="font-bold text-brand-800">Agent Insight: </span>
            <span>{recommendationData.reasons[0]}</span>
          </div>
        )}

        {/* Expanded Facilities & Details */}
        {expanded && (
          <div className="pt-2 border-t border-slate-100 text-xs space-y-2 animate-fadeIn">
            <div>
              <span className="font-bold text-slate-700">Campus Facilities:</span>
              <ul className="mt-1 list-disc list-inside text-slate-600 space-y-0.5">
                {(college.facilities || []).slice(0, 4).map((fac, i) => (
                  <li key={i}>{fac}</li>
                ))}
              </ul>
            </div>
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-brand-600 hover:text-brand-800 font-semibold"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => toggleCompare(collegeId)}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition ${
              isCompared
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isCompared ? <Check className="w-3.5 h-3.5 mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          <button
            onClick={handleShortlist}
            disabled={shortlisted || shortlistLoading}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition ${
              shortlisted
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
            title={expanded ? 'Collapse' : 'More info'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
