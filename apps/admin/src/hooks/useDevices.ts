import { useState } from "react";

export type Device = {
  id: string;
  _id?: string;
  name: string;
  type: string; // "DHT22", "DHT11", etc.
  status: "active" | "offline" | "error";
  location: {
    id: string;
    name: string;
  };
  lastDataReceived?: string; // ISO date string
  topic?: string; // MQTT topic
  config?: {
    interval?: number; // Segundos entre lecturas
    [key: string]: any;
  };
};

export type DevicesByLocation = {
  locationId: string;
  locationName: string;
  locationImage?: string;
  devices: Device[];
};

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesByLocation, setDevicesByLocation] = useState<DevicesByLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      // Aquí conectarás con tu API real
      const response = await fetch("http://localhost:3000/api/v1/devices");
      const data = await response.json();

      console.log("📦 Datos crudos del backend:", data); // Debug

      // Mapea _id a id y valida estructura
      const mappedDevices = data
        .filter((device: any) => {
          // ✅ Filtra dispositivos sin ubicación válida
          if (!device.location) {
            console.warn("⚠️ Dispositivo sin ubicación:", device);
            return false;
          }
          return true;
        })
        .map((device: any) => ({
          ...device,
          id: device._id,
          // ✅ Normaliza la estructura de location
          location: {
            id: device.location._id || device.location.id || device.location,
            name: device.location.name || "Ubicación sin nombre",
          },
        }));

      console.log("✅ Dispositivos mapeados:", mappedDevices); // Debug

      setDevices(mappedDevices);

      // Agrupa por ubicación
      const grouped = groupDevicesByLocation(mappedDevices);
      setDevicesByLocation(grouped);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDevices([]);
      setDevicesByLocation([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevicesByLocation = async (locationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/locations/${locationId}/devices`
      );
      const data = await response.json();
      return data.map((device: any) => ({
        ...device,
        id: device._id,
      }));
    } catch (error) {
      console.error("Error fetching devices by location:", error);
      return [];
    }
  };

  const removeDevice = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/devices/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setDevices((prev) => prev.filter((d) => d.id !== id));

        // Actualiza también el agrupado
        setDevicesByLocation((prev) =>
          prev.map((group) => ({
            ...group,
            devices: group.devices.filter((d) => d.id !== id),
          })).filter((group) => group.devices.length > 0)
        );

        return { success: true };
      }

      return { success: false, error: "Error al eliminar dispositivo" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const groupDevicesByLocation = (devices: Device[]): DevicesByLocation[] => {
    const grouped = devices.reduce((acc, device) => {
      const locationId = device.location.id;

      if (!acc[locationId]) {
        acc[locationId] = {
          locationId,
          locationName: device.location.name,
          devices: [],
        };
      }

      acc[locationId].devices.push(device);
      return acc;
    }, {} as Record<string, DevicesByLocation>);

    return Object.values(grouped);
  };

  return {
    devices,
    devicesByLocation,
    loading,
    fetchDevices,
    fetchDevicesByLocation,
    removeDevice,
  };
};
