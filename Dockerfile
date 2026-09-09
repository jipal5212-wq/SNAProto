# ==============================================================================
# S.N.A.P - Startup Network & Automated Procurement
# Production Unified Dockerfile (Frontend + Backend + AI RAG Engine)
# ==============================================================================

FROM node:20-bookworm-slim

# Prevent prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production
ENV PORT=5000

# Install Python 3, pip, build dependencies, curl and git
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# 1. Install Python RAG Engine dependencies in a clean virtualenv
COPY rag-engine/requirements.txt ./rag-engine/
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r rag-engine/requirements.txt

# 2. Install Node.js dependencies
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# 3. Copy application source code
COPY . .

# Ensure writable storage directories for uploads, vector DB, SQLite
# /data is mounted as a persistent disk on Render; fall back to /app/data locally
RUN mkdir -p /data/uploads /data/chroma_data /app/rag-engine/uploads /app/public/uploads

# Set env defaults for paths (overridden by render.yaml env vars in prod)
ENV CHROMA_PERSIST_DIR=/data/chroma_data
ENV SQLITE_DB_PATH=/data/snap_rag.db
ENV UPLOAD_DIR=/data/uploads
ENV PYTHON_PATH=/opt/venv/bin/python

# Expose Node.js application port (which auto-manages port 8000 internally)
EXPOSE 5000

# Health check — Express app must respond within 60s of container start
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:5000/health || exit 1

# Launch the unified application (Node.js starts FastAPI as a subprocess)
CMD ["npm", "start"]
