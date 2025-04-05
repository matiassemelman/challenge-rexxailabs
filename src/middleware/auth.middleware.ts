import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { HttpError } from '../utils/HttpError';

/**
 * Authentication middleware
 * @module AuthMiddleware
 */

/**
 * Middleware that validates JWT tokens and attaches user information to the request
 *
 * This middleware:
 * 1. Extracts the Bearer token from the Authorization header
 * 2. Verifies the token validity and signature
 * 3. Attaches the user ID from the token payload to the request object
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 * @throws {HttpError} If the token is missing, invalid or expired
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Extract the authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists and has the right format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new HttpError('Unauthorized: Missing or invalid token format', 401));
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    if (!token) {
        return next(new HttpError('Unauthorized: Token not found after Bearer', 401));
    }

    // Verify token integrity and signature
    const payload = verifyToken(token);

    if (!payload) {
        // verifyToken logs the specific error (expired, invalid signature, etc.)
        return next(new HttpError('Unauthorized: Invalid or expired token', 401));
    }

    // Attach user information to the request object
    // The type definition in src/types/express/index.d.ts allows this
    req.user = {
        id: payload.userId
        // Add other properties from payload if needed
    };

    // Token is valid, proceed to the next middleware/route handler
    next();
};