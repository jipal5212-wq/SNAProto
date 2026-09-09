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

// Connect to MongoDB with timeout
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
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
let sessionStore;
try {
  sessionStore = MongoStore.create({
    mongoUrl: mongoUri,
    touchAfter: 24 * 3600
  });
  sessionStore.on('error', (err) => {
    console.warn('⚠️ Session store warning (using in-memory fallback):', err.message);
  });
} catch (e) {
  console.warn('⚠️ Failed to initialize MongoStore, using in-memory store:', e.message);
}

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'snap_secret_key_2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
};
if (sessionStore) {
  sessionOptions.store = sessionStore;
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

// Unified RAG routes
app.get('/rag', (req, res) => res.redirect('http://127.0.0.1:8000'));
app.get('/rag/docs', (req, res) => res.redirect('http://127.0.0.1:8000/docs'));

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
        (process.platform === 'win32' ? defaultWinPython : 'python3');
      
      const pyProc = spawn(pythonExecutable, ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
        cwd: ragDir,
        stdio: 'inherit',
        shell: false
      });

      pyProc.on('error', (err) => {
        console.warn('⚠️ Primary python spawn failed, falling back to "python":', err.message);
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

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` SNAP GovTech Platform active on http://localhost:${PORT}`);
  console.log(` AI RAG Microservice available on http://localhost:8000`);
  console.log(`====================================================`);
  ensureRagEngine();
});
