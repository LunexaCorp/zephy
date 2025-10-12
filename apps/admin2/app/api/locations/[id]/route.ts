import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 🗑️ Eliminar una ubicación
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deletedLocation = await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Ubicación eliminada correctamente", deletedLocation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar ubicación:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la ubicación" },
      { status: 500 }
    );
  }
}

// ✏️ Actualizar una ubicación
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    // Actualiza según tu estructura real de Location
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        img: data.img,
        coordinates: data.coordinates, // o latitud/longitud si usas eso
      },
    });

    return NextResponse.json(
      { message: "Ubicación actualizada correctamente", updatedLocation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la ubicación" },
      { status: 500 }
    );
  }
}
