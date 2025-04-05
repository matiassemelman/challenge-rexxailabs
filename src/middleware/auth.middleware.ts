import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { HttpError } from '../utils/HttpError';

/**
 * Authentication middleware that validates JWT tokens and attaches user information to the request
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
        return next(new HttpError('Unauthorized: Invalid or expired token', 401));
    }

    // Attach user information to the request object
    req.user = {
        id: payload.userId
    };

    // Token is valid, proceed to the next middleware/route handler
    next();
};