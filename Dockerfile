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

# Ensure storage directories exist with correct write permissions
RUN mkdir -p /app/rag-engine/uploads /app/rag-engine/chroma_data /app/public/uploads

# Expose Node.js application port (which auto-manages port 8000 internally)
EXPOSE 5000

# Health check to ensure service is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

# Launch the unified application
CMD ["npm", "start"]
