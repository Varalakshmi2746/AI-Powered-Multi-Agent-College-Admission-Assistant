from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class CollegeComparisonAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="CollegeComparisonAgent", role="Agent 4: College Comparison Agent")

    def run(self, selected_colleges: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not selected_colleges or len(selected_colleges) < 2:
            return {
                "comparison_matrix": [],
                "comparison_summary": "Select at least 2 colleges to generate an in-depth comparison."
            }

        def fallback_comparison():
            matrix = []
            for col in selected_colleges:
                pros = []
                cons = []

                if "Govt" in col.get("type", "") or "State" in col.get("type", ""):
                    pros.append("High prestige as an established State Government University")
                    pros.append("Low, government-subsidized tuition fee")
                    cons.append("Hostel rooms are traditional compared to private deemed universities")
                else:
                    pros.append("Modern industry-aligned autonomous curriculum")
                    pros.append("Extensive campus recruitment drives with tier-1 MNCs")
                    if col.get("tuitionFee", 0) > 100000:
                        cons.append("Higher tuition expenditure compared to convener government colleges")

                avg_lpa = col.get("placementAvgLPA", 6.0)
                if avg_lpa >= 7.0:
                    pros.append(f"Strong placement record with average package of {avg_lpa} LPA")

                matrix.append({
                    "id": col.get("id") or col.get("_id"),
                    "name": col.get("name"),
                    "code": col.get("code"),
                    "type": col.get("type"),
                    "naacGrade": col.get("naacGrade"),
                    "nirfRank": col.get("nirfRank"),
                    "tuitionFee": col.get("tuitionFee"),
                    "hostelFee": col.get("hostelFee"),
                    "totalAnnual": col.get("totalAnnualExpense"),
                    "placementAvgLPA": avg_lpa,
                    "placementHighestLPA": col.get("placementHighestLPA", 30.0),
                    "pros": pros,
                    "cons": cons
                })

            summary = (
                f"Generated comparison matrix across {len(selected_colleges)} institutions. "
                "Government institutions excel in return-on-investment and brand legacy; "
                "autonomous colleges offer agile tech specializations and competitive campus recruitment."
            )
            return {"comparison_matrix": matrix, "comparison_summary": summary}

        system_prompt = (
            "You are the College Comparison Agent. Perform an objective, structured comparison across the provided colleges. "
            "Highlight strengths, trade-offs, placements, and financial viability. Return JSON with 'comparison_matrix' and 'comparison_summary'."
        )
        user_prompt = f"Colleges to compare: {[c.get('name') for c in selected_colleges]}."

        return self.call_llm_json(system_prompt, user_prompt, fallback_comparison)
