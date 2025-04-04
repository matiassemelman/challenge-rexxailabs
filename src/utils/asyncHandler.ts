import { Request, Response, NextFunction, RequestHandler } from 'express';

// Define the type for our async route handlers
type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

/**
 * Wraps an async route handler to catch errors and pass them to the Express error handling middleware.
 * @param fn The async route handler function.
 * @returns An Express RequestHandler.
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next); // Catch promise rejections and forward to next()
    };