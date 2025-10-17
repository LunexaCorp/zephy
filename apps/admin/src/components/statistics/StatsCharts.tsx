import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useState } from "react";
import { TrendingUp } from "lucide-react";

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

type StatsChartsProps = {
  readings: SensorReading[];
};

export default function StatsCharts({ readings }: StatsChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState<"temperature" | "humidity" | "co2">("temperature");

  // Preparar datos para el gráfico (invertir para orden cronológico)
  const chartData = [...readings]
    .reverse()
    .map((reading) => ({
      timestamp: new Date(reading.timestamp).toLocaleString("es-ES", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      fullDate: new Date(reading.timestamp).toLocaleString("es-ES"),
      temperature: reading.temperature || null,
      humidity: reading.humidity || null,
      co2: reading.co2 || null,
      airQuality: reading.airQuality || null,
      uvIndex: reading.uvIndex || null
    }));

  const metrics = [
    {
      key: "temperature",
      label: "Temperatura",
      unit: "°C",
      color: "#f97316",
      strokeWidth: 2
    },
    {
      key: "humidity",
      label: "Humedad",
      unit: "%",
      color: "#3b82f6",
      strokeWidth: 2
    },
    {
      key: "airQuality",
      label: "Calidad del aire",
      unit: "",
      color: "#a855f7",
      strokeWidth: 2
    }
  ];

  const currentMetric = metrics.find(m => m.key === selectedMetric)!;

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-gray-600 mb-2">{data.fullDate}</p>
          {metrics.map((metric) => {
            const value = data[metric.key];
            if (value !== null && value !== undefined) {
              return (
                <div key={metric.key} className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium" style={{ color: metric.color }}>
                    {metric.label}:
                  </span>
                  <span className="font-bold text-gray-800">
                    {value.toFixed(1)} {metric.unit}
                  </span>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Tendencias Temporales
            </h2>
            <p className="text-sm text-gray-600">
              Evolución de métricas en el tiempo
            </p>
          </div>
        </div>

        {/* Selector de métrica */}
        <div className="flex gap-2">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key as any)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${selectedMetric === metric.key
                ? "shadow-lg scale-105"
                : "hover:scale-105 opacity-60 hover:opacity-100"
              }
              `}
              style={{
                backgroundColor: selectedMetric === metric.key ? `${metric.color}20` : "#f3f4f6",
                color: selectedMetric === metric.key ? metric.color : "#6b7280",
                borderWidth: "2px",
                borderColor: selectedMetric === metric.key ? metric.color : "transparent"
              }}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full" style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              label={{
                value: currentMetric.unit,
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 14, fill: "#6b7280" }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={currentMetric.strokeWidth}
              dot={{ r: 4, fill: currentMetric.color }}
              activeDot={{ r: 6 }}
              name={`${currentMetric.label} (${currentMetric.unit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Información adicional */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Total de lecturas</p>
          <p className="text-2xl font-bold text-gray-800">{readings.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Primera lectura</p>
          <p className="text-sm font-semibold text-gray-800">
            {chartData.length > 0
              ? new Date(readings[readings.length - 1].timestamp).toLocaleDateString("es-ES")
              : "N/A"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Última lectura</p>
          <p className="text-sm font-semibold text-gray-800">
            {chartData.length > 0
              ? new Date(readings[0].timestamp).toLocaleDateString("es-ES")
              : "N/A"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
