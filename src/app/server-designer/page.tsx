import { getWeekDates, getWeekStartDate } from "~/lib/utils";
import { fetchActiveWeekData, fetchDishList } from "~/server/data-layer";
import NewDesignComponent from "./new-design";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        d?: string;
        m?: string;
        y?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const dishName = searchParams?.query ?? '';
    const dayInParams = searchParams?.d ?? '';
    const monthInParams = searchParams?.m ?? '';
    const yearInParams = searchParams?.y ?? '';
    const checkActiveDate = () => {
        if (dayInParams && monthInParams && yearInParams) {
            const d = parseInt(dayInParams);
            const m = parseInt(monthInParams);
            const y = parseInt(yearInParams);
            const currentDateInParams = new Date(y, m, d, 1);
            const firstDayFromParams = getWeekStartDate(currentDateInParams);
            return firstDayFromParams;
        } else {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const currentDay = new Date().getDate();
            const currentDateInParams = new Date(currentYear, currentMonth, currentDay, 1);
            const firstDayFromServer = getWeekStartDate(currentDateInParams);
            return firstDayFromServer;
        }
    }
    const calculatedFirstDay = checkActiveDate();
    const datesOfCurrentWeek = getWeekDates(calculatedFirstDay);
    const fetchFromServerActiveWeekData = fetchActiveWeekData(datesOfCurrentWeek);
    const dishList = fetchDishList(dishName);
    return (
        <NewDesignComponent
            storedDishList={dishList}
            storedPlannedWeek={fetchFromServerActiveWeekData}
            currentWeek={datesOfCurrentWeek}
        />
    )
}