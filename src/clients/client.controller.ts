import { Request, Response, NextFunction } from 'express';
import * as clientService from './client.service';
import { HttpError } from '../utils/HttpError';

// Extend Express Request type to include user property
interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

/**
 * POST /clients
 * Create a new client.
 */
export const createClientHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        const clientData = req.body;
        const newClient = await clientService.createClient(clientData, userId);
        res.status(201).json(newClient);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /clients
 * Get all clients for the authenticated user.
 */
export const getAllClientsHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        const clients = await clientService.getClientsByUser(userId);
        res.status(200).json(clients);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /clients/:id
 * Get a specific client by ID.
 */
export const getClientByIdHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const clientId = req.params.id;
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        const client = await clientService.getClientById(clientId, userId);
        res.status(200).json(client);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /clients/:id
 * Update a specific client by ID.
 */
export const updateClientHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const clientId = req.params.id;
        const updateData = req.body;
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        const updatedClient = await clientService.updateClient(clientId, updateData, userId);
        res.status(200).json(updatedClient);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /clients/:id
 * Delete a specific client by ID.
 */
export const deleteClientHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const clientId = req.params.id;
        if (!userId) {
            throw new HttpError('Authentication required', 401);
        }
        await clientService.deleteClient(clientId, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};