'use client';
import { AppleIcon, Trash2Icon } from "lucide-react";
import { Combobox } from "./combobox";
import { useState } from "react";
import { z } from "zod";
import { Dish, DishListType, DishType } from "~/models/types/dish.type";

const mealSchema = z.object({
    key: z.number(),
    label: z.string(),
})

const mealOfDaySchema = mealSchema.array();

const daySchema = z.object({
    label: z.string(),
    key: z.string(),
    meal: mealOfDaySchema
});

const weekSchema = daySchema.array();

export type MealType = z.infer<typeof mealSchema>
export type MealsOfADayType = z.infer<typeof mealOfDaySchema>
export type DayType = z.infer<typeof daySchema>
export type WeekType = z.infer<typeof weekSchema>

const mealsOfMeals = [];
for (let i = 0; i < 7; i++) {
    const mealsOfDay = [];
    for (let j = 0; j < 6; j++) {
        mealsOfDay.push({ key: Math.random(), label: "-" });
    }
    mealsOfMeals.push(mealsOfDay);
}
const emptyWeek: WeekType = [
    { label: 'Lunes', key: crypto.randomUUID(), meal: mealsOfMeals[0]! },
    { label: 'Martes', key: crypto.randomUUID(), meal: mealsOfMeals[1]! },
    { label: 'Miércoles', key: crypto.randomUUID(), meal: mealsOfMeals[2]! },
    { label: 'Jueves', key: crypto.randomUUID(), meal: mealsOfMeals[3]! },
    { label: 'Viernes', key: crypto.randomUUID(), meal: mealsOfMeals[4]! },
    { label: 'Sábado', key: crypto.randomUUID(), meal: mealsOfMeals[5]! },
    { label: 'Domingo', key: crypto.randomUUID(), meal: mealsOfMeals[6]! },
];

export default function DishDesignerComponent(
    { plannedDays, dishList }: { 
        plannedDays: unknown, 
        dishList: DishListType }
) {

    const [isHovering, setIsHovering] = useState<number | null>();
    const [draggedValue, setDraggedValue] = useState<DishType>({
        id: 0,
        name: '',
    });
    const [mealsOfWeek, setMealsOfWeek] = useState(emptyWeek);
    const updateMealOfWeek = (mealKey: number, updatedMeal: { key: number, label: string }) => {
        const revisedMeals: WeekType = mealsOfWeek.map((day: DayType) => {
            return {
                key: day.key,
                label: day.label,
                meal: day.meal.map((mealToFind) => {
                    if (mealToFind.key === updatedMeal.key) {
                        return { key: Math.random(), label: "-" }
                    } else {
                        return mealToFind
                    }
                })
            }
        })

        const up = revisedMeals.map((day) => {
            return {
                label: day.label,
                key: day.key,
                meal: day.meal.map((meal) => {
                    if (meal.key === mealKey) {
                        return updatedMeal
                    } else {
                        return meal
                    }
                })
            }
        });
        setMealsOfWeek(up);
    }
    return (
        <main className="grid grid-cols-12 gap-6 p-24">
            <div className="col-span-12 bg-blue-50">
                <h1 className="items-center font-medium h-12 text-4xl flex">Semana 43</h1>
                <h2 className="items-center h-12 text-3xl flex">12 jul - 18 jul</h2>
            </div>
            <div className="col-span-4 flex flex-col gap-1">
                <Combobox frameworks={[{ label: "React", value: "react" }, { label: "Vue", value: "vue" }]} />
                <Combobox frameworks={[{ label: "React", value: "react" }, { label: "Vue", value: "vue" }]} />
                <div className="border-[1px] rounded-[2px] px-4 py-2 text-sm font-medium flex flex-col gap-3">
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
            <div className="col-span-8">
                <div className="grid grid-cols-8 gap-x-3 gap-y-1 text-center">
                    {/* Days of the week */}
                    <div className=""></div>
                    <div className="h-6 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Lunes</div>
                    <div className="h-6 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Martes</div>
                    <div className="h-6 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Miércoles</div>
                    <div className="h-6 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Jueves</div>
                    <div className="h-6 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Viernes</div>
                    <div className="h-6 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Sábado</div>
                    <div className="h-6 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Domingo</div>
                    {/* Meals */}
                    <div className="grid gap-1">
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Desayuno</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Media mañana</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Almuerzo</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Merienda</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Cena</div>
                        <div className="h-16 items-center flex justify-center text-sm font-medium border-[1px] bg-slate-100 rounded-[4px]">Snack</div>
                    </div>
                    {mealsOfWeek.map((day) => {
                        return <div key={day.key} className="grid gap-1 h-96">
                            {day.meal.map((meal) => {
                                return <div
                                    key={meal.key} draggable
                                    onDragStart={() => setDraggedValue(meal)}
                                    onDrop={() => {
                                        updateMealOfWeek(meal.key, draggedValue);
                                    }}
                                    onDragOver={(event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        setIsHovering(meal.key);
                                    }}
                                    onDragLeave={() => { setIsHovering(null) }}
                                    className={`h-16 items-center flex justify-center text-sm font-medium transition-all duration-200 ${isHovering === meal.key ? 'border-slate-700 border-dashed border-2 rounded-[4px]' : ''}`}>{meal.label}</div>
                            })}
                        </div>
                    })}
                </div>
                <div className="bg-red-500 text-white flex justify-center border-[1px] rounded-[2px] px-4 py-2 text-sm font-medium mt-3 items-center gap-3">Eliminar comida<Trash2Icon /></div>
            </div>
        </main>
    )
}