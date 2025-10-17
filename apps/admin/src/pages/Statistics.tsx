import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  AlertCircle
} from "lucide-react";
import { useStatistics } from "../hooks/useStatistics";

export default function Statistics() {
  const navigate = useNavigate();
  const { summaries, loading, fetchStatisticsSummaries } = useStatistics();

  useEffect(() => {
    fetchStatisticsSummaries();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ok":
        return {
          bg: "from-emerald-500/20 to-emerald-600/10",
          border: "border-emerald-500/30",
          text: "text-emerald-600",
          badge: "bg-emerald-500/20 text-emerald-700",
          label: "Óptimo"
        };
      case "warning":
        return {
          bg: "from-amber-500/20 to-amber-600/10",
          border: "border-amber-500/30",
          text: "text-amber-600",
          badge: "bg-amber-500/20 text-amber-700",
          label: "Alerta"
        };
      case "danger":
        return {
          bg: "from-red-500/20 to-red-600/10",
          border: "border-red-500/30",
          text: "text-red-600",
          badge: "bg-red-500/20 text-red-700",
          label: "Crítico"
        };
      default:
        return {
          bg: "from-gray-500/20 to-gray-600/10",
          border: "border-gray-500/30",
          text: "text-gray-600",
          badge: "bg-gray-500/20 text-gray-700",
          label: "Sin datos"
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
      <div className="flex items-center gap-3">
      <Activity className="h-6 w-6 animate-spin text-sky-600" />
      <span className="text-lg text-gray-700">Cargando estadísticas...</span>
    </div>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8"
  >
  <h1 className="text-4xl font-bold text-gray-800 mb-2">
    Estadísticas Ambientales
  </h1>
  <p className="text-gray-600">
    Monitoreo en tiempo real de todas las ubicaciones
  </p>
  </motion.div>

  {/* Grid de ubicaciones */}
  {summaries.length === 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16"
    >
    <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No hay datos disponibles
  </h3>
  <p className="text-gray-500">
    Configura dispositivos para comenzar a ver estadísticas
  </p>
  </motion.div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaries.map((summary, index) => {
          const statusConfig = getStatusConfig(summary.status);

          return (
            <motion.div
              key={summary.locationId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          onClick={() => navigate(`/statistics/${summary.locationId}`)} className={`
          group relative overflow-hidden rounded-2xl cursor-pointer
    bg-white border-2 ${statusConfig.border}
    shadow-lg hover:shadow-2xl transition-all duration-300
  `}
        >
          {/* Imagen de fondo con overlay */}
          <div className="relative h-40 overflow-hidden">
            {summary.locationImage ? (
                  <img
                    src={summary.locationImage}
                alt={summary.locationName}
              className="w-full h-full object-cover"
                />
        ) : (
            <div className={`w-full h-full bg-gradient-to-br ${statusConfig.bg}`} />
        )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Badge de estado */}
            <div className="absolute top-3 right-3">
          <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${statusConfig.badge} backdrop-blur-sm
                    `}>
          {statusConfig.label}
          </span>
          </div>

          {/* Nombre de ubicación */}
          <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-white" />
          <h3 className="text-xl font-bold text-white truncate">
            {summary.locationName}
            </h3>
            </div>
            </div>
            </div>

          {/* Contenido */}
          <div className="p-4 space-y-4">
            {/* Dispositivos activos */}
            <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Dispositivos activos</span>
          <span className="font-semibold text-gray-800">
            {summary.deviceCount}
            </span>
            </div>

          {/* Valores actuales */}
          <div className="grid grid-cols-3 gap-2">
            {/* Temperatura */}
            <div className="text-center p-2 rounded-lg bg-orange-50">
          <Thermometer className="h-5 w-5 text-orange-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Temp</div>
            <div className="text-sm font-bold text-gray-800">
              {summary.latestValues.temperature != null
                ? `${summary.latestValues.temperature.toFixed(1)}°C`
                : "N/A"}
            </div>
            </div>

          {/* Humedad */}
          <div className="text-center p-2 rounded-lg bg-blue-50">
          <Droplets className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Humedad</div>
            <div className="text-sm font-bold text-gray-800">
            {summary.latestValues.humidity != null
                ? `${summary.latestValues.humidity.toFixed(1)}%`
                : "N/A"}
            </div>
            </div>

          {/* Calidad del aire */}
          <div className="text-center p-2 rounded-lg bg-purple-50">
          <Wind className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Calidad del aire</div>
          <div className="text-sm font-bold text-gray-800">
            {summary.latestValues.airQuality != null
                ? `${Math.round(summary.latestValues.airQuality)}`
                : "N/A"}
            </div>
            </div>
            </div>

          {/* Última actualización */}
          {summary.lastUpdate && (
            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
              Última actualización:{" "}
            {new Date(summary.lastUpdate).toLocaleString("es-ES", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            })}
            </div>
          )}
          </div>

          {/* Indicador de hover */}
          <div className={`
                  absolute bottom-0 left-0 right-0 h-1
                  bg-gradient-to-r ${statusConfig.bg}
                  transform scale-x-0 group-hover:scale-x-100
                  transition-transform duration-300
                `} />
          </motion.div>
        );
        })}
      </div>
  )}
  </div>
);
}
