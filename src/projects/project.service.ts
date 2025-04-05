import { PrismaClient, Project, ProjectStatus, Client } from '@prisma/client';
import { HttpError } from '../utils/HttpError';

const prisma = new PrismaClient();

// Helper function to verify client ownership
const verifyClientOwnership = async (clientId: string, userId: string): Promise<Client> => {
    const client = await prisma.client.findUnique({
        where: { id: clientId },
    });
    if (!client) {
        throw new HttpError('Client not found', 404);
    }
    if (client.userId !== userId) {
        // Throw 404 to avoid leaking info about client existence
        throw new HttpError('Client not found', 404);
    }
    return client;
};

/**
 * Creates a new project for a given client, ensuring the client belongs to the user.
 */
export const createProject = async (
    data: {
        name: string;
        description?: string;
        clientId: string;
        status?: ProjectStatus;
        startDate?: Date;
        deliveryDate?: Date;
    },
    userId: string
): Promise<Project> => {
    // Verify client ownership first
    await verifyClientOwnership(data.clientId, userId);

    // Create the project
    return prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            clientId: data.clientId,
            status: data.status || ProjectStatus.PENDING,
            startDate: data.startDate,
            deliveryDate: data.deliveryDate,
        },
    });
};

/**
 * Gets projects, optionally filtered by clientId and/or status.
 * Ensures that if clientId is provided, it belongs to the user.
 */
export const getProjectsFiltered = async (
    userId: string,
    filters: {
        clientId?: string;
        status?: ProjectStatus;
    }
): Promise<Project[]> => {
    const whereClause: any = {};

    // Filter by client ONLY if clientId is provided
    if (filters.clientId) {
        // Verify ownership of the client before filtering by it
        await verifyClientOwnership(filters.clientId, userId);
        whereClause.clientId = filters.clientId;
    } else {
        // If no clientId filter, fetch projects only for clients owned by the user
        whereClause.client = {
            userId: userId,
        };
    }

    // Add status filter if provided
    if (filters.status) {
        whereClause.status = filters.status;
    }

    return prisma.project.findMany({
        where: whereClause,
        include: {
            client: {
                select: { id: true, name: true }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

/**
 * Gets a single project by its ID, ensuring it belongs (via its client) to the user.
 */
export const getProjectById = async (projectId: string, userId: string): Promise<Project> => {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            client: true,
        },
    });

    if (!project) {
        throw new HttpError('Project not found', 404);
    }

    // Verify that the project's client belongs to the user
    if (project.client.userId !== userId) {
        throw new HttpError('Project not found', 404);
    }

    return project;
};

/**
 * Updates a project, ensuring it belongs (via its client) to the user.
 */
export const updateProject = async (
    projectId: string,
    data: {
        name?: string;
        description?: string | null;
        status?: ProjectStatus;
        startDate?: Date | null;
        deliveryDate?: Date | null;
    },
    userId: string
): Promise<Project> => {
    // Verify ownership first by getting the project
    const existingProject = await getProjectById(projectId, userId);

    // Update the project
    return prisma.project.update({
        where: { id: projectId },
        data: {
            name: data.name,
            description: data.description,
            status: data.status,
            startDate: data.startDate,
            deliveryDate: data.deliveryDate,
        },
    });
};

/**
 * Deletes a project, ensuring it belongs (via its client) to the user.
 */
export const deleteProject = async (projectId: string, userId: string): Promise<Project> => {
    // Verify ownership first
    await getProjectById(projectId, userId);

    // Delete the project
    return prisma.project.delete({
        where: { id: projectId },
    });
};