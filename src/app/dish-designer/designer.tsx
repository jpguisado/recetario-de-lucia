'use client';
import { AppleIcon, ChevronLeftCircle, ChevronRightCircle, Trash2Icon } from "lucide-react";
import { useState } from "react";
import type { DishListType, DishType } from "~/models/types/dish.type";
import type { PlannedDayType, PlannedWeekType } from "~/models/types/plannedDay";
import type { PlannedMealType } from "~/models/types/plannedMeal";
import { Input } from "~/components/ui/input";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
const allWeekMeals = []
for (let i = 0; i < 7; i++) {
    const oneDayMeals: PlannedMealType[] = [] // comidas de un día
    for (let j = 0; j < 6; j++) {
        oneDayMeals.push({
            id: Math.random(),
            dish: {
                id: Math.random(),
                name: '-'
            }
        })
    }
    allWeekMeals.push(oneDayMeals)
}

const emptyWeek: PlannedWeekType = [] // dias de la semana
for (let i = 0; i < 7; i++) {
    emptyWeek.push({
        id: Math.random(),
        day: new Date(),
        plannedMeal: allWeekMeals[i]! // aqui se está metiendo siete veces lo mismo
    })
}

export default function DishDesignerComponent(
    { plannedWeek, dishList, weekDates }: {
        plannedWeek: PlannedWeekType,
        dishList: DishListType,
        weekDates: Date[]
    }
) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { replace } = useRouter();
    const [startingDate, setStartingDate] = useState(new Date());
    /**
     * Sets the starting date to configure the calendar
     * @param e  React mouse event
     * @param action Add or remove action
     */
    const setCalendarStartDate = async (e: React.MouseEvent<HTMLButtonElement>, action: string): Promise<void> => {
        e.preventDefault();
        const timeInMilis = action === 'add' ? startingDate.getTime() + (86400000 * 7) : startingDate.getTime() - (86400000 * 7);
        setStartingDate(new Date(timeInMilis));
        await setDateInSearchParams(timeInMilis)
    }
    /**
     * Sets date in Search params
     */
    async function setDateInSearchParams(startingDate: number) {
        const params = new URLSearchParams(searchParams);
        params.set('dateInMilis', startingDate.toString())
        replace(`${pathname}?${params.toString()}`);
    }
    const [isHovering, setIsHovering] = useState<number | null>();
    const [draggedValue, setDraggedValue] = useState<DishType>({ // TODO
        name: '-',
        id: Math.random(),
        recipe: '',
        ingredientList: []
    });
    const [mealsOfWeek, setMealsOfWeek] = useState(emptyWeek);
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
                    {dishList.map((dish) => {
                        return (
                            <div key={dish.id} draggable onDragStart={() => setDraggedValue(dish)} className="hover:bg-slate-50 border-[1px] bg-white rounded-[2px] p-3 flex gap-2 items-center">
                                <AppleIcon />
                                {dish.name}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="col-span-8 gap-3 flex flex-col">
                <div className="grid grid-cols-8 gap-x-3 gap-y-1 text-center">
                    {/* Days of the week */}
                    <div className="flex justify-between items-center">
                        <Button onClick={(e) => setCalendarStartDate(e, 'remove')}>
                            <ChevronLeftCircle  />
                        </Button>
                        <Button onClick={(e) => setCalendarStartDate(e, 'add')}>
                            <ChevronRightCircle />
                        </Button>
                    </div>
                    {weekDates.map((dia) =>
                        <div key={dia.getMilliseconds()} className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">{dia.getDate()}</div>
                    )}
                    {/* <div className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Lunes 10/1/2024</div>
                    <div className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Martes 10/1/2024</div>
                    <div className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Miércoles 10/1/2024</div>
                    <div className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Jueves 10/1/2024</div>
                    <div className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Viernes 10/1/2024</div>
                    <div className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Sábado 10/1/2024</div>
                    <div className="h-12 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Domingo 10/1/2024</div> */}
                    {/* Meals */}
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
                {

                    <div className="bg-red-500 text-white flex justify-center border-[1px] rounded-[2px] px-4 py-2 text-sm font-medium items-center gap-3">Eliminar comida<Trash2Icon /></div>
                }
            </div>
        </main>
    )
}