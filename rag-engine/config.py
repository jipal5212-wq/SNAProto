"""
Central configuration for the SNAP RAG Engine.
All tunable parameters live here.
"""
import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ── API Keys ──────────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_WORKSPACE_ID = os.getenv("ANTHROPIC_WORKSPACE_ID", "")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# ── Embedding ─────────────────────────────────────────────
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
CHUNK_SIZE = 400          # tokens per chunk (approx)
CHUNK_OVERLAP = 50        # overlap between chunks

# ── Paths ─────────────────────────────────────────────────
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", "./snap_rag.db")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

# ── Scoring Weights (8-Dimension Evaluation Framework) ───
SCORING_WEIGHTS = {
    "technical_fit": 0.25,        # Problem/Technical Fit (25%)
    "expected_impact": 0.20,      # Expected Impact (20%)
    "feasibility": 0.15,          # Feasibility of Implementation (15%)
    "cost_effectiveness": 0.10,   # Cost Effectiveness (10%)
    "scalability": 0.10,          # Scalability (10%)
    "security_privacy": 0.10,     # Security & Data Privacy (10%)
    "team_capability": 0.05,      # Startup Capability / Team (5%)
    "innovation": 0.05,           # Innovation (5%)
}

# ── Ranking ───────────────────────────────────────────────
CONSISTENCY_FLAG_PENALTY = 0.5   # deducted per flag from final score
TOP_N_SHORTLIST = 15             # default number of startups to shortlist

# ── Eligibility defaults ─────────────────────────────────
DEFAULT_ELIGIBILITY_RULES = {
    "max_turnover_cr": 100,       # max annual turnover in crores
    "dpiit_required": True,       # DPIIT recognition mandatory
    "min_incorporation_years": 0, # minimum years since incorporation
    "allowed_sectors": [],        # empty = all sectors allowed
}

# ── LLM settings ─────────────────────────────────────────
LLM_MAX_TOKENS = 4096
LLM_TEMPERATURE = 0.1            # low temperature for deterministic JSON
