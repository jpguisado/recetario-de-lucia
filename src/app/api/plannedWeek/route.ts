import { NextResponse } from 'next/server'
import { plannedWeekSchema } from '~/models/schemas/plannedDay'
import { db } from '~/server/db'

export async function GET(weekDates: Date[]) {
    const plannedWeek = await db.plannedDay.findMany({
        where: {
            day: {
                in: weekDates
            }
        },
        include: {
            plannedMeal: {
                include: {
                    dish: true
                }
            }
        }
    })
    const { data } = plannedWeekSchema.safeParse(plannedWeek);
    return NextResponse.json(data!)
}