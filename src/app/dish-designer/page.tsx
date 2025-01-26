import { MEALS } from "~/lib/utils";
import DishDesignerComponent from "./designer";
import { fetchDishList, fetchPlannedDays } from "~/server/data-layer";

export default async function DishDesignerPage() {
    const MEALS = [
        'BREAKFAST',
        'MIDMORNING',
        'LUNCH',
        'SNACK',
        'DINNER',
        'COMPLEMENTARY',
    ];
    const dates = [
        new Date(2025, 0, 6, 1),
        new Date(2025, 0, 7, 1),
        new Date(2025, 0, 8, 1),
        new Date(2025, 0, 9, 1),
        new Date(2025, 0, 10, 1),
        new Date(2025, 0, 11, 1),
        new Date(2025, 0, 12, 1),
    ]
    const dishList = await fetchDishList();
    const plannedWeek = await fetchPlannedDays(dates);

    const filledMeals = plannedWeek.map((dayInBBDD) => {
        return {
            ...dayInBBDD,
            "plannedMeal": Array.from({ length: 6 }, (_, _index) => {
                return dayInBBDD.plannedMeal.find((mealsOfADay) => mealsOfADay.meal === MEALS[_index]) ?? {
                    id: Math.random(),
                    dishId: Math.random(),
                    dish: {
                        id: Math.random(),
                        name: '-'
                    },
                    meal: MEALS[_index]!
                }
            })
        }
    });

    const filledDays = dates.map((dayInMemory) => {
        return filledMeals.find((dayInBBDD) => dayInBBDD.day.getTime() === dayInMemory.getTime()) ?? {
            "id": Math.random(),
            "day": dayInMemory,
            "plannedMeal": Array.from({ length: 6 }, (_, _index) => {
                return {
                    id: _index,
                    dish: {
                        id: Math.random(),
                        name: '-'
                    },
                    meal: MEALS[_index]!
                }
            })
        };
    });
    console.log(filledDays)
    return (
        <DishDesignerComponent
            plannedWeek={filledDays}
            dishList={dishList}
        />
    )
}
