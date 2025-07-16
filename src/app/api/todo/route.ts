import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//POST API todo

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, deadline, priority, isDone, userEmail } = body;

    if (!text  || !priority || !userEmail) {
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

    const newTodo = await prisma.todo.create({
      data: {
        text,
        deadline:deadline ? new Date(deadline) : new Date(),
        priority,
        isDone,
        userId: user.id
        //Mocked points
      },
    });

    return NextResponse.json({ message: "Todo created", newTodo, points });
  } catch (error) {
    console.error("POST /api/todo error:", error);
    return NextResponse.json(
      { message: "Failed to create todo" },
      { status: 500 }
    );
  }
}

// GET /api/todo?userId= ????

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url)
    const userId = searchParams.get("userID")

    if(!userId){
        return NextResponse.json({message:"Missing userID"},{status: 400})
    }
    try {
        const todos = await prisma.todo.findMany({
            where:{userId},
            orderBy: {createdAt:"desc"},
        })
        return NextResponse.json({todos})
    } catch (error) {
        console.error("GET /api/todo/error:", error)
        return NextResponse.json({message:"Failed to fetch todos"},{status: 500})
    }
}

//PUT api/todo/:id
