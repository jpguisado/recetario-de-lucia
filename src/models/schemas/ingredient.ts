import { z } from "zod";

export const ingredientSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1)
});

export const brandNewIngredientSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1)
});

export const createIngredientSchema = z.object({
    ingredientId: z.number().optional(),
    name: z.string().min(1),
    quantity: z.string(),
    quantityUnit: z.string()
});


export const editIngredientSchema = z.object({
    ingredientId: z.number(),
    name: z.string().min(1),
    quantity: z.string(),
    quantityUnit: z.string()
});

export const ingredientsOnDishesSchema = z.object({
    ingredientId: z.number().optional(),
    ingredient: brandNewIngredientSchema,
    quantity: z.string(),
    quantityUnit: z.string()
});