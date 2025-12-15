module.exports = function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    console.log('Auth middleware: missing session or userId');
    return res.status(401).json({ message: 'Not authorized' });
  }
  // For debugging, log which user is making the request
  console.log('Auth middleware: userId =', req.session.userId);
  next();
};


