"""
Ranker.
Computes final weighted score from dimension scores, applies consistency flag penalties,
sorts descending, and returns top N solutions.
"""
from config import SCORING_WEIGHTS, CONSISTENCY_FLAG_PENALTY, TOP_N_SHORTLIST


def compute_final_score(scores: dict, consistency_flags: list) -> float:
    """
    Compute weighted final score and apply per-flag penalty.
    All dimension scores are on 1-5 scale.
    Final score normalized to 0-10 range for readability.
    """
    dimensions = ["relevance", "feasibility", "innovation", "team_credibility", "pilot_readiness"]

    raw_score = 0.0
    total_weight = 0.0

    for dim in dimensions:
        weight = SCORING_WEIGHTS.get(dim, 0)
        score = scores.get(dim, 1)
        raw_score += weight * score
        total_weight += weight

    # Normalize to 0-10 scale (raw is 1-5 weighted avg → multiply by 2)
    if total_weight > 0:
        weighted_avg = raw_score / total_weight  # 1.0 - 5.0
        normalized = (weighted_avg - 1) / 4 * 10  # 0 - 10
    else:
        normalized = 0.0

    # Penalty per consistency flag
    penalty = len(consistency_flags) * CONSISTENCY_FLAG_PENALTY
    final = max(0.0, normalized - penalty)

    return round(final, 2)


def rank_solutions(scored_solutions: list[dict], top_n: int = TOP_N_SHORTLIST) -> list[dict]:
    """
    Rank a list of scored solutions.

    Each item in scored_solutions should have:
    - solution_id
    - startup_name
    - filename
    - scores: {relevance, feasibility, innovation, team_credibility, pilot_readiness}
    - justification: {dim: "text"}
    - consistency_flags: [str]
    - solution_json: dict (optional, for display)

    Returns sorted list (descending final_score), sliced to top_n.
    """
    ranked = []

    for item in scored_solutions:
        scores = {
            "relevance": item.get("relevance", 1),
            "feasibility": item.get("feasibility", 1),
            "innovation": item.get("innovation", 1),
            "team_credibility": item.get("team_credibility", 1),
            "pilot_readiness": item.get("pilot_readiness", 1),
        }

        import json
        flags_raw = item.get("consistency_flags", "[]")
        if isinstance(flags_raw, str):
            try:
                flags = json.loads(flags_raw)
            except Exception:
                flags = []
        else:
            flags = flags_raw or []

        final_score = compute_final_score(scores, flags)

        jus_raw = item.get("justification_json", "{}")
        if isinstance(jus_raw, str):
            try:
                justification = json.loads(jus_raw)
            except Exception:
                justification = {}
        else:
            justification = jus_raw or {}

        ranked.append({
            "solution_id": item.get("solution_id") or item.get("id"),
            "rank": 0,  # filled after sort
            "startup_name": item.get("startup_name", "Unknown"),
            "filename": item.get("filename", ""),
            "final_score": final_score,
            "scores": scores,
            "justification": justification,
            "consistency_flags": flags,
            "flag_count": len(flags),
            "penalty_applied": len(flags) * CONSISTENCY_FLAG_PENALTY,
        })

    # Sort descending
    ranked.sort(key=lambda x: x["final_score"], reverse=True)

    # Assign ranks
    for i, item in enumerate(ranked):
        item["rank"] = i + 1

    return ranked[:top_n]


if __name__ == "__main__":
    import json

    sample_solutions = [
        {
            "solution_id": 1,
            "startup_name": "TechSense Solutions",
            "filename": "techsense.pdf",
            "relevance": 5, "feasibility": 4, "innovation": 4,
            "team_credibility": 4, "pilot_readiness": 5,
            "justification_json": json.dumps({
                "relevance": "Directly addresses pipeline leak detection",
                "feasibility": "Realistic cost and timeline",
                "innovation": "Novel acoustic sensor approach",
                "team_credibility": "Experienced IIT alumni team",
                "pilot_readiness": "Ready to deploy in 30 days"
            }),
            "consistency_flags": "[]"
        },
        {
            "solution_id": 2,
            "startup_name": "SmartWater AI",
            "filename": "smartwater.pdf",
            "relevance": 4, "feasibility": 3, "innovation": 5,
            "team_credibility": 3, "pilot_readiness": 3,
            "justification_json": json.dumps({
                "relevance": "Addresses leak detection with AI",
                "feasibility": "Cost is slightly high",
                "innovation": "Cutting-edge ML approach",
                "team_credibility": "Small team, limited track record",
                "pilot_readiness": "Needs 2 months setup"
            }),
            "consistency_flags": json.dumps(["TRL claims deployed but only prototype exists"])
        },
    ]

    results = rank_solutions(sample_solutions, top_n=10)
    for r in results:
        print(f"#{r['rank']} {r['startup_name']}: {r['final_score']}/10 "
              f"(flags: {r['flag_count']}, penalty: -{r['penalty_applied']})")
