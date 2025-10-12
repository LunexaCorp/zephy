import PropTypes from "prop-types";
import { Thermometer, Cloud, Wind } from "lucide-react";

LocationCard.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    position: PropTypes.array,
    img: PropTypes.string,
    percentage: PropTypes.number,
    color: PropTypes.string,
    lastUpdated: PropTypes.string,
    radius: PropTypes.number,
    sensorData: PropTypes.shape({
      temperature: PropTypes.number,
      humidity: PropTypes.number,
      airQuality: PropTypes.number,
      lastUpdated: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function LocationCard({ location, onClose }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl border border-emerald-500/30 w-80 overflow-hidden">
      {/* Imagen y botón cerrar */}
      <div className="relative">
        <img
          src={location.img || "/fallback-location.jpg"}
          alt={location.name}
          className="w-full h-40 object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/50 rounded-full p-2 hover:bg-black/80 transition"
        >
          ✕
        </button>
      </div>

      {/* descripcion del lugar */}
      <div className="p-4 space-y-3 mt-6">
        <h2 className="text-xl font-bold text-emerald-400">{location.name}</h2>
        <p className="text-gray-300 text-sm">{location.description}</p>

        {/* Sensores */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center bg-gray-800/50 rounded p-2">
            <Thermometer className="text-red-400 mb-1" size={18} />
            <span className="text-gray-400 text-xs">Temperatura</span>
            <span className="font-bold text-white">
              {location.sensorData.temperature}°C
            </span>
          </div>

          <div className="flex flex-col items-center bg-gray-800/50 rounded p-2">
            <Cloud className="text-blue-400 mb-1" size={18} />
            <span className="text-gray-400 text-xs">Humedad</span>
            <span className="font-bold text-white">
              {location.sensorData.humidity} %
            </span>
          </div>

          <div className="flex flex-col items-center bg-gray-800/50 rounded p-2">
            <Wind className="text-green-400 mb-1" size={18} />
            <span className="text-gray-400 text-xs">Calidad Aire</span>
            <span className="font-bold text-white">
              {location.sensorData.airQuality} ppm
            </span>
          </div>
        </div>

        {/* Última lectura */}
        <div className="mt-2 text-right text-gray-400 text-xs">
          Última lectura: {location.sensorData.lastUpdated}
        </div>
      </div>
    </div>
  );
}
