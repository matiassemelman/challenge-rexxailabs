import { PrismaClient } from '@prisma/client';
import { RegisterInput } from '../auth/auth.validation'; // Assuming validation types are exported

const prisma = new PrismaClient();

// Service to find a user by their email address
export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

// Service to create a new user
export const createUser = async (userData: Omit<RegisterInput, 'password'> & { passwordHash: string }) => {
    return await prisma.user.create({
        data: userData,
    });
};

// Service to find a user by their ID
export const findUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};