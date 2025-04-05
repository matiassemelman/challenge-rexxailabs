import { Prisma } from '@prisma/client';
import * as userService from '../users/user.service';
import { hashPassword, comparePassword } from '../utils/hashing';
import { signToken } from '../utils/jwt';
import { LoginInput, RegisterInput } from './auth.validation';
import { HttpError } from '../utils/HttpError';

/**
 * Authentication service with user registration and login functionality
 */

/**
 * Registers a new user in the system
 */
export const register = async (input: RegisterInput) => {
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(input.email);
    if (existingUser) {
        throw new HttpError('User with this email already exists', 409);
    }

    // Hash the password
    const passwordHash = await hashPassword(input.password);

    // Create the user
    try {
        const user = await userService.createUser({
            email: input.email,
            passwordHash: passwordHash,
        });
        // Omit password hash from the returned user object
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        // Handle potential Prisma unique constraint error gracefully
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
             throw new HttpError('User with this email already exists', 409);
        }
        console.error("Error during user creation:", error);
        throw new HttpError('Could not register user', 500);
    }
};

/**
 * Authenticates a user and generates a JWT token
 */
export const login = async (input: LoginInput) => {
    // Find user by email
    const user = await userService.findUserByEmail(input.email);
    if (!user) {
        throw new HttpError('Invalid email or password', 401);
    }

    // Compare password
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new HttpError('Invalid email or password', 401);
    }

    // Generate JWT
    const token = signToken({ userId: user.id });

    // Return token and user info without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
};