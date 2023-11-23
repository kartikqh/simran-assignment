function requireDriverAccess(req, res, next) {
    if (req.session.user && req.session.user.userType === 'Driver') {
      // User is a Driver, allow access
      return next();
    } else {
      // User is not a Driver, deny access
      return res.render('login', {message: 'Access denied. Please Login First'});
    }
  }
  
  module.exports = { requireDriverAccess };