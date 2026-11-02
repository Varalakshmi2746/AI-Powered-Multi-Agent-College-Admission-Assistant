from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class AdmissionEligibilityAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="AdmissionEligibilityAgent", role="Agent 2: Admission Eligibility Agent")

    def run(self, student: Dict[str, Any], candidate_colleges: List[Dict[str, Any]]) -> Dict[str, Any]:
        rank = int(student.get("entranceExamRank", 8500))
        marks = float(student.get("intermediateMarks", 85.0))
        category = student.get("category", "OC")
        course_name = student.get("preferredCourse", "Computer Science and Engineering")

        def fallback_analysis():
            evaluated = []
            safer_count, match_count, reach_count = 0, 0, 0

            for col in candidate_colleges:
                # Find matching course cutoff
                matching_course = None
                for crs in col.get("courses", []):
                    if course_name.lower() in crs.get("branch", "").lower():
                        matching_course = crs
                        break
                
                if not matching_course and col.get("courses"):
                    matching_course = col["courses"][0]

                cutoffs = matching_course.get("cutoffs", {}) if matching_course else {}
                closing_cutoff = cutoffs.get(category, cutoffs.get("OC", 10000))
                opening_cutoff = int(closing_cutoff * 0.4)

                if marks < 45.0:
                    status = "Ineligible"
                    prob = 0
                    explanation = f"Class 12 Intermediate aggregate ({marks}%) is below the minimum mandated eligibility threshold (45%)."
                elif rank <= closing_cutoff * 0.70:
                    status = "Safer"
                    prob = 92
                    safer_count += 1
                    explanation = (
                        f"Your rank ({rank:,}) is significantly favorable compared to the previous closing cutoff "
                        f"({closing_cutoff:,}) for {category} category. High admission probability based on past trends."
                    )
                elif rank <= closing_cutoff * 1.15:
                    status = "Match"
                    prob = 70
                    match_count += 1
                    explanation = (
                        f"Your rank ({rank:,}) falls well within the competitive range "
                        f"({opening_cutoff:,} - {closing_cutoff:,}) for {category} category."
                    )
                else:
                    status = "Reach"
                    prob = 38
                    reach_count += 1
                    explanation = (
                        f"Your rank ({rank:,}) exceeds historical cutoff ({closing_cutoff:,}). "
                        f"Consider this an aspirational option for later rounds or special mop-up counselling."
                    )

                evaluated.append({
                    "collegeId": col.get("id") or col.get("_id"),
                    "collegeName": col.get("name"),
                    "collegeCode": col.get("code"),
                    "branch": matching_course.get("branch", course_name) if matching_course else course_name,
                    "category": status,
                    "probabilityScore": prob,
                    "cutoffRank": closing_cutoff,
                    "studentRank": rank,
                    "explanation": explanation,
                    "disclaimer": "Admissions are subject to annual seat allocation, category normalization, and choices submitted in web counselling. Admission is never guaranteed."
                })

            summary = (
                f"Evaluated {len(evaluated)} institutions against your AP EAPCET rank of {rank:,} ({category} category). "
                f"Identified {safer_count} Safer options, {match_count} Match options, and {reach_count} Reach options."
            )
            return {"evaluations": evaluated, "eligibility_summary": summary}

        system_prompt = (
            "You are the Admission Eligibility Agent. Analyze the student's rank and marks against college historical cutoffs. "
            "Categorize each institution strictly as 'Reach', 'Match', or 'Safer'. "
            "Never guarantee admission. Explain reasoning clearly. Return structured JSON with 'evaluations' and 'eligibility_summary'."
        )
        user_prompt = f"Student Rank: {rank}, Category: {category}, Course: {course_name}. Colleges to evaluate: {len(candidate_colleges)}."

        return self.call_llm_json(system_prompt, user_prompt, fallback_analysis)
