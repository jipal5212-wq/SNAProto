"""
Scorer.
Uses Claude as an LLM-judge to score each startup solution against requirements.
Scores 5 dimensions on a 1-5 scale with mandatory justifications.
"""
import json
from llm_client import call_claude_json

SYSTEM_PROMPT = """You are an expert government procurement evaluator assessing startup solutions.
Score the startup solution against the government's requirements on 5 dimensions.
Each score must be 1-5 (integer). Each score must have a one-line justification.

Scoring Rubric:
- 1 = Very Poor / Not addressed
- 2 = Below expectations
- 3 = Meets basic requirements
- 4 = Exceeds expectations  
- 5 = Exceptional / Best possible

Dimensions:
1. relevance: How well does the solution address the specific problem and desired outcomes?
2. feasibility: How realistic is the proposed approach, timeline, and cost within government constraints?
3. innovation: How novel or differentiated is the approach compared to conventional solutions?
4. team_credibility: How credible and experienced is the team to deliver this solution?
5. pilot_readiness: How ready is the startup to begin a controlled pilot immediately?

Output ONLY valid JSON — no markdown, no explanation:
{
  "relevance": <1-5>,
  "feasibility": <1-5>,
  "innovation": <1-5>,
  "team_credibility": <1-5>,
  "pilot_readiness": <1-5>,
  "justification": {
    "relevance": "one-line explanation",
    "feasibility": "one-line explanation",
    "innovation": "one-line explanation",
    "team_credibility": "one-line explanation",
    "pilot_readiness": "one-line explanation"
  }
}"""


def score_solution(requirements: dict, solution: dict) -> dict:
    """
    Score a solution against requirements using Claude as LLM-judge.
    Returns dict with scores 1-5 per dimension + justifications.
    """
    user_prompt = f"""Government Requirements:
{json.dumps(requirements, indent=2)}

Startup Solution:
{json.dumps(solution, indent=2)}

Score this solution against the requirements."""

    fallback = {
        "relevance": 1,
        "feasibility": 1,
        "innovation": 1,
        "team_credibility": 1,
        "pilot_readiness": 1,
        "justification": {
            "relevance": "Scoring failed — could not evaluate",
            "feasibility": "Scoring failed — could not evaluate",
            "innovation": "Scoring failed — could not evaluate",
            "team_credibility": "Scoring failed — could not evaluate",
            "pilot_readiness": "Scoring failed — could not evaluate"
        }
    }

    result = call_claude_json(SYSTEM_PROMPT, user_prompt, fallback=fallback)

    # Validate scores are integers in 1-5 range
    dimensions = ["relevance", "feasibility", "innovation", "team_credibility", "pilot_readiness"]
    for dim in dimensions:
        if dim not in result:
            result[dim] = 1
        else:
            try:
                val = int(result[dim])
                result[dim] = max(1, min(5, val))
            except (ValueError, TypeError):
                result[dim] = 1

    if "justification" not in result or not isinstance(result["justification"], dict):
        result["justification"] = fallback["justification"]

    return result


if __name__ == "__main__":
    reqs = {
        "outcomes_wanted": ["Real-time leak detection", "30% reduction in water loss"],
        "target_users": "Municipal water department",
        "constraints": ["Budget: Rs 2 crore", "Timeline: 6 months", "Must integrate with SCADA"],
        "must_have_criteria": ["IoT sensors", "Real-time alerts", "SCADA integration"],
        "nice_to_have_criteria": ["Mobile app", "AI prediction"],
        "domain": "water management"
    }
    sol = {
        "startup_name": "TechSense Solutions",
        "approach_summary": "IoT acoustic sensors for real-time pipeline leak detection",
        "tech_stack": ["Raspberry Pi", "MQTT", "AWS IoT Core", "React"],
        "trl_level": "TRL 7 - demonstrated in operational environment",
        "team_experience": "12 engineers, IIT alumni, 5 years experience",
        "pilot_readiness": "Ready to deploy in 30 days",
        "cost_estimate": "Rs 45 lakhs for 100km pilot",
        "claimed_outcomes": ["30% water loss reduction", "< 2min alert latency"]
    }
    result = score_solution(reqs, sol)
    print(json.dumps(result, indent=2))
