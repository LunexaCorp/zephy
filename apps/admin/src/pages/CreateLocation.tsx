import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Wifi, Image, FileText, Navigation, Cpu, Check, ChevronRight, Sparkles, Globe, Zap } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload.ts";
import { createLocation } from "../services/axios.config.ts";
import { createDevice } from "../services/axios.config.ts";

import Swal from 'sweetalert2';
import {Link} from "react-router-dom";

export default function CreateLocationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdLocationId, setCreatedLocationId] = useState<string | null>(null);

  // Usa el hook completo
  const {
    imagePreview,
    uploadingImage,
    uploadError,
    handleImageChange, // Usa esta función del hook
    uploadToCloudinary,
    clearImage,
  } = useImageUpload();

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

  const deviceTypes = [
    { value: "ESP32",  label: "ESP32 — Temperatura y Humedad (DHT11 / DHT22)", icon: "🌡️💧" },
    { value: "ESP8266", label: "ESP8266 — Calidad del aire / gases (MQ-135)",       icon: "💨🧪" },
  ];

  const handleLocationChange = (e) => {
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

  const handleDeviceChange = (e) => {
    const { name, value } = e.target;
    setDeviceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      // 1. Subir imagen (Tu lógica actual)
      if (imagePreview) {
        imageUrl = await uploadToCloudinary();
      }

      const locationToSubmit = {
        name: locationData.name,
        description: locationData.description,
        img: imageUrl,
        coordinates: {
          latitude: locationData.coordinates.latitude.toString(),
          longitude: locationData.coordinates.longitude.toString(),
        },
      };

      // 2. Crear la ubicación en el backend
      const result = await createLocation(locationToSubmit);

      if (result.success) {
        // ÉXITO
        setCreatedLocationId(result.data.id);
        clearImage();
        setStep(2);
      } else {
        // Falla: El backend devolvió { success: false, error: '...' }
        // Aquí es donde lanzamos el error para que sea capturado en el 'catch'
        throw new Error(result.error);
      }

    } catch (error: any) {
      console.error('💥 Error completo:', error);

      const errorMessage = error.message || 'Hubo un error desconocido al crear la ubicación';

      //  Se tendría que modificar en el backend
      if (errorMessage.includes('duplicado')) {
        // Mensaje específico que definiste en el backend para el error 409/E11000
        Swal.fire({
          icon: 'warning',
          title: 'Ubicación Duplicada',
          text: 'Ya existe una ubicación registrada con el nombre: "' + locationData.name + '". Por favor, elige un nombre diferente.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#f8c04e', // Un color amarillo/naranja
        });
      } else {
        // Para cualquier otro error (falta de red, error 500 genérico, etc.)
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: errorMessage,
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#d33',
        });
      }

    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Verificar si tenemos el ID de la ubicación
    if (!createdLocationId) {
      Swal.fire({
        icon: 'error',
        title: 'Error de flujo',
        text: 'No se encontró el ID de la ubicación. Por favor, intente crear la ubicación de nuevo.',
      });
      setLoading(false);
      return;
    }

    try {
      // 2. Armar el objeto del dispositivo
      const deviceToSubmit = {
        name: deviceData.name,
        type: deviceData.type,
        location: createdLocationId,
        isEnabled: true,

        // Nota: El serialNumber debe ser manejado por el backend o generado aquí
      };

      console.log("Enviando dispositivo:", deviceToSubmit);

      // 3. Crear el dispositivo en el backend
      const result = await createDevice(deviceToSubmit);

      if (result.success) {
        // ÉXITO
        console.log("Dispositivo creado:", result.data);
        setLoading(false);
        setIsSuccess(true); // Muestra la pantalla de éxito

        setTimeout(() => {
          // navigate("/locations");
        }, 2000);
      } else {
        // Falla: El backend devolvió un error (ej. nombre/serial duplicado)
        throw new Error(result.error);
      }

    } catch (error: any) {
      console.error('💥 Error al crear el dispositivo:', error);

      const errorMessage = error.message || 'Hubo un error desconocido al crear el dispositivo';

      // Manejo de errores de duplicidad de dispositivo (ej. serialNumber si lo manejas)
      if (errorMessage.includes('dispositivo ya está registrado') || errorMessage.includes('duplicate key')) {
        Swal.fire({
          icon: 'warning',
          title: 'Dispositivo Duplicado',
          text: 'El dispositivo o su número serial ya está registrado. Por favor, verifique los datos.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#f8c04e',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar dispositivo',
          text: errorMessage,
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#d33',
        });
      }

    } finally {
      setLoading(false);
    }
  };

