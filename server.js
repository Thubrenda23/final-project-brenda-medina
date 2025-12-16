require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');

const app = express();

// Trust Render's proxy in production so secure cookies work
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for simplicity (can be enabled later)
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});
app.use('/api/auth/', authLimiter);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration - allow Authorization header for JWT tokens
app.use(
  cors({
    origin: true, // Allow same-origin requests (frontend and backend on same domain)
    credentials: true, // Still needed for some browser behaviors, even with JWT
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow Authorization header
  })
);

// Debug middleware for API routes (simplified for JWT)
app.use('/api', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    console.log(`[${req.method} ${req.path}] Authorization header present`);
  } else {
    console.log(`[${req.method} ${req.path}] No Authorization header`);
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


