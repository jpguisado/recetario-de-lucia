import { calcularLosDiasDeLaSemana } from "~/lib/utils";
import DishDesignerComponent from "./designer";
import { fetchDishList, fetchPlannedMealsWellFormated } from "~/server/data-layer";

export default async function DishDesignerPage() {
    const weekDates = calcularLosDiasDeLaSemana(new Date());
    const plannedWeek = await fetchPlannedMealsWellFormated(weekDates);
    const dishList = await fetchDishList();
    return (
        <DishDesignerComponent
            plannedWeek={plannedWeek}
            dishList={dishList}
        />
    )
}