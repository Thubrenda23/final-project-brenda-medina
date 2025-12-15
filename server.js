require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

const app = express();

// Trust Render's proxy in production so secure cookies work
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - allow credentials for session cookies
// Since frontend and backend are on same domain, CORS is mainly for API calls
app.use(
  cors({
    origin: true, // Allow same-origin requests (frontend and backend on same domain)
    credentials: true, // Important: allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Sessions configuration
// Using MemoryStore for now (works fine for single instance on Render free tier)
// If you scale to multiple instances, we can add MongoDB session store later
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'vicare_dev_secret',
    resave: false,
    saveUninitialized: false,
    name: 'vicare.sid', // Custom session name
    cookie: {
      httpOnly: true,
      sameSite: 'lax', // Use 'lax' since frontend and backend are on same domain
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/', // Ensure cookie is available for all paths
    },
  })
);

// Debug middleware to log session info (only for API routes to reduce noise)
app.use('/api', (req, res, next) => {
  console.log(`[${req.method} ${req.path}] Session ID: ${req.sessionID}`);
  console.log(`[${req.method} ${req.path}] Session userId: ${req.session?.userId || 'none'}`);
  if (!req.session?.userId && req.path !== '/auth/login' && req.path !== '/auth/signup') {
    console.log(`[${req.method} ${req.path}] WARNING: No userId in session`);
  }
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const settingsRoutes = require('./routes/settings');

app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', settingsRoutes);

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ViCare server running on port ${PORT}`);
});


