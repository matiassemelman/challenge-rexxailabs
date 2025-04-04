import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import clientRoutes from './clients/client.routes';
// Import other routes as they are created
// import authRoutes from './auth/auth.routes';
// import projectRoutes from './projects/project.routes';
import { errorMiddleware } from './middleware/error.middleware';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000

// ---- Global Middleware ----

// Enable CORS for all origins (adjust in production if needed)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Simple root route for health check or basic info
app.get('/', (req: Request, res: Response) => {
  res.send('Rexxailabs Challenge API is running!');
});

// ---- API Routes ----

// Mount client routes
app.use('/api/v1/clients', clientRoutes);

// Mount other routes here when ready
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/projects', projectRoutes);


// ---- Error Handling Middleware ----
// This MUST be the last middleware applied
app.use(errorMiddleware);

// ---- Start Server ----

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});