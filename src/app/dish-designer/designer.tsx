'use client';
import { AppleIcon, ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { Suspense, useState } from "react";
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
import { getWeekDates, getWeekStartDate } from "~/lib/utils";

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

    const [isHovering, setIsHovering] = useState<number | null>();
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
    const updateMealOfWeek = (dishId: number, newDish: DishType) => {
        const revisedMeals: PlannedWeekType = mealsOfWeek.map((day: PlannedDayType) => {
            return {
                id: day.id,
                day: day.day,
                plannedMeal: day.plannedMeal.map((dishToFind) => {
                    if (dishToFind.dish.id === newDish.id) {
                        return { id: Math.random(), dish: { name: '-', id: Math.random() } }
                    } else {
                        return dishToFind
                    }
                })
            }
        })
        const up = revisedMeals.map((day) => {
            return {
                id: day.id,
                day: day.day,
                plannedMeal: day.plannedMeal.map((dish) => {
                    if (dish.dish.id === dishId) {
                        return {
                            ...dish,
                            dish: newDish,
                        } // CAMBIAR ESTO
                    } else {
                        return dish
                    }
                })
            }
        });
        setMealsOfWeek(up);
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
                    {
                        <Suspense fallback="Scheleton..">
                            {dishList.map((dish) => {
                                return (
                                    <div key={dish.id} draggable onDragStart={() => setDraggedValue(dish)} className="hover:bg-slate-50 border-[1px] bg-white rounded-[2px] p-3 flex gap-2 items-center">
                                        <AppleIcon />
                                        {dish.name}
                                    </div>
                                )
                            })}
                        </Suspense>
                    }
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
                    {mealsOfWeek.map((meal) => {
                        return <div key={meal.id} className="grid gap-1 h-96">
                            {meal.plannedMeal.map((dishOfAMeal) => {
                                return <div key={dishOfAMeal.id}
                                    draggable
                                    onDragStart={() => setDraggedValue(dishOfAMeal.dish)}
                                    onDragOver={(event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        setIsHovering(dishOfAMeal.dish.id);
                                    }}
                                    onDragLeave={() => { setIsHovering(null) }}
                                    onDrop={() => { // TODO
                                        updateMealOfWeek(dishOfAMeal.dish.id!, draggedValue);
                                    }}
                                    className={`h-16 
                                            items-center
                                            flex 
                                            justify-center
                                            text-sm
                                            font-medium
                                            transition-all
                                            duration-200
                                            ${isHovering === dishOfAMeal.dish.id ?
                                            'border-slate-700 border-dashed border-2 rounded-[4px]' :
                                            ''}`
                                    }>
                                    {dishOfAMeal.dish.name}
                                </div>
                            })}
                        </div>
                    })}
                </div>
            </div>
        </main>
    )
}