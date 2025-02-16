'use client';

import type { DishListType, DishType } from "~/models/types/dish.type";
import type { PlannedWeekType } from "~/models/types/plannedDay";

import { AppleIcon, ChevronLeftCircle, ChevronRightCircle, HomeIcon } from "lucide-react";
import { Suspense, use, useEffect, useState, useTransition } from "react";
import { Input } from "~/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getWeekDates, getWeekStartDate, MEALS } from "~/lib/utils";
import { type PlannedMealType } from "~/models/types/plannedMeal";
import { Button } from "~/components/ui/button";
import { storePlannedDay, updateMealOfDay } from "~/server/plannedWeek";
import TableSkeleton from "../dish-designer/table-skeleton";
export const dynamic = 'force-dynamic';
const NewDesignComponent = (
    { dishList, storedPlannedWeek, currentWeek }: {
        storedPlannedWeek: Promise<PlannedWeekType>,
        currentWeek: Date[]
        dishList?: DishListType,
    }
) => {
    const pathname = usePathname();
    const router = useRouter();
    const params = useSearchParams();
    const week = use(storedPlannedWeek);
    const [isHovering, setIsHovering] = useState<{ x: number, y: number } | null>();
    const [isPending, startTransition] = useTransition();
    const [fromCoordinates, setFromCoordinates] = useState<{ dayIndex: number, mealIndex: number }>();
    const [toCoordinates, setToCoordinates] = useState<{ dayIndex: number, mealIndex: number }>();
    const [plannedWeek, setPlannedWeek] = useState(week);
    const [draggedValue, setDraggedValue] = useState<DishType>({
        name: '-',
        id: 1,
        recipe: '',
        ingredientList: []
    });
    const checkActiveDate = () => {
        if (params.has('d') && params.has('m') && params.has('y')) {
            const d = parseInt(params.get('d')!);
            const m = parseInt(params.get('m')!);
            const y = parseInt(params.get('y')!);
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
    function updateSearchParams(newDate: Date) {
        const params = new URLSearchParams();
        params.set('d', newDate.getDate().toString());
        params.set('m', newDate.getMonth().toString());
        params.set('y', newDate.getFullYear().toString());
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    }
    function adjustCurrentWeek(direction: string) {
        const currentDate = checkActiveDate();
        if (direction === 'next') {
            const oneWeekMoreInMilis = currentDate.getTime() + (86400000 * 7);
            const oneWeekMoreDate = new Date(oneWeekMoreInMilis);
            updateSearchParams(new Date(oneWeekMoreDate));
        } else {
            const oneWeekLessInMilis = currentDate.getTime() - (86400000 * 7);
            const oneWeekLessDate = new Date(oneWeekLessInMilis);
            updateSearchParams(new Date(oneWeekLessDate));
        }
    }
    async function updateCurrentMeal() {
        const dayId = week[fromCoordinates!.dayIndex]!.id;
        const mealId = week[fromCoordinates!.mealIndex]!.id;
        await updateMealOfDay(dayId!, mealId!)
    }
    async function updateTargetMeal(targetMealId: number, targetDishId: number) {
        if(fromCoordinates) {
            await updateCurrentMeal()
        }
        await updateMealOfDay(targetDishId, targetMealId)
        // console.log(targetDayId);
        // console.log(targetMealId);
        // console.log(targetDishId);
    }

    return (
        <div className="col-span-9 gap-3 flex flex-col">
            <div className="grid grid-cols-8 gap-x-3 gap-y-1 text-center">
                {/* Days of the week */}
                <div className="flex justify-between items-center gap-1">
                    <Button
                        variant={"outline"}
                        disabled={isPending}
                        onClick={(() => adjustCurrentWeek('previous'))}
                    >
                        <ChevronLeftCircle />
                    </Button>
                    <Button
                        variant={"outline"}
                        disabled={isPending}
                        // onClick={(() => adjustCurrentWeek('next'))}
                    >
                        Hoy
                    </Button>
                    <Button
                        variant={"outline"}
                        disabled={isPending}
                        onClick={(() => adjustCurrentWeek('next'))}
                    >
                        <ChevronRightCircle />
                    </Button>
                </div>
                {currentWeek.map((day) =>
                    <div key={day.getDay()} className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">{day.getDate().toString()}</div>
                )}
                <div className="grid gap-1">
                    {MEALS.map((meal) =>
                        <div key={meal.label} className="h-16 items-center flex justify-center text-xs font-medium border-[1px] bg-slate-100 rounded-[4px]">{meal.label}</div>
                    )}
                </div>
                {week.map((day, dayIndex) => {
                    return (
                        <div key={day.id} className="grid gap-1 h-fit">
                            {day.plannedMeal.map((mealsOfADay, mealIndex) => {
                                return (
                                    <div key={mealsOfADay.id}
                                        draggable
                                        onDragStart={
                                            () => {
                                                setFromCoordinates({ dayIndex, mealIndex });
                                                setDraggedValue(mealsOfADay.dish);
                                            }
                                        }
                                        onDragOver={(event) => {
                                            event.stopPropagation();
                                            event.preventDefault();
                                            setToCoordinates({ dayIndex, mealIndex });
                                            setIsHovering({ x: dayIndex, y: mealIndex });
                                        }}
                                        onDragLeave={() => { setIsHovering(null) }}
                                        onDrop={() => {
                                            setIsHovering(null);
                                            updateTargetMeal(mealsOfADay.id, draggedValue.id);
                                            // void updateCurrentWeekPlan(
                                            //     plannedWeek[fromCoordinates!.dayIndex]!,
                                            //     { id: mealsOfADay.id, meal: MEALS[fromCoordinates!.mealIndex]!.label, dish: { name: '-', id: 1 } },
                                            //     day,
                                            //     { id: mealsOfADay.id, meal: mealsOfADay.meal, dish: draggedValue });
                                            // updatePlannedWeek(draggedValue);
                                        }}
                                        className={`
                                            h-16 
                                            items-center
                                            flex 
                                            justify-center
                                            text-sm
                                            font-medium
                                            transition-all
                                            duration-200
                                            ${isHovering?.x === dayIndex && isHovering.y === mealIndex ?
                                                'border-slate-700 border-dashed border-2 rounded-[4px]' :
                                                ''}`
                                        }>
                                        {isPending ? <TableSkeleton /> : <div className="h-12">{mealsOfADay.dish.name}</div>}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default NewDesignComponent