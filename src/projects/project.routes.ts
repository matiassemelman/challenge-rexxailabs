import { Router } from 'express';
import * as projectController from './project.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
    createProjectSchema,
    updateProjectSchema,
    projectIdSchema,
    projectFilterSchema
} from './project.validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Apply auth middleware to all project routes
router.use(authMiddleware);

// POST /projects - Create a new project
router.post(
    '/',
    validate(createProjectSchema),
    asyncHandler(projectController.createProjectHandler)
);

// GET /projects - Get all projects (with optional filters for status and clientId)
// If clientId is provided, verifies the client belongs to the user
router.get(
    '/',
    validate(projectFilterSchema), // Optional query params validation
    asyncHandler(projectController.getAllProjectsHandler)
);

// GET /projects/:id - Get a specific project by ID
router.get(
    '/:id',
    validate(projectIdSchema),
    asyncHandler(projectController.getProjectByIdHandler)
);

// PUT /projects/:id - Update a specific project
router.put(
    '/:id',
    validate(updateProjectSchema),
    asyncHandler(projectController.updateProjectHandler)
);

// DELETE /projects/:id - Delete a specific project
router.delete(
    '/:id',
    validate(projectIdSchema),
    asyncHandler(projectController.deleteProjectHandler)
);

export default router;