import { useEffect, useState, useCallback } from "react";
import { getSingleDashboardData, getAllDashboardsData } from "../services/axios.js";

export const useMeasurerData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("lastLocation") || null
  );

  // 🎯 Función para actualizar UN SOLO medidor (reutilizable)
  const fetchSingleMeasurer = useCallback(async (locationId) => {
    if (!locationId) return;

    try {
      const data = await getSingleDashboardData(locationId);

      if (data && data.locationId) {
        setDashboardData(data);

        if (data.sensorData) {
          setError(null);
        } else {
          setError(data.message || "Sin datos de sensor en esta ubicación.");
        }
      } else {
        setError("Error: Respuesta no válida del medidor.");
      }
    } catch (err) {
      console.error("[Hook] Error al actualizar medidor:", err);
      setError("Error de conexión al actualizar datos.");
    }
  }, []);

  // ✅ CARGA INICIAL: Solo UNA VEZ al montar
  useEffect(() => {
    const init = async () => {
      try {
        setError(null); // Limpiar error anterior

        // 1. Cargar TODOS los dashboards (solo esta vez)
        const response = await getAllDashboardsData();
        const allDashboards = response.dashboards || [];
        const defaultLocationId = response.defaultLocationId;

        if (allDashboards.length === 0) {
          setError("No hay ubicaciones disponibles.");
          setLoading(false);
          return;
        }

        // 2. Configurar lista de ubicaciones para el selector
        setLocations(allDashboards.map(d => ({
          _id: d.locationId,
          name: d.locationName,
          hasData: !!d.sensorData
        })));

        // 3. Determinar ubicación inicial
        const savedLocation = localStorage.getItem("lastLocation");
        const initialLocation = savedLocation || defaultLocationId;

        // 4. Buscar datos de la ubicación inicial en la carga
        const initialData = allDashboards.find(d => d.locationId === initialLocation);

        if (initialData) {
          setDashboardData(initialData);
          setCurrentLocation(initialData.locationId);

          if (!initialData.sensorData) {
            setError("Sin datos de sensor en esta ubicación.");
          }
        } else {
          // Fallback: usar el primer dashboard con datos
          const firstWithData = allDashboards.find(d => d.sensorData);
          if (firstWithData) {
            setDashboardData(firstWithData);
            setCurrentLocation(firstWithData.locationId);
            localStorage.setItem("lastLocation", firstWithData.locationId);
          }
        }


      } catch (err) {
        console.error("[Hook] ❌ Error en carga inicial:", err);
        setError("Error al cargar los datos iniciales.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []); // 🔒 Solo se ejecuta al montar

  // ✅ ACTUALIZACIÓN PERIÓDICA: Solo del medidor actual
  useEffect(() => {
    if (!currentLocation || loading) return;



    // 1. Fetch inicial del medidor seleccionado
    fetchSingleMeasurer(currentLocation);

    // 2. Configurar intervalo de actualización
    const interval = setInterval(() => {

      fetchSingleMeasurer(currentLocation);
    }, 30000); // Cada 30 segundos

    // 3. Limpiar intervalo al cambiar de ubicación o desmontar
    return () => {



      clearInterval(interval);
    };
  }, [currentLocation, loading, fetchSingleMeasurer]);

  // ✅ MANEJADOR DE CAMBIO DE UBICACIÓN
  const handleLocationChange = useCallback((newLocationId) => {

    setCurrentLocation(newLocationId);
    localStorage.setItem("lastLocation", newLocationId);
  }, []);

  return {
    dashboardData,
    locations,
    loading,
    error,
    currentLocation,
    setCurrentLocation: handleLocationChange,
  };
};
