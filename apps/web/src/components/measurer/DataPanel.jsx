import { MapPin, Thermometer, Cloud, Wind } from "lucide-react";
import { DataItem } from "../DataItem.jsx";

const DataPanel = ({ currentData }) => (
  <div className="h-full bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-emerald-400/20 flex flex-col gap-4">
    <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center">
      <span className="inline-block w-2 h-6 bg-emerald-500 mr-3 rounded-sm"></span>
      Datos en Tiempo Real
    </h2>

    <div className="flex flex-col gap-4">
      <DataItem
        label="Lugar"
        value={currentData.locationName}
        icon={<MapPin className="text-blue-400 w-6 h-6" />}
      />

      <DataItem
        label="Temperatura"
        value={`${currentData.sensorData.temperature}°C`}
        icon={<Thermometer className="text-red-400 w-6 h-6" />}
      />

      <DataItem
        label="CO₂"
        value={`${currentData.sensorData.co2} ppm`}
        icon={<Cloud className="text-sky-400 w-6 h-6" />}
      />

      <DataItem
        label="Calidad del Aire"
        value={`${currentData.sensorData.airQuality}/100`}
        icon={<Wind className="text-green-400 w-6 h-6" />}
      />
    </div>
  </div>
);

export default DataPanel;
