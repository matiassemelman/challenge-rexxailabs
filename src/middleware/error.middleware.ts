import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error occurred:", err); // Log the error for debugging

    let statusCode = 500;
    let message = 'Internal Server Error';
    let details: any = undefined;

    if (err instanceof HttpError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details; // Include details if provided by HttpError
    } else if (err instanceof ZodError) {
        // Handle Zod validation errors specifically if not caught by validationMiddleware
        statusCode = 400;
        message = 'Validation Failed';
        details = err.errors.map(e => ({ path: e.path.join('.'), message: e.message }));
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors (e.g., unique constraints)
        // See Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
        if (err.code === 'P2002') { // Unique constraint violation
            statusCode = 409; // Conflict
            // Safely access and join target fields if it's an array
            const target = err.meta?.target;
            if (Array.isArray(target)) {
                message = `Unique constraint failed on the field(s): ${target.join(', ')}`;
            } else {
                message = 'Unique constraint failed.'; // Fallback message
            }
        } else if (err.code === 'P2025') { // Record not found (e.g., for update/delete)
            statusCode = 404;
            message = 'Resource not found.';
            details = err.meta?.cause ?? 'The related record does not exist.';
        } else {
            statusCode = 400; // Generic bad request for other Prisma client errors
            message = 'Database request error';
            details = err.message; // Provide Prisma message in details for dev
        }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        // Handle Prisma validation errors (e.g., missing fields)
        statusCode = 400;
        message = 'Database validation error';
        details = err.message; // Provide Prisma message in details
    }

    // Avoid sending stack trace in production
    const responseBody: { error: { message: string; details?: any } } = {
        error: {
            message: message,
        }
    };

    if (details && process.env.NODE_ENV !== 'production') { // Only send details in non-production env
        responseBody.error.details = details;
    }

    res.status(statusCode).json(responseBody);
};