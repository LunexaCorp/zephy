// components/LocationForm.tsx
"use client"; // Necesario para usar useState y manejar el estado del formulario

import React, { useState } from "react";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('../LocationMap'), {
  ssr: false,
  loading: () => <div className="h-80 w-full bg-gray-700 flex items-center justify-center text-white rounded-md">Cargando Mapa...</div>
});

// Define el tipo de datos de la ubicación
interface LocationData {
  id?: string;
  name: string;
  description: string;
  img: string;
  latitud: string;
  longitud: string;
}

interface LocationFormProps {
  // Los datos iniciales pueden ser null si es un formulario de "Crear"
  initialData: LocationData | null;
  // Prop para controlar si es solo de visualización o de edición
  isEditing: boolean;
}

export default function LocationForm({
  initialData,
  isEditing,
}: LocationFormProps) {
  const router = useRouter();

  // 1. Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState<LocationData>(
    initialData || {
      name: "",
      description: "",
      img: "",
      latitud: "",
      longitud: "",
    }
  );

  // 2. Estado para manejar la carga (deshabilitar el botón)
  const [isLoading, setIsLoading] = useState(false);

  // 3. Manejador de cambios
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 4. Manejador de envío (CREATE o UPDATE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return; // Si no está editando, no debe enviar

    setIsLoading(true);

    const apiPath = formData.id
      ? `/api/locations/${formData.id}` // Ruta para UPDATE
      : "/api/locations"; // Ruta para CREATE

    const method = formData.id ? "PUT" : "POST";

    try {
      const res = await fetch(apiPath, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: `Ubicación ${
            formData.id ? "actualizada" : "creada"
          } con éxito.`,
          showConfirmButton: false,
          timer: 1500,
        });
        // Redirigir al listado después de guardar
        router.push("/locations");
        router.refresh();
      } else {
        throw new Error("Error al guardar la ubicación.");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Ocurrió un error al intentar conectar con el servidor.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 5. NUEVO: Manejador de cambio de coordenadas desde el mapa
  const handleCoordinatesChange = (lat: string, lng: string) => {
    setFormData((prev) => ({
      ...prev,
      latitud: lat,
      longitud: lng,
    }));
  };

  // Determina el título y si los campos están deshabilitados
  const title = initialData
    ? isEditing
      ? "Editar Ubicación"
      : "Ver Detalles de Ubicación"
    : "Crear Nueva Ubicación";

  const disabledFields = !isEditing && initialData; // Deshabilitar si está en modo "Ver"

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-800 rounded-lg shadow-2xl max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Nombre"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={disabledFields}
        />
        <FormField
          label="URL de Imagen (img)"
          id="img"
          name="img"
          value={formData.img}
          onChange={handleChange}
          disabled={disabledFields}
        />
        <FormField
          label="Latitud"
          id="latitud"
          name="latitud"
          value={formData.latitud}
          type="text" // Usar 'text' para permitir la coma/punto como separador decimal
          onChange={handleChange}
          disabled={disabledFields}
        />
        <FormField
          label="Longitud"
          id="longitud"
          name="longitud"
          value={formData.longitud}
          type="text"
          onChange={handleChange}
          disabled={disabledFields}
        />
      </div>

      {/* 6. CAMPO DE MAPA */}
      <LocationMap
        initialLat={formData.latitud}
        initialLng={formData.longitud}
        onCoordinatesChange={handleCoordinatesChange} // Callback para actualizar el estado
        disabled={disabledFields}
      />

      {/* Campo de descripción usa textarea */}
      <FormField
        label="Descripción"
        id="description"
        name="description"
        value={formData.description}
        type="textarea"
        onChange={handleChange}
        disabled={disabledFields}
      />

      {/* 5. Botón de acción (Solo visible y funcional si está en modo Edición/Creación) */}
      {isEditing && (
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-150 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Guardando..."
              : formData.id
              ? "Guardar Cambios"
              : "Crear Ubicación"}
          </button>
        </div>
      )}

      {/* Botón de volver */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => router.push("/locations")}
          className="w-full text-center text-gray-400 py-2 rounded-md hover:text-white transition duration-150 border border-gray-700 hover:border-white"
        >
          Volver al Listado
        </button>
      </div>
    </form>
  );
}
