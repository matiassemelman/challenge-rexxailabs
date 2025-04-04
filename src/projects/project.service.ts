import { PrismaClient, Project, ProjectStatus, Client } from '@prisma/client';
import { HttpError } from '../utils/HttpError'; // Assuming HttpError exists

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

// --- Service Functions ---

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
    // 1. Verify client ownership first
    await verifyClientOwnership(data.clientId, userId);

    // 2. Create the project
    return prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            clientId: data.clientId,
            status: data.status || ProjectStatus.PENDING, // Default status if not provided
            startDate: data.startDate,
            deliveryDate: data.deliveryDate,
            // No need to pass userId here, it's linked via the client
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
        // IMPORTANT: Verify ownership of the client before filtering by it
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
            client: { // Optionally include client details
                select: { id: true, name: true } // Select only necessary client fields
            }
        },
        orderBy: {
            createdAt: 'desc', // Default order
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
            client: true, // Need client to check ownership
        },
    });

    if (!project) {
        throw new HttpError('Project not found', 404);
    }

    // Verify that the project's client belongs to the user
    if (project.client.userId !== userId) {
        throw new HttpError('Project not found', 404); // Use 404 for consistency
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
        // Note: Updating clientId is complex and usually avoided. If needed, requires extra checks.
    },
    userId: string
): Promise<Project> => {
    // 1. Verify ownership first by getting the project
    const existingProject = await getProjectById(projectId, userId);
    // getProjectById already checks ownership, so no need to check project.client.userId again

    // 2. Update the project
    return prisma.project.update({
        where: { id: projectId }, // Use the ID from the existing project found
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
    // 1. Verify ownership first
    await getProjectById(projectId, userId); // Throws if not found or not owned

    // 2. Delete the project
    return prisma.project.delete({
        where: { id: projectId },
    });
};