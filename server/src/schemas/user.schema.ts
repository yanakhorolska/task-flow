import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  bio: z.string().trim().max(500).nullable().optional(),
  avatarUrl: z.union([z.url().max(2048), z.null()]).optional(),
  birthDate: z.iso.date().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
