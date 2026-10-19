import { z } from "zod";
export const newListItemSchema = z.object({ title: z.string().trim().min(1).max(200) });
export const completionSchema = z.object({ completed: z.boolean() });
export const listItemIdSchema = z.uuid();
