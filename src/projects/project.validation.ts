import { z } from 'zod';
import { ProjectStatus } from '@prisma/client';

const projectStatusEnum = z.nativeEnum(ProjectStatus);

// Schema for creating a project - validates request body
export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Project name is required" }),
    description: z.string().optional(),
    clientId: z.string().uuid({ message: "Invalid client UUID format" }), // Ensure clientId is provided and is a UUID
    status: projectStatusEnum.optional().default(ProjectStatus.PENDING), // Optional on creation, defaults to PENDING
    // Add optional date fields
    startDate: z.coerce.date().optional(),
    deliveryDate: z.coerce.date().optional(),
  }),
});

// Schema for updating a project - validates request body and params
export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Project name cannot be empty" }).optional(),
    description: z.string().optional().nullable(), // Allow null to clear description
    status: projectStatusEnum.optional(),
    // Add optional date fields, allow null to clear them
    startDate: z.coerce.date().optional().nullable(),
    deliveryDate: z.coerce.date().optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "Invalid project UUID format in URL parameter" }),
  }),
});

// Schema for project ID parameter (for GET and DELETE operations)
export const projectIdSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid project UUID format in URL parameter" }),
  }),
});

// Schema for project query parameters (e.g., filtering by status or clientId)
export const projectFilterSchema = z.object({
  query: z.object({
    status: projectStatusEnum.optional(),
    clientId: z.string().uuid({ message: "Invalid client UUID format" }).optional(),
  }).optional(),
});