import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { HttpError } from '../utils/HttpError';

// Middleware factory function
export const validationMiddleware =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Determine where to validate based on method or schema type if needed
        // Simple approach: validate body by default
        await schema.parseAsync(req.body);

        // You could extend this to validate req.params or req.query if needed:
        // await schema.parseAsync({
        //     body: req.body,
        //     query: req.query,
        //     params: req.params,
        // });

        next(); // Validation successful
    } catch (error) {
        if (error instanceof ZodError) {
            // Format Zod errors for a cleaner response
            const formattedErrors = error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }));
            // Use HttpError for consistent error handling
            next(new HttpError('Validation failed', 400, formattedErrors));
        } else {
            // Pass other errors to the global error handler
            next(new HttpError('Internal server error during validation', 500));
        }
    }
};