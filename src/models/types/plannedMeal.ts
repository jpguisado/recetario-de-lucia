import type { z } from "zod";
import type { plannedMealSchema } from "../schemas/plannedDay";

export type PlannedMealType = z.infer<typeof plannedMealSchema>
