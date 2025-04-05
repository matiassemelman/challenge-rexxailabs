import { Request } from 'express';

// Global declaration merging to extend Express types
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

// Extend Request for authentication
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}