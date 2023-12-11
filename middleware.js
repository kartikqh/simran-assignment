function requireDriverAccess(req, res, next) {
  console.log(req.session)
  if (req.session.user && req.session.user.userType === 'Driver') {
    // User is a Driver, allow access
    return next();
  } else {
    // User is not a Driver, deny access
    // Redirect to a login page or send an error response
    return res.status(403).render('login', { message: 'Access denied. Please Login First' });
  }
}

module.exports = { requireDriverAccess };
