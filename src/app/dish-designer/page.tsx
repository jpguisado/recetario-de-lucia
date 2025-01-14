import { getWeekDates, getWeekStartDate } from "~/lib/utils";
import DishDesignerComponent from "./designer";
import { fetchDishList, fetchPlannedMealsWellFormated } from "~/server/data-layer";

export default async function DishDesignerPage(props: {
    searchParams?: Promise<{
        dateInMilis?: string;
    }>;
}) {

    const a = (await props.searchParams)?.dateInMilis;
    const getMonday = getWeekStartDate(a ? new Date(parseInt(a, 10)) : new Date());
    const weekDates = getWeekDates(getMonday);
    const plannedWeek = await fetchPlannedMealsWellFormated(weekDates);
    const dishList = await fetchDishList();

    return (
        <DishDesignerComponent
            weekDates={weekDates}
            plannedWeek={plannedWeek}
            dishList={dishList}
        />
    )
}