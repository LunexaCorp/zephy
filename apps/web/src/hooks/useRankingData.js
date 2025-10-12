// src/hooks/useRankingData.js
import { useState, useEffect } from "react";
import { PercentageCalculation } from "../utils/PercentageCalculation.js";
import { getLocations, getSingleDashboardData } from "../services/axios.js";

export const useRankingData = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const locations = await getLocations();
        const data = await Promise.all(
          locations.map(async (loc) => {
            const response = await getSingleDashboardData(loc._id);
            const sensorData = response.sensorData || {};

            return {
              id: loc._id,
              location: loc.name,
              img: loc.img,
              temperature: sensorData.temperature,
              humidity: sensorData.humidity,
              airQuality: sensorData.airQuality,
              index: PercentageCalculation(sensorData),
            };
          })
        );
        setRankingData(data.sort((a, b) => b.index - a.index));
      } catch (err) {
        console.error("Error fetching ranking data:", err);
        setError("Error al cargar datos del ranking");
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
    const interval = setInterval(fetchRankingData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { rankingData, loading, error };
};
