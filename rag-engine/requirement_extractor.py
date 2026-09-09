"""
Requirement Extractor.
Input: raw text of a government problem statement
Output: structured JSON with outcomes, constraints, and criteria
"""
from llm_client import call_claude_json

SYSTEM_PROMPT = """You are a government procurement analyst.
Extract structured requirements from a government problem statement.
Output ONLY valid JSON matching this exact schema — no markdown, no explanation:
{
  "outcomes_wanted": ["list of desired outcomes"],
  "target_users": "description of who benefits",
  "constraints": ["list of constraints like budget, timeline, regulations"],
  "must_have_criteria": ["mandatory features/capabilities the solution must have"],
  "nice_to_have_criteria": ["optional but preferred features"],
  "domain": "sector/domain (e.g. healthcare, transport, agriculture)",
  "problem_severity": "low/medium/high"
}"""


def extract_requirements(problem_text: str) -> dict:
    """
    Parse government problem statement into structured requirements JSON.
    Returns structured dict or a safe fallback.
    """
    user_prompt = f"""Government Problem Statement:
---
{problem_text}
---
Extract requirements as JSON."""

    fallback = {
        "outcomes_wanted": [],
        "target_users": "Government department",
        "constraints": [],
        "must_have_criteria": [],
        "nice_to_have_criteria": [],
        "domain": "general",
        "problem_severity": "medium"
    }

    result = call_claude_json(SYSTEM_PROMPT, user_prompt, fallback=fallback)

    # Ensure all required keys exist
    for key in fallback:
        if key not in result:
            result[key] = fallback[key]

    return result


if __name__ == "__main__":
    # Quick test
    sample = """
    The Municipal Corporation faces difficulty in monitoring 500+ km of water pipelines for 
    leaks in real time. Current manual inspection takes 3 weeks and leaks cause 40% water loss.
    Budget is limited to Rs 2 crore for pilot. Solution must integrate with existing SCADA systems.
    DPIIT-registered startups only. Must be deployable within 6 months.
    """
    import json
    result = extract_requirements(sample)
    print(json.dumps(result, indent=2))
