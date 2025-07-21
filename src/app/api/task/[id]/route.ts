import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//GET /api/task/:id

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const { id } = params;
    const task = await prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      return NextResponse.json({ message: "Todo not found" }, { status: 400 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error("GET task error", error);
    return NextResponse.json(
      { message: "Error fetching task" },
      { status: 500 }
    );
  }
}

//PUT /api/task/:id

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { done } = await req.json();

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: { done },
    });
    return NextResponse.json({ message: "Updated", task: updated });
  } catch (error) {
    console.error("PUT /api/task/:id error:", error);
    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}

//DELETE

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.task.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE /api/task/:id error", error);
    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
await prisma.$disconnect();