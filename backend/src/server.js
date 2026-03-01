import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://hostel-ops1.vercel.app', 'http://localhost:5173']
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check - VERY IMPORTANT for Render
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'HostelOps API is running', endpoints: ['/health', '/api/auth', '/api/complaints'] });
});

// IMPORTANT: Bind to '0.0.0.0' for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});