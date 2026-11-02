import React, { useState } from 'react';
import {
  Compass,
  FileCheck,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  ShieldCheck,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

export default function AdmissionGuidancePage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const steps = [
    {
      step: '01',
      title: 'Online Registration & Processing Fee Payment',
      desc: 'Candidates visit the official APSCHE portal (cets.apsche.ap.gov.in) and enter their AP EAPCET Hall Ticket No. & DOB. Processing fee: ₹1,200 (OC/BC), ₹600 (SC/ST) via Net Banking/UPI.',
      tag: 'Mandatory',
    },
    {
      step: '02',
      title: 'Online & Help Line Center (HLC) Certificate Verification',
      desc: 'Candidates whose certificates are auto-verified via departmental data receive successful verification SMS. Candidates with discrepancies report to designated district HLCs with original documents.',
      tag: 'Critical',
    },
    {
      step: '03',
      title: 'Web Options Entry & Prioritization',
      desc: 'Candidates log in using their registered password and OTP. Exercise priority options across college and branch codes in descending order. Save options frequently before final auto-freeze.',
      tag: 'Core Step',
    },
    {
      step: '04',
      title: 'Provisional Seat Allotment',
      desc: 'Seat allotment algorithms process merit rank, reservation quotas (BC, SC, ST, EWS), local area status (AU/SVU regions), and option preferences. Allotment orders are downloaded online.',
      tag: 'Milestone',
    },
    {
      step: '05',
      title: 'Self-Reporting & College Campus Admission',
      desc: 'Complete 2-stage self-reporting: 1) Online self-reporting on the portal, and 2) Physical reporting at the allotted college with original certificates and fee allotment receipt.',
      tag: 'Final Phase',
    },
  ];

  const documents = [
    { title: 'AP EAPCET Rank Card', desc: 'Official scorecard downloaded from APSCHE portal.' },
    { title: 'AP EAPCET Hall Ticket', desc: 'Entrance examination admit card.' },
    { title: 'Class 10 (SSC) Memorandum of Marks', desc: 'Proof of date of birth and secondary education.' },
    { title: 'Class 12 (Intermediate) Pass Certificate', desc: 'Marks memorandum of qualifying board exam.' },
    { title: 'Study / Bonafide Certificates', desc: 'Class 6 to Intermediate (to establish AU/SVU local status).' },
    { title: 'Transfer Certificate (TC)', desc: 'Issued by the intermediate junior college attended.' },
    { title: 'Integrated Community Certificate (Caste)', desc: 'Mandatory for BC, SC, and ST category claims.' },
    { title: 'Income Certificate / White Ration Card', desc: 'Required for Jagananna Vidya Deevena (JVD) fee reimbursement.' },
    { title: 'EWS Certificate', desc: 'Issued by competent authority for 10% EWS quota.' },
  ];

  const officialLinks = [
    {
      name: 'APSCHE Official Admissions Portal',
      url: 'https://cets.apsche.ap.gov.in',
      desc: 'Main engineering web counselling and allotment portal.',
    },
    {
      name: 'Andhra Pradesh State Council of Higher Education',
      url: 'https://sche.ap.gov.in',
      desc: 'Official higher education administrative updates.',
    },
    {
      name: 'Jagananna Vidya Deevena (Navasakam)',
      url: 'https://navasakam.ap.gov.in',
      desc: 'Welfare portal for student tuition fee reimbursement status.',
    },
  ];

  const faqs = [
    {
      q: 'Can I exercise web options for colleges across both AU and SVU regions?',
      a: 'Yes. Candidates can opt for colleges across the entire state. 85% of seats in each university area are reserved for local candidates, and 15% are open unreserved seats accessible to all AP candidates.',
    },
    {
      q: 'How does sliding / betterment work between Phase 1 and Phase 2?',
      a: 'If you accept your Phase 1 allotment through self-reporting, you can participate in Phase 2 for higher preference options. If allotted in Phase 2, your Phase 1 seat is automatically released to other candidates.',
    },
    {
      q: 'Who is eligible for Jagananna Vidya Deevena (JVD) tuition fee reimbursement?',
      a: 'Students who secured admission through convener quota with total annual family income below ₹2.50 Lakhs (or holding a valid white ration card) qualify for 100% tuition reimbursement crediting into the mother’s account.',
    },
    {
      q: 'What should I do if my certificates fail online auto-verification?',
      a: 'Visit any of the designated district Help Line Centers (HLCs) with all original documents, xerox copies, and your EAPCET rank card to complete manual verification in person.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-600">
          <Compass className="w-4 h-4" />
          <span>Agent 5: Admission Guidance Agent</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Andhra Pradesh Engineering Admission Roadmap
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Verified counselling guidelines, mandatory document checklists, and official APSCHE resources.
        </p>
      </div>

      {/* Step by Step Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-brand-600" />
          <span>Counselling Lifecycle: Step-by-Step</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-brand-600 font-mono">{st.step}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700">
                    {st.tag}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-800 leading-snug">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents Checklist */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>Mandatory Document Checklist for Verification</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Keep 2 sets of attested photocopies and original certificates ready for HLC reporting
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            9 Documents
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1 hover:bg-slate-50 transition"
            >
              <div className="flex items-center space-x-2 font-bold text-xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{doc.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">{doc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Links & Portal Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {officialLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="p-6 bg-white hover:bg-brand-50/50 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                  Government Portal
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-2">{link.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{link.desc}</p>
            </div>
            <span className="text-xs font-bold text-brand-700 group-hover:underline">
              Access Portal →
            </span>
          </a>
        ))}
      </div>

      {/* Admission FAQs Accordion */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Frequently Asked Admission Questions</h2>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div key={i} className="py-4">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-800 hover:text-brand-600 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
