import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        img: true,
        latitud: true,
        longitud: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Respuesta con caché
    return NextResponse.json(
    {locations},
    {
      headers: {
        // Cachea por 60 segundos
        'Cache-Control': 'public, max-age=60, stale-while-    revalidate=60',
    },
  }
);
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener ubicaciones' },
      { status: 500 }
    );
  }
}
