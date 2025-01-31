'use client';
import { AppleIcon, ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { useState } from "react";
import type { DishListType, DishType } from "~/models/types/dish.type";
import type { PlannedWeekType } from "~/models/types/plannedDay";
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
export default function DishDesignerComponent(
{ dishList, plannedWeek }: {
        plannedWeek: PlannedWeekType
        dishList: DishListType,
    }
) {
    const pathname = usePathname();
    const router = useRouter();
    const params = useSearchParams();

    const activeDateOnClient = new Date();
    const firstDayOfTheWeek = getWeekStartDate(activeDateOnClient);

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

    function adjustWeek(direction: string) {
        const currentDate = checkActiveDate();
        if (direction === 'next') {
            const oneWeekMoreInMilis = currentDate.getTime() + (86400000 * 7);
            const oneWeekMoreDate = new Date(oneWeekMoreInMilis);
            const nextWeekDates = getWeekDates(oneWeekMoreDate);
            updateSearchParams(new Date(oneWeekMoreDate));
            setWeekDates(nextWeekDates);
        } else {
            const oneWeekLessInMilis = currentDate.getTime() - (86400000 * 7);
            const oneWeekLessDate = new Date(oneWeekLessInMilis);
            const previousWeekDates = getWeekDates(oneWeekLessDate);
            updateSearchParams(new Date(oneWeekLessDate));
            setWeekDates(previousWeekDates);
        }
    }

    function updateSearchParams(newDate: Date) {
        const params = new URLSearchParams();
        params.set('d', newDate.getDate().toString());
        params.set('m', newDate.getMonth().toString());
        params.set('y', newDate.getFullYear().toString());
        router.replace(`${pathname}?${params.toString()}`);
    }

    const [fromCoordinates, setFromCoordinates] = useState<{ dayIndex: number, mealIndex: number }>();
    const [toCoordinates, setToCoordinates] = useState<{ dayIndex: number, mealIndex: number }>();
    const [isHovering, setIsHovering] = useState<{ x: number, y: number } | null>();
    const [draggedValue, setDraggedValue] = useState<DishType>({ // TODO
        name: '-',
        id: Math.random(),
        recipe: '',
        ingredientList: []
    });
    const [weekDates, setWeekDates] = useState(
        getWeekDates(firstDayOfTheWeek)
    );
    const [mealsOfWeek, setMealsOfWeek] = useState(plannedWeek);

    /**
     * 
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
            dish: { name: '-' }
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

        if (fromCoordinates) {
            mealInPlan = mealsOfWeek.toSpliced(
                fromCoordinates.dayIndex,
                1,
                updatePlannedMeals(mealsOfWeek, fromCoordinates.dayIndex, fromCoordinates.mealIndex, mealSlot(fromCoordinates.mealIndex))
            );
        } else {
            mealInPlan = mealsOfWeek;
        }

        const addMeal: PlannedWeekType = mealInPlan.toSpliced(
            toCoordinates.dayIndex,
            1,
            updatePlannedMeals(mealInPlan, toCoordinates.dayIndex, toCoordinates.mealIndex, mealWithNewDish(toCoordinates.mealIndex))
        )
        setMealsOfWeek(addMeal);
    }
    return (
        <main className="grid grid-cols-12 gap-6 px-24 p-8">
            <div className="col-span-12">
                <h1 className="items-center font-medium h-12 text-4xl flex">Semana 43</h1>
                <h2 className="items-center h-12 text-3xl flex">12 jul - 18 jul</h2>
            </div>
            <div className="col-span-4 flex flex-col gap-1">
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
                <Input placeholder="Introduce texto para filtrar los platos:" />
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
            <div className="col-span-8 gap-3 flex flex-col">
                <div className="grid grid-cols-8 gap-x-3 gap-y-1 text-center">
                    {/* Days of the week */}
                    <div className="flex justify-between items-center">
                        <ChevronLeftCircle onClick={(() => adjustWeek('previous'))} />
                        <ChevronRightCircle onClick={(() => adjustWeek('next'))} />
                    </div>
                    {weekDates.map((dia) =>
                        <div key={dia.getDay()} className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">{dia.getDate()}</div>
                    )}
                    <div className="grid gap-1">
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Desayuno</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Media mañana</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Almuerzo</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Merienda</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Cena</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Snack</div>
                    </div>
                    {mealsOfWeek.map((day, dayIndex) => {
                        return (
                            <div key={day.id} className="grid gap-1 h-96">
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
                                                updatePlannedWeek(draggedValue);
                                            }}
                                            className={`h-16 
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
                                            {mealsOfADay.dish.name}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}

function uuidv4() {
    throw new Error("Function not implemented.");
}
