import { useState, useEffect, useMemo } from "react";
import { getLocations, getSingleDashboardData } from "../services/axios.js";
import {
  PercentageCalculation,
  getColorByPercentage,
} from "../utils/PercentageCalculation.js";

// Coordenadas por defecto para centrar el mapa
const defaultCenter = [-12.6, -69.185];

// Función para parsear coordenadas de forma segura
const parseCoordinates = (lat, lng) => {
  try {
    return [parseFloat(lat), parseFloat(lng)];
  } catch {
    return defaultCenter;
  }
};

/**
 * Custom Hook para gestionar el estado y la obtención de datos del mapa.
 * Realiza la carga inicial y la actualización de datos cada 2 minutos.
 *
 * @returns {object} Un objeto con los datos, estado de carga, errores y funciones de filtrado.
 */
const useMapData = () => {
  const [processedLocations, setProcessedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores antes de la nueva petición

      const locations = await getLocations();

      const locationsWithData = await Promise.all(
        locations.map(async (loc) => {
          const response = await getSingleDashboardData(loc._id);
          const sensorData = response.sensorData || {};

          const percentage = PercentageCalculation(sensorData);

          return {
            id: loc._id,
            name: loc.name,
            description: loc.description,
            position: parseCoordinates(
              loc.coordinates.latitude,
              loc.coordinates.longitude
            ),
            img: loc.img,
            percentage,
            color: getColorByPercentage(percentage),
            radius: 80 + percentage / 2,
            sensorData: {
              temperature: sensorData.temperature ?? 0,
              humidity: sensorData.humidity ?? 0,
              airQuality: sensorData.airQuality ?? 0,
              lastUpdated: sensorData.lastUpdate
                ? new Date(sensorData.lastUpdate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "N/A",
            },
          };
        })
      );

      setProcessedLocations(locationsWithData);
    } catch (err) {
      console.error(err);
      setError("Error al cargar datos del mapa");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para la carga inicial y las actualizaciones periódicas
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000); // 2 minutos
    return () => clearInterval(interval);
  }, []); // Se ejecuta solo al montar el componente

  // Memoización de la lógica de filtrado para optimizar el rendimiento
  const filteredLocations = useMemo(() => {
    return processedLocations.filter((loc) => {
      if (filter === "all") return true;
      if (filter === "healthy") return loc.percentage >= 70;
      if (filter === "moderate")
        return loc.percentage >= 40 && loc.percentage < 70;
      if (filter === "critical") return loc.percentage < 40;
      return true;
    });
  }, [processedLocations, filter]);

  return {
    loading,
    error,
    defaultCenter,
    filteredLocations,
    filter,
    setFilter,
    selectedLocation,
    setSelectedLocation,
  };
};

export default useMapData;
