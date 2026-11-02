import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def generate_docx():
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(30, 41, 59) # Slate-800

    # 1. TITLE PAGE
    p_title_top = doc.add_paragraph()
    p_title_top.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title_top.paragraph_format.space_before = Pt(36)
    p_title_top.paragraph_format.space_after = Pt(12)
    run_dept = p_title_top.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\nMAJOR PROJECT REPORT")
    run_dept.font.size = Pt(13)
    run_dept.font.bold = True
    run_dept.font.color.rgb = RGBColor(79, 70, 229)

    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_proj.paragraph_format.space_after = Pt(24)
    run_proj = p_proj.add_run("AI-POWERED MULTI-AGENT COLLEGE ADMISSION ASSISTANT")
    run_proj.font.size = Pt(22)
    run_proj.font.bold = True
    run_proj.font.color.rgb = RGBColor(30, 27, 75)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(48)
    run_sub = p_sub.add_run("A Capstone Generative AI Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of\nBACHELOR OF TECHNOLOGY\nin\nCOMPUTER SCIENCE AND ENGINEERING")
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True

    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_after = Pt(48)
    p_by.add_run("Submitted By:\n[STUDENT NAME / TEAM MEMBERS]\n[REGISTER NUMBER / ROLL NUMBER]\n\nUnder the Guidance of:\n[FACULTY GUIDE NAME & DESIGNATION]")

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(24)
    p_inst.add_run("[NAME OF THE INSTITUTION / UNIVERSITY]\nACCREDITED WITH NAAC 'A+' GRADE | APPROVED BY AICTE\nANDHRA PRADESH, INDIA\nACADEMIC YEAR 2025 - 2026")
    doc.add_page_break()

    # 2. CERTIFICATE PAGE
    h_cert = doc.add_heading("CERTIFICATE", level=1)
    h_cert.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert = doc.add_paragraph(
        "This is to certify that the project report entitled 'AI-POWERED MULTI-AGENT COLLEGE ADMISSION ASSISTANT' "
        "is a bonafide record of work carried out by [STUDENT NAME] (Reg. No: [ROLL NUMBER]) in partial fulfillment "
        "of the requirements for the award of the degree of Bachelor of Technology in Computer Science and Engineering "
        "at [NAME OF THE INSTITUTION] during the academic year 2025-2026.\n\n"
        "The project has been approved as satisfying the academic requirements prescribed by the University."
    )
    p_cert.paragraph_format.space_after = Pt(72)

    t_cert = doc.add_table(rows=2, cols=2)
    t_cert.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_cert.cell(0, 0).text = "_____________________\nProject Supervisor / Guide\nDepartment of CSE"
    t_cert.cell(0, 1).text = "_____________________\nHead of the Department (HOD)\nDepartment of CSE"
    t_cert.cell(1, 0).text = "\n\n_____________________\nInternal Examiner"
    t_cert.cell(1, 1).text = "\n\n_____________________\nExternal Examiner"
    doc.add_page_break()

    # 3. DECLARATION
    h_dec = doc.add_heading("DECLARATION", level=1)
    doc.add_paragraph(
        "I hereby declare that this project report entitled 'AI-POWERED MULTI-AGENT COLLEGE ADMISSION ASSISTANT' "
        "submitted to [NAME OF INSTITUTION] is my original work and has not formed the basis for the award of any "
        "degree, diploma, associateship, fellowship, or other similar title to any candidate in any other university.\n\n"
        "Place: __________________\n"
        "Date:  __________________\n\n"
        "Signature of the Candidate:\n[STUDENT NAME]"
    )
    doc.add_page_break()

    # 4. ACKNOWLEDGEMENT
    h_ack = doc.add_heading("ACKNOWLEDGEMENT", level=1)
    doc.add_paragraph(
        "I express my deep sense of gratitude and respect to our revered Principal and Head of the Department "
        "of Computer Science and Engineering for providing the academic ecosystem and computational facilities "
        "required to bring this Generative AI project to fruition.\n\n"
        "I extend my sincere thanks to my project guide [GUIDE NAME] for their continuous encouragement, insightful "
        "reviews, and methodological guidance throughout the development of the multi-agent orchestration architecture.\n\n"
        "Finally, I thank my parents, peers, and faculty members who directly or indirectly contributed with their "
        "invaluable feedback."
    )
    doc.add_page_break()

    # 5. ABSTRACT
    h_abs = doc.add_heading("ABSTRACT", level=1)
    doc.add_paragraph(
        "Navigating higher education admissions in India presents significant informational asymmetry for aspiring candidates. "
        "Students transitioning from Class 12 (Intermediate) face disparate data silos regarding competitive entrance cutoffs "
        "(e.g., AP EAPCET, JEE), annual fee structures, institutional accreditations (NAAC, NBA, NIRF), living accommodations, "
        "and statutory reservation matrices. Traditional college search portals offer passive filtering interfaces that lack contextual "
        "reasoning, risk categorization, and step-by-step counselling guidance.\n\n"
        "This project presents the 'AI-Powered Multi-Agent College Admission Assistant', an end-to-end, production-grade web "
        "platform powered by specialized Generative AI agents orchestrated via LangGraph. The platform features six distinct "
        "intelligent agents: (1) College Finder Agent, (2) Admission Eligibility Agent, (3) Fee Analysis Agent, (4) College Comparison Agent, "
        "(5) Admission Guidance Agent, and (6) AI Admission Coordinator. Using stateful graph orchestration, the agents collaboratively "
        "evaluate candidate inputs against verified historical benchmarks without hallucinatory admission guarantees.\n\n"
        "The system is built on a modern decoupling stack: a React.js (Vite) and Tailwind CSS frontend with interactive Recharts "
        "data visualizations, a Node.js Express REST API backend with resilient MongoDB Atlas and embedded database storage, "
        "and a Python FastAPI AI service managing LangGraph multi-agent execution with dual-mode OpenAI LLM and deterministic "
        "algorithmic fallback logic. Initialized with high-fidelity datasets from leading Andhra Pradesh colleges, the application delivers "
        "accurate Reach, Match, and Safer classifications, fee transparency including AP Jagananna Vidya Deevena (JVD) scholarship criteria, "
        "and interactive admissions consulting."
    )
    doc.add_page_break()

    # 6. TABLE OF CONTENTS
    h_toc = doc.add_heading("TABLE OF CONTENTS", level=1)
    toc_items = [
        ("1. Introduction", "1"),
        ("2. Problem Statement", "3"),
        ("3. Project Objectives", "4"),
        ("4. Literature Survey & Existing Systems", "5"),
        ("5. Proposed Multi-Agent System", "7"),
        ("6. System Requirements Specification", "9"),
        ("7. Software & Hardware Requirements", "10"),
        ("8. Technology Stack Description", "11"),
        ("9. System Architecture & Component Diagram", "13"),
        ("10. Multi-Agent Orchestration Architecture (LangGraph)", "15"),
        ("11. Data Flow Diagrams (Level 0, 1, 2)", "17"),
        ("12. Use Case & Interaction Diagrams", "19"),
        ("13. Database Design & Schema Modeling", "21"),
        ("14. Detailed Module Description", "24"),
        ("15. Implementation & Code Architecture", "27"),
        ("16. Application Screenshots & UI Walkthrough", "30"),
        ("17. Verification & Test Cases", "33"),
        ("18. Results & Performance Discussion", "36"),
        ("19. Advantages & Business Value", "38"),
        ("20. Limitations & Risk Factors", "39"),
        ("21. Future Enhancements & National Expansion", "40"),
        ("22. Conclusion", "41"),
        ("23. References", "42"),
    ]
    for title, pg in toc_items:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        run_t = p.add_run(title)
        run_t.font.bold = True
        run_dot = p.add_run(" " + "." * (55 - len(title)) + " ")
        run_dot.font.color.rgb = RGBColor(148, 163, 184)
        run_p = p.add_run(pg)
        run_p.font.bold = True
    doc.add_page_break()

    # SECTION 7: INTRODUCTION
    doc.add_heading("1. INTRODUCTION", level=1)
    doc.add_paragraph(
        "Higher education engineering admissions in India represent a critical junction in a student's academic and professional journey. "
        "Annually, over two million students sit for national and state-level engineering entrance examinations such as JEE Main and "
        "AP EAPCET (Andhra Pradesh Engineering, Agriculture and Pharmacy Common Entrance Test). Despite the volume of candidates, "
        "students and parents routinely encounter significant impediments during post-examination counselling. The choice of college "
        "requires synthesizing multi-dimensional parameters including entrance rank closing percentiles, category reservations (OC, BC, SC, ST, EWS), "
        "tuition fees, hostel and mess living expenses, NAAC and NBA accreditations, historical campus placement statistics, and regional "
        "government welfare subsidies.\n\n"
        "In the contemporary landscape of Generative Artificial Intelligence, autonomous multi-agent systems represent a major paradigm shift. "
        "Rather than relying on monolithic, generic Large Language Models that risk hallucinations and superficial answers, multi-agent frameworks "
        "employ specialized functional roles with segregated tools, clear state boundaries, and deterministic reasoning fallbacks. "
        "This project, titled 'AI-Powered Multi-Agent College Admission Assistant', designs and implements an intelligent advisory web "
        "application centered on Andhra Pradesh institutions, engineered with an extensible modular framework that scales seamlessly to other Indian states."
    )

    # SECTION 8: PROBLEM STATEMENT
    doc.add_heading("2. PROBLEM STATEMENT", level=1)
    doc.add_paragraph(
        "Current higher education search portals suffer from critical systemic deficiencies:\n\n"
        "1. Disconnected Information Silos: Government web counselling portals (such as APSCHE) publish voluminous tabular cutoffs and seat matrices "
        "as raw PDF files that require laborious manual cross-referencing.\n"
        "2. Absence of Risk-Stratified Counseling: Commercial aggregator portals display generic listings or sponsored colleges without providing "
        "statistically grounded Reach, Match, and Safer categorizations tailored to a student's specific entrance rank and reservation quota.\n"
        "3. Financial Opacity: Published tuition fees frequently exclude mandatory hostel, mess, and laboratory maintenance expenditures, blindsiding "
        "families regarding true annual out-of-pocket costs and government tuition reimbursement schemes (e.g. Jagananna Vidya Deevena).\n"
        "4. Hallucination Risk in Generic AI Bots: Generic conversational chatbots often fabricate cutoffs, invent unrealistic fee numbers, or irresponsibly "
        "guarantee admission to candidates, causing severe academic detriment.\n\n"
        "There is an urgent requirement for an objective, trustworthy, multi-agent system that provides personalized, explainable, and multi-faceted "
        "admission recommendations anchored in validated database criteria."
    )

    # SECTION 9: OBJECTIVES
    doc.add_heading("3. PROJECT OBJECTIVES", level=1)
    doc.add_paragraph(
        "The primary objectives of this project are:\n\n"
        "• Multi-Agent Collaboration: Design and orchestrate six specialized AI agents (College Finder, Admission Eligibility, Fee Analysis, "
        "College Comparison, Admission Guidance, and AI Admission Coordinator) using the LangGraph stateful graph framework.\n"
        "• Objective Eligibility Categorization: Implement intelligent evaluation algorithms that categorize institutions into 'Reach' (aspirational), "
        "'Match' (competitive), and 'Safer' (high-probability) options without irresponsible guarantees.\n"
        "• Comprehensive Financial Modeling: Deliver realistic annual expense projections (tuition + hostel + food) and incorporate Andhra Pradesh "
        "state welfare criteria (JVD tuition reimbursement).\n"
        "• Production-Ready Web Implementation: Develop a responsive educational technology user interface using React.js, Tailwind CSS, and Recharts, "
        "backed by a resilient Node.js Express REST API and a Python FastAPI microservice.\n"
        "• High-Fidelity Demonstration Dataset: Model verified engineering colleges across major Andhra Pradesh regions (Visakhapatnam, Kakinada, "
        "Vijayawada, Guntur, Tirupati, Bhimavaram) with real branch cutoffs and placement metrics."
    )

    # SECTION 10: EXISTING SYSTEM
    doc.add_heading("4. EXISTING SYSTEMS VS. PROPOSED SYSTEM", level=1)
    doc.add_paragraph(
        "Traditional admission search engines operate primarily as lead-generation mechanisms rather than unbiased student advisors. "
        "Commercial platforms prioritize institutions based on advertising revenue rather than student academic fit. Furthermore, official state "
        "counselling portals provide static PDF archives without interactive scenario modeling or personalized budget matching."
    )

    # Comparison Table
    table_comp = doc.add_table(rows=6, cols=3)
    table_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Feature / Dimension", "Existing Search Portals", "Proposed Multi-Agent System"]
    for i, h in enumerate(headers):
        cell = table_comp.cell(0, i)
        cell.text = h
        set_cell_background(cell, "4F46E5")
        for p in cell.paragraphs:
            p.runs[0].font.bold = True
            p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    comp_rows = [
        ("Architecture", "Monolithic static queries", "Multi-Agent LangGraph Orchestration"),
        ("Decision Support", "Basic keyword filtering", "Risk-stratified Reach / Match / Safer options"),
        ("Fee Transparency", "Tuition only (often outdated)", "Comprehensive Tuition + Hostel + Mess + JVD Support"),
        ("College Comparison", "Basic side-by-side specs", "Deep side-by-side matrices with AI Pros & Cons"),
        ("Advisory Accuracy", "Unchecked LLM or sponsored bias", "Validated cutoff matching with non-guarantee ethics"),
    ]
    for row_idx, data in enumerate(comp_rows, start=1):
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = table_comp.cell(row_idx, col_idx)
            cell.text = text
            set_cell_background(cell, bg)

    # SECTION 11: PROPOSED SYSTEM
    doc.add_heading("5. PROPOSED SYSTEM ARCHITECTURE", level=1)
    doc.add_paragraph(
        "The proposed system adopts a microservice-oriented architecture consisting of three primary layers:\n\n"
        "1. Presentation Tier (Frontend): Built with React 18 and Vite, styling with Tailwind CSS, and data visualization using Recharts. "
        "The interface incorporates accessible educational design standards with blue, purple, and neutral white palettes, responsive layout "
        "containers, and interactive dashboards.\n"
        "2. Application & Data Tier (Backend): Implemented in Node.js and Express.js, handling user authentication via JSON Web Tokens (JWT), "
        "bcrypt password hashing, MongoDB object modeling via Mongoose, and student application lifecycle management.\n"
        "3. Artificial Intelligence Orchestration Tier (AI Service): Developed in Python 3.14 with FastAPI and LangGraph. "
        "This service implements a stateful StateGraph that sequences tasks across specialist agents with deterministic fallback safeguards."
    )

    # SECTION 16: MULTI-AGENT ARCHITECTURE
    doc.add_heading("6. MULTI-AGENT SPECIFICATIONS & COLLABORATION", level=1)
    doc.add_paragraph(
        "The system deploys six specialized agents, each possessing distinct domain logic:\n\n"
        "• Agent 1 (College Finder Agent): Queries repository datasets to match candidate preferences regarding engineering specializations "
        "(CSE, AI&DS, AIML, IT, ECE), target geographical regions (e.g. Visakhapatnam, NTR, Guntur, Tirupati), and campus infrastructure.\n"
        "• Agent 2 (Admission Eligibility Agent): Ingests the candidate's AP EAPCET rank, reservation category, and Intermediate marks. "
        "By comparing rank Against historical closing cutoffs, it classifies options into Safer (cutoff >= 1.3x rank), Match (cutoff ~ rank +/- 15%), "
        "and Reach (rank > cutoff). It enforces ethical non-guarantee disclosures.\n"
        "• Agent 3 (Fee Analysis Agent): Computes aggregate annual academic costs (Tuition + Hostel + Mess + Amenities) and tests affordability "
        "against candidate annual budgets. It identifies AP Jagananna Vidya Deevena (JVD) welfare eligibility for convener candidates.\n"
        "• Agent 4 (College Comparison Agent): Generates detailed multi-column comparison matrices evaluating placements (highest and average LPA), "
        "NAAC/NIRF credentials, and synthesizes structured pros and cons for each institution.\n"
        "• Agent 5 (Admission Guidance Agent): Provides step-by-step documentation roadmaps for APSCHE web counselling, including Help Line Center (HLC) "
        "certificate verification protocols and active portal links.\n"
        "• Agent 6 (AI Admission Coordinator): Orchestrates the multi-agent execution graph, aggregates specialist insights, and delivers a unified "
        "strategic admission blueprint."
    )

    # SECTION 19: DATABASE DESIGN
    doc.add_heading("7. DATABASE DESIGN & SCHEMA ARCHITECTURE", level=1)
    doc.add_paragraph(
        "The database schema is modeled using MongoDB and Mongoose with 9 interconnected collections:\n\n"
        "1. Users Collection: Stores credentials, roles ('student', 'admin'), and timestamps.\n"
        "2. Students Collection: References User; stores Intermediate marks, entrance exam details, category, budget, and hostel flags.\n"
        "3. Colleges Collection: Stores college profile, code, accreditation grades (NAAC, NIRF), facilities, and placement statistics.\n"
        "4. Courses Collection: Maps degrees (B.Tech) and branch specializations with sanctioned intake seats to respective colleges.\n"
        "5. AdmissionCriteria Collection: Stores historical opening/closing cutoff ranks segregated across reservation categories (OC, BC-A/B/C/D/E, SC, ST, EWS).\n"
        "6. FeeDetails Collection: Contains annual tuition fees, hostel rent, mess costs, and JVD welfare eligibility flags.\n"
        "7. Recommendations Collection: Persists synthesized multi-agent evaluation outputs and confidence metrics.\n"
        "8. Applications Collection: Enables students to track shortlisted options through web counselling phases (Draft, Allotted, Admitted).\n"
        "9. ChatHistory Collection: Logs contextual conversational threads between students and specialist agents."
    )

    # SECTION 23: TESTING AND TEST CASES
    doc.add_heading("8. TESTING & QUALITY ASSURANCE", level=1)
    doc.add_paragraph(
        "Comprehensive testing was conducted across all system modules. The test harness validated unit functionality, API contracts, "
        "multi-agent orchestration, and frontend component rendering."
    )

    test_table = doc.add_table(rows=7, cols=4)
    test_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    test_headers = ["Test ID", "Module / Scenario", "Expected Outcome", "Status"]
    for i, h in enumerate(test_headers):
        cell = test_table.cell(0, i)
        cell.text = h
        set_cell_background(cell, "1E1B4B")
        for p in cell.paragraphs:
            p.runs[0].font.bold = True
            p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    test_rows = [
        ("TC-01", "User Auth & JWT Generation", "Valid token returned and attached to profile", "PASSED"),
        ("TC-02", "Embedded DB Auto-Seeding", "10 AP colleges and courses seeded on first run", "PASSED"),
        ("TC-03", "Eligibility Categorization", "Correct categorization into Reach / Match / Safer", "PASSED"),
        ("TC-04", "Fee & Budget Filtering", "Identifies over-budget options and calculates variance", "PASSED"),
        ("TC-05", "LangGraph Multi-Agent Flow", "All 5 nodes execute sequentially into coordinator", "PASSED"),
        ("TC-06", "Vite Production Compilation", "Clean production build with zero bundle errors", "PASSED"),
    ]
    for row_idx, data in enumerate(test_rows, start=1):
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = test_table.cell(row_idx, col_idx)
            cell.text = text
            set_cell_background(cell, bg)

    # SECTION 28: CONCLUSION & REFERENCES
    doc.add_heading("9. CONCLUSION & FUTURE WORK", level=1)
    doc.add_paragraph(
        "The 'AI-Powered Multi-Agent College Admission Assistant' successfully demonstrates the practical efficacy of collaborative Generative AI "
        "agents in academic counseling. By decomposing a complex problem into dedicated agents orchestrated through LangGraph, the platform eliminates "
        "informational ambiguity and delivers actionable, risk-stratified insights to engineering aspirants in Andhra Pradesh.\n\n"
        "Future enhancements include expanding datasets to encompass Karnataka (KCET/COMEDK), Telangana (TG EAPCET), and Maharashtra (MHT-CET), "
        "integrating real-time OCR document verification for uploaded marks memos, and adding multilingual voice interactions in Telugu and Hindi."
    )

    doc.add_heading("10. REFERENCES", level=1)
    refs = [
        "1. Andhra Pradesh State Council of Higher Education (APSCHE) - Official Admissions Handbook (2025).",
        "2. LangGraph: Multi-Agent Orchestration Framework Documentation - Harrison Chase et al. (2024).",
        "3. Fast and Scalable Web APIs with FastAPI - Sebastián Ramírez (2023).",
        "4. National Institutional Ranking Framework (NIRF) - Ministry of Education, Government of India (2024).",
        "5. Jagananna Vidya Deevena Welfare Scheme Guidelines - Department of Higher Education, Govt. of AP.",
    ]
    for r in refs:
        doc.add_paragraph(r)

    # Save DOCX
    out_dir = os.path.dirname(os.path.abspath(__file__))
    docx_path = os.path.join(out_dir, "AI_Powered_Multi_Agent_College_Admission_Assistant_Report.docx")
    doc.save(docx_path)
    print(f"[Report] DOCX report generated successfully at: {docx_path}")

if __name__ == "__main__":
    generate_docx()
