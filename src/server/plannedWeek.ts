"use server"

import { db } from "./db";
import type { MealsType } from "~/models/types/meals.type";
import type { PlannedDayType } from "~/models/types/plannedDay";
import type { PlannedMealType } from "~/models/types/plannedMeal";

export async function storePlannedDay(
    plannedDayFrom: PlannedDayType,
    plannedMealFrom: PlannedMealType,
    plannedDayTo: PlannedDayType,
    plannedMealTo: PlannedMealType,
) {
    const day = await db.plannedDay.upsert({
        create: {
            day: plannedDayFrom.day
        },
        update: {

        },
        where: {
            id: plannedDayFrom.id
        }
    })
    await db.plannedDay.upsert({
        create: {
            day: plannedDayTo.day
        },
        update: {

        },
        where: {
            id: plannedDayTo.id ?? day.id
        }
    })
    await db.plannedMeal.upsert({
        create: {
            plannedDayId: plannedDayFrom.id!,
            dishId: plannedMealFrom.dish.id!,
            meal: plannedMealFrom.meal,
        },
        update: {
            plannedDayId: plannedDayFrom.id!,
            dishId: plannedMealFrom.dish.id!,
            meal: plannedMealFrom.meal,
        },
        where: {
            id: plannedMealFrom.id
        }
    });

    await db.plannedMeal.upsert({
        create: {
            plannedDayId: plannedDayTo.id!,
            dishId: plannedMealTo.dish.id!,
            meal: plannedMealTo.meal,
        },
        update: {
            plannedDayId: plannedDayTo.id!,
            dishId: plannedMealTo.dish.id!,
            meal: plannedMealTo.meal,
        },
        where: {
            id: plannedMealTo.id
        }
    });
}

export async function updateMealOfDay(dishId: number, mealId: number) {
    await db.plannedMeal.update({
        data: {
            dishId: dishId,
        },
        where: {
            id: mealId,
        }
    })
}