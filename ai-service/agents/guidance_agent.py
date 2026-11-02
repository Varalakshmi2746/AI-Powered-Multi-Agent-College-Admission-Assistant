from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class AdmissionGuidanceAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="AdmissionGuidanceAgent", role="Agent 5: Admission Guidance Agent")

    def run(self, query: str = "") -> Dict[str, Any]:
        def fallback_guidance():
            steps = [
                {
                    "stepNumber": 1,
                    "title": "Online Registration & Processing Fee Payment",
                    "description": "Visit the official APSCHE counselling portal. Enter AP EAPCET Hall Ticket Number and Date of Birth. Pay the processing fee online (OC/BC: ₹1200, SC/ST: ₹600)."
                },
                {
                    "stepNumber": 2,
                    "title": "Certificate Verification (Online / Help Line Centers)",
                    "description": "Candidates whose data is auto-verified online receive verification SMS. Candidates requiring document validation must visit the designated Help Line Center (HLC) with original certificates."
                },
                {
                    "stepNumber": 3,
                    "title": "Web Options Entry & Prioritization",
                    "description": "Log into the portal using your credentials and OTP. Exercise choice of colleges and courses in descending order of true preference. Save choices regularly and freeze options before the closing deadline."
                },
                {
                    "stepNumber": 4,
                    "title": "Provisional Seat Allotment",
                    "description": "The allotment algorithm allocates seats based on rank, category reservations, local area status (AU/SVU region), and web choices. Download the provisional allotment letter."
                },
                {
                    "stepNumber": 5,
                    "title": "Self-Reporting & College Admission",
                    "description": "Complete online self-reporting on the portal and physically report to the allotted college along with original certificates and fee allotment receipt within the specified reporting window."
                }
            ]

            documents_required = [
                "AP EAPCET Rank Card & Hall Ticket",
                "SSC (Class 10) Marks Memo or equivalent",
                "Intermediate (Class 12) Pass Certificate cum Memorandum of Marks",
                "Study / Bonafide Certificates from Class 6 to Intermediate",
                "Transfer Certificate (TC) & Conduct Certificate from last attended institution",
                "Integrated Community / Caste Certificate (for BC, SC, ST candidates)",
                "Income Certificate / White Ration Card (issued on or after Jan 1 of admission year) for fee reimbursement",
                "EWS Certificate (valid for current financial year if claiming 10% EWS quota)",
                "Local Status Certificate (if applicable for migration candidates)"
            ]

            official_links = [
                {"name": "APSCHE Official Admissions Portal", "url": "https://cets.apsche.ap.gov.in"},
                {"name": "Andhra Pradesh State Council of Higher Education", "url": "https://sche.ap.gov.in"},
                {"name": "Jagananna Vidya Deevena (JVD) Welfare Portal", "url": "https://navasakam.ap.gov.in"}
            ]

            faqs = [
                {
                    "question": "Can I participate in Phase 2 counselling if I am already allotted a seat in Phase 1?",
                    "answer": "Yes. If you report to Phase 1 and opt for sliding/betterment in Phase 2, your Phase 1 seat remains safeguarded until you are allotted a higher choice in Phase 2."
                },
                {
                    "question": "How does the Jagananna Vidya Deevena (JVD) scheme work?",
                    "answer": "Under JVD, the Andhra Pradesh Government credits full tuition fees directly for eligible students holding valid white ration cards or meeting annual household income criteria."
                },
                {
                    "question": "What happens if I do not freeze my web options before the deadline?",
                    "answer": "Saved web options are automatically frozen by the system at the official cutoff time and considered for seat allotment."
                }
            ]

            summary = (
                "Step-by-step guidance prepared according to official APSCHE engineering admission norms. "
                "Ensure all mandatory certificates and income documentation are updated before Web Options opening."
            )

            return {
                "counselling_steps": steps,
                "documents_required": documents_required,
                "official_links": official_links,
                "faqs": faqs,
                "guidance_summary": summary
            }

        system_prompt = (
            "You are the Admission Guidance Agent for AP engineering counselling. "
            "Provide accurate instructions, document lists, and links. Return JSON."
        )
        user_prompt = f"Guidance request: {query or 'General AP EAPCET counselling roadmap'}"

        return self.call_llm_json(system_prompt, user_prompt, fallback_guidance)
