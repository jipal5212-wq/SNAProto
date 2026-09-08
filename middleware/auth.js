const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.session.error = 'You must be logged in to view this page.';
    return res.redirect('/auth/login');
  }
  next();
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.session.error = 'You must be logged in.';
      return res.redirect('/auth/login');
    }
    
    if (!roles.includes(req.session.user.role)) {
      req.session.error = 'You do not have permission to access this page.';
      return res.redirect('/');
    }
    
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};
