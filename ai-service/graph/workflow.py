import os
import json
from typing import Dict, Any
from langgraph.graph import StateGraph, START, END
from graph.state import AgentState
from agents.college_finder_agent import CollegeFinderAgent
from agents.eligibility_agent import AdmissionEligibilityAgent
from agents.fee_analysis_agent import FeeAnalysisAgent
from agents.guidance_agent import AdmissionGuidanceAgent
from agents.coordinator_agent import CoordinatorAgent

finder_agent = CollegeFinderAgent()
eligibility_agent = AdmissionEligibilityAgent()
fee_agent = FeeAnalysisAgent()
guidance_agent = AdmissionGuidanceAgent()
coordinator_agent = CoordinatorAgent()

# Helper to load cached college data
def load_colleges_data():
    cache_path = os.path.join(os.path.dirname(__file__), "..", "data", "colleges_cache.json")
    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

# Node 1: College Finder Node
def finder_node(state: AgentState) -> Dict[str, Any]:
    colleges = state.get("all_colleges") or load_colleges_data()
    student = state.get("student", {})
    res = finder_agent.run(student, colleges)
    return {
        "all_colleges": colleges,
        "found_colleges": res.get("matched_colleges", colleges),
        "finder_summary": res.get("finder_summary", "Filtered relevant colleges."),
    }

# Node 2: Admission Eligibility Node
def eligibility_node(state: AgentState) -> Dict[str, Any]:
    student = state.get("student", {})
    candidate_colleges = state.get("found_colleges", [])
    res = eligibility_agent.run(student, candidate_colleges)
    return {
        "eligibility_results": res.get("evaluations", []),
        "eligibility_summary": res.get("eligibility_summary", "Analyzed rank criteria."),
    }

# Node 3: Fee Analysis Node
def fee_node(state: AgentState) -> Dict[str, Any]:
    student = state.get("student", {})
    candidate_colleges = state.get("found_colleges", [])
    res = fee_agent.run(student, candidate_colleges)
    return {
        "fee_results": res.get("fee_analysis", []),
        "fee_summary": res.get("fee_summary", "Evaluated fee affordability."),
    }

# Node 4: Admission Guidance Node
def guidance_node(state: AgentState) -> Dict[str, Any]:
    query = state.get("user_query", "")
    res = guidance_agent.run(query)
    return {
        "guidance_notes": [s.get("title") for s in res.get("counselling_steps", [])],
        "guidance_summary": res.get("guidance_summary", "Compiled official counselling requirements."),
    }

# Node 5: Coordinator Orchestration Node
def coordinator_node(state: AgentState) -> Dict[str, Any]:
    student = state.get("student", {})
    finder_data = {"matched_colleges": state.get("found_colleges", [])}
    eligibility_data = {"evaluations": state.get("eligibility_results", [])}
    fee_data = {"fee_analysis": state.get("fee_results", [])}
    guidance_data = {"guidance_summary": state.get("guidance_summary", "")}

    res = coordinator_agent.synthesize_recommendations(
        student=student,
        finder_data=finder_data,
        eligibility_data=eligibility_data,
        fee_data=fee_data,
        guidance_data=guidance_data,
    )

    return {
        "coordinator_verdict": res.get("coordinator_verdict", "Multi-agent synthesis finished."),
        "final_recommendations": res.get("final_recommendations", []),
    }

def create_multi_agent_graph():
    """Builds and compiles the LangGraph StateGraph multi-agent orchestration workflow."""
    builder = StateGraph(AgentState)

    builder.add_node("college_finder", finder_node)
    builder.add_node("admission_eligibility", eligibility_node)
    builder.add_node("fee_analysis", fee_node)
    builder.add_node("admission_guidance", guidance_node)
    builder.add_node("coordinator", coordinator_node)

    # Multi-agent sequential pipeline
    builder.add_edge(START, "college_finder")
    builder.add_edge("college_finder", "admission_eligibility")
    builder.add_edge("admission_eligibility", "fee_analysis")
    builder.add_edge("fee_analysis", "admission_guidance")
    builder.add_edge("admission_guidance", "coordinator")
    builder.add_edge("coordinator", END)

    return builder.compile()

# Singleton compiled workflow
admission_graph = create_multi_agent_graph()
