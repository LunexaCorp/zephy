import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const taskRemove = await prisma.location.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({
      taskRemove,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
      });
    }
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { name, description, img, latitud, longitud} = await request.json();
  const taskUpdate = await prisma.location.update({
    where: {
        id: id,
    },
    data: {
        name,
        description,
        img,
        latitud,
        longitud,

    }
  })
  return NextResponse.json({
    taskUpdate
  });
}
