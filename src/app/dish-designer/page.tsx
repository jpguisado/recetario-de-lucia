import { getWeekDates, getWeekStartDate } from "~/lib/utils";
import DishDesignerComponent from "./designer";
import { fetchDishList, fetchPlannedDays } from "~/server/data-layer";
import { Suspense } from "react";

export default async function Page(props: {
    searchParams?: Promise<{
        dishName?: string;
        dishCategory?: string;
        d?: string;
        m?: string;
        y?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const dishName = searchParams?.dishName ?? '';
    const day = searchParams?.d ?? '';
    const month = searchParams?.m ?? '';
    const year = searchParams?.y ?? '';

    const currentDayOnServer = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 1);
    const firstDayOfTheWeek = getWeekStartDate(currentDayOnServer);
    function checkActiveDate() {
        if (day && month && year) {
            const d = parseInt(day);
            const m = parseInt(month);
            const y = parseInt(year);
            const dateInParams = new Date(y, m, d, 1);
            return dateInParams;
        } else {
            return firstDayOfTheWeek;
        }
    }
    const selectedStartingDate = checkActiveDate()
    const dates = getWeekDates(selectedStartingDate);
    const dishList = await fetchDishList(dishName);
    const plannedWeek = fetchPlannedDays(dates);

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <DishDesignerComponent
                storedPlannedWeek={plannedWeek}
                dishList={dishList}
            />
        </Suspense>
    )
}
