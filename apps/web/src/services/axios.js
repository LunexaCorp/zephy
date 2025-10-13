import axios from "axios";

// Configuración para desarrollo/producción
const baseURL = import.meta.env.PROD
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1`
  : `http://localhost:${import.meta.env.VITE_PORT}/api/v1`;

const api = axios.create({
  baseURL,
  timeout: 30000, // ⚡ Aumentado a 30 segundos para getAllDashboards
});

// Instancia especial para consultas individuales (más rápidas)
const apiQuick = axios.create({
  baseURL,
  timeout: 10000, // 10 segundos para consultas individuales
});

// ✅ Helper para reintentar en caso de timeout
const retryRequest = async (requestFn, maxRetries = 2) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      if (error.code === 'ECONNABORTED' && attempt < maxRetries) {
        console.warn(`[API] Timeout en intento ${attempt}. Reintentando...`);
        // Esperar 1 segundo antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        break;
      }
    }
  }

  throw lastError;
};

// Funciones para obtener datos de la API
export const getLocations = async () => {
  try {
    const response = await apiQuick.get("/locations");
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

// ⚡ Función optimizada para obtener todos los dashboards (CON RETRY)
export const getAllDashboardsData = async () => {
  try {
    const startTime = Date.now();

    const response = await retryRequest(async () => {
      return await api.get("/dashboard/all");
    });

    const elapsed = Date.now() - startTime;

    return response.data;
  } catch (error) {
    console.error("[API] ❌ Error fetching all dashboards:", error);

    // Mensaje de error más descriptivo
    if (error.code === 'ECONNABORTED') {
      throw new Error("El servidor está tardando demasiado en responder. Por favor, intenta de nuevo.");
    }

    throw error.response?.data?.error || error.message || "Error al obtener todos los dashboards";
  }
};

// ✅ Función para obtener los datos de un solo medidor por su ID
export const getSingleDashboardData = async (locationId) => {
  try {
    const { data } = await apiQuick.get(`/dashboard/medidor/${locationId}`);
    return data;
  } catch (error) {
    console.error(`[API] Error fetching dashboard for ${locationId}:`, error);
    throw error;
  }
};

// Función legacy (mantener por compatibilidad)
export const getAllDashboardData = async () => {
  console.warn("[API] ⚠️ getAllDashboardData() está deprecado. Usa getAllDashboardsData()");
  try {
    const { data } = await api.get("/dashboard/medidor");
    return data;
  } catch (error) {
    console.error("Error fetching all dashboard data:", error);
    throw error;
  }
};
