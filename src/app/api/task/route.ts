import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//POST API task

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, deadline, priority, done, userEmail,timezone } = body;

    if (!title  || !priority || !userEmail) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const pointsMap: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    const normPriority = priority.toLowerCase()
    const points = pointsMap[normPriority] || 0;

    let user = await prisma.user.findUnique({
      where:{email: userEmail}
    })
    console.log("User from DB", user)
    if(!user){
      user = await prisma.user.create({
        data:{email: userEmail}
      })
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        deadline:deadline ? new Date(deadline) : null,
        priority,
        timezone,
        done,
        userId: user.id
        //Mocked points
      },
    });

    return NextResponse.json({ message: "task created", newTask, points });
  } catch (error) {
    console.error("POST /api/task error:", error);
    return NextResponse.json(
      { message: "Failed to create task" },
      { status: 500 }
    );
  }
}

// GET /api/task?userId= ????

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url)
    const userId = searchParams.get("userID")

    if(!userId){
        return NextResponse.json({message:"Missing userID"},{status: 400})
    }
    try {
        const tasks = await prisma.task.findMany({
            where:{userId},
            orderBy: {createdAt:"desc"},
        })
        
        return NextResponse.json({tasks})
    } catch (error) {
        console.error("GET /api/task/error:", error)
        return NextResponse.json({message:"Failed to fetch tasks"},{status: 500})
    }
}