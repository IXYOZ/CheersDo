import {prisma} from "@/lib/prisma"
import {NextResponse } from "next/server"
import dayjs from "dayjs"

export async function GET() {
    const tomorrow = dayjs().add(1, "day").toDate()
    const now = new Date()

    const tasks = await prisma.task.findMany({
        where:{
            deadline:{
                gte: now,
                lte: tomorrow,
            },
        },
        include: {user: true},
    })
    return NextResponse.json(tasks)
}