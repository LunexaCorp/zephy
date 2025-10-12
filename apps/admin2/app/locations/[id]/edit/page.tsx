// app/locations/[id]/edit/page.tsx (Server Component)

import { prisma } from "@/app/lib/prisma";
import LocationForm from "@/app/components/forms/LocationForm";

interface Props {
  params: { id: string };
}

export default async function EditLocationPage({ params }: Props) {
    const locationId = params.id;

    // Carga los datos DE UNA VEZ en el servidor
    const initialData = await prisma.location.findUnique({
        where: { id: locationId },
    });

    if (!initialData) {
        // En un caso real, esto debería devolver un componente 404
        return <div className="p-8 text-red-500">Error: Ubicación con ID ${locationId} no encontrada.</div>;
    }

    // Pasa los datos cargados al componente de cliente
    return (
        <LocationForm
            initialData={initialData}
            isEditing={true} // Permite la edición en esta ruta
        />
    );
}
