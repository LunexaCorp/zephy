import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 🔹 Obtener todas las ubicaciones
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        img: true,
        coordinates: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Error al obtener ubicaciones:", error);
    return NextResponse.json({ error: "Error al obtener ubicaciones" }, { status: 500 });
  }
}

// 🔹 Crear una nueva ubicación (← ESTE MÉTODO ES CLAVE)
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validación simple
    if (!data.name || !data.coordinates) {
      return NextResponse.json(
        { error: "El nombre y las coordenadas son obligatorios." },
        { status: 400 }
      );
    }

    const newLocation = await prisma.location.create({
      data: {
        name: data.name,
        description: data.description || "",
        img: data.img || null,
        coordinates: data.coordinates,
      },
    });

    return NextResponse.json({ success: true, location: newLocation }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar ubicación:", error);
    return NextResponse.json({ error: "Error al guardar ubicación" }, { status: 500 });
  }
}
