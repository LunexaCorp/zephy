import { useState, useEffect, useCallback } from "react";
import { PercentageCalculation } from "../utils/PercentageCalculation.js";
import { getAllDashboardsData } from "../services/axios.js";

export const useRankingData = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🎯 Función para procesar y ordenar datos
  const processRankingData = useCallback((dashboards) => {
    return dashboards
      .map((dashboard) => {
        const sensorData = dashboard.sensorData || {};
        console.log(sensorData)
        return {
          id: dashboard.locationId,
          location: dashboard.locationName,
          img: dashboard.locationImg,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          airQuality: sensorData.airQuality,
          index: PercentageCalculation(sensorData),
          hasData: !!dashboard.sensorData, // Para filtrar/mostrar indicadores
        };
      })
      .sort((a, b) => b.index - a.index); // Ordenar por índice descendente
  }, []);

  // ✅ Función para cargar datos del ranking
  const fetchRankingData = useCallback(async () => {
    try {
      console.log("[Ranking] 🔄 Cargando datos...");

      // 🚀 Una sola llamada para obtener todos los dashboards
      const response = await getAllDashboardsData();
      const allDashboards = response.dashboards || [];

      if (allDashboards.length === 0) {
        setError("No hay ubicaciones disponibles para el ranking.");
        setRankingData([]);
        return;
      }

      // Procesar y ordenar datos
      const processedData = processRankingData(allDashboards);

      setRankingData(processedData);
      setError(null);

      console.log(`[Ranking] ✓ ${processedData.length} ubicaciones cargadas`);

    } catch (err) {
      console.error("[Ranking] ❌ Error al cargar datos:", err);

      const errorMessage = typeof err === 'string'
        ? err
        : err.message || "Error al cargar datos del ranking";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [processRankingData]);

  // ✅ Efecto para carga inicial y actualización periódica
  useEffect(() => {
    console.log("[Ranking] 🚀 Iniciando...");

    // Carga inicial
    fetchRankingData();

    // Actualización cada 30 segundos
    const interval = setInterval(() => {
      console.log("[Ranking] 🔃 Actualizando...");
      fetchRankingData();
    }, 30000);

    return () => {
      console.log("[Ranking] 🛑 Limpiando intervalo");
      clearInterval(interval);
    };
  }, [fetchRankingData]);

  return { rankingData, loading, error };
};
