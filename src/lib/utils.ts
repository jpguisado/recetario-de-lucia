import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
* Given a date, it returns the next six following dates
* @param firstDayOfWeek It can be 0 or 1 representing sunday or monday
* @param firstDateOfWeek It will be the date of the first day of week
* @returns Array of dates that represents the current week
*/
export const calcularLosDiasDeLaSemana = (firstDateOfWeek: Date): Date[] => {
  const twentyFourHoursInMilis = 86400000;
  const weekDates: Date[] = []; // Array donde almacenaremos las fechas
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const dayInMilis = firstDateOfWeek.getTime() + twentyFourHoursInMilis * dayOfWeek;
    const dateToAdd = new Date(dayInMilis);
    weekDates.push(dateToAdd);
  }
  return weekDates;
}