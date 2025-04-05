import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

/**
 * JWT utility functions for token generation and verification
 * @module JwtUtils
 */

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

// Ensure JWT_SECRET is defined to prevent running with missing configuration
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

/**
 * JWT payload structure
 * @interface JwtPayload
 */
interface JwtPayload {
    /** User identifier from database */
    userId: string;
}

/**
 * Signs a new JWT token with the provided payload
 *
 * @param {JwtPayload} payload - Data to be included in the token (usually userId)
 * @param {string|number} expiresIn - Token expiration time (default: '1h')
 * @returns {string} Signed JWT token
 */
export const signToken = (payload: JwtPayload, expiresIn: string | number = '1h'): string => {
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn });
};

/**
 * Verifies a JWT token and returns its payload if valid
 *
 * @param {string} token - JWT token to verify
 * @returns {JwtPayload|null} Token payload if valid, null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
    try {
        // Type assertion after successful verification
        return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};