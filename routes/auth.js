const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const requireAuth = require('../middleware/auth');
const { validateSignup, validateLogin, checkValidation } = require('../middleware/validation');

const router = express.Router();

// JWT secret - use environment variable or fallback
const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'vicare_jwt_secret_change_in_production';

// Helper to call email verification API
async function verifyEmail(email) {
  const accessKey = process.env.EMAIL_VERIFY_API_KEY;
  if (!accessKey) {
    // If no key is set, skip verification in dev
    return { valid: true };
  }

  const url = `http://apilayer.net/api/check?access_key=${accessKey}&email=${encodeURIComponent(
    email
  )}&smtp=1&format=1`;

  const { data } = await axios.get(url);

  const isValid =
    data &&
    data.format_valid &&
    (data.smtp_check === true || data.smtp_check === 'true');

  return { valid: !!isValid, raw: data };
}

// POST /api/auth/signup
router.post('/signup', validateSignup, checkValidation, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const check = await verifyEmail(email);
    if (!check.valid) {
      return res.status(400).json({ message: 'Email could not be verified.' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash: hash,
      name: name || '',
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Signup: User created, JWT token generated');
    
    res.json({
      message: 'Signup successful',
      user: { id: user._id, email: user.email, name: user.name },
      token: token, // Send token to frontend
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', validateLogin, checkValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Login: JWT token generated for user:', user._id.toString());
    
    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, name: user.name },
      token: token, // Send token to frontend
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint just confirms the logout
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me - current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl || '',
      emergencyContact: user.emergencyContact || '',
      primaryDoctorContact: user.primaryDoctorContact || '',
    });
  } catch (err) {
    console.error('Get current user error:', err.message);
    res.status(500).json({ message: 'Error loading profile.' });
  }
});

module.exports = router;


