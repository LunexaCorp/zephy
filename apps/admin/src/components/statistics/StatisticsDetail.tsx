import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatsSummaryCards from "../../components/statistics/StatsSummaryCards.tsx";
import StatsCharts from "../../components/statistics/StatsCharts";
import StatsTable from "../../components/statistics/StatsTable";
import {
  ArrowLeft,
  Download,
  Activity,
  MapPin,
  Calendar
} from "lucide-react";
import { useStatistics } from "../../hooks/useStatistics";
import * as XLSX from "xlsx";

export default function StatisticsDetail() {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { fetchLocationStatistics } = useStatistics();
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    if (locationId) {
      loadStatistics();
    }
  }, [locationId, limit]);

  const loadStatistics = async () => {
    setLoading(true);
    const data = await fetchLocationStatistics(locationId!, limit);
    setStatistics(data);
    setLoading(false);
  };

  const handleDownloadExcel = () => {
    if (!statistics || !statistics.latestReadings) return;

    // Preparar datos para Excel
    const excelData = statistics.latestReadings.map((reading: any) => ({
      Fecha: new Date(reading.timestamp).toLocaleString("es-ES"),
      Dispositivo: reading.device,
      "Temperatura (°C)": reading.temperature || "N/A",
      "Humedad (%)": reading.humidity || "N/A",
      //"CO₂ (ppm)": reading.co2 || "N/A",
      "Calidad del Aire": reading.airQuality || "N/A",
      //"Índice UV": reading.uvIndex || "N/A",
    }));

    // Crear worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 20 }, // Fecha
      { wch: 25 }, // Dispositivo
      { wch: 15 }, // Temperatura
      { wch: 12 }, // Humedad
      //{ wch: 12 }, // CO2
      { wch: 18 }, // Calidad del Aire
      //{ wch: 12 }, // Índice UV
    ];
    ws["!cols"] = columnWidths;

    // Crear workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lecturas");

    // Agregar hoja de resumen
    const summaryData = [
      { Métrica: "Ubicación", Valor: statistics.locationName },
      { Métrica: "Dispositivos", Valor: statistics.deviceCount },
      { Métrica: "Total de lecturas", Valor: statistics.latestReadings.length },
      { Métrica: "", Valor: "" },
      { Métrica: "PROMEDIOS", Valor: "" },
      { Métrica: "Temperatura promedio (°C)", Valor: statistics.averages.temperature?.toFixed(2) || "N/A" },
      { Métrica: "Humedad promedio (%)", Valor: statistics.averages.humidity?.toFixed(2) || "N/A" },
      //{ Métrica: "CO₂ promedio (ppm)", Valor: statistics.averages.co2?.toFixed(2) || "N/A" },
      { Métrica: "", Valor: "" },
      { Métrica: "RANGOS", Valor: "" },
      { Métrica: "Temp. mínima (°C)", Valor: statistics.ranges.temperature?.min || "N/A" },
      { Métrica: "Temp. máxima (°C)", Valor: statistics.ranges.temperature?.max || "N/A" },
      { Métrica: "Humedad mínima (%)", Valor: statistics.ranges.humidity?.min || "N/A" },
      { Métrica: "Humedad máxima (%)", Valor: statistics.ranges.humidity?.max || "N/A" },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary["!cols"] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");

    // Descargar
    const fileName = `estadisticas_${statistics.locationName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
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

  if (!statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-4 md:p-8">
        <div className="text-center py-16">
          <p className="text-xl text-gray-700">No se encontraron estadísticas para esta ubicación</p>
          <button
            onClick={() => navigate("/statistics")}
            className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            Volver
          </button>
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
        {/* Breadcrumb y acciones */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <button
            onClick={() => navigate("/statistics")}
            className="flex items-center gap-2 text-gray-600 hover:text-sky-600 transition group w-fit"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver a estadísticas</span>
          </button>

          <div className="flex gap-3">
            {/* Selector de límite */}
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value={20}>Últimas 20 lecturas</option>
              <option value={50}>Últimas 50 lecturas</option>
              <option value={100}>Últimas 100 lecturas</option>
              <option value={200}>Últimas 200 lecturas</option>
            </select>

            {/* Botón descargar Excel */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition"
            >
              <Download className="h-5 w-5" />
              <span className="font-medium">Descargar Excel</span>
            </motion.button>
          </div>
        </div>

        {/* Información de la ubicación */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-48">
            {statistics.locationImage ? (
              <img
                src={statistics.locationImage}
                alt={statistics.locationName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-6 w-6 text-white" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {statistics.locationName}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>{statistics.deviceCount} dispositivos</span>
                </div>
                {statistics.lastUpdate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(statistics.lastUpdate).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Componentes de visualización */}
      <div className="space-y-6">
        {/* Cards de resumen */}
        <StatsSummaryCards
          averages={statistics.averages}
          ranges={statistics.ranges}
        />

        {/* Gráficos de tendencias */}
        {statistics.latestReadings && statistics.latestReadings.length > 0 && (
          <StatsCharts readings={statistics.latestReadings} />
        )}

        {/* Tabla de datos */}
        {statistics.latestReadings && statistics.latestReadings.length > 0 && (
          <StatsTable readings={statistics.latestReadings} />
        )}
      </div>
    </div>
  );
}
