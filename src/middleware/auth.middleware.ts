import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { HttpError } from '../utils/HttpError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new HttpError('Unauthorized: Missing or invalid token format', 401));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return next(new HttpError('Unauthorized: Token not found after Bearer', 401));
    }

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

    next(); // Token is valid, proceed to the next middleware/route handler
};