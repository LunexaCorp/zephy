// axios.config.ts
import axios, { type AxiosInstance } from "axios";

const baseURL = import.meta.env.PROD
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1`
  : `http://localhost:${import.meta.env.VITE_PORT}/api/v1`;

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// GET: Obtener ubicación
export const getLocations = async () => {
  try {
    const response = await api.get("/locations");

    const locations = response.data.map((location: any) => ({
      ...location,
      id: location._id,
      image: location.img,
    }));

    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

// POST: Crear nueva ubicación
export const createLocation = async (location: {
  name: string;
  description: string;
  img: string;
  coordinates: object;
}) => {
  try {
    const response = await api.post("/locations", location);
    return {
      success: true,
      data: {
        ...response.data,
        id: response.data._id,
      }
    };
  } catch (error: any) {
    console.error("Error creating location:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error al crear ubicación",
    };
  }
};

// PUT: Actualizar ubicación
export const updateLocation = async (
  locationId: string,
  updates: {
    name: string;
    description: string;
    img: string;
    coordinates: object;
  }
) => {
  try {
    const response = await api.put(`/locations/${locationId}`, updates);
    return {
      success: true,
      data: {
        ...response.data,
        id: response.data._id,
      }
    };
  } catch (error: any) {
    console.error("Error updating location:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error al actualizar ubicación",
    };
  }
};

// DELETE: Eliminar ubicación
export const deleteLocation = async (locationId: string) => {
  try {
    await api.delete(`/locations/${locationId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting location:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error al eliminar ubicación",
    };
  }
};

// Agregar endpoints de dispositivos
export const getDevices = async () => {
  try {
    const response = await api.get("/devices");
    return response.data.map((device: any) => ({
      ...device,
      id: device._id,
    }));
  } catch (error) {
    console.error("Error fetching devices:", error);
    return [];
  }
};

// POST: Crear nuevo dispositivo
export const createDevice = async (device: {
  name: string;
  type: string;
  location: string;
}) => {
  try {
    const response = await api.post("/devices", device);
    return { success: true, data: { ...response.data, id: response.data._id } };
  } catch (error: any) {
    console.error("Error creating device:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error al crear dispositivo",
    };
  }
};


export const deleteDevice = async (deviceId: string) => {
  try {
    await api.delete(`/devices/${deviceId}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Error al eliminar dispositivo",
    };
  }
};


// POST: Subir imagen a Cloudinary
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post("/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      url: response.data.url,
      public_id: response.data.public_id,
    };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Error al subir imagen",
    };
  }
};
