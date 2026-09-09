"""
Central configuration for the SNAP RAG Engine.
All tunable parameters live here.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ── API Keys ──────────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_WORKSPACE_ID = os.getenv("ANTHROPIC_WORKSPACE_ID", "")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")

# ── Embedding ─────────────────────────────────────────────
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
CHUNK_SIZE = 400          # tokens per chunk (approx)
CHUNK_OVERLAP = 50        # overlap between chunks

# ── Paths ─────────────────────────────────────────────────
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", "./snap_rag.db")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

# ── Scoring Weights ──────────────────────────────────────
SCORING_WEIGHTS = {
    "relevance": 0.30,
    "feasibility": 0.25,
    "innovation": 0.20,
    "team_credibility": 0.15,
    "pilot_readiness": 0.10,
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
