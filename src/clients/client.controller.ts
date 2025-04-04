import { Request, Response, NextFunction } from 'express';
import * as ClientService from './client.service';
import { HttpError } from '../utils/HttpError'; // Import the custom error class

export const handleCreateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // User ID should be attached by authMiddleware
        if (!req.user?.id) {
            throw new HttpError('Unauthorized', 401);
        }
        const clientData = req.body; // Already validated by validationMiddleware
        const newClient = await ClientService.createClient(clientData, req.user.id);
        res.status(201).json(newClient);
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

export const handleGetMyClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            throw new HttpError('Unauthorized', 401);
        }
        const clients = await ClientService.getClientsByUser(req.user.id);
        res.status(200).json(clients);
    } catch (error) {
        next(error);
    }
};

export const handleGetClientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            throw new HttpError('Unauthorized', 401);
        }
        const { id } = req.params;
        const client = await ClientService.getClientById(id, req.user.id);
        res.status(200).json(client);
    } catch (error) {
        // The service throws HttpError with 404 if not found or not owned
        next(error);
    }
};

export const handleUpdateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            throw new HttpError('Unauthorized', 401);
        }
        const { id } = req.params;
        const updateData = req.body; // Already validated
        const updatedClient = await ClientService.updateClient(id, updateData, req.user.id);
        res.status(200).json(updatedClient);
    } catch (error) {
        next(error);
    }
};

export const handleDeleteClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            throw new HttpError('Unauthorized', 401);
        }
        const { id } = req.params;
        const deletedClient = await ClientService.deleteClient(id, req.user.id);
        // Respond with the deleted client data or just a success status
        // res.status(200).json(deletedClient);
        res.status(204).send(); // 204 No Content is often preferred for DELETE
    } catch (error) {
        next(error);
    }
};