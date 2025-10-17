import { motion } from "framer-motion";
import { useState } from "react";
import {
  Table,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Sun
} from "lucide-react";

type SensorReading = {
  _id: string;
  device: string;
  timestamp: string;
  temperature?: number;
  humidity?: number;
  co2?: number;
  airQuality?: number;
  uvIndex?: number;
};

type StatsTableProps = {
  readings: SensorReading[];
};

export default function StatsTable({ readings }: StatsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(readings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReadings = readings.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getValueColor = (value: number | undefined, type: string) => {
    if (value === undefined || value === null) return "text-gray-400";

    switch (type) {
      case "temperature":
        if (value > 30) return "text-red-600 font-bold";
        if (value < 15) return "text-blue-600 font-bold";
        return "text-gray-800";
      case "humidity":
        if (value > 70) return "text-blue-600 font-bold";
        if (value < 30) return "text-amber-600 font-bold";
        return "text-gray-800";
      case "airQuality":
        if (value > 1000) return "text-red-600 font-bold";
        if (value > 800) return "text-amber-600 font-bold";
        return "text-gray-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Table className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Registro de Lecturas
            </h2>
            <p className="text-sm text-gray-600">
              {readings.length} lecturas totales
            </p>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Fecha y Hora
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-center gap-1">
                <Thermometer className="h-4 w-4" />
                Temp (°C)
              </div>
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-center gap-1">
                <Droplets className="h-4 w-4" />
                Humedad (%)
              </div>
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-center gap-1">
                <Gauge className="h-4 w-4" />
                Calidad
              </div>
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-center gap-1">
                <Wind className="h-4 w-4" />
                CO₂ (ppm)
              </div>
            </th>

            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-center gap-1">
                <Sun className="h-4 w-4" />
                UV
              </div>
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
          {currentReadings.map((reading, index) => (
            <motion.tr
              key={reading._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {new Date(reading.timestamp).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                  <div className="text-gray-500">
                    {new Date(reading.timestamp).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-medium ${getValueColor(reading.temperature, "temperature")}`}>
                    {reading.temperature !== undefined && reading.temperature !== null
                      ? reading.temperature.toFixed(1)
                      : "—"}
                  </span>
              </td>
              <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-medium ${getValueColor(reading.humidity, "humidity")}`}>
                    {reading.humidity !== undefined && reading.humidity !== null
                      ? reading.humidity.toFixed(1)
                      : "—"}
                  </span>
              </td>
              <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-gray-800">
                    {reading.airQuality !== undefined && reading.airQuality !== null
                      ? reading.airQuality.toFixed(1)
                      : "—"}
                  </span>
              </td>
              <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-medium ${getValueColor(reading.co2, "co2")}`}>
                    {reading.co2 !== undefined && reading.co2 !== null
                      ? Math.round(reading.co2)
                      : "—"}
                  </span>
              </td>
              <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-gray-800">
                    {reading.uvIndex !== undefined && reading.uvIndex !== null
                      ? reading.uvIndex.toFixed(1)
                      : "—"}
                  </span>
              </td>
            </motion.tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} - {Math.min(endIndex, readings.length)} de {readings.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`
                p-2 rounded-lg transition-all
                ${currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 hover:text-sky-600"
              }
              `}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`
                        px-3 py-1 rounded-lg text-sm font-medium transition-all
                        ${pageNum === currentPage
                        ? "bg-sky-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`
                p-2 rounded-lg transition-all
                ${currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 hover:text-sky-600"
              }
              `}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
