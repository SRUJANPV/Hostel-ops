import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';

dotenv.config();

const app = express();

// ----- CORS CONFIGURATION - CRITICAL -----
const allowedOrigins = [
  'https://hostel-ops.onrender.com',  // Your Render frontend
  'http://localhost:5173',            // Local development
  'http://localhost:3000'              // Local backend
];

// CORS middleware - must be BEFORE any routes
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('❌ Blocked origin:', origin);
      return callback(new Error('CORS not allowed'), false);
    }
    console.log('✅ Allowed origin:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());
// ----- END CORS CONFIGURATION -----

app.use(express.json());

// ----- TEST ROUTES (MUST BE BEFORE OTHER ROUTES) -----
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    message: 'Backend is running',
    cors: 'Configured for Render frontend'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working', 
    endpoints: ['/health', '/api/auth/register', '/api/auth/login']
  });
});

// Auth test endpoint
app.get('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth routes are working',
    available: ['POST /api/auth/register', 'POST /api/auth/login']
  });
});
// ----- END TEST ROUTES -----

// ----- ACTUAL ROUTES -----
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    path: req.originalUrl,
    available: ['/health', '/api/test', '/api/auth/test', '/api/auth', '/api/complaints']
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌎 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🔑 Auth test: http://localhost:${PORT}/api/auth/test`);
  console.log(`📝 CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log('='.repeat(50));
});