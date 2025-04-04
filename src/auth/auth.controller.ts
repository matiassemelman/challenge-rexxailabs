import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { LoginInput, RegisterInput } from './auth.validation';

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