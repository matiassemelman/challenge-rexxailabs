import express from 'express';
import { registerHandler, loginHandler, getMeHandler } from './auth.controller';
import { validate } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from './auth.validation';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Route for user registration
// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), asyncHandler(registerHandler));

// Route for user login
// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), asyncHandler(loginHandler));

// Route for getting current user info
// GET /api/v1/auth/me
router.get('/me', authMiddleware, asyncHandler(getMeHandler));

export default router;