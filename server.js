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
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://vicare-medicine-tracker.onrender.com']
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in production for now, can restrict later
      }
    },
    credentials: true, // Important: allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Sessions - Use MongoDB store for production (works across multiple instances)
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://bcm:vilcare@vilcare.dr0ijnv.mongodb.net/vicare?appName=Vilcare';

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'vicare_dev_secret',
    resave: false,
    saveUninitialized: false,
    name: 'vicare.sid', // Custom session name
    store: MongoStore.create({
      mongoUrl: mongoUri,
      dbName: 'vicare',
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' needed for cross-site in production
      secure: process.env.NODE_ENV === 'production', // true in production, false in development
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/', // Ensure cookie is available for all paths
    },
  })
);

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


