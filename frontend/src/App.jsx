import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CollegeProvider } from './context/CollegeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentDashboard from './pages/StudentDashboard';
import RecommendationsPage from './pages/RecommendationsPage';
import EligibilityCheckerPage from './pages/EligibilityCheckerPage';
import FeeAnalysisPage from './pages/FeeAnalysisPage';
import CollegeComparisonPage from './pages/CollegeComparisonPage';
import ChatbotPage from './pages/ChatbotPage';
import AdmissionGuidancePage from './pages/AdmissionGuidancePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CollegeProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/eligibility" element={<EligibilityCheckerPage />} />
                <Route path="/fees" element={<FeeAnalysisPage />} />
                <Route path="/compare" element={<CollegeComparisonPage />} />
                <Route path="/guidance" element={<AdmissionGuidancePage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />

                {/* Protected Student Pages */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <StudentProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Page */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CollegeProvider>
      </AuthProvider>
    </Router>
  );
}
