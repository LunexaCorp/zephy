import { useState, useEffect, useMemo, useCallback } from "react";
import { getAllDashboardsData } from "../services/axios.js";
import {
  PercentageCalculation,
  getColorByPercentage,
} from "../utils/PercentageCalculation.js";

// Coordenadas por defecto para centrar el mapa
const defaultCenter = [-12.6, -69.185];

// Función para parsear coordenadas de forma segura
const parseCoordinates = (lat, lng) => {
  try {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    // Validar que son números válidos
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      console.warn(`Coordenadas inválidas: lat=${lat}, lng=${lng}`);
      return defaultCenter;
    }

    return [parsedLat, parsedLng];
  } catch (error) {
    console.error("Error al parsear coordenadas:", error);
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

  // 🎯 Función para procesar los datos del dashboard y convertirlos en formato del mapa
  const processLocationsData = useCallback((dashboards) => {
    return dashboards
      .map((dashboard) => {
        const sensorData = dashboard.sensorData || {};
        const percentage = PercentageCalculation(sensorData);

        // Nota: Necesitamos las coordenadas de Location
        // Si no están en el dashboard, necesitamos cargarlas por separado
        // o incluirlas en el endpoint getAllDashboards

        return {
          id: dashboard.locationId,
          name: dashboard.locationName,
          description: dashboard.description || "", // Agregar si está disponible
          position: dashboard.coordinates
            ? parseCoordinates(dashboard.coordinates.latitude, dashboard.coordinates.longitude)
            : defaultCenter, // Fallback si no hay coordenadas
          img: dashboard.locationImg,
          percentage,
          color: getColorByPercentage(percentage),
          radius: 80 + percentage / 2,
          hasData: !!dashboard.sensorData,
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
      .filter((loc) => loc.position !== defaultCenter || loc.hasData); // Filtrar ubicaciones sin coordenadas válidas
  }, []);

  // ✅ Función optimizada para cargar datos
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 🚀 Una sola llamada para obtener todos los dashboards
      const response = await getAllDashboardsData();
      const allDashboards = response.dashboards || [];

      if (allDashboards.length === 0) {
        setError("No hay ubicaciones disponibles para mostrar en el mapa.");
        setProcessedLocations([]);
        return;
      }

      // Procesar los datos
      const locationsWithData = processLocationsData(allDashboards);

      setProcessedLocations(locationsWithData);

    } catch (err) {
      console.error("[Map] ❌ Error al cargar datos:", err);

      const errorMessage = typeof err === 'string'
        ? err
        : err.message || "Error al cargar datos del mapa";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [processLocationsData]);

  // ✅ Efecto para la carga inicial y las actualizaciones periódicas
  useEffect(() => {

    fetchData();

    // Actualización cada 2 minutos
    const interval = setInterval(() => {
      fetchData();
    }, 120000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchData]);

  // ✅ Memoización de la lógica de filtrado para optimizar el rendimiento
  const filteredLocations = useMemo(() => {
    const filtered = processedLocations.filter((loc) => {
      if (filter === "all") return true;
      if (filter === "healthy") return loc.percentage >= 70;
      if (filter === "moderate")
        return loc.percentage >= 40 && loc.percentage < 70;
      if (filter === "critical") return loc.percentage < 40;
      return true;
    });

    return filtered;
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
    refetch: fetchData, // 💡 Exponer función para refrescar manualmente
  };
};

export default useMapData;
