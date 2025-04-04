import { Router } from 'express';
import * as ClientController from './client.controller';
import { authMiddleware } from '../middleware/auth.middleware'; // Assuming this path is correct
import { validationMiddleware } from '../middleware/validation.middleware'; // Assuming this path is correct
import { createClientSchema, updateClientSchema } from './client.validation';

const router = Router();

// Apply auth middleware to all client routes
router.use(authMiddleware);

// Define routes
router.post(
    '/',
    validationMiddleware(createClientSchema), // Validate body first
    ClientController.handleCreateClient
);

router.get('/', ClientController.handleGetMyClients);

router.get('/:id', ClientController.handleGetClientById);

router.put(
    '/:id',
    validationMiddleware(updateClientSchema), // Validate body first
    ClientController.handleUpdateClient
);

router.delete('/:id', ClientController.handleDeleteClient);

export default router;