import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

interface JwtPayload {
    userId: string;
    // Add other properties if you include them in the token
}

export const signToken = (payload: JwtPayload, expiresIn: string | number = '1h'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        // Type assertion after successful verification
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};