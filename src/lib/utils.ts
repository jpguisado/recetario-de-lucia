import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the number of a week given a date
 * @param dateToCompare the date whose week we want to know
 * @returns The number of a week
 */
export const getWeekNumber = (dateToCompare: Date) => {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
  const difference = dateToCompare.getTime() - firstDayOfYear;
  return Math.ceil(((difference) / 86400000 + 1) / 7)
}

export const MONTHS = [
  {
    label: 'January',
    short: 'Jan'
  },
  {
    label: 'February',
    short: 'Feb'
  },
  {
    label: 'March',
    short: 'Mar'
  },
  {
    label: 'April',
    short: 'Apr'
  },
  {
    label: 'May',
    short: 'May'
  },
  {
    label: 'June',
    short: 'Jun'
  },
  {
    label: 'July',
    short: 'Jul'
  },
  {
    label: 'August',
    short: 'Aug'
  },
  {
    label: 'September',
    short: 'Sep'
  },
  {
    label: 'October',
    short: 'Oct'
  },
  {
    label: 'November',
    short: 'Nov'
  },
  {
    label: 'December',
    short: 'Dec'
  }
];

export const MEALS = [
  {
    label: 'BREAKFAST',
    icon: ''
  },{
    label: 'MIDMORNING',
    icon: '',
  },{
    label: 'LUNCH',
    icon: '',
  }, {
    label: 'SNACK',
    icon: '', 
  },{
    label: 'DINNER',
    icon: '',
  },{
    label: 'COMPLEMENTARY',
    icon: '',
  }
] as const;

/**
* Calculates an array of seven consecutive dates starting from a given date
* @param startDate The starting date to calculate the week from
* @returns Array of 7 consecutive dates
*/
export const getWeekDates = (startDate: Date): Date[] => {
  // Constants should be clearly defined
  const DAYS_IN_WEEK = 7;
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
  // Input validation
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new Error('Invalid date provided');
  }
  // Create a new Date object to avoid mutating the input
  const firstDate = new Date(startDate.getTime());
  // Use Array.from for cleaner array generation
  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    return new Date(firstDate.getTime() + MILLISECONDS_PER_DAY * index);
  });
}

/**
 * Finds the Monday of the week containing the given date
 * @param searchDate The date to find the week's Monday from
 * @returns Date object representing Monday of the same week
 * @throws {Error} If the provided date is invalid
 */
export const getWeekStartDate = (searchDate: Date): Date => {
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
  const DAYS_IN_WEEK = 7;
  // Input validation
  if (!(searchDate instanceof Date) || isNaN(searchDate.getTime())) {
    throw new Error('Invalid date provided');
  }
  // Create a new Date object to avoid mutating the input
  const inputDate = new Date(searchDate.getTime());
  // Calculate days since Monday (Monday = 0, Sunday = 6)
  const daysSinceMonday = (inputDate.getDay() + 6) % DAYS_IN_WEEK;
  // Calculate milliseconds to subtract to reach Monday
  const millisecondsToSubtract = daysSinceMonday * MILLISECONDS_PER_DAY;
  // Return new Date set to Monday
  return new Date(inputDate.getTime() - millisecondsToSubtract);
}