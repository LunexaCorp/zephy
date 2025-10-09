"use client";

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface DeleteButtonProps {
  locationId: string;
}

export default function DeleteButton({ locationId }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    // 1. Mostrar confirmación con SweetAlert
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Red-600
      cancelButtonColor: "#4b5563", // Gray-600
      confirmButtonText: "Sí, ¡eliminar!",
    });

    if (result.isConfirmed) {
      // 2. Ejecutar la llamada a la API DELETE
      const res = await fetch(`/api/locations/${locationId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 3. Mostrar éxito y refrescar la tabla
        Swal.fire({
          title: "Eliminado!",
          text: "La ubicación ha sido eliminada.",
          icon: "success",
        });
        router.refresh(); // Refresca los datos de la tabla
      } else {
        Swal.fire("Error", "No se pudo eliminar la ubicación.", "error");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-400"
      title="Eliminar"
    >
      <Trash2 size={18} />
    </button>
  );
}
