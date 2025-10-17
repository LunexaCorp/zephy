import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

type StatsSummaryCardsProps = {
  averages: {
    temperature?: number;
    humidity?: number;
    co2?: number;
    airQuality?: number;
    uvIndex?: number;
  };
  ranges: {
    temperature?: { min: number; max: number };
    humidity?: { min: number; max: number };
    co2?: { min: number; max: number };
    airQuality?: { min: number; max: number };
    uvIndex?: { min: number; max: number };
  };
};

export default function StatsSummaryCards({ averages, ranges }: StatsSummaryCardsProps) {
  const metrics = [
    {
      name: "Temperatura",
      icon: Thermometer,
      average: averages.temperature,
      range: ranges.temperature,
      unit: "°C",
      color: "orange",
      bgGradient: "from-orange-500/20 to-red-500/10",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      textColor: "text-orange-700"
    },
    {
      name: "Humedad",
      icon: Droplets,
      average: averages.humidity,
      range: ranges.humidity,
      unit: "%",
      color: "blue",
      bgGradient: "from-blue-500/20 to-cyan-500/10",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-700"
    },
    {
      name: "Calidad del Aire",
      icon: Gauge,
      average: averages.airQuality,
      range: ranges.airQuality,
      unit: "",
      color: "emerald",
      bgGradient: "from-emerald-500/20 to-green-500/10",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700"
    },
    {
      name: "CO₂",
      icon: Wind,
      average: averages.co2,
      range: ranges.co2,
      unit: "ppm",
      color: "purple",
      bgGradient: "from-purple-500/20 to-indigo-500/10",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-700"
    },
    {
      name: "Índice UV",
      icon: Sun,
      average: averages.uvIndex,
      range: ranges.uvIndex,
      unit: "",
      color: "amber",
      bgGradient: "from-amber-500/20 to-yellow-500/10",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const hasData = metric.average !== undefined && metric.average !== null;

        return (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative overflow-hidden rounded-2xl
              bg-gradient-to-br ${metric.bgGradient}
              border border-white/50 shadow-lg
              backdrop-blur-sm
            `}
          >
            <div className="p-5">
              {/* Header con icono */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                  <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                </div>
              </div>

              {/* Nombre de la métrica */}
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {metric.name}
              </h3>

              {hasData ? (
                <>
                  {/* Valor promedio */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${metric.textColor}`}>
                        {metric.average!.toFixed(1)}
                      </span>
                      <span className="text-lg text-gray-600 font-medium">
                        {metric.unit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Promedio</p>
                  </div>

                  {/* Rango min/max */}
                  {metric.range && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <TrendingDown className="h-4 w-4" />
                          <span>Mín:</span>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {metric.range.min.toFixed(1)} {metric.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>Máx:</span>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {metric.range.max.toFixed(1)} {metric.unit}
                        </span>
                      </div>

                      {/* Barra de rango visual */}
                      <div className="relative h-2 bg-gray-200/50 rounded-full mt-3">
                        <div
                          className={`absolute h-full bg-gradient-to-r ${metric.bgGradient} rounded-full`}
                          style={{
                            left: "0%",
                            right: "0%"
                          }}
                        />
                        {/* Indicador de promedio */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-${metric.color}-600 border-2 border-white shadow-md`}
                          style={{
                            left: `${((metric.average! - metric.range.min) / (metric.range.max - metric.range.min)) * 100}%`,
                            transform: "translateX(-50%) translateY(-50%)"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Minus className="h-8 w-8 mb-2" />
                  <span className="text-sm">Sin datos</span>
                </div>
              )}
            </div>

            {/* Decoración de fondo */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
          </motion.div>
        );
      })}
    </div>
  );
}
