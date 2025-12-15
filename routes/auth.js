const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');

const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

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
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

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

    req.session.userId = user._id.toString();
    
    // Log session info for debugging
    console.log('Signup: Setting session userId =', user._id.toString());
    console.log('Signup: Session ID =', req.sessionID);
    console.log('Signup: Session before save =', JSON.stringify(req.session));
    
    // Let express-session save automatically, but ensure it's saved
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return reject(err);
        }
        console.log('Signup: Session saved successfully, userId =', req.session.userId);
        resolve();
      });
    });
    
    res.json({
      message: 'Signup successful',
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    req.session.userId = user._id.toString();
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regenerate error:', err);
        return res.status(500).json({ message: 'Error creating session.' });
      }
      
      req.session.userId = user._id.toString();
      
      // Log session info for debugging
      console.log('Login: Setting session userId =', user._id.toString());
      console.log('Login: Session ID =', req.sessionID);
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Error saving session.' });
        }
        console.log('Login: Session saved successfully, userId =', req.session.userId);
        console.log('Login: Cookie should be set in response');
        
        res.json({
          message: 'Login successful',
          user: { id: user._id, email: user.email, name: user.name },
        });
      });
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err.message);
      return res.status(500).json({ message: 'Error logging out.' });
    }
    res.clearCookie('vicare.sid'); // Use correct session name
    res.json({ message: 'Logged out' });
  });
});

// GET /api/auth/me - current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
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


