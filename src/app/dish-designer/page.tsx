import { calcularLosDiasDeLaSemana } from "~/lib/utils";
import DishDesignerComponent from "./designer";
import { fetchPlannedDays } from "~/server/data-layer";

export default async function DishDesignerPage() {
    const weekDates = calcularLosDiasDeLaSemana(new Date());
    const plannedDays = await fetchPlannedDays(weekDates);
    return (
        <DishDesignerComponent
            plannedDays={plannedDays}
        />
    )
}