export class HttpError extends Error {
    statusCode: number;
    details?: any;

    constructor(message: string, statusCode: number, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'HttpError';

        // Maintains proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }
}