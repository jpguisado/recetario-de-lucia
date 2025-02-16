import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { getWeekDates, getWeekStartDate, MEALS } from "~/lib/utils";
import { fetchActiveWeekData } from "~/server/data-layer";
import TableSkeleton from "../dish-designer/table-skeleton";
import NewDesignComponent from "./new-design";

export default async function Page(props: {
    searchParams?: Promise<{
        d?: string;
        m?: string;
        y?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
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
    /**
     * 1. Es primera carga o ya tengo una semana cargada
     * -> Si es primera carga
     * --> Miro que día empieza la semana
     * ---> Calculo los 7 días siguientes
     * ----> Muestro la semana
     * -> Si tengo una semana cargada
     * --> Miro que día empieza la semana
     * ---> Calculos 7 dias siguientes
     * ----> Muestro la semana
     */

    return (
        <div>
            <NewDesignComponent
                storedPlannedWeek={fetchFromServerActiveWeekData}
                currentWeek={datesOfCurrentWeek}
                />
        </div>
    )
}