// ... (asegúrate de reemplazar el `handleSubmitDevice` simulado por este nuevo código)

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData(prev => ({
            ...prev,
            coordinates: {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
            },
          }));
        },
        (error) => {
          alert("No se pudo obtener la ubicación actual");
        }
      );
    }
  };



  if (isSuccess) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-black mb-2">¡Creación Exitosa!</h2>
          <p className="text-black">Tu ubicación y dispositivo han sido configurados correctamente</p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto animate-pulse" />
          </motion.div>

          <Link
            to={"/locations"}
            className="inline-flex items-center gap-2 px-4 py-2 mt-8 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            ← Volver
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step >= 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-700'
              }`}>
                {step > 1 ? <Check className="w-5 h-5 text-white" /> : <span className="text-white font-bold">1</span>}
              </div>
              <span className="ml-3 text-white font-medium">Ubicación</span>
            </div>

            <div className="flex-1 mx-4">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: "0%" }}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step >= 2 ? 'bg-gradient-to-r from-cyan-500 to-green-500' : 'bg-gray-700'
              }`}>
                <span className="text-white font-bold">2</span>
              </div>
              <span className="ml-3 text-white font-medium">Dispositivo</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-white">Nueva Ubicación</h2>
                  <p className="text-gray-400 text-sm">Configure los detalles de la ubicación</p>
                </div>
              </div>

              <form onSubmit={handleSubmitLocation} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                      <FileText className="w-4 h-4 mr-1" />
                      Nombre de la ubicación
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="Ej: Oficina Central, Planta de Producción"
                      value={locationData.name}
                      onChange={handleLocationChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                      <FileText className="w-4 h-4 mr-1" />
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                      placeholder="Describe brevemente esta ubicación..."
                      value={locationData.description}
                      onChange={handleLocationChange}
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                      <Image className="w-4 h-4 mr-1" />
                      Imagen de la ubicación
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 file:cursor-pointer"
                    />

                    {uploadError && (
                      <p className="mt-2 text-red-400 text-sm">{uploadError}</p>
                    )}

                    {/* Preview de la imagen */}
                    {imagePreview && (
                      <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-700">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            clearImage()
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {uploadingImage && (
                      <div className="mt-2 text-cyan-400 text-sm flex items-center">
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
                        Subiendo imagen...
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center text-gray-300 text-sm font-medium">
                        <Globe className="w-4 h-4 mr-1" />
                        Coordenadas
                      </label>
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="flex items-center text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Usar mi ubicación
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder="Latitud"
                        value={locationData.coordinates.latitude}
                        onChange={handleLocationChange}
                        required
                      />
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder="Longitud"
                        value={locationData.coordinates.longitude}
                        onChange={handleLocationChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Continuar
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="device"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <Cpu className="w-7 h-7 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-white">Dispositivo IoT</h2>
                  <p className="text-gray-400 text-sm">Asocie un dispositivo a esta ubicación</p>
                </div>
              </div>

              <form onSubmit={handleSubmitDevice} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                      <Wifi className="w-4 h-4 mr-1" />
                      Nombre del dispositivo
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                      placeholder="Ej: Sensor Principal, Monitor Ambiental"
                      value={deviceData.name}
                      onChange={handleDeviceChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
                      <Zap className="w-4 h-4 mr-1" />
                      Tipo de dispositivo
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {deviceTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setDeviceData(prev => ({ ...prev, type: type.value }))}
                          className={`p-3 rounded-xl border transition-all text-left ${
                            deviceData.type === type.value
                              ? 'bg-gradient-to-r from-cyan-500/20 to-green-500/20 border-green-500 text-white'
                              : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{type.icon}</span>
                            <div>
                              <div className="font-medium text-sm">{type.value}</div>
                              <div className="text-xs opacity-75">{type.label.split(' - ')[1]}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      name="type"
                      className="mt-3 w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                      placeholder="O escriba un tipo personalizado..."
                      value={deviceData.type}
                      onChange={handleDeviceChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition-all"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {uploadingImage ? 'Subiendo imagen...' : 'Creando ubicación...'}
                      </>
                    ) : (
                      <>
                        Continuar
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
