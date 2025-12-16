const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'vicare_jwt_secret_change_in_production';

module.exports = function requireAuth(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request
    console.log('Auth middleware: Token verified, userId =', decoded.userId);
    next();
  } catch (err) {
    console.log('Auth middleware: Invalid token:', err.message);
    return res.status(401).json({ message: 'Not authorized' });
  }
};


