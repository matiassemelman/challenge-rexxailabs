import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import * as userService from '../users/user.service';
import { LoginInput, RegisterInput } from './auth.validation';
import { HttpError } from '../utils/HttpError';

// Controller for user registration
export const registerHandler = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        // Pass errors to the global error handler
        next(error);
    }
};

// Controller for user login
export const loginHandler = async (
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token, user } = await authService.login(req.body);
        res.status(200).json({
            status: 'success',
            data: {
                token,
                user,
            },
        });
    } catch (error) {
         // Pass specific authentication errors or generic ones
        next(error); // Let the error middleware handle the response status
    }
};

// Controller for getting current user information
export const getMeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // The user is attached to the request by authMiddleware
        if (!req.user || !req.user.id) {
            throw new HttpError('Authentication required', 401);
        }

        // Get user from database using id from token
        const user = await userService.findUserById(req.user.id);

        if (!user) {
            throw new HttpError('User not found', 404);
        }

        // Remove password hash from response
        const { passwordHash: _, ...userWithoutPassword } = user;

        res.status(200).json({
            status: 'success',
            data: {
                user: userWithoutPassword
            }
        });
    } catch (error) {
        next(error);
    }
};