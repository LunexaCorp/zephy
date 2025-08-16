// src/services/axios.js
import axios from "axios";

// Configuración para desarrollo/producción
const baseURL = import.meta.env.PROD
  ? "https://ecoroute-backend.onrender.com"
  : "/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Ejemplo de endpoint corregido
export const getLocations = async () => {
  try {
    const response = await api.get("/locations"); // Sin /api aquí
    console.log("Fetched locations:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return []; // Retorna array vacío en caso de error
  }
};

export const getDevices = async () => {
  try {
    const response = await api.get("/devices");
    console.log("Fetched devices:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    return [];
  }
};

{
  /*
  export const getLocationSensorData = async (locationId) => {
  try {
    const devices = (await getDevices()).filter(
      (device) => device.locationId === locationId
    );

    if (devices.length === 0) return generateEmptyData();

    const sensorData = await Promise.all(
      devices.map(async (device) => {
        const sensors = (await api.get(`/sensors?deviceId=${device._id}`)).data;
        console.log("Fetched sensors for device", device._id, ":", sensors);

        if (sensors.length === 0) return generateEmptyData();

        const data =
          (await api.get(`/sensorData?sensorId=${sensors[0]?._id || ""}`))
            .data[0] || {};
        console.log(
          "Fetched sensor data for sensor",
          sensors[0]?._id,
          ":",
          data
        );

        return {
          temperature: data.temperature ?? 0,
          co2: data.co2 ?? 0,
          airQuality: data.airQuality ?? 0,
          lastUpdate: data.timestamp || new Date().toISOString(),
          location: device.name || "Sin ubicación",
          img: "/fallback.png",
        };
      })
    );

    return sensorData[0] || generateEmptyData();
  } catch (error) {
    console.error("Error sensor data:", error);
    return generateEmptyData();
  }
};
  */
}

// src/services/axios.js
export const getLocationSensorData = async (locationId) => {
  try {
    const devices = (await getDevices()).filter(
      (device) => device.locationId === locationId
    );

    if (devices.length === 0) return generateEmptyData();

    const sensorData = await Promise.all(
      devices.map(async (device) => {
        const sensors = (await api.get(`/sensors?deviceId=${device._id}`)).data;
        console.log("Fetched sensors for device", device._id, ":", sensors);

        if (sensors.length === 0) return generateEmptyData();

        const data =
          (await api.get(`/sensorData?sensorId=${sensors[0]?._id || ""}`))
            .data[0] || {};
        console.log(
          "Fetched sensor data for sensor",
          sensors[0]?._id,
          ":",
          data
        );

        return {
          temperature: data.temperature ?? 0,
          co2: data.co2 ?? 0,
          airQuality: data.airQuality ?? 0,
          lastUpdate: data.timestamp || new Date().toISOString(),
        };
      })
    );

    return sensorData[0] || generateEmptyData();
  } catch (error) {
    console.error("Error sensor data:", error);
    return generateEmptyData();
  }
};

const generateEmptyData = () => ({
  temperature: 0,
  co2: 0,
  airQuality: 0,
  lastUpdate: new Date().toISOString(),
});
