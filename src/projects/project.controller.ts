import { Request, Response, NextFunction } from 'express';
import * as projectService from './project.service';
import { HttpError } from '../utils/HttpError';
import { ProjectStatus } from '@prisma/client'; // Import status enum

// Extend Express Request type to include user property
interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

/**
 * POST /projects
 * Create a new project.
 */
export const createProjectHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        // Data validated by middleware (createProjectSchema)
        const projectData = req.body;
        const newProject = await projectService.createProject(projectData, userId);
        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /projects
 * Get projects for the authenticated user, allows filtering by status and clientId.
 */
export const getAllProjectsHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }

        // Extract and validate query parameters (ideally using projectFilterSchema with middleware)
        const { clientId, status } = req.query;
        const filters: { clientId?: string; status?: ProjectStatus } = {};

        if (clientId && typeof clientId === 'string') {
            // Basic validation, better handled by Zod middleware
            filters.clientId = clientId;
        }
        if (status && typeof status === 'string' && status in ProjectStatus) {
             // Basic validation, better handled by Zod middleware
            filters.status = status as ProjectStatus;
        }

        const projects = await projectService.getProjectsFiltered(userId, filters);
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /projects/:id
 * Get a specific project by ID.
 */
export const getProjectByIdHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id; // Assumes validated (projectIdSchema)
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        const project = await projectService.getProjectById(projectId, userId);
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /projects/:id
 * Update a specific project by ID.
 */
export const updateProjectHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id; // Assumes validated
        const updateData = req.body; // Assumes validated (updateProjectSchema)
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        const updatedProject = await projectService.updateProject(projectId, updateData, userId);
        res.status(200).json(updatedProject);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /projects/:id
 * Delete a specific project by ID.
 */
export const deleteProjectHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id; // Assumes validated
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        await projectService.deleteProject(projectId, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};