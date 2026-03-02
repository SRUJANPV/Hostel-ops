// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';

dotenv.config();

const app = express();

// --- UPDATED CORS CONFIGURATION ---
// Define the allowed origins for your application
const allowedOrigins = [
  'https://hostel-ops1.vercel.app', // Your production frontend on Vercel
  'http://localhost:5173',           // Your local Vite dev server
  'http://localhost:3000'             // Your local backend (if needed)
];

// Configure CORS options dynamically
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    // or if the origin is in the allowedOrigins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin); // Log blocked origins for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Crucial: Allow cookies and authorization headers to be sent
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
// --- END OF UPDATED CORS CONFIGURATION ---

// Handle preflight requests explicitly (though the cors middleware usually does this)
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});