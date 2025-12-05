import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { aiRateLimiter } from './services/aiService.js';
import dotenv from 'dotenv';
import curateResourcesRouter from './routes/curateResources.js';
import generatePlanRouter from './routes/generatePlan.js';
import pdfChatRouter from './routes/pdfChat.js';
import rateLimit from 'express-rate-limit';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Ensure required directories exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  await mkdir(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

const app = express();
const port = process.env.PORT || 8000;

// Trust proxy - required for rate limiting behind reverse proxies (Render)
app.set('trust proxy', 1);
app.use(express.json());

// Middleware
app.use(
  cors({
    origin: [
      "https://mind-mentor-67s2.onrender.com", // <-- ADDED YOUR RENDER URL
      "https://mind-mentor-pearl.vercel.app",
      "https://mind-mentor.kartiklabhshetwar.me",
      "http://localhost:3000",
      "https://www.mind-mentor.ink",
      "https://mind-mentor.ink",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply global rate limiter
app.use(limiter);

// --- FIX: Apply AI Rate Limiter to the CORRECT paths ---
app.use('/curate-resources', aiRateLimiter);
app.use('/generate-plan', aiRateLimiter);
app.use('/pdf', aiRateLimiter);

// Basic health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Mind Mentor API is running' });
});

// Lightweight health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Mind Mentor API is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Apply routes
app.use('/generate-plan', generatePlanRouter);
app.use('/curate-resources', curateResourcesRouter);
app.use('/pdf', pdfChatRouter);

// --- FIX: Error handling middleware must have 4 arguments ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
