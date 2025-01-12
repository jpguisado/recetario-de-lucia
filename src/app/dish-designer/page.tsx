import { calcularLosDiasDeLaSemana } from "~/lib/utils";
import DishDesignerComponent from "./designer";
import { fetchDishList, fetchPlannedDays } from "~/server/data-layer";

export default async function DishDesignerPage() {
    const weekDates = calcularLosDiasDeLaSemana(new Date());
    const plannedDays = await fetchPlannedDays(weekDates);
    const dishList = await fetchDishList();
    return (
        <DishDesignerComponent
            plannedDays={plannedDays}
            dishList={dishList}
        />
    )
}