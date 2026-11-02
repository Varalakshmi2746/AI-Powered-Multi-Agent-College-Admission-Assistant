from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class CoordinatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="AIAdmissionCoordinator", role="Agent 6: AI Admission Coordinator (Orchestrator)")

    def synthesize_recommendations(
        self,
        student: Dict[str, Any],
        finder_data: Dict[str, Any],
        eligibility_data: Dict[str, Any],
        fee_data: Dict[str, Any],
        guidance_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Synthesizes outputs from all specialist agents into cohesive, actionable college recommendations."""
        matched_colleges = finder_data.get("matched_colleges", [])
        eligibility_list = eligibility_data.get("evaluations", [])
        fee_list = fee_data.get("fee_analysis", [])

        # Build lookup maps
        elig_map = {e.get("collegeCode") or e.get("collegeName"): e for e in eligibility_list}
        fee_map = {f.get("collegeCode") or f.get("collegeName"): f for f in fee_list}

        final_recommendations = []
        for col in matched_colleges:
            code = col.get("code")
            name = col.get("name")
            elig = elig_map.get(code) or elig_map.get(name) or {}
            fee = fee_map.get(code) or fee_map.get(name) or {}

            category = elig.get("category", "Match")
            is_affordable = fee.get("isAffordable", True)
            total_annual = fee.get("totalAnnualExpense", col.get("totalAnnualExpense", 180000))
            prob_score = elig.get("probabilityScore", 70)

            final_recommendations.append({
                "collegeId": col.get("id") or col.get("_id"),
                "collegeName": name,
                "collegeCode": code,
                "type": col.get("type", "Autonomous Private"),
                "city": col.get("city"),
                "district": col.get("district"),
                "branch": elig.get("branch", student.get("preferredCourse", "Computer Science and Engineering")),
                "category": category, # Reach, Match, Safer
                "confidenceScore": prob_score,
                "cutoffRank": elig.get("cutoffRank", 12000),
                "studentRank": student.get("entranceExamRank", 8500),
                "tuitionFee": fee.get("tuitionFee", col.get("tuitionFee", 70000)),
                "hostelFee": fee.get("hostelFee", col.get("hostelFee", 60000)),
                "totalAnnualExpense": total_annual,
                "isAffordable": is_affordable,
                "explanation": elig.get("explanation", ""),
                "placementStats": {
                    "averagePackageLPA": col.get("placementAvgLPA", 6.0),
                    "highestPackageLPA": col.get("placementHighestLPA", 35.0),
                },
                "facilities": col.get("facilities", []),
                "reasons": [
                    elig.get("explanation", "Matches past AP EAPCET cutoff trends."),
                    f"Annual expense is estimated at ₹{total_annual:,} ({'within budget' if is_affordable else 'exceeds budget'}).",
                    f"NAAC Grade: {col.get('naacGrade', 'A+')} with verified placement track record."
                ]
            })

        # Sort: Safer & Match first, then confidence score
        order = {"Match": 1, "Safer": 2, "Reach": 3, "Ineligible": 4}
        final_recommendations.sort(key=lambda x: (order.get(x["category"], 5), -x["confidenceScore"]))

        student_rank = student.get("entranceExamRank", 8500)
        course = student.get("preferredCourse", "Computer Science and Engineering")
        verdict = (
            f"Coordinator Synthesis: Evaluated options for {course} with AP EAPCET Rank {student_rank:,}. "
            f"Recommended a balanced portfolio of Match options for primary preference, Safer choices to safeguard admission, "
            f"and high-value Reach institutions for initial web-options prioritization."
        )

        return {
            "coordinator_verdict": verdict,
            "final_recommendations": final_recommendations
        }

    def chat(self, message: str, agent_role: str, student: Dict[str, Any], history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Conversational coordinator providing intelligent agent replies."""
        system_prompt = (
            "You are the AI Admission Coordinator orchestrating a team of 5 specialist agents "
            "(College Finder, Admission Eligibility, Fee Analysis, College Comparison, and Admission Guidance). "
            "You provide precise, supportive, informative answers tailored to Andhra Pradesh engineering admissions "
            "(AP EAPCET, Intermediate marks, Jagananna Vidya Deevena, APSCHE counselling rules). "
            "Never guarantee admission based on rank. Answer professionally and recommend next steps."
        )

        def fallback_chat():
            return {
                "reply": (
                    f"Thank you for contacting the AI Admission Assistant. "
                    f"Based on your query regarding '{message}', our multi-agent system recommends checking your "
                    f"eligibility benchmarks and web counselling choices for Andhra Pradesh colleges. "
                    f"Feel free to explore our Recommendation, Fee Analysis, or Eligibility Checker modules."
                ),
                "agent_role": agent_role,
                "suggested_actions": ["Run College Recommendations", "Check AP EAPCET Eligibility", "Analyze College Fees"]
            }

        user_prompt = f"Student Profile: {student}. User Query: '{message}'. Active Agent Role: '{agent_role}'."
        reply_text = self.call_llm_text(system_prompt, user_prompt, lambda: fallback_chat()["reply"])

        return {
            "reply": reply_text,
            "agent_role": agent_role,
            "suggested_actions": ["View Recommended Colleges", "Fee Analysis", "Compare Top Colleges"]
        }
