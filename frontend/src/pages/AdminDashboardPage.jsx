import React, { useState, useEffect } from 'react';
import { adminAPI, collegeAPI } from '../services/api';
import {
  ShieldCheck,
  Building,
  Users,
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  Search,
  Check,
  X,
  ExternalLink,
  IndianRupee,
  Award,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('colleges'); // colleges, students
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New College Modal
  const [showModal, setShowModal] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: '',
    code: '',
    type: 'Autonomous Private',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    website: 'https://',
    nirfRank: 'Rank 151-200 Band',
    naacGrade: 'A+',
    tuitionFeePerYear: 70000,
    hostelFeePerYear: 60000,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, collegesRes, studentsRes] = await Promise.all([
        adminAPI.getStats(),
        collegeAPI.getAll(),
        adminAPI.getAllStudents(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (collegesRes.data.success) setColleges(collegesRes.data.colleges);
      if (studentsRes.data.success) setStudents(studentsRes.data.students);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCollege = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove associated criteria and fee records.`)) {
      try {
        await collegeAPI.delete(id);
        setColleges((prev) => prev.filter((c) => c._id !== id));
        alert('College deleted successfully.');
      } catch (err) {
        alert('Failed to delete college.');
      }
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newCollege.name,
        code: newCollege.code,
        type: newCollege.type,
        city: newCollege.city,
        district: newCollege.district,
        state: newCollege.state,
        website: newCollege.website,
        nirfRank: newCollege.nirfRank,
        naacGrade: newCollege.naacGrade,
        feeDetails: {
          tuitionFeePerYear: Number(newCollege.tuitionFeePerYear),
          hostelFeePerYear: Number(newCollege.hostelFeePerYear),
          messFeePerYear: 35000,
          otherFeePerYear: 10000,
        },
      };

      await collegeAPI.create(payload);
      setShowModal(false);
      fetchData();
      alert('College successfully added!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create college record.');
    }
  };

  const filteredColleges = colleges.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Institutional Administration Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            System Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage colleges, admission cutoffs, fee datasets, and verified student applications.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New College</span>
        </button>
      </div>

      {/* Top Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Colleges</span>
              <Building className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.collegesCount}</div>
            <span className="text-[11px] text-slate-400">Andhra Pradesh network</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Student Profiles</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-700 mt-1">{stats.studentsCount}</div>
            <span className="text-[11px] text-slate-400">Active applicants</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Applications</span>
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.applicationsCount}</div>
            <span className="text-[11px] text-slate-400">Shortlisted / Web options</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Branches Seeded</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-700 mt-1">{stats.coursesCount}</div>
            <span className="text-[11px] text-slate-400">Engineering courses</span>
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('colleges')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
            activeTab === 'colleges'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Colleges & Fees ({colleges.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
            activeTab === 'students'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Registered Students ({students.length})
        </button>
      </div>

      {/* Colleges Management Tab */}
      {activeTab === 'colleges' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search college by code, name, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredColleges.length} colleges
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-3 px-6">Code</th>
                  <th className="py-3 px-4">College Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">NAAC / NIRF</th>
                  <th className="py-3 px-4">Tuition Fee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredColleges.map((col) => (
                  <tr key={col._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-brand-700">{col.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 max-w-xs truncate">{col.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{col.type}</td>
                    <td className="py-3.5 px-4 text-slate-600">{col.city}, {col.district}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-brand-700">NAAC {col.naacGrade}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{col.feeDetails?.tuitionFeePerYear?.toLocaleString() || '70,000'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCollege(col._id, col.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete college"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Students Directory Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Exam & Rank</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Preferred Course</th>
                  <th className="py-3 px-4">Annual Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-800">{st.userId?.name || 'Student'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{st.userId?.email || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">
                      {st.entranceExamName}: {st.entranceExamRank?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{st.category}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{st.preferredCourse}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">₹{st.annualBudget?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add College Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
                <Building className="w-5 h-5 text-brand-600" />
                <span>Add College Record</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollege} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">College Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCollege.name}
                  onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                  placeholder="e.g. Sri Venkateswara Engineering College"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Counselling Code *</label>
                  <input
                    type="text"
                    required
                    value={newCollege.code}
                    onChange={(e) => setNewCollege({ ...newCollege, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SVEC"
                    className="w-full px-3 py-2 border rounded-xl uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Institution Type</label>
                  <select
                    value={newCollege.type}
                    onChange={(e) => setNewCollege({ ...newCollege, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Autonomous Private">Autonomous Private</option>
                    <option value="State University / Govt">State University / Govt</option>
                    <option value="Deemed University">Deemed University</option>
                    <option value="Private Affiliated">Private Affiliated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCollege.city}
                    onChange={(e) => setNewCollege({ ...newCollege, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={newCollege.district}
                    onChange={(e) => setNewCollege({ ...newCollege, district: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Annual Tuition Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCollege.tuitionFeePerYear}
                    onChange={(e) => setNewCollege({ ...newCollege, tuitionFeePerYear: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-brand-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Hostel Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCollege.hostelFeePerYear}
                    onChange={(e) => setNewCollege({ ...newCollege, hostelFeePerYear: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
