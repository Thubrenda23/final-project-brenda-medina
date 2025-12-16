require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

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
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'vicare_dev_secret',
    resave: false, // Only save if session was modified
    saveUninitialized: false, // Don't create session until something is stored
    name: 'vicare.sid', // Custom session name
    rolling: false, // Don't reset expiration on every request
    cookie: {
      httpOnly: true,
      sameSite: 'lax', // Use 'lax' since frontend and backend are on same domain
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/', // Cookie available for all paths
      // Don't set domain - let browser use default (same origin)
    },
  })
);

// Debug middleware to log session info and response cookies
app.use('/api', (req, res, next) => {
  console.log(`[${req.method} ${req.path}] Session ID: ${req.sessionID}`);
  console.log(`[${req.method} ${req.path}] Session userId: ${req.session?.userId || 'none'}`);
  console.log(`[${req.method} ${req.path}] Cookies received: ${req.headers.cookie || 'none'}`);
  
  // Log Set-Cookie header in response
  const originalEnd = res.end;
  res.end = function(...args) {
    const setCookieHeader = res.getHeader('Set-Cookie');
    if (setCookieHeader) {
      console.log(`[${req.method} ${req.path}] Set-Cookie header: ${Array.isArray(setCookieHeader) ? setCookieHeader.join(', ') : setCookieHeader}`);
    } else {
      console.log(`[${req.method} ${req.path}] No Set-Cookie header in response`);
    }
    originalEnd.apply(res, args);
  };
  
  if (!req.session?.userId && req.path !== '/auth/login' && req.path !== '/auth/signup' && req.path !== '/auth/logout') {
    console.log(`[${req.method} ${req.path}] WARNING: No userId in session`);
    console.log(`[${req.method} ${req.path}] Session exists: ${!!req.session}`);
    console.log(`[${req.method} ${req.path}] Session keys: ${req.session ? Object.keys(req.session).join(', ') : 'no session'}`);
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


