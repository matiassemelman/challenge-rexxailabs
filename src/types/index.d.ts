import { Request } from 'express';

// Global declaration merging
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
  }
}

// Extend for custom request type used in the project
declare interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
  body: any;
  params: any;
  query: any;
}