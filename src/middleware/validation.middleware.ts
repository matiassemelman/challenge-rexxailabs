import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { HttpError } from '../utils/HttpError';

// Middleware factory to validate request data against a Zod schema
export const validate = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            // Format Zod errors for a cleaner response
            const formattedErrors = error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return res.status(400).json({
                status: 'fail',
                message: 'Input validation failed',
                errors: formattedErrors,
            });
        }
        // Forward other errors to the global error handler
        next(error);
    }
};