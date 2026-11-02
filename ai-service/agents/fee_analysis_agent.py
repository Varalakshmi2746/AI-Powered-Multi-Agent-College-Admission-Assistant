from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class FeeAnalysisAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="FeeAnalysisAgent", role="Agent 3: Fee Analysis Agent")

    def run(self, student: Dict[str, Any], colleges: List[Dict[str, Any]]) -> Dict[str, Any]:
        budget = int(student.get("annualBudget", 180000))
        hostel_req = bool(student.get("hostelRequired", True))

        def fallback_analysis():
            fee_breakdowns = []
            affordable_count = 0

            for col in colleges:
                tuition = int(col.get("tuitionFee", 70000))
                hostel = int(col.get("hostelFee", 60000)) if hostel_req else 0
                mess = int(col.get("messFee", 35000)) if hostel_req else 0
                other = int(col.get("otherFee", 10000))
                total_annual = tuition + hostel + mess + other
                
                is_affordable = total_annual <= budget
                if is_affordable:
                    affordable_count += 1
                variance = budget - total_annual

                fee_breakdowns.append({
                    "collegeId": col.get("id") or col.get("_id"),
                    "collegeName": col.get("name"),
                    "collegeCode": col.get("code"),
                    "tuitionFee": tuition,
                    "hostelFee": hostel,
                    "messFee": mess,
                    "otherFee": other,
                    "totalAnnualExpense": total_annual,
                    "studentBudget": budget,
                    "variance": variance,
                    "isAffordable": is_affordable,
                    "scholarshipSupport": "Eligible for full tuition fee reimbursement under AP JVD scheme for qualified candidates."
                })

            summary = (
                f"Assessed fee structures against your annual budget of ₹{budget:,}. "
                f"Found {affordable_count} institutions completely within budget. "
                f"State universities average ~₹1.25 Lakhs/yr whereas top autonomous private institutions average ~₹1.85 Lakhs/yr."
            )
            return {"fee_analysis": fee_breakdowns, "fee_summary": summary}

        system_prompt = (
            "You are the Fee Analysis Agent. Examine tuition, hostel, and miscellaneous costs against the student's budget. "
            "Return JSON containing 'fee_analysis' list and 'fee_summary'."
        )
        user_prompt = f"Student Budget: ₹{budget:,}, Hostel Required: {hostel_req}. Institutions: {len(colleges)}."

        return self.call_llm_json(system_prompt, user_prompt, fallback_analysis)
