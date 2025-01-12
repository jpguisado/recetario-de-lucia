import { z } from "zod";

export const ingredientSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1)
});