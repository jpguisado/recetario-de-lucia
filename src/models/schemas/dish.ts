import { z } from "zod";
import { ingredientSchema } from "./ingredient";

export const dishSchema = z.object({
    id: z.number().optional(),
    recipe: z.string().optional(),
    name: z.string().min(1),
    kcal: z.string().optional(),
    ingredientList: ingredientSchema.array().optional()
});

export const dishListSchema = dishSchema.array();