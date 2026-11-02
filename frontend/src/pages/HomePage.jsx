import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  GraduationCap,
  ShieldCheck,
  Target,
  IndianRupee,
  Scale,
  Compass,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  const agents = [
    {
      num: 'Agent 1',
      title: 'College Finder Agent',
      desc: 'Discovers verified colleges across Andhra Pradesh filtered by preferred branch, district, and campus amenities.',
      icon: Layers,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      num: 'Agent 2',
      title: 'Admission Eligibility Agent',
      desc: 'Evaluates AP EAPCET and JEE ranks against historical cutoffs to categorize options into Reach, Match, and Safer.',
      icon: Target,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      num: 'Agent 3',
      title: 'Fee Analysis Agent',
      desc: 'Breakdowns tuition, hostel, and living expenses against your annual budget and identifies AP JVD scholarship eligibility.',
      icon: IndianRupee,
      color: 'from-purple-600 to-pink-600',
    },
    {
      num: 'Agent 4',
      title: 'College Comparison Agent',
      desc: 'Generates objective side-by-side matrices comparing NIRF rankings, NAAC grades, placements, and pros & cons.',
      icon: Scale,
      color: 'from-amber-500 to-orange-600',
    },
    {
      num: 'Agent 5',
      title: 'Admission Guidance Agent',
      desc: 'Guides candidates through APSCHE web options, certificate verification at Help Line Centers, and admission deadlines.',
      icon: Compass,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      num: 'Agent 6',
      title: 'AI Admission Coordinator',
      desc: 'Orchestrates the specialist agents via LangGraph and synthesizes a balanced, personalized admission roadmap.',
      icon: Bot,
      color: 'from-brand-600 to-accent-600',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-brand-50/70 via-white to-slate-50">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-100/40 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-800 text-xs font-bold uppercase tracking-wider border border-brand-200 shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Multi-Agent LangGraph Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              AI-Powered College Admission Assistant
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Find suitable colleges in <strong className="text-slate-800 font-semibold">Andhra Pradesh</strong> based on your academic marks, entrance examination rank, preferred course, budget, and location. Orchestrated by 6 specialized Generative AI agents.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/recommendations"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span>Get AI Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/eligibility"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow transition flex items-center justify-center space-x-2"
              >
                <Target className="w-4 h-4 text-brand-600" />
                <span>Check Rank Eligibility</span>
              </Link>

              <Link
                to="/chatbot"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-accent-700 bg-accent-50 hover:bg-accent-100 border border-accent-200 transition flex items-center justify-center space-x-2"
              >
                <Bot className="w-4 h-4 text-accent-600" />
                <span>AI Chatbot</span>
              </Link>
            </div>

            {/* Quick stats ticker */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200/60 shadow-xs">
                <div className="text-2xl font-extrabold text-brand-700">6 Agents</div>
                <div className="text-xs text-slate-500 font-medium">Collaborative Multi-Agent Flow</div>
              </div>
              <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200/60 shadow-xs">
                <div className="text-2xl font-extrabold text-purple-700">AP EAPCET</div>
                <div className="text-xs text-slate-500 font-medium">Historical Benchmarks</div>
              </div>
              <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200/60 shadow-xs">
                <div className="text-2xl font-extrabold text-emerald-700">Reach / Match</div>
                <div className="text-xs text-slate-500 font-medium">Safer Safety Categorization</div>
              </div>
              <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200/60 shadow-xs">
                <div className="text-2xl font-extrabold text-amber-700">JVD Eligible</div>
                <div className="text-xs text-slate-500 font-medium">AP Fee Transparency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600">Specialized Intelligence</div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet the 6 Collaborative AI Agents
          </h2>
          <p className="text-sm text-slate-600">
            Each agent performs a distinct, specialized mission. The AI Admission Coordinator orchestrates their outputs into an actionable admission blueprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((ag, i) => {
            const Icon = ag.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${ag.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ag.num}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors">
                      {ag.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {ag.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-600">
                  <span>Specialized LLM & Algorithmic Logic</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 my-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-400">Step-by-Step Workflow</div>
          <h2 className="text-3xl font-extrabold tracking-tight">How the Platform Works</h2>
          <p className="text-slate-400 text-sm">
            From initial entrance rank to finalized web options in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-lg">Enter Academic Profile</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Input Intermediate marks, AP EAPCET rank, reservation category, preferred engineering branch, and annual budget.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-lg">Multi-Agent Processing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              LangGraph triggers College Finder, Admission Eligibility, Fee Analysis, and Guidance agents in parallel and sequential states.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-lg">Receive Actionable Plan</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Review Reach/Match/Safer college tiers, side-by-side matrices, fee affordability reports, and step-by-step APSCHE guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Target Andhra Pradesh Colleges Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider backdrop-blur-sm">
              Andhra Pradesh Regional Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Pre-loaded with Top Andhra Pradesh Institutions
            </h2>
            <p className="text-brand-100 text-sm leading-relaxed">
              Featuring Andhra University (AUCE), JNTU Kakinada, SVU Tirupati, VR Siddhartha, Gayatri Vidya Parishad, RVR&JC, SRKR, GMRIT, Mohan Babu University, and KL University with branch cutoffs and JVD reimbursement indicators.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/recommendations"
                className="px-6 py-3 rounded-xl bg-white text-brand-900 font-bold text-sm hover:bg-brand-50 transition shadow"
              >
                Explore AP Colleges
              </Link>
              <Link
                to="/guidance"
                className="px-6 py-3 rounded-xl bg-brand-800/80 text-white font-bold text-sm hover:bg-brand-800 border border-white/20 transition"
              >
                AP Counselling Rules
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
