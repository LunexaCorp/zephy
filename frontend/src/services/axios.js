import axios from "axios";

// Configuración para desarrollo/producción
const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_BASE_URL
  : `http://localhost:${import.meta.env.VITE_PORT}/api`;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// --- Funciones para obtener datos de la API ---
export const getLocations = async () => {
  try {
    const response = await api.get("/locations");
    console.log("Fetched locations:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return []; // Retorna array vacío en caso de error
  }
};

// Función para obtener todos los datos del dashboard
export const getAllDashboardData = async () => {
  try {
    // Usa la instancia `api` para mantener la configuración base
    const { data } = await api.get("/dashboard/medidor");
    return data;
  } catch (error) {
    console.error("Error fetching all dashboard data:", error);
    throw error;
  }
};

// Función para obtener los datos de un solo medidor por su ID
// Esta función ahora solo maneja la ruta con ID
export const getSingleDashboardData = async (locationId) => {
  try {
    const { data } = await api.get(`/dashboard/medidor/${locationId}`);
    return data;
  } catch (error) {
    console.error("Error fetching single dashboard data:", error);
    throw error;
  }
};
