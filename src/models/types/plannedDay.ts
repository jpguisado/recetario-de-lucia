import type { z } from "zod";
import type { plannedDaySchema, plannedWeekSchema } from "../schemas/plannedDay";

export type PlannedDayType = z.infer<typeof plannedDaySchema>
export type PlannedWeekType = z.infer<typeof plannedWeekSchema>