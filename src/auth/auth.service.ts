import { Prisma } from '@prisma/client';
import * as userService from '../users/user.service';
import { hashPassword, comparePassword } from '../utils/hashing';
import { signToken } from '../utils/jwt';
import { LoginInput, RegisterInput } from './auth.validation';

// Service for user registration
export const register = async (input: RegisterInput) => {
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(input.email);
    if (existingUser) {
        throw new Error('User with this email already exists');
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
             throw new Error('User with this email already exists');
        }
        console.error("Error during user creation:", error);
        throw new Error('Could not register user');
    }
};

// Service for user login
export const login = async (input: LoginInput) => {
    // Find user by email
    const user = await userService.findUserByEmail(input.email);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = signToken({ userId: user.id });

    // Return token (and potentially user info without password)
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token: `Bearer ${token}`, user: userWithoutPassword };

};