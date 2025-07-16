import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//GET /api/todo/:id

export async function GET(
  _req: NextRequest,
  {params}: { params: { id: string } }
) {
  try {
    const {id} = params
    const todo = await prisma.todo.findUnique({
      where: { id},
    });
    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 400 });
    }
    return NextResponse.json(todo);
  } catch (error) {
    console.error("GET todo error", error);
    return NextResponse.json(
      { message: "Error fetching todo" },
      { status: 500 }
    );
  }
}

//PUT /api/todo/:id

export async function PUT(
  req: NextRequest,
  {params} : { params: { id: string } }
) {
  const {id} = await params
  const {isDone} = await req.json()

  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: { isDone},
    });
    return NextResponse.json({ message: "Updated", todo: updated });
  } catch (error) {
    console.error("PUT /api/todo/:id error:", error);
    return NextResponse.json(
      { message: "Failed to update todo" },
      { status: 500 }
    );
  }
}

//DELETE

export async function DELETE(
  _req: NextRequest,
  {params}: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.todo.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE /api/todo/:id error", error);
    return NextResponse.json(
      { message: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
