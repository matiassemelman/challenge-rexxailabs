import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
    process.exit(1);
}

interface JwtPayload {
    userId: string;
    // Add other properties if you include them in the token
}

export const signToken = (payload: JwtPayload, expiresIn: number = 3600): string => {
    const options: jwt.SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET as string, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
            return decoded;
        }
        console.error('JWT verification failed: Invalid payload structure');
        return null;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error('JWT verification failed: Token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error('JWT verification failed:', error.message);
        } else {
            console.error('JWT verification failed:', error);
        }
        return null;
    }
};