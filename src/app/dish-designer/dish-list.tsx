'use client';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DishListType } from "~/models/types/dish.type";
import { AppleIcon } from "lucide-react";
export default function DishList(
    { dishList}: {
        dishList: DishListType,
    }
) {
    const router = useRouter();
    const params = useSearchParams();
    const pathname = usePathname();
    const filterListOfDishes = (dishName: string) => {
        const searchParams = new URLSearchParams(params);
        if (dishName) {
            searchParams.set('dishName', dishName);
        } else {
            searchParams.delete('dishName');
        }
        router.replace(`${pathname}?${searchParams.toString()}`);
    }
    return (
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
    )
}