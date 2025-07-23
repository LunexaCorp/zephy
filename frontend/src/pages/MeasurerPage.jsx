import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { locations } from "../data/locations";
import { sensorData } from "../data/sensorData";
import { EnvironmentalGauge } from "../components/EnvironmentalGauge";
import { DataItem } from "../components/DataItem";

const MeasurerPage = () => {
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("lastLocation") || locations[0].id
  );
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("lastLocation", currentLocation);
  }, [currentLocation]);

  const currentData = sensorData[currentLocation];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900">
      <div className="bg-black px-4 py-5 border-b border-emerald-400/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-center">
            <span className="text-white">LUNEXA</span>
            <span className="text-emerald-400"> Zephy</span>
          </h1>

          <div className="w-full sm:w-64">
            <select
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-emerald-400/50 focus:ring-2 focus:ring-emerald-400"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-gray-800">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna 1.- Gauge */}
          <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-emerald-400/20">
            <EnvironmentalGauge data={currentData} />
          </div>

          {/* Columna 2.- Datos */}
          <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-emerald-400/20">
            <h2 className="text-xl font-bold text-emerald-400 mb-5 flex items-center">
              <span className="inline-block w-2 h-6 bg-emerald-500 mr-3"></span>
              Datos en Tiempo Real
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <DataItem label="Lugar" value={currentData.location} icon="📍" />
              <DataItem
                label="Temperatura"
                value={`${currentData.temperature}°C`}
                icon="🌡️"
              />
              <DataItem
                label="CO₂"
                value={`${currentData.co2} ppm`}
                icon="☁️"
              />
              <DataItem
                label="Calidad Aire"
                value={`${currentData.airQuality}/100`}
                icon="🍃"
              />
            </div>
          </div>

          {/* Columna 3.- Imagen */}
          <div className="lg:col-span-1 overflow-hidden rounded-xl shadow-2xl border border-emerald-400/20 group">
            <img
              src={currentData.img}
              alt={currentData.location}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Botones flotantes */}
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={() => navigate("/ranking")}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-lg flex items-center gap-2 transition-all"
          >
            <span className="text-white font-medium">🏆 Ranking</span>
          </button>
          <button
            onClick={() => navigate("/mapa")}
            className="px-5 py-3 bg-gray-800 hover:bg-gray-700 border border-emerald-400/30 rounded-full shadow-lg flex items-center gap-2 transition-all"
          >
            <span className="text-emerald-400 font-medium">🗺️ Mapa</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default MeasurerPage;
