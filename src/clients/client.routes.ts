import { Router } from 'express';
import * as ClientController from './client.controller';
import { authMiddleware } from '../middleware/auth.middleware'; // Assuming this path is correct
import { validate } from '../middleware/validation.middleware'; // Assuming this path is correct
import { createClientSchema, updateClientSchema } from './client.validation';
import { asyncHandler } from '../utils/asyncHandler'; // Import asyncHandler

const router = Router();

// Apply auth middleware to all client routes
router.use(authMiddleware);

// Define routes, wrapping controllers with asyncHandler
router.post(
    '/',
    validate(createClientSchema), // Validate body first
    asyncHandler(ClientController.handleCreateClient) // Wrap with asyncHandler
);

router.get('/', asyncHandler(ClientController.handleGetMyClients)); // Wrap with asyncHandler

router.get('/:id', asyncHandler(ClientController.handleGetClientById)); // Wrap with asyncHandler

router.put(
    '/:id',
    validate(updateClientSchema), // Validate body first
    asyncHandler(ClientController.handleUpdateClient) // Wrap with asyncHandler
);

router.delete('/:id', asyncHandler(ClientController.handleDeleteClient)); // Wrap with asyncHandler

export default router;