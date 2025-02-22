import { z } from "zod";
import { plannedMealSchema } from "./plannedMeal";

export const mealSchema = z.union([
    z.literal('BREAKFAST'),
    z.literal('MIDMORNING'),
    z.literal('LUNCH'),
    z.literal('DINNER'),
    z.literal('SNACK'),
    z.literal('COMPLEMENTARY'),
]);

export const plannedDaySchema = z.object({
    id: z.number().optional(),
    day: z.date(),
    plannedMeal: plannedMealSchema.array(),
});

export const plannedWeekSchema = plannedDaySchema.array();