import { dishListSchema } from "~/models/schemas/dish";
import { db } from "./db";

/**
 * Gets all the planned days of a week, including meals an dishes.
 * @param datesOfTheWeek An array containing dates to filter
 * @returns the days of the week
 */
export async function fetchPlannedDays(datesOfTheWeek: Date[]) {
    const MEALS = ['BREAKFAST', 'MIDMORNING', 'LUNCH', 'SNACK', 'DINNER'];
    const comidaPlanificada = await db.plannedDay.findMany({
        include: {
            plannedMeal: {
                select: {
                    dish: true,
                    meal: true,
                    dishId: true,
                    id: true
                }
            }
        }, where: {
            day: {
                in: datesOfTheWeek
            }
        }, orderBy: {
            day: "asc"
        }
    })

    // Sorts meals to show them in order
    comidaPlanificada.map((comida) => comida.plannedMeal.sort((a, b) => MEALS.indexOf(a.meal) - MEALS.indexOf(b.meal)))

    return comidaPlanificada;
}

/**
 * Fetch list of dish
 * @returns 
 */
export async function fetchDishList() {
    const dishes = await db.dish.findMany();
    const { success, data } = dishListSchema.safeParse(dishes);
    if (!success) throw new Error('Invalid dish data');
    return data;
}