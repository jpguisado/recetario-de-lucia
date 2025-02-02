import { getWeekDates, getWeekNumber, getWeekStartDate, MONTHS } from "~/lib/utils";
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
    const getCurrentWeekNumber = getWeekNumber(dates[0]!);
    const currentWeekStartAndEndDatesString = `
        ${dates[0]!.getDate()} 
        ${MONTHS[dates[0]!.getMonth()]?.short} - 
        ${dates.at(6)!.getDate()} 
        ${MONTHS[dates[6]!.getMonth()]?.short}`
    return (
        <main className="grid grid-cols-12 gap-6 px-24 p-8">
            <div className="col-span-12">
                <h1 className="items-center font-medium h-12 text-4xl flex">Semana {getCurrentWeekNumber}</h1>
                <h2 className="items-center h-12 text-3xl flex">{currentWeekStartAndEndDatesString}</h2>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <DishDesignerComponent
                    storedPlannedWeek={plannedWeek}
                    dishList={dishList}
                />
            </Suspense>
        </main>
    )
}
