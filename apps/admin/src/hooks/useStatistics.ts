import { useState } from "react";
import { getLocationStatistics } from "../services/axios.config.ts";

export type SensorReading = {
  _id: string;
  device: string;
  timestamp: string;
  temperature?: number;
  humidity?: number;
  co2?: number;
  airQuality?: number;
  uvIndex?: number;
};

export type LocationStatistics = {
  locationId: string;
  locationName: string;
  locationImage?: string;
  deviceCount: number;
  latestReadings: SensorReading[];
  averages: {
    temperature?: number;
    humidity?: number;
    co2?: number;
    airQuality?: number;
    uvIndex?: number;
  };
  ranges: {
    temperature?: { min: number; max: number };
    humidity?: { min: number; max: number };
    co2?: { min: number; max: number };
    airQuality?: { min: number; max: number };
    uvIndex?: { min: number; max: number };
  };
  lastUpdate?: string;
};

export type StatisticsSummary = {
  locationId: string;
  locationName: string;
  locationImage?: string;
  deviceCount: number;
  latestValues: {
    temperature?: number;
    humidity?: number;
    airQuality?: number;
  };
  status: "ok" | "warning" | "danger" | "offline";
  lastUpdate?: string;
};

export const useStatistics = () => {
  const [statistics, setStatistics] = useState<LocationStatistics[]>([]);
  const [summaries, setSummaries] = useState<StatisticsSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener resumen de todas las ubicaciones
  const fetchStatisticsSummaries = async () => {
    setLoading(true);
    try {
      const data = await getLocationStatistics();
      setSummaries(data);
    } catch (error) {
      console.error("Error fetching statistics summaries:", error);
      setSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas detalladas de una ubicación específica
  const fetchLocationStatistics = async (locationId: string, limit: number = 50) => {
    setLoading(true);
    try {
      const data = await getLocationStatistics(locationId, limit);
      return data;
    } catch (error) {
      console.error("Error fetching location statistics:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    statistics,
    summaries,
    loading,
    fetchStatisticsSummaries,
    fetchLocationStatistics,
  };
};
