import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useColleges } from '../context/CollegeContext';
import {
  GraduationCap,
  Sparkles,
  Bot,
  Scale,
  Compass,
  CheckCircle,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { selectedForCompare } = useColleges();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Eligibility', path: '/eligibility', icon: CheckCircle },
    { name: 'Fee Analysis', path: '/fees', icon: IndianRupee },
    { name: 'Compare', path: '/compare', icon: Scale, badge: selectedForCompare.length },
    { name: 'Guidance', path: '/guidance', icon: Compass },
    { name: 'AI Chatbot', path: '/chatbot', icon: Bot, highlight: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-900 via-brand-700 to-accent-600 bg-clip-text text-transparent">
                  AdmissionAI
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 -mt-1">
                  Multi-Agent Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  } ${link.highlight ? 'text-accent-600 hover:text-accent-700 font-semibold' : ''}`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${link.highlight ? 'text-accent-500' : ''}`} />}
                  <span>{link.name}</span>
                  {link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-brand-600 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-brand-50 transition"
                >
                  {isAdmin ? <ShieldCheck className="w-4 h-4 text-purple-600" /> : <LayoutDashboard className="w-4 h-4 text-brand-600" />}
                  <span>{isAdmin ? 'Admin Portal' : 'My Dashboard'}</span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 px-4 py-2 rounded-lg shadow-sm shadow-brand-500/20 transition hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {link.icon && <link.icon className="w-5 h-5 text-brand-500" />}
                <span>{link.name}</span>
              </div>
              {link.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-brand-600 text-white rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-4 mt-2 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-brand-700 bg-brand-50 font-medium"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>{isAdmin ? 'Admin Portal' : 'My Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out ({user.name})</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
