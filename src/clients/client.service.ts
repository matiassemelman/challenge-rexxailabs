import { PrismaClient, Client } from '@prisma/client';
import { HttpError } from '../utils/HttpError'; // Assuming you have a custom HttpError class

const prisma = new PrismaClient();

export const createClient = async (data: { name: string; email?: string; phone?: string }, userId: string): Promise<Client> => {
    return prisma.client.create({
        data: {
            ...data,
            userId: userId,
        },
    });
};

export const getClientsByUser = async (userId: string): Promise<Client[]> => {
    return prisma.client.findMany({
        where: { userId: userId },
    });
};

export const getClientById = async (id: string, userId: string): Promise<Client> => {
    const client = await prisma.client.findUnique({
        where: { id: id },
    });

    if (!client) {
        throw new HttpError('Client not found', 404);
    }

    if (client.userId !== userId) {
        // Important: Throw a generic "not found" error to avoid leaking information
        // about which clients exist but don't belong to the user.
        // Alternatively, use a 403 Forbidden error if your API strategy prefers that.
        throw new HttpError('Client not found', 404);
        // Or: throw new HttpError('Forbidden', 403);
    }

    return client;
};

export const updateClient = async (id: string, data: { name?: string; email?: string | null; phone?: string | null }, userId: string): Promise<Client> => {
    // First, verify ownership and existence
    await getClientById(id, userId); // This will throw if not found or not owned

    return prisma.client.update({
        where: { id: id },
        data: data,
    });
};

export const deleteClient = async (id: string, userId: string): Promise<Client> => {
    // First, verify ownership and existence
    await getClientById(id, userId); // This will throw if not found or not owned

    return prisma.client.delete({
        where: { id: id },
    });
};