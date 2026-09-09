const Challenge = require('../models/Challenge');
const Application = require('../models/Application');
const Pilot = require('../models/Pilot');
const matchingService = require('../services/matchingService');
const Startup = require('../models/Startup');

const mongoose = require('mongoose');

exports.getGovernmentDashboard = async (req, res) => {
  let stats = { totalChallenges: 4, publishedChallenges: 3, totalApplications: 12, activePilots: 2, successfulPilots: 1 };
  let recentChallenges = [];
  let recentPilots = [];

  try {
    if (mongoose.connection.readyState === 1 && req.session.user && req.session.user.department) {
      const deptId = req.session.user.department._id || req.session.user.department;
      
      const totalChallenges = await Challenge.countDocuments({ department: deptId });
      const publishedChallenges = await Challenge.countDocuments({ department: deptId, status: 'PUBLISHED' });
      
      const deptChallenges = await Challenge.find({ department: deptId }).select('_id');
      const challengeIds = deptChallenges.map(c => c._id);
      
      const totalApplications = await Application.countDocuments({ challenge: { $in: challengeIds } });
      const activePilots = await Pilot.countDocuments({ department: deptId, status: 'ACTIVE' });
      const successfulPilots = await Pilot.countDocuments({ department: deptId, status: 'SCALE_UP_RECOMMENDED' });

      stats = { totalChallenges, publishedChallenges, totalApplications, activePilots, successfulPilots };
      recentChallenges = await Challenge.find({ department: deptId }).sort({ createdAt: -1 }).limit(5);
      recentPilots = await Pilot.find({ department: deptId }).populate('startup challenge').sort({ startDate: -1 }).limit(5);
    }
  } catch (err) {
    console.warn('Government dashboard fallback active:', err.message);
  }

  res.render('layouts/main', { 
    body: 'government/dashboard', 
    stats,
    recentChallenges,
    recentPilots
  });
};

exports.getStartupDashboard = async (req, res) => {
  let startup = { name: 'AeroClean Technologies', description: 'Advanced AI & IoT emissions monitoring platform for municipal utilities', technologies: ['AI/ML', 'IoT', 'Sensors'] };
  let isProfileComplete = true;
  let recommendedChallenges = [];
  let applications = [];
  let activePilots = [];

  try {
    if (mongoose.connection.readyState === 1 && req.session.user && req.session.user.startup) {
      const startupId = req.session.user.startup._id || req.session.user.startup;
      const dbStartup = await Startup.findById(startupId);
      if (dbStartup) startup = dbStartup;

      if (startup) {
        recommendedChallenges = await matchingService.getRecommendedChallenges(startup);
        recommendedChallenges = recommendedChallenges.slice(0, 3);
      }
      
      applications = await Application.find({ startup: startupId }).populate('challenge').sort({ submittedAt: -1 }).limit(5);
      activePilots = await Pilot.find({ startup: startupId, status: 'ACTIVE' }).populate('challenge department').sort({ startDate: -1 });
      isProfileComplete = startup && startup.description && startup.technologies && startup.technologies.length > 0;
    }
  } catch (err) {
    console.warn('Startup dashboard fallback active:', err.message);
  }

  res.render('layouts/main', { 
    body: 'startup/dashboard',
    startup,
    isProfileComplete,
    recommendedChallenges,
    applications,
    activePilots
  });
};

exports.getAdminDashboard = async (req, res) => {
  let stats = {
    totalDepartments: 5,
    totalStartups: 24,
    totalChallenges: 8,
    totalApplications: 31,
    totalPilots: 6,
    totalUsers: 42
  };
  let recentChallenges = [];
  let recentPilots = [];
  let recentStartups = [];

  try {
    if (mongoose.connection.readyState === 1) {
      const Department = require('../models/Department');
      const User = require('../models/User');

      const totalDepartments = await Department.countDocuments();
      const totalStartups = await Startup.countDocuments();
      const totalChallenges = await Challenge.countDocuments();
      const totalApplications = await Application.countDocuments();
      const totalPilots = await Pilot.countDocuments();
      const totalUsers = await User.countDocuments();

      stats = { totalDepartments, totalStartups, totalChallenges, totalApplications, totalPilots, totalUsers };
      recentChallenges = await Challenge.find().populate('department').sort({ createdAt: -1 }).limit(5);
      recentPilots = await Pilot.find().populate('startup challenge department').sort({ startDate: -1 }).limit(5);
      recentStartups = await Startup.find().sort({ createdAt: -1 }).limit(5);
    }
  } catch (err) {
    console.warn('Admin dashboard fallback active:', err.message);
  }

  res.render('layouts/main', {
    body: 'admin/dashboard',
    stats,
    recentChallenges,
    recentPilots,
    recentStartups
  });
};


exports.getSeedPage = async (req, res) => {
  res.render('layouts/main', { body: 'admin/seed' });
};

exports.postSeedData = async (req, res) => {
  try {
    const seed = require('../seed/seed');
    await seed();
    req.session.success = 'Database re-seeded successfully with rich demo data!';
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Seed execution failed:', err);
    req.session.error = 'Failed to re-seed database: ' + err.message;
    res.redirect('/admin/dashboard');
  }
};
