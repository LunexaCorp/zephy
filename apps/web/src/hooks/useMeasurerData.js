// hooks/useMeasurerData.js

import { useEffect, useState } from "react";
// 💡 ASUME que tienes estas funciones de servicio
import { getSingleDashboardData, getAllDashboardsData } from "../services/axios.js";

export const useMeasurerData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("lastLocation") || null
  );

  // Función para manejar la lógica de selección y fallback local
  const selectDashboard = (allDashboards, targetLocationId) => {
    // 1. Intentar cargar la ubicación target (guardada o por defecto)
    let selectedData = allDashboards.find(d => d.locationId === targetLocationId);

    // 2. Actualizar estados
    if (selectedData) {
      setDashboardData(selectedData);
      setCurrentLocation(selectedData.locationId);
      localStorage.setItem("lastLocation", selectedData.locationId);
    }
  };


  // Carga Inicial (Un solo useEffect sin bucles de fetch)
  useEffect(() => {
    const init = async () => {
      try {
        // 1. Cargar TODOS los datos en una sola llamada al nuevo endpoint
        const response = await getAllDashboardsData();
        const allDashboards = response.dashboards || [];
        const defaultLocationId = response.defaultLocationId;

        if (allDashboards.length === 0) {
          setError("No hay ubicaciones disponibles.");
          return;
        }

        // 2. Extraer las ubicaciones para el selector
        setLocations(allDashboards.map(d => ({
          _id: d.locationId,
          name: d.locationName,
          // 💡 Puedes agregar si tiene datos o no para el selector visual
          hasData: !!d.sensorData
        })));

        // 3. Determinar la ubicación a mostrar inicialmente
        const initialLocation = currentLocation || defaultLocationId;

        // 4. Ejecutar la lógica de selección y fallback
        selectDashboard(allDashboards, initialLocation);

      } catch (err) {
        console.error("[Hook] Error al cargar los datos iniciales:", err);
        setError("Error al cargar los datos iniciales.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []); // Solo se ejecuta al montar el componente


  // Actualización de Datos (Refresco y Cambio de Ubicación)
  useEffect(() => {
    if (!currentLocation || locations.length === 0 || loading) return;

    const fetchData = async () => {
      try {
        // un medidor
        const data = await getSingleDashboardData(currentLocation);

        // Comprobamos si la data retornada es válida
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
        localStorage.setItem("lastLocation", currentLocation);

      } catch (err) {
        console.error("[Hook] Error al actualizar datos:", err);
        setError("Error de conexión al actualizar datos.");
      }
    };

    // 1. Ejecutar inmediatamente al cambiar `currentLocation`
    fetchData();

    // 2. Configurar el intervalo de refresco
    const interval = setInterval(fetchData, 30000); // Cada 30 segundos

    return () => clearInterval(interval); // Limpiar al desmontar o cambiar dependencias
  }, [currentLocation, locations, loading]); // Dependencias: cambia si la ubicación o la lista de locations cambia

  return {
    dashboardData,
    locations,
    loading,
    error,
    currentLocation,
    setCurrentLocation,
  };
};
