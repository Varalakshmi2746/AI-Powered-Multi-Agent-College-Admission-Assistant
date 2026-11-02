from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class CollegeFinderAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="CollegeFinderAgent", role="Agent 1: College Finder Agent")

    def run(self, student: Dict[str, Any], colleges: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Filters colleges matching course and location preferences."""
        preferred_course = student.get("preferredCourse", "Computer Science and Engineering")
        preferred_city = student.get("preferredCity", "All / Any")
        target_district = student.get("targetDistrict", "")

        def fallback_filter():
            matched = []
            for col in colleges:
                # Check city / district if specified and not 'All'
                if preferred_city and preferred_city != "All / Any" and preferred_city.lower() not in col.get("city", "").lower():
                    continue
                if target_district and target_district.lower() not in col.get("district", "").lower():
                    continue

                # Check if course offered
                has_course = any(
                    preferred_course.lower() in c.get("branch", "").lower()
                    for c in col.get("courses", [])
                )
                if has_course or not col.get("courses"):
                    matched.append(col)

            # If filters were too restrictive, return top accredited colleges
            if not matched:
                matched = colleges[:6]

            summary = f"Located {len(matched)} premier institutions in Andhra Pradesh offering {preferred_course}."
            return {"matched_colleges": matched, "finder_summary": summary}

        system_prompt = (
            "You are an expert College Finder Agent for Indian engineering admissions. "
            "Filter the supplied colleges list according to the student's preferred course and location. "
            "Return JSON with 'matched_colleges' and 'finder_summary'."
        )
        user_prompt = f"Student Preferences: Course={preferred_course}, City={preferred_city}. Colleges data: {len(colleges)} records available."

        return self.call_llm_json(system_prompt, user_prompt, fallback_filter)
