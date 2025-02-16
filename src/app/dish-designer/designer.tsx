'use client';
import { AppleIcon, ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { use, useEffect, useState, useTransition } from "react";
import type { DishListType, DishType } from "~/models/types/dish.type";
import type { PlannedDayType, PlannedWeekType } from "~/models/types/plannedDay";
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
import TableSkeleton from "./table-skeleton";
import { storePlannedDay } from "~/server/plannedWeek";
export const dynamic = 'force-dynamic'
export default function DishDesignerComponent(
    { dishList, storedPlannedWeek }: {
        storedPlannedWeek: Promise<PlannedWeekType>,
        dishList: DishListType,
    }
) {
    // TODO: cuando busco un plato, se borra el contenido de la tabla.
    // Cuando recargo la página con parámetros en la URL, se pierden los días
    const pathname = usePathname();
    const router = useRouter();
    const params = useSearchParams();
    const week = use(storedPlannedWeek);
    const [fromCoordinates, setFromCoordinates] = useState<{ dayIndex: number, mealIndex: number }>();
    const [toCoordinates, setToCoordinates] = useState<{ dayIndex: number, mealIndex: number }>();
    const [isHovering, setIsHovering] = useState<{ x: number, y: number } | null>();
    const [plannedWeek, setPlannedWeek] = useState(week);
    const [isPending, startTransition] = useTransition();
    const [draggedValue, setDraggedValue] = useState<DishType>({
        name: '-',
        id: 1,
        recipe: '',
        ingredientList: []
    });
    useEffect(() => {
        setPlannedWeek(week)
    }, [week])
    function checkActiveDate() {
        if (params.has('d') && params.has('m') && params.has('y')) {
            const d = parseInt(params.get('d')!);
            const m = parseInt(params.get('m')!);
            const y = parseInt(params.get('y')!);
            const dateInParams = new Date(y, m, d);
            return dateInParams;
        } else {
            return new Date();
        }
    }
    const firstDayOfTheWeek = getWeekStartDate(checkActiveDate());
    const [currentWeekDates, setCurrentWeekDates] = useState(
        getWeekDates(firstDayOfTheWeek)
    );
    function adjustCurrentWeek(direction: string) {
        const currentDate = checkActiveDate();
        if (direction === 'next') {
            const oneWeekMoreInMilis = currentDate.getTime() + (86400000 * 7);
            const oneWeekMoreDate = new Date(oneWeekMoreInMilis);
            const nextWeekDates = getWeekDates(oneWeekMoreDate);
            updateSearchParams(new Date(oneWeekMoreDate));
            setCurrentWeekDates(nextWeekDates);
        } else {
            const oneWeekLessInMilis = currentDate.getTime() - (86400000 * 7);
            const oneWeekLessDate = new Date(oneWeekLessInMilis);
            const previousWeekDates = getWeekDates(oneWeekLessDate);
            updateSearchParams(new Date(oneWeekLessDate));
            setCurrentWeekDates(previousWeekDates);
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

    const filterListOfDishes = (dishName: string) => {
        const searchParams = new URLSearchParams(params);
        if (dishName) {
            searchParams.set('dishName', dishName);
        } else {
            searchParams.delete('dishName');
        }
        router.replace(`${pathname}?${searchParams.toString()}`);
    }

    /**
     * Updates the planification table
     * @param newDish 
     * @returns 
     */
    const updatePlannedWeek = (newDish: DishType) => {
        let mealInPlan: PlannedWeekType = [];
        if (!toCoordinates) {
            console.error("Invalid destination coordinates provided");
            return;
        }
        // Generate a empty meal slot
        const mealSlot = (mealIndex: number) => ({
            meal: MEALS[mealIndex]!.label,
            id: Math.random(),
            dish: { name: '-', id: 1 }
        });

        // Generate a empty meal slot
        const mealWithNewDish = (mealIndex: number) => ({
            meal: MEALS[mealIndex]!.label,
            id: Math.random(),
            dish: newDish,
        });

        /**
         * Updates the meal of a day with a new dish
         * @param dayIndex the day where the meal is
         * @param mealIndex the meal position were we are going to insert
         * @param meal the meal we're going to update
         * @returns a updated version of a weekly plan 
         */
        const updatePlannedMeals = (planToBeUpdated: PlannedWeekType, dayIndex: number, mealIndex: number, meal: PlannedMealType) => {
            const day = planToBeUpdated[dayIndex]!.day;
            const updatedPlannedMeal = planToBeUpdated[dayIndex]!.plannedMeal.toSpliced(mealIndex, 1, meal);
            return {
                id: Math.random(),
                day,
                plannedMeal: updatedPlannedMeal
            };
        };

        // Checks if the dish comes from table or from dish list
        if (fromCoordinates) {
            mealInPlan = plannedWeek.toSpliced(
                fromCoordinates.dayIndex,
                1,
                updatePlannedMeals(plannedWeek, fromCoordinates.dayIndex, fromCoordinates.mealIndex, mealSlot(fromCoordinates.mealIndex))
            );
        } else {
            mealInPlan = plannedWeek;
        }
        const addMeal: PlannedWeekType = mealInPlan.toSpliced(
            toCoordinates.dayIndex,
            1,
            updatePlannedMeals(mealInPlan, toCoordinates.dayIndex, toCoordinates.mealIndex, mealWithNewDish(toCoordinates.mealIndex))
        )
        setPlannedWeek(addMeal);
    }
    async function updateCurrentWeekPlan(
        dayFrom: PlannedDayType,
        mealsOfADayFrom: PlannedMealType,
        dayTo: PlannedDayType,
        mealsOfADayTo: PlannedMealType
    ) {
        console.log('from day: ', dayFrom);
        console.log('to day: ', dayTo);
        console.log('from meal: ', mealsOfADayFrom);
        console.log('to meal: ', mealsOfADayTo);
        startTransition(async () => {
            await storePlannedDay(dayFrom, mealsOfADayFrom, dayTo, mealsOfADayTo);
        })
    }
    return (
        <>  
            <div className="col-span-3 flex flex-col gap-1">
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categorías</SelectLabel>
                            <SelectItem value="desayuno">Desayuno</SelectItem>
                            <SelectItem value="media mañana">Media mañana</SelectItem>
                            <SelectItem value="almuerzo">Almuerzo</SelectItem>
                            <SelectItem value="merienda">Merienda</SelectItem>
                            <SelectItem value="cena">Cena</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Introduce texto para filtrar los platos:"
                    onChange={(e) => {
                        filterListOfDishes(e.target.value);
                    }}
                    defaultValue={params.get('dishName')?.toString()}
                />
                <div className="border-[1px] rounded-[2px] px-4 py-2 text-sm font-medium flex flex-col gap-3 h-80 overflow-x-scroll">
                    <div>Dishes:</div>
                    {dishList.map((dish) => {
                        return <div
                            className="hover:bg-slate-50 border-[1px] bg-white rounded-[2px] p-3 flex gap-2 items-center"
                            key={dish.id}
                            draggable
                            onDragStart={() => setDraggedValue(dish)}>
                            <AppleIcon />
                            {dish.name}
                        </div>
                    })}
                </div>
            </div>
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
                            onClick={(() => adjustCurrentWeek('next'))}
                        >
                            <ChevronRightCircle />
                        </Button>
                    </div>
                    {currentWeekDates.map((day) =>
                        <div key={day.getDay()} className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">{day.getDate()}</div>
                    )}
                    <div className="grid gap-1">
                        {MEALS.map((meal) =>
                            <div key={meal.label} className="h-16 items-center flex justify-center text-xs font-medium border-[1px] bg-slate-100 rounded-[4px]">{meal.label}</div>
                        )}
                    </div>
                    {plannedWeek.map((day, dayIndex) => {
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
                                                void updateCurrentWeekPlan(
                                                    plannedWeek[fromCoordinates!.dayIndex]!,
                                                    { id: mealsOfADay.id, meal: MEALS[fromCoordinates!.mealIndex]!.label, dish: { name: '-', id: 1 } },
                                                    day,
                                                    { id: mealsOfADay.id, meal: mealsOfADay.meal, dish: draggedValue });
                                                updatePlannedWeek(draggedValue);
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
        </>
    )
}