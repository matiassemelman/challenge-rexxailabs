import { z } from 'zod';

// Schema for creating a client, expecting fields within the request body
export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    contactInfo: z.string().optional(),
  })
});

// Schema for updating a client, expecting fields within the request body
export const updateClientSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }).optional(),
    contactInfo: z.string().optional(),
  }),
  // Podrías añadir validación de params aquí si fuera necesario, por ejemplo:
  // params: z.object({ id: z.string().uuid() })
});