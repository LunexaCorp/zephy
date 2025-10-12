// app/locations/create/page.tsx (Server Component)

import LocationForm from "@/app/components/forms/LocationForm";

export default function CreateLocationPage() {
  return (
    <div className="flex justify-center items-center min-h-screen py-10">
      <LocationForm
        initialData={null} // Pasa null para indicar modo Creación
        isEditing={true} // Es siempre editable (escribiendo el nuevo registro)
      />
    </div>
  );
}
