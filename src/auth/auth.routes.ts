import express from 'express';
import { registerHandler, loginHandler } from './auth.controller';
import { validate } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from './auth.validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Route for user registration
// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), asyncHandler(registerHandler));

// Route for user login
// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), asyncHandler(loginHandler));

export default router;