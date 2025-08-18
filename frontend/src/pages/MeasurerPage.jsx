import { useState, useEffect } from "react";
import { getLocationSensorData, getLocations } from "../services/axios.js"; // Cambiado a api.js
import { useNavigate } from "react-router-dom";
import { EnvironmentalGauge } from "../components/EnvironmentalGauge";
import { DataItem } from "../components/DataItem";

const MeasurerPage = () => {
  const [sensorData, setSensorData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("lastLocation") || null
  );
  const navigate = useNavigate();

  // Datos por defecto
  const currentData = sensorData || {
    temperature: 0,
    co2: 0,
    airQuality: 0,
    lastUpdate: new Date().toISOString(),
    location: "Selecciona una ubicación",
    img: "/fallback.png",
  };

  useEffect(() => {
    const init = async () => {
      try {
        const locaciones = await getLocations();
        setLocations(locaciones);

        const savedLocation =
          localStorage.getItem("lastLocation") || locaciones[0]?._id;
        setCurrentLocation(savedLocation);

        if (savedLocation) {
          const data = await getLocationSensorData(savedLocation); // Cambiado aquí
          setSensorData(data);
        }
      } catch (err) {
        setError("Error al cargar datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const fetchData = async () => {
        try {
          const data = await getLocationSensorData(currentLocation); // Cambiado aquí
          // Añade la imagen de la ubicación correspondiente
          const selectedLocation = locations.find(
            (loc) => loc._id === currentLocation
          );
          setSensorData({
            ...data,
            img: selectedLocation?.img || "/fallback.png",
            location: selectedLocation?.name || "Ubicación desconocida",
          });
          localStorage.setItem("lastLocation", currentLocation);
        } catch (err) {
          setError("Error al actualizar datos");
          console.error(err);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [currentLocation, locations]);

  if (loading) return <div className="text-center py-20">Cargando...</div>;

  return (
    <>
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
                  <option key={loc._id} value={loc._id} className="bg-gray-800">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {sensorData && <div>si hay datos</div>}
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
                <DataItem
                  label="Lugar"
                  value={currentData.location}
                  icon="📍"
                />
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
    </>
  );
};

export default MeasurerPage;
