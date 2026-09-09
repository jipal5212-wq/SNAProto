"""
SQLite database layer.
Stores problems, solutions, scores, and all intermediate JSON for debugging.
"""
import sqlite3
import json
import os
from config import SQLITE_DB_PATH

def get_connection():
    """Return a sqlite3 connection with row_factory set."""
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    """Create tables if they don't exist."""
    conn = get_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            raw_text TEXT NOT NULL,
            requirements_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS solutions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            problem_id INTEGER NOT NULL,
            startup_name TEXT DEFAULT 'Unknown',
            filename TEXT,
            raw_text TEXT,
            solution_json TEXT,
            eligible INTEGER DEFAULT 1,
            eligibility_reason TEXT DEFAULT '',
            consistency_flags TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (problem_id) REFERENCES problems(id)
        );

        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            solution_id INTEGER NOT NULL,
            problem_id INTEGER NOT NULL,
            relevance REAL,
            feasibility REAL,
            innovation REAL,
            team_credibility REAL,
            pilot_readiness REAL,
            justification_json TEXT,
            final_score REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (solution_id) REFERENCES solutions(id),
            FOREIGN KEY (problem_id) REFERENCES problems(id)
        );
    """)
    conn.commit()
    conn.close()

# ── Problem CRUD ─────────────────────────────────────────

def insert_problem(raw_text: str, requirements_json: dict) -> int:
    conn = get_connection()
    cur = conn.execute(
        "INSERT INTO problems (raw_text, requirements_json) VALUES (?, ?)",
        (raw_text, json.dumps(requirements_json))
    )
    pid = cur.lastrowid
    conn.commit()
    conn.close()
    return pid

def get_problem(problem_id: int) -> dict | None:
    conn = get_connection()
    row = conn.execute("SELECT * FROM problems WHERE id = ?", (problem_id,)).fetchone()
    conn.close()
    if row is None:
        return None
    return dict(row)

# ── Solution CRUD ────────────────────────────────────────

def insert_solution(problem_id: int, startup_name: str, filename: str,
                    raw_text: str, solution_json: dict,
                    eligible: bool, eligibility_reason: str,
                    consistency_flags: list) -> int:
    conn = get_connection()
    cur = conn.execute(
        """INSERT INTO solutions
           (problem_id, startup_name, filename, raw_text, solution_json,
            eligible, eligibility_reason, consistency_flags)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (problem_id, startup_name, filename, raw_text,
         json.dumps(solution_json), int(eligible), eligibility_reason,
         json.dumps(consistency_flags))
    )
    sid = cur.lastrowid
    conn.commit()
    conn.close()
    return sid

def get_solutions_for_problem(problem_id: int, eligible_only: bool = True) -> list[dict]:
    conn = get_connection()
    query = "SELECT * FROM solutions WHERE problem_id = ?"
    if eligible_only:
        query += " AND eligible = 1"
    rows = conn.execute(query, (problem_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_solution(solution_id: int) -> dict | None:
    conn = get_connection()
    row = conn.execute("SELECT * FROM solutions WHERE id = ?", (solution_id,)).fetchone()
    conn.close()
    if row is None:
        return None
    return dict(row)

# ── Score CRUD ───────────────────────────────────────────

def insert_score(solution_id: int, problem_id: int, scores: dict,
                 justification: dict, final_score: float) -> int:
    conn = get_connection()
    cur = conn.execute(
        """INSERT INTO scores
           (solution_id, problem_id, relevance, feasibility, innovation,
            team_credibility, pilot_readiness, justification_json, final_score)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (solution_id, problem_id,
         scores.get("relevance", 0), scores.get("feasibility", 0),
         scores.get("innovation", 0), scores.get("team_credibility", 0),
         scores.get("pilot_readiness", 0),
         json.dumps(justification), final_score)
    )
    sid = cur.lastrowid
    conn.commit()
    conn.close()
    return sid

def get_scores_for_problem(problem_id: int) -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        """SELECT sc.*, s.startup_name, s.filename, s.consistency_flags
           FROM scores sc
           JOIN solutions s ON sc.solution_id = s.id
           WHERE sc.problem_id = ?
           ORDER BY sc.final_score DESC""",
        (problem_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def delete_scores_for_problem(problem_id: int):
    """Clear existing scores before re-scoring."""
    conn = get_connection()
    conn.execute("DELETE FROM scores WHERE problem_id = ?", (problem_id,))
    conn.commit()
    conn.close()
