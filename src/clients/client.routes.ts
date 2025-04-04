import { Router } from 'express';
import * as clientController from './client.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createClientSchema, updateClientSchema, getOrDeleteClientSchema } from './client.validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Apply auth middleware to all client routes
router.use(authMiddleware);

// POST /clients - Create a new client
router.post(
    '/',
    validate(createClientSchema),
    asyncHandler(clientController.createClientHandler)
);

// GET /clients - Get all clients for the authenticated user
router.get('/', asyncHandler(clientController.getAllClientsHandler));

// GET /clients/:id - Get a specific client by ID
router.get(
    '/:id',
    validate(getOrDeleteClientSchema),
    asyncHandler(clientController.getClientByIdHandler)
);

// PUT /clients/:id - Update a specific client
router.put(
    '/:id',
    validate(updateClientSchema),
    asyncHandler(clientController.updateClientHandler)
);

// DELETE /clients/:id - Delete a specific client
router.delete(
    '/:id',
    validate(getOrDeleteClientSchema),
    asyncHandler(clientController.deleteClientHandler)
);

export default router;