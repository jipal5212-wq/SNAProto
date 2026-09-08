const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('layouts/main', { body: 'auth/login' });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('department startup');
    if (!user) {
      req.session.error = 'Invalid email or password.';
      return res.redirect('/auth/login');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.error = 'Invalid email or password.';
      return res.redirect('/auth/login');
    }

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      startup: user.startup
    };
    
    req.session.success = `Welcome back, ${user.name}!`;
    
    if (user.role === 'GOVERNMENT' || user.role === 'EVALUATOR') {
      res.redirect('/government/dashboard');
    } else if (user.role === 'STARTUP') {
      res.redirect('/startup/dashboard');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    req.session.error = 'An error occurred during login.';
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
