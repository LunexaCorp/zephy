export default function LocationCard({ location, onClose }) {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-emerald-500/30 w-80 overflow-hidden">
      <div className="relative">
        <img
          src={location.img || "/fallback-location.jpg"}
          alt={location.name}
          className="w-full h-40 object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/80 transition"
        >
          ✕
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-white">{location.name}</h3>
        <div className="flex items-center mt-2 mb-4">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: location.color }}
          />
          <span className="text-sm font-medium text-gray-300">
            {location.percentage}% -{" "}
            {location.percentage >= 70
              ? "Saludable"
              : location.percentage >= 40
              ? "Moderado"
              : "Peligroso"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-gray-400">Temperatura</p>
            <p className="font-bold">{location.temperature}°C</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-gray-400">CO₂</p>
            <p className="font-bold">{location.co2} ppm</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-gray-400">Calidad Aire</p>
            <p className="font-bold">{location.airQuality}/100</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-gray-400">Última lectura</p>
            <p className="font-bold">{location.lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
