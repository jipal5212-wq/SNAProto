const Startup = require('../models/Startup');

exports.getProfile = async (req, res) => {
  try {
    const startup = await Startup.findOne({ user: req.session.user._id });
    res.render('layouts/main', { body: 'startup/profile', startup });
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to load profile.';
    res.redirect('/startup/dashboard');
  }
};

exports.postProfile = async (req, res) => {
  try {
    const {
      name, description, teamSize, stage, foundedYear,
      industries, technologies, capabilities, products,
      previousProjects, governmentProjects, pilotReady, regions
    } = req.body;

    const parseArray = (str) => str ? str.split(',').map(s => s.trim()) : [];

    let startup = await Startup.findOne({ user: req.session.user._id });
    
    if (!startup) {
      startup = new Startup({ user: req.session.user._id });
    }

    startup.name = name;
    startup.description = description;
    startup.teamSize = teamSize;
    startup.stage = stage;
    startup.foundedYear = foundedYear;
    startup.industries = parseArray(industries);
    startup.technologies = parseArray(technologies);
    startup.capabilities = parseArray(capabilities);
    startup.products = parseArray(products);
    startup.previousProjects = parseArray(previousProjects);
    startup.governmentProjects = parseArray(governmentProjects);
    startup.pilotReady = pilotReady === 'on';
    startup.regions = parseArray(regions);

    await startup.save();
    
    // update session if it wasn't linked
    if (!req.session.user.startup) {
      req.session.user.startup = startup._id;
    }

    req.session.success = 'Profile updated successfully.';
    res.redirect('/startup/profile');
  } catch (err) {
    console.error(err);
    req.session.error = 'Failed to save profile.';
    res.redirect('/startup/profile');
  }
};
