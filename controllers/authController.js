const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const DEMO_USERS = {
  'gov@demo.com': {
    _id: '660000000000000000000001',
    name: 'Ministry of Urban Development',
    email: 'gov@demo.com',
    role: 'GOVERNMENT',
    department: { _id: '660000000000000000000010', name: 'Ministry of Housing and Urban Affairs' }
  },
  'startup@demo.com': {
    _id: '660000000000000000000002',
    name: 'AeroClean Technologies',
    email: 'startup@demo.com',
    role: 'STARTUP',
    startup: { _id: '660000000000000000000020', name: 'AeroClean Technologies' }
  },
  'evaluator@demo.com': {
    _id: '660000000000000000000003',
    name: 'Dr. Ramesh Sharma (Technical Evaluator)',
    email: 'evaluator@demo.com',
    role: 'EVALUATOR',
    department: { _id: '660000000000000000000010', name: 'Ministry of Housing and Urban Affairs' }
  },
  'admin@demo.com': {
    _id: '660000000000000000000004',
    name: 'SNAP Platform Administrator',
    email: 'admin@demo.com',
    role: 'ADMIN'
  }
};

exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('layouts/main', { body: 'auth/login' });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let loggedUser = null;

    // 1. If MongoDB is connected, attempt DB lookup
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email }).populate('department startup');
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            loggedUser = {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              department: user.department,
              startup: user.startup
            };
          }
        }
      } catch (dbErr) {
        console.warn('DB lookup failed, falling back to demo users:', dbErr.message);
      }
    }

    // 2. If not matched in DB, check standard demo accounts
    if (!loggedUser && DEMO_USERS[email]) {
      if (password === 'password' || password.length >= 1) {
        loggedUser = { ...DEMO_USERS[email] };
      }
    }

    if (!loggedUser) {
      req.session.error = 'Invalid email or password. Use demo accounts: gov@demo.com / password';
      return res.redirect('/auth/login');
    }

    req.session.user = loggedUser;

    // Set cookie payload for serverless/edge compatibility
    const payload = Buffer.from(JSON.stringify(loggedUser)).toString('base64');
    res.cookie('snap_user_payload', payload, { httpOnly: true, maxAge: 24 * 3600 * 1000, path: '/' });

    req.session.success = `Welcome back, ${loggedUser.name}!`;

    if (loggedUser.role === 'GOVERNMENT' || loggedUser.role === 'EVALUATOR') {
      return res.redirect('/government/dashboard');
    } else if (loggedUser.role === 'STARTUP') {
      return res.redirect('/startup/dashboard');
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error('Login error:', err);
    req.session.error = 'An error occurred during login. Please try again.';
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('snap_user_payload', { path: '/' });
  req.session.destroy();
  res.redirect('/');
};
