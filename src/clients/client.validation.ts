import { z } from 'zod';

// Schema for creating a client - validates request body
export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Client name is required" }),
    email: z.string().email({ message: "Invalid email format" }).optional(),
    phone: z.string().optional(),
  }),
});

// Schema for updating a client - validates request body and params
export const updateClientSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Client name cannot be empty" }).optional(),
    email: z.string().email({ message: "Invalid email format" }).optional().nullable(),
    phone: z.string().optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "Invalid client UUID format in URL parameter" }),
  }),
});

// Schema for validating client ID in URL parameters
export const getOrDeleteClientSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid client UUID format in URL parameter" }),
  }),
});