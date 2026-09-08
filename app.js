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

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoUri }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

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

app.get('/', (req, res) => {
  res.render('layouts/main', { body: 'partials/home' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
