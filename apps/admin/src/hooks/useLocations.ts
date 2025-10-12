import { useState } from "react";
import { getLocations, deleteLocation } from "../services/axios.config.ts";

// Define el tipo Location
export type Location = {
  id: string;
  name: string;
  description?: string | null;
  image?: string;
  coordinates: {
    latitude: number | string;
    longitude: number | string;
  };
};

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    setLoading(true);
    const data = await getLocations();
    setLocations(data);
    setLoading(false);
  };

  // función para eliminar
  const removeLocation = async (id: string) => {
    const result = await deleteLocation(id);
    if (result.success) {
      // Actualiza el estado local sin hacer otra petición
      setLocations(prev => prev.filter(loc => loc.id !== id));
    }
    return result;
  };

  return {
    locations,
    loading,
    fetchLocations,
    removeLocation // ✅ Exporta la función de eliminación
  };
};
