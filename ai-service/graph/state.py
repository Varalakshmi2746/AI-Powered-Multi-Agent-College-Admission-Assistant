from typing import TypedDict, List, Dict, Any, Optional

class AgentState(TypedDict):
    # Input user / student context
    student: Dict[str, Any]
    user_query: Optional[str]
    selected_colleges: Optional[List[str]]
    
    # Internal agent pipeline data
    all_colleges: List[Dict[str, Any]]
    found_colleges: List[Dict[str, Any]]
    eligibility_results: List[Dict[str, Any]]
    fee_results: List[Dict[str, Any]]
    comparison_data: Optional[Dict[str, Any]]
    guidance_notes: List[str]
    
    # Agent insights
    finder_summary: str
    eligibility_summary: str
    fee_summary: str
    comparison_summary: str
    guidance_summary: str
    
    # Final synthesized recommendation output
    coordinator_verdict: str
    final_recommendations: List[Dict[str, Any]]
    error: Optional[str]
