"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { createLocation, createDevice } from "../../services/axios.config";
import { useNavigate } from "react-router-dom";

export default function CreateLocationPage() {
  const [step, setStep] = useState(1); // 1: ubicación, 2: dispositivo
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState({
    name: "",
    description: "",
    img: "",
    coordinates: { latitude: "", longitude: "" },
  });

  const [deviceData, setDeviceData] = useState({
    name: "",
    type: "",
  });

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (["latitude", "longitude"].includes(name)) {
      setLocationData(prev => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: value },
      }));
    } else {
      setLocationData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeviceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await createLocation(locationData);

    if (result.success) {
      // Guardamos el ID para el paso 2
      localStorage.setItem("newLocationId", result.data.id);
      setStep(2);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleSubmitDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const locationId = localStorage.getItem("newLocationId");

    if (!locationId) {
      alert("Error: no se encontró la ubicación asociada.");
      setLoading(false);
      return;
    }

    const result = await createDevice({
      ...deviceData,
      location: locationId,
    });

    if (result.success) {
      alert("Ubicación y dispositivo creados correctamente 🎉");
      localStorage.removeItem("newLocationId");
      navigate("/locations");
    } else {
      alert(result.error);
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="max-w-lg mx-auto p-8 bg-white/10 backdrop-blur-lg text-white rounded-2xl shadow-lg mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {step === 1 ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">Nueva Ubicación</h2>
          <form onSubmit={handleSubmitLocation} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre de la ubicación"
              className="w-full p-2 rounded bg-white/20"
              value={locationData.name}
              onChange={handleLocationChange}
              required
            />
            <textarea
              name="description"
              placeholder="Descripción"
              className="w-full p-2 rounded bg-white/20"
              value={locationData.description}
              onChange={handleLocationChange}
            />
            <input
              type="text"
              name="img"
              placeholder="URL de la imagen"
              className="w-full p-2 rounded bg-white/20"
              value={locationData.img}
              onChange={handleLocationChange}
            />
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                name="latitude"
                placeholder="Latitud"
                className="w-1/2 p-2 rounded bg-white/20"
                value={locationData.coordinates.latitude}
                onChange={handleLocationChange}
                required
              />
              <input
                type="number"
                step="any"
                name="longitude"
                placeholder="Longitud"
                className="w-1/2 p-2 rounded bg-white/20"
                value={locationData.coordinates.longitude}
                onChange={handleLocationChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 p-2 rounded-lg font-semibold mt-4"
              disabled={loading}
            >
              {loading ? "Creando..." : "Guardar y continuar"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">Dispositivo asociado</h2>
          <form onSubmit={handleSubmitDevice} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre del dispositivo"
              className="w-full p-2 rounded bg-white/20"
              value={deviceData.name}
              onChange={handleDeviceChange}
              required
            />
            <input
              type="text"
              name="type"
              placeholder="Tipo (ej. DHT11, MQ135, etc.)"
              className="w-full p-2 rounded bg-white/20"
              value={deviceData.type}
              onChange={handleDeviceChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 p-2 rounded-lg font-semibold mt-4"
              disabled={loading}
            >
              {loading ? "Creando..." : "Finalizar creación"}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}
