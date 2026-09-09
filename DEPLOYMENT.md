# 🚀 S.N.A.P - Full-Stack Production Deployment Guide

Deploy the entire platform — **Frontend + Backend + AI RAG Microservice + Database** — all together into production.

---

## ⚡ Option 1: 1-Click Free Cloud Deployment on Render

Render provides free hosting for web services and natively builds the unified Docker container.

### Step-by-Step Instructions:
1. Go to **[Render.com](https://render.com)** and sign in with your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository**.
4. Choose or enter your GitHub repository:
   ```
   https://github.com/jipal5212-wq/SNAProto
   ```
5. Render will automatically detect the **`Dockerfile`**.
6. Set the following environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your MongoDB connection string (e.g. from free MongoDB Atlas below)*
   - `SESSION_SECRET`: `snap_production_super_secret_key_2026`
   - `ANTHROPIC_API_KEY`: *(Optional) Your Claude API key if you wish to use live Anthropic instead of the offline heuristic engine*
7. Click **Create Web Service**.
8. Render will build the container, install Node + Python RAG dependencies, and give you a live **`https://snap-xxxx.onrender.com`** URL!

---

## 🚂 Option 2: 1-Click Deployment on Railway

Railway supports multi-service deployments with integrated MongoDB.

### Step-by-Step Instructions:
1. Go to **[Railway.app](https://railway.app)** and log in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo** -> Select `jipal5212-wq/SNAProto`.
3. Click **Add a Service** -> Select **Database** -> **MongoDB**.
4. Railway will automatically inject the `MONGO_URL` / `MONGODB_URI` environment variable into your web service.
5. Click **Deploy**. Railway will build the Docker container and provide a live public HTTPS domain (`https://xxxx.up.railway.app`).

---

## 🐳 Option 3: Local or VPS Deployment with Docker Compose

If you have Docker Desktop or a VPS (Ubuntu / Debian / AWS EC2 / DigitalOcean Droplet):

```bash
# 1. Clone repository
git clone https://github.com/jipal5212-wq/SNAProto.git
cd SNAProto

# 2. Launch the entire stack (Node.js + Python FastAPI + MongoDB 7.0)
docker compose up -d

# 3. View running containers
docker compose ps

# 4. Access the platform
# Web Portal: http://localhost:5000
# AI RAG Engine: http://localhost:5000/rag (or http://localhost:8000)
# Interactive API Docs: http://localhost:8000/docs
```

To view logs:
```bash
docker compose logs -f app
```

To stop:
```bash
docker compose down
```

---

## 🍃 Setting up a Free MongoDB Atlas Database (For Cloud Deployments)

For cloud hosting on Render, Railway, or AWS, use a free MongoDB Atlas cluster:
1. Go to **[mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)** and sign up for free.
2. Create a **Shared (M0 Free)** cluster in your preferred region (e.g., AWS Mumbai / ap-south-1).
3. Under **Database Access**, create a user (e.g. `snap_admin` with password).
4. Under **Network Access**, click **Add IP Address** -> Select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** -> **Drivers (Node.js)** -> Copy your connection string:
   ```
   mongodb+srv://snap_admin:<password>@cluster0.xxxxx.mongodb.net/snap_prototype?retryWrites=true&w=majority
   ```
6. Paste this string as `MONGODB_URI` in your Render or Railway environment settings.

---

## 📋 Production Environment Variables Reference

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `PORT` | Optional | `5000` | Port for the Node.js web portal (set dynamically by Render/Railway) |
| `MONGODB_URI` | **Required** | `mongodb://localhost:27017/snap_prototype` | Connection URI for MongoDB database |
| `SESSION_SECRET` | Optional | `snap_secret_key` | Secret key for encrypted session cookies |
| `PYTHON_PATH` | Optional | `/opt/venv/bin/python` | Path to Python executable in container |
| `RAG_ENGINE_URL` | Optional | `http://127.0.0.1:8000` | Internal URL for the Python FastAPI RAG microservice |
| `ANTHROPIC_API_KEY` | Optional | `""` | Claude Sonnet API key for live AI scoring (falls back to local heuristic engine if not provided) |
