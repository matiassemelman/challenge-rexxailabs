import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  contactInfo: z.string().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }).optional(),
  contactInfo: z.string().optional(),
});