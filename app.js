require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/snap_prototype';

// Pre-register all Mongoose models so populate() works everywhere
require('./models/User');
require('./models/Department');
require('./models/Startup');
require('./models/Challenge');
require('./models/Application');
require('./models/Evaluation');
require('./models/Pilot');
require('./models/KPI');
require('./models/Validation');
require('./models/Recommendation');

// Connect to MongoDB with timeout and non-blocking query buffer
mongoose.set('bufferCommands', false);
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 })
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch(err => console.warn('⚠️ MongoDB Connection Warning (Continuing with resilient fallback):', err.message));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup with resilient fallback
const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'snap_secret_key_2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
};

// Only attach MongoStore if MONGODB_URI is provided and not localhost
if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('localhost')) {
  try {
    const store = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600,
      mongoOptions: { serverSelectionTimeoutMS: 5000 }
    });
    store.on('error', (err) => {
      console.warn('⚠️ Session store warning:', err.message);
    });
    sessionOptions.store = store;
  } catch (e) {
    console.warn('⚠️ Failed to initialize MongoStore, using in-memory store:', e.message);
  }
}

app.use(session(sessionOptions));

// Global variables for views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.error = req.session.error || null;
  res.locals.success = req.session.success || null;
  delete req.session.error;
  delete req.session.success;
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const startupRoutes = require('./routes/startupRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const pilotRoutes = require('./routes/pilotRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/auth', authRoutes);
app.use('/', challengeRoutes);
app.use('/', marketplaceRoutes);
app.use('/', startupRoutes);
app.use('/', applicationRoutes);
app.use('/', evaluationRoutes);
app.use('/', pilotRoutes);
app.use('/', dashboardRoutes);

// ── Health check (for Render / load balancers) ───────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SNAP GovTech Platform', version: '1.0.0' });
});

// Serve standalone RAG Engine frontend on the public web
app.get('/rag', (req, res) => {
  res.sendFile(path.join(__dirname, 'rag-engine', 'frontend', 'index.html'));
});

// Proxy RAG API requests to internal FastAPI microservice
const ragBaseUrl = process.env.RAG_ENGINE_URL || 'http://127.0.0.1:8000';
app.all(/^\/(problem|startup\/upload|shortlist|search)/, async (req, res) => {
  try {
    const targetUrl = `${ragBaseUrl}${req.originalUrl}`;
    const headers = { ...req.headers };
    delete headers.host;
    
    const fetchOptions = {
      method: req.method,
      headers: headers
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req;
      fetchOptions.duplex = 'half';
    }
    const response = await fetch(targetUrl, fetchOptions);
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    const data = await response.arrayBuffer();
    res.send(Buffer.from(data));
  } catch (err) {
    res.status(502).json({ error: 'RAG Microservice Gateway Error: ' + err.message });
  }
});

app.get('/', (req, res) => {
  res.render('layouts/main', { body: 'partials/home' });
});

// Auto-start RAG Engine microservice if not already running
const { spawn } = require('child_process');
const ragService = require('./services/ragService');

function ensureRagEngine() {
  ragService.isAvailable().then(isOnline => {
    if (isOnline) {
      console.log('⚡ RAG Engine microservice is active on http://127.0.0.1:8000');
    } else {
      console.log('🚀 Auto-starting RAG Engine microservice (port 8000)...');
      const ragDir = path.join(__dirname, 'rag-engine');
      const defaultWinPython = 'C:\\Users\\ASHISH KUMAR PAL\\AppData\\Local\\Python\\bin\\python.exe';
      const pythonExecutable = process.env.PYTHON_PATH || 
        (process.platform === 'win32' ? defaultWinPython : '/opt/venv/bin/python');
      
      const pyProc = spawn(pythonExecutable, ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
        cwd: ragDir,
        stdio: 'inherit',
        shell: false
      });

      pyProc.on('error', (err) => {
        console.warn('⚠️ Primary python spawn failed, falling back to "python3":', err.message);
        spawn(process.platform === 'win32' ? 'python' : 'python3', ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
          cwd: ragDir,
          stdio: 'inherit',
          shell: false
        });
      });

      process.on('exit', () => { try { pyProc.kill(); } catch (_) {} });
    }
  }).catch(() => {});
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` SNAP GovTech Platform active on http://0.0.0.0:${PORT}`);
  console.log(` AI RAG Microservice available on port 8000`);
  console.log(`====================================================`);
  ensureRagEngine();
});
