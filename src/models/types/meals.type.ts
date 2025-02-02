import type { z } from "zod";
import type { mealSchema } from "../schemas/plannedDay";

export type MealsType = z.infer<typeof mealSchema>