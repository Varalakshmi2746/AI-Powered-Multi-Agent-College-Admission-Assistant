import os
import uvicorn
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

from graph.workflow import admission_graph, load_colleges_data
from agents.coordinator_agent import CoordinatorAgent
from agents.college_finder_agent import CollegeFinderAgent
from agents.eligibility_agent import AdmissionEligibilityAgent
from agents.fee_analysis_agent import FeeAnalysisAgent
from agents.comparison_agent import CollegeComparisonAgent
from agents.guidance_agent import AdmissionGuidanceAgent

app = FastAPI(
    title="AI-Powered Multi-Agent College Admission Assistant API",
    description="LangGraph Multi-Agent Orchestration Service for College Admissions",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate agents
coordinator_agent = CoordinatorAgent()
finder_agent = CollegeFinderAgent()
eligibility_agent = AdmissionEligibilityAgent()
fee_agent = FeeAnalysisAgent()
comparison_agent = CollegeComparisonAgent()
guidance_agent = AdmissionGuidanceAgent()

# Pydantic Schemas
class StudentProfileSchema(BaseModel):
    intermediateMarks: Optional[float] = 85.0
    entranceExamName: Optional[str] = "AP EAPCET"
    entranceExamRank: Optional[int] = 8500
    category: Optional[str] = "OC"
    preferredCourse: Optional[str] = "Computer Science and Engineering"
    preferredState: Optional[str] = "Andhra Pradesh"
    preferredCity: Optional[str] = "All / Any"
    annualBudget: Optional[int] = 180000
    hostelRequired: Optional[bool] = True
    targetDistrict: Optional[str] = ""

class RecommendRequest(BaseModel):
    student: StudentProfileSchema
    user_query: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    agent_role: Optional[str] = "coordinator"
    student: Optional[Dict[str, Any]] = None
    history: Optional[List[Dict[str, Any]]] = None

class CompareRequest(BaseModel):
    colleges: List[Dict[str, Any]]

class GuidanceRequest(BaseModel):
    query: Optional[str] = ""

@app.get("/")
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "AI-Powered Multi-Agent College Admission Service",
        "framework": "FastAPI + LangGraph",
        "agents": [
            "Agent 1: College Finder Agent",
            "Agent 2: Admission Eligibility Agent",
            "Agent 3: Fee Analysis Agent",
            "Agent 4: College Comparison Agent",
            "Agent 5: Admission Guidance Agent",
            "Agent 6: AI Admission Coordinator"
        ],
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
    }

@app.post("/agents/coordinator/recommend")
def run_coordinator_recommendations(req: RecommendRequest):
    """Executes the full LangGraph multi-agent orchestration pipeline."""
    try:
        colleges = load_colleges_data()
        initial_state = {
            "student": req.student.model_dump(),
            "user_query": req.user_query,
            "all_colleges": colleges,
            "found_colleges": [],
            "eligibility_results": [],
            "fee_results": [],
            "comparison_data": None,
            "guidance_notes": [],
            "finder_summary": "",
            "eligibility_summary": "",
            "fee_summary": "",
            "comparison_summary": "",
            "guidance_summary": "",
            "coordinator_verdict": "",
            "final_recommendations": [],
            "error": None,
        }

        # Run through LangGraph multi-agent workflow
        final_state = admission_graph.invoke(initial_state)

        return {
            "success": True,
            "source": "langgraph_multi_agent",
            "querySummary": {
                "rank": req.student.entranceExamRank,
                "course": req.student.preferredCourse,
                "budget": req.student.annualBudget,
                "category": req.student.category,
            },
            "coordinatorVerdict": final_state.get("coordinator_verdict"),
            "agentSummaries": {
                "finderAgent": final_state.get("finder_summary"),
                "eligibilityAgent": final_state.get("eligibility_summary"),
                "feeAgent": final_state.get("fee_summary"),
                "guidanceAgent": final_state.get("guidance_summary"),
            },
            "recommendations": final_state.get("final_recommendations", []),
        }
    except Exception as e:
        print(f"[Error in LangGraph Execution]: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents/chat")
def chat_agent(req: ChatRequest):
    """Conversational interaction with specialized agents."""
    try:
        result = coordinator_agent.chat(
            message=req.message,
            agent_role=req.agent_role or "coordinator",
            student=req.student or {},
            history=req.history or []
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents/finder")
def run_finder(req: RecommendRequest):
    colleges = load_colleges_data()
    return finder_agent.run(req.student.model_dump(), colleges)

@app.post("/agents/eligibility")
def run_eligibility(req: RecommendRequest):
    colleges = load_colleges_data()
    return eligibility_agent.run(req.student.model_dump(), colleges)

@app.post("/agents/fees")
def run_fees(req: RecommendRequest):
    colleges = load_colleges_data()
    return fee_agent.run(req.student.model_dump(), colleges)

@app.post("/agents/compare")
def run_compare(req: CompareRequest):
    return comparison_agent.run(req.colleges)

@app.post("/agents/guidance")
def run_guidance(req: GuidanceRequest):
    return guidance_agent.run(req.query or "")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting Multi-Agent AI Service on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
