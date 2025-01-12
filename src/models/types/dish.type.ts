import type { z } from "zod";
import type { dishListSchema, dishSchema } from "../schemas/dish";

export type DishType = z.infer<typeof dishSchema>
export type DishListType = z.infer<typeof dishListSchema>