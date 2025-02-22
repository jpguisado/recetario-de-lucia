import type { z } from "zod";
import type { plannedMealSchema } from "../schemas/plannedMeal";

export type PlannedMealType = z.infer<typeof plannedMealSchema>