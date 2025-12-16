const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'vicare_jwt_secret_change_in_production';

module.exports = function requireAuth(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Authorization header:', authHeader || 'none');
  console.log('Request path:', req.path);
  console.log('Request method:', req.method);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth middleware: No token provided or invalid format');
    console.log('===================');
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  console.log('Token received (first 20 chars):', token.substring(0, 20) + '...');
  
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request
    console.log('Auth middleware: Token verified successfully');
    console.log('Auth middleware: userId =', decoded.userId);
    console.log('===================');
    next();
  } catch (err) {
    console.log('Auth middleware: Token verification failed');
    console.log('Error:', err.message);
    console.log('===================');
    return res.status(401).json({ message: 'Not authorized' });
  }
};


