"use server"

import { db } from "./db";
import type { DishType } from "~/models/types/dish.type";
import type { MealsType } from "~/models/types/meals.type";

export async function storePlannedWeek(day: Date, meal: MealsType, dish: DishType) {
    await db.plannedMeal.create({
        data: {
            meal: meal,
            plannedDay: {
                connectOrCreate: {
                    create: {
                        day: day
                    },
                    where: {
                        day: day
                    }
                }
            },
            dish: {
                connect: {
                    id: dish.id
                }
            }
        },
    });
}