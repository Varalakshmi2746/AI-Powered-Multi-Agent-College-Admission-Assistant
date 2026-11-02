import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldAlert, Cpu, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span>AdmissionAI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An intelligent, multi-agent platform orchestrating AI specialists for college discovery,
              eligibility analysis, fee transparency, and counselling roadmap assistance.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-xs text-brand-300 border border-slate-700">
              <Cpu className="w-3.5 h-3.5" />
              <span>Orchestrated with LangGraph & FastAPI</span>
            </div>
          </div>

          {/* Col 2: Specialized Agents */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Multi-Agent Team</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Agent 1: College Finder</li>
              <li>Agent 2: Admission Eligibility</li>
              <li>Agent 3: Fee Analysis</li>
              <li>Agent 4: College Comparison</li>
              <li>Agent 5: Admission Guidance</li>
              <li>Agent 6: Admission Coordinator</li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Portal Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/recommendations" className="hover:text-brand-400 transition">Recommendations</Link></li>
              <li><Link to="/eligibility" className="hover:text-brand-400 transition">Eligibility Checker</Link></li>
              <li><Link to="/fees" className="hover:text-brand-400 transition">Fee & Budget Analysis</Link></li>
              <li><Link to="/compare" className="hover:text-brand-400 transition">College Comparison</Link></li>
              <li><Link to="/guidance" className="hover:text-brand-400 transition">AP EAPCET Guidance</Link></li>
              <li><Link to="/chatbot" className="hover:text-brand-400 transition">Interactive AI Chatbot</Link></li>
            </ul>
          </div>

          {/* Col 4: Important Notice */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Academic Notice</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/80 p-3 rounded-lg border border-slate-700/80">
              Demonstration college datasets and AP EAPCET cutoff benchmarks are synthesized for educational simulation.
              Actual admissions depend on official APSCHE annual web counseling rounds and seat allotments. Admission is never guaranteed.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© 2026 AI-Powered Multi-Agent College Admission Assistant. Built for B.Tech Generative AI Capstone.</p>
          <p className="flex items-center space-x-1">
            <span>Engineered with React, Node.js, LangGraph & FastAPI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
