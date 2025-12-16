module.exports = function requireAuth(req, res, next) {
  console.log('=== AUTH MIDDLEWARE DEBUG ===');
  console.log('Session exists:', !!req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Session userId:', req.session?.userId || 'none');
  console.log('Cookies in request:', req.headers.cookie || 'none');
  console.log('Session keys:', req.session ? Object.keys(req.session).join(', ') : 'no session');
  
  if (!req.session || !req.session.userId) {
    console.log('Auth middleware: missing session or userId');
    console.log('===========================');
    return res.status(401).json({ message: 'Not authorized' });
  }
  // For debugging, log which user is making the request
  console.log('Auth middleware: userId =', req.session.userId);
  console.log('===========================');
  next();
};


