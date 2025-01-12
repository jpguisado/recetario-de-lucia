'use client';
import { AppleIcon } from "lucide-react";
import { Combobox } from "./combobox";
import { useState } from "react";

const mealsOfMeals = [];
for (let i = 0; i < 7; i++) {
    const mealsOfDay = [];
    for (let j = 0; j < 6; j++) {
        mealsOfDay.push({ key: Math.random(), label: "-" });
    }
    mealsOfMeals.push(mealsOfDay);
}

const emptyWeek = [
    { key: crypto.randomUUID(), meal: mealsOfMeals[0]! },
    { key: crypto.randomUUID(), meal: mealsOfMeals[1]! },
    { key: crypto.randomUUID(), meal: mealsOfMeals[2]! },
    { key: crypto.randomUUID(), meal: mealsOfMeals[3]! },
    { key: crypto.randomUUID(), meal: mealsOfMeals[4]! },
    { key: crypto.randomUUID(), meal: mealsOfMeals[5]! },
    { key: crypto.randomUUID(), meal: mealsOfMeals[6]! },
];

export default function DishDesignerComponent({ plannedDays }: { plannedDays: unknown }) {

    const [isHovering, setIsHovering] = useState<number | null>();
    const [draggedValue, setDraggedValue] = useState({
        key: 0,
        label: '',
    });
    const [mealsOfWeek, setMealsOfWeek] = useState(emptyWeek);
    const updateMealOfWeek = (dayKey: string, mealKey: number, updatedWeek: { key: number, label: string }) => {
        console.log(dayKey);
        console.log(mealKey);
        console.log(updatedWeek);
        const up = mealsOfWeek.map((days) => {
            return {
                key: days.key,
                meal: days.meal.map((meal) => {
                    if(meal.key === mealKey) {
                        return updatedWeek
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
            <div className="col-span-12 bg-blue-50 h-12">
                <h1 className="font-serif text-4xl flex">Hello world</h1>
            </div>
            <div className="col-span-4 flex flex-col gap-1">
                <Combobox frameworks={[{ label: "React", value: "react" }, { label: "Vue", value: "vue" }]} />
                <Combobox frameworks={[{ label: "React", value: "react" }, { label: "Vue", value: "vue" }]} />
                <div className="border-[1px] rounded-[2px] px-4 py-2 text-sm font-medium flex flex-col gap-3">Dishes
                    <div draggable onDragStart={() => setDraggedValue({ key: 12345, label: 'Tortilla de patatas draggadas' })} className="hover:bg-slate-50 border-[1px] bg-white rounded-[2px] p-3 flex gap-2 items-center">
                        <AppleIcon />
                        Papas fritas con huevo
                    </div>
                    <div className="border-[1px] rounded-[2px] p-3 flex gap-2 items-center">
                        <AppleIcon />
                        Papas fritas con huevo
                    </div>
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
                                    onDragOver={() => { setIsHovering(meal.key); updateMealOfWeek(day.key, meal.key, draggedValue) }}
                                    onDragLeave={() => { setIsHovering(null) }}
                                    className={`h-16 items-center flex justify-center text-sm font-medium transition-all duration-200 ${isHovering === meal.key ? 'border-slate-700 border-dashed border-2 rounded-[4px]' : ''}`}>{meal.label}</div>
                            })}
                        </div>
                    })}
                </div>
            </div>
        </main>
    )
}