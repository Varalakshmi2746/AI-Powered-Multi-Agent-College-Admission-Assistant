import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import {
  User,
  GraduationCap,
  Award,
  Target,
  IndianRupee,
  Home,
  MapPin,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function StudentProfilePage() {
  const { studentProfile, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    intermediateMarks: 85,
    entranceExamName: 'AP EAPCET',
    entranceExamRank: 8500,
    category: 'OC',
    preferredCourse: 'Computer Science and Engineering',
    preferredState: 'Andhra Pradesh',
    preferredCity: 'All / Any',
    annualBudget: 180000,
    hostelRequired: true,
    targetDistrict: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (studentProfile) {
      setFormData({
        intermediateMarks: studentProfile.intermediateMarks ?? 85,
        entranceExamName: studentProfile.entranceExamName || 'AP EAPCET',
        entranceExamRank: studentProfile.entranceExamRank ?? 8500,
        category: studentProfile.category || 'OC',
        preferredCourse: studentProfile.preferredCourse || 'Computer Science and Engineering',
        preferredState: studentProfile.preferredState || 'Andhra Pradesh',
        preferredCity: studentProfile.preferredCity || 'All / Any',
        annualBudget: studentProfile.annualBudget ?? 180000,
        hostelRequired: studentProfile.hostelRequired ?? true,
        targetDistrict: studentProfile.targetDistrict || '',
      });
    }
  }, [studentProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await studentAPI.updateProfile(formData);
      await refreshProfile();
      setSuccessMsg('Academic profile updated successfully! AI agents will use these criteria.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update student profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <User className="w-6 h-6 text-brand-600" />
            <span>Student Academic Profile</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Provide your scores and preferences to calibrate the 6 multi-agent recommendations.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
        {/* Section 1: Academic Scores */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm uppercase tracking-wider pb-2 border-b border-slate-100">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Performance & Entrance Examination</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Intermediate / Class 12 Marks (%) *
              </label>
              <input
                type="number"
                name="intermediateMarks"
                min="0"
                max="100"
                step="0.1"
                required
                value={formData.intermediateMarks}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Min 45% required for AP counselling</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Entrance Examination *
              </label>
              <select
                name="entranceExamName"
                value={formData.entranceExamName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="AP EAPCET">AP EAPCET (Engineering)</option>
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="Management / Other">Management / NRI Quota</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                All-India / State Rank *
              </label>
              <input
                type="number"
                name="entranceExamRank"
                min="1"
                required
                value={formData.entranceExamRank}
                onChange={handleChange}
                placeholder="e.g. 8500"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reservation Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="OC">Open Competition (OC / General)</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
                <option value="BCA">Backward Class - A (BC-A)</option>
                <option value="BCB">Backward Class - B (BC-B)</option>
                <option value="BCC">Backward Class - C (BC-C)</option>
                <option value="BCD">Backward Class - D (BC-D)</option>
                <option value="BCE">Backward Class - E (BC-E)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">Used by Eligibility Agent for category cutoffs</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Engineering Branch *
              </label>
              <select
                name="preferredCourse"
                value={formData.preferredCourse}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering (CSE)</option>
                <option value="Artificial Intelligence and Data Science">AI & Data Science (AI&DS)</option>
                <option value="Artificial Intelligence and Machine Learning">AI & Machine Learning (AIML)</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Electronics and Communication Engineering">Electronics & Communication (ECE)</option>
                <option value="Electrical and Electronics Engineering">Electrical & Electronics (EEE)</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Budget Preferences */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm uppercase tracking-wider pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4" />
            <span>Location & Financial Budget Preferences</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target State
              </label>
              <input
                type="text"
                name="preferredState"
                readOnly
                value={formData.preferredState}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred City / Region
              </label>
              <select
                name="preferredCity"
                value={formData.preferredCity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="All / Any">All Cities in Andhra Pradesh</option>
                <option value="Visakhapatnam">Visakhapatnam (AU Region)</option>
                <option value="Vijayawada">Vijayawada (Krishna / NTR)</option>
                <option value="Guntur">Guntur (Guntur District)</option>
                <option value="Tirupati">Tirupati (SVU Region)</option>
                <option value="Kakinada">Kakinada (Godavari Region)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target District (Optional)
              </label>
              <input
                type="text"
                name="targetDistrict"
                value={formData.targetDistrict}
                onChange={handleChange}
                placeholder="e.g. Visakhapatnam, NTR, Chittoor"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Annual Total Budget (₹ INR) *
              </label>
              <div className="relative">
                <IndianRupee className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  name="annualBudget"
                  min="30000"
                  step="5000"
                  required
                  value={formData.annualBudget}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Includes estimated tuition, hostel, and food expenses per academic year
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  name="hostelRequired"
                  checked={formData.hostelRequired}
                  onChange={handleChange}
                  className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-800 flex items-center">
                    <Home className="w-4 h-4 mr-1 text-brand-600" />
                    Hostel & Accommodation Required
                  </span>
                  <span className="text-xs text-slate-500 block">
                    When enabled, Fee Analysis Agent adds hostel & mess estimates
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-md shadow-brand-500/20 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Academic Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
