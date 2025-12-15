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

// Sessions - Use MongoDB store for production (works across multiple instances)
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://bcm:vilcare@vilcare.dr0ijnv.mongodb.net/vicare?appName=Vilcare';

// Create MongoDB session store with error handling
let sessionStore;
try {
  sessionStore = MongoStore.create({
    mongoUrl: mongoUri,
    touchAfter: 24 * 3600, // lazy session update (24 hours)
    ttl: 24 * 60 * 60, // session TTL in seconds (24 hours)
  });
  console.log('MongoDB session store initialized successfully');
} catch (err) {
  console.error('Error creating MongoDB session store:', err.message);
  sessionStore = undefined; // Fallback to MemoryStore if MongoDB store fails
  console.log('Falling back to MemoryStore (sessions won\'t persist across restarts)');
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'vicare_dev_secret',
    resave: false,
    saveUninitialized: false,
    name: 'vicare.sid', // Custom session name
    store: sessionStore, // Use MongoDB store if available, otherwise MemoryStore
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


