import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import clientRoutes from './clients/client.routes';
import authRoutes from './auth/auth.routes';
import projectRoutes from './projects/project.routes';
import { errorMiddleware } from './middleware/error.middleware';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000

// ---- Global Middleware ----

// Configure CORS with secure settings
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // Vite default
  'https://challenge-frontend-rexxailabs.vercel.app/', // Frontend deployed on Vercel
  process.env.FRONTEND_URL // From .env if defined
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy blocks access from this origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Allow cookies and authentication headers
}));

// Rate limiting middleware to prevent abuse
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Apply rate limiting to all requests
app.use(globalLimiter);

// More strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 20, // Limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again after 30 minutes'
  }
});

// Parse JSON request bodies
app.use(express.json({ limit: '1mb' })); // Limit body size

// Simple root route for health check or basic info
app.get('/', (req: Request, res: Response) => {
  res.send('Rexxailabs Challenge API is running!');
});

// ---- API Routes ----

// Mount client routes
app.use('/api/v1/clients', clientRoutes);

// Apply stricter rate limiting to auth routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/projects', projectRoutes);

// ---- Error Handling Middleware ----
// This MUST be the last middleware applied
app.use(errorMiddleware);

// ---- Start Server ----

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});