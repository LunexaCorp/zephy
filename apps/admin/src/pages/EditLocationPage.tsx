import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Image, FileText, Navigation, Check } from "lucide-react";
import Swal from "sweetalert2";

import { useImageUpload } from "../hooks/useImageUpload";
import { getLocationById, updateLocation } from "../services/axios.config";

export default function EditLocationPage() {
  const { id } = useParams(); // ID desde la URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [locationData, setLocationData] = useState({
    name: "",
    description: "",
    img: "",
    coordinates: { latitude: "", longitude: "" },
  });

  // Hook para imagen
  const {
    imagePreview,
    uploadingImage,
    uploadError,
    handleImageChange,
    uploadToCloudinary,
    clearImage,
  } = useImageUpload();

  // 🧭 Obtener ubicación al montar
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const result = await getLocationById(id!);
        if (result.success && result.data) {
          const loc = result.data;
          setLocationData({
            name: loc.name,
            description: loc.description || "",
            img: loc.img || "",
            coordinates: {
              latitude: loc.coordinates.latitude.toString(),
              longitude: loc.coordinates.longitude.toString(),
            },
          });
        } else {
          throw new Error("No se pudo cargar la ubicación");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar",
          text: "No se pudo obtener la información de la ubicación.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  // 🖊️ Manejar cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (["latitude", "longitude"].includes(name)) {
      setLocationData((prev) => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: value },
      }));
    } else {
      setLocationData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 📍 Obtener coordenadas del navegador
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData((prev) => ({
            ...prev,
            coordinates: {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
            },
          }));
        },
        () => {
          Swal.fire({
            icon: "warning",
            title: "Ubicación no disponible",
            text: "No se pudo acceder a tu ubicación actual.",
          });
        }
      );
    }
  };

  // 💾 Enviar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = locationData.img;

      // Si hay nueva imagen, subirla
      if (imagePreview) {
        imageUrl = await uploadToCloudinary();
      }

      const updatedData = {
        name: locationData.name,
        description: locationData.description,
        img: imageUrl,
        coordinates: {
          latitude: locationData.coordinates.latitude.toString(),
          longitude: locationData.coordinates.longitude.toString(),
        },
      };

      const result = await updateLocation(id!, updatedData);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Ubicación actualizada",
          text: "Los cambios se guardaron correctamente.",
          confirmButtonColor: "#10B981",
        });
        navigate("/locations");
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.message || "No se pudo guardar la ubicación.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <motion.div
        className="w-full max-w-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-white">Editar Ubicación</h2>
            <p className="text-gray-400 text-sm">Actualiza los detalles de la ubicación</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
              <FileText className="w-4 h-4 mr-1" />
              Nombre
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              value={locationData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
              <FileText className="w-4 h-4 mr-1" />
              Descripción
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
              value={locationData.description}
              onChange={handleChange}
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="flex items-center text-gray-300 text-sm font-medium mb-2">
              <Image className="w-4 h-4 mr-1" />
              Imagen
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
            />

            {(imagePreview || locationData.img) && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-700">
                <img
                  src={imagePreview || locationData.img}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    clearImage(); // limpia el preview del hook
                    setLocationData(prev => ({ ...prev, img: "" })); // limpia la imagen del estado principal
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                >
                  ✕
                </button>

              </div>
            )}

            {uploadError && <p className="mt-2 text-red-400 text-sm">{uploadError}</p>}
            {uploadingImage && (
              <p className="mt-2 text-cyan-400 text-sm">Subiendo imagen...</p>
            )}
          </div>

          {/* Coordenadas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center text-gray-300 text-sm font-medium">
                <Navigation className="w-4 h-4 mr-1" />
                Coordenadas
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Usar mi ubicación
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="any"
                name="latitude"
                className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                value={locationData.coordinates.latitude}
                onChange={handleChange}
              />
              <input
                type="number"
                step="any"
                name="longitude"
                className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                value={locationData.coordinates.longitude}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              to="/locations"
              className="py-3 px-6 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all"
            >
              ← Volver
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
