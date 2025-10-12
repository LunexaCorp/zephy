import { MapPin, Thermometer, Droplets, Wind, Activity } from "lucide-react";
import { DataItem } from "../DataItem.jsx";
import { PercentageCalculation, getHealthLabel } from "../../utils/PercentageCalculation.js";

const DataPanel = ({ currentData }) => {
  // Validación robusta de datos
  if (!currentData || !currentData.sensorData) {
    return (
      <div className="h-full bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-600/20 flex flex-col items-center justify-center gap-4">
        <Wind className="w-16 h-16 text-gray-500 animate-pulse" />
        <h2 className="text-xl font-bold text-gray-400">
          Esperando datos del sensor...
        </h2>
        <p className="text-sm text-gray-500">
          Verifica la conexión con el ESP32
        </p>
      </div>
    );
  }

  const { locationName, sensorData } = currentData;

  // Calcular el health score general
  const healthScore = PercentageCalculation(sensorData);
  const healthLabel = getHealthLabel(healthScore);

  // Validación individual de cada sensor
  const hasTemperature = typeof sensorData.temperature === 'number' && !isNaN(sensorData.temperature);
  const hasHumidity = typeof sensorData.humidity === 'number'
    && !isNaN(sensorData.humidity)
    && sensorData.humidity > 0;
  const hasAirQuality = typeof sensorData.airQuality === 'number' && !isNaN(sensorData.airQuality);

  // Determinar color del health score
  const getHealthColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-lime-400";
    if (score >= 40) return "text-amber-400";
    if (score >= 20) return "text-red-400";
    return "text-red-600";
  };

  const getHealthBgColor = (score) => {
    if (score >= 80) return "bg-emerald-500/20 border-emerald-400/30";
    if (score >= 60) return "bg-lime-500/20 border-lime-400/30";
    if (score >= 40) return "bg-amber-500/20 border-amber-400/30";
    if (score >= 20) return "bg-red-500/20 border-red-400/30";
    return "bg-red-900/20 border-red-600/30";
  };

  return (
    <div className="h-full bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-emerald-400/20 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-emerald-400 flex items-center">
          <span className="inline-block w-2 h-6 bg-emerald-500 mr-3 rounded-sm"></span>
          Datos en Tiempo Real
        </h2>

      </div>

      {/* Ubicación */}
      <div className="bg-gray-800/60 rounded-lg p-3 border border-blue-500/20">
        <div className="flex items-center gap-3">
          <MapPin className="text-blue-400 w-5 h-5" />
          <div>
            <p className="text-xs text-blue-300">Ubicación</p>
            <p className="text-lg font-bold text-white">
              {locationName || "Sin identificar"}
            </p>
          </div>
        </div>
      </div>



      {/* Sensores Individuales */}
      <div className="flex flex-col gap-3">
        {/* Temperatura */}
        <DataItem
          label="Temperatura"
          value={hasTemperature ? sensorData.temperature : null}
          icon={<Thermometer className="text-red-400 w-6 h-6" />}
          unit="°C"
        />

        {/* Humedad */}
        <DataItem
          label="Humedad"
          value={hasHumidity ? sensorData.humidity : null}
          icon={<Droplets className="text-sky-400 w-6 h-6" />}
          unit="%"
        />

        {/* Calidad del Aire (CO₂) */}
        <DataItem
          label="CO₂ (Calidad del Aire)"
          value={hasAirQuality ? sensorData.airQuality : null}
          icon={<Wind className="text-green-400 w-6 h-6" />}
          unit=" ppm"
        />
      </div>

      {/* Footer con advertencias */}
      {healthScore < 40 && (
        <div className="mt-auto bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-red-400 text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-400">
                Acción Requerida
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {healthScore < 20
                  ? "Condiciones peligrosas. Ventilación inmediata necesaria."
                  : "Calidad ambiental deficiente. Se recomienda ventilar."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-500 mt-2">
        Última actualización: {new Date(sensorData.lastUpdate).toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })}
      </div>
    </div>
  );
};

export default DataPanel;
