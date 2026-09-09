/**
 * Service to bridge SNAP (Node.js) with the RAG Evaluation & Shortlisting Engine (FastAPI).
 */
const fs = require('fs');
const path = require('path');

const RAG_BASE_URL = process.env.RAG_ENGINE_URL || 'http://127.0.0.1:8000';

class RagService {
  /**
   * Check if the RAG microservice is running.
   */
  async isAvailable() {
    try {
      const res = await fetch(`${RAG_BASE_URL}/docs`, {
        method: 'GET',
        signal: AbortSignal.timeout(1500)
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Register or synchronize a challenge problem statement in the RAG Engine.
   * Returns the numeric problem_id.
   */
  async syncProblem(challenge) {
    const problemText = [
      `Challenge Title: ${challenge.title}`,
      challenge.problemStatement ? `Problem Statement: ${challenge.problemStatement}` : '',
      challenge.rawProblem ? `Raw Problem Context: ${challenge.rawProblem}` : '',
      challenge.desiredOutcome ? `Desired Outcome: ${challenge.desiredOutcome}` : '',
      challenge.target ? `Target KPI: ${challenge.target}` : '',
      challenge.constraints && challenge.constraints.length ? `Constraints: ${challenge.constraints.join(', ')}` : '',
      challenge.budgetMax ? `Max Budget: Rs ${challenge.budgetMax}` : '',
      challenge.technologies && challenge.technologies.length ? `Preferred Tech: ${challenge.technologies.join(', ')}` : ''
    ].filter(Boolean).join('\n\n');

    const res = await fetch(`${RAG_BASE_URL}/problem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_text: problemText }),
      signal: AbortSignal.timeout(60000)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to sync problem statement to RAG engine');
    }

    const data = await res.json();
    return data.problem_id;
  }

  /**
   * Upload a startup's proposal document to the RAG Engine for parsing, eligibility & indexing.
   */
  async uploadSolutionDoc(problemId, startupName, filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const blob = new Blob([fileBuffer]);

    const formData = new FormData();
    formData.append('problem_id', String(problemId));
    formData.append('startup_name', startupName || 'Unknown');
    formData.append('file', blob, fileName);

    const res = await fetch(`${RAG_BASE_URL}/startup/upload`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(120000)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to upload document to RAG engine');
    }

    return await res.json();
  }

  /**
   * Fetch AI RAG shortlisted and ranked solutions for a problem.
   */
  async getShortlist(problemId, rescore = false) {
    const url = `${RAG_BASE_URL}/shortlist/${problemId}?rescore=${rescore}&top_n=15`;
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(180000)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch shortlist from RAG engine');
    }

    return await res.json();
  }

  /**
   * Cross-document semantic search using sentence-transformers + ChromaDB.
   */
  async searchSolutions(problemId, query) {
    const url = `${RAG_BASE_URL}/search?problem_id=${problemId}&query=${encodeURIComponent(query)}&top_k=10`;
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(30000)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to search RAG index');
    }

    return await res.json();
  }
}

module.exports = new RagService();
