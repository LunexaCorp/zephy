import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { EnvironmentalGauge } from "../components/EnvironmentalGauge";
import EnvironmentalTabs from "../components/EnvironmentalTabs";
import TipsCarousel from "../components/TipsCarousel";
import { Icon } from "../components/Icons.jsx";

import { DataItem } from "../components/DataItem";

import Loader from "../components/Loader.jsx";
// Importa el nuevo componente para la imagen
import LoaderTime from "../components/LoaderTime.jsx";

// Importa solo las funciones necesarias
import { getSingleDashboardData, getLocations } from "../services/axios.js";

const MeasurerPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("lastLocation") || null
  );
  const navigate = useNavigate();

  // useEffect 1: Carga inicial y lógica de selección
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setError(null);
      try {
        const locs = await getLocations();
        setLocations(locs);

        let initialLocationId = currentLocation;

        if (!initialLocationId && locs.length > 0) {
          initialLocationId = locs[0]._id;
          setCurrentLocation(initialLocationId);
        }

        if (initialLocationId) {
          const data = await getSingleDashboardData(initialLocationId);
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Error en la carga inicial:", err);
        setError("Error al cargar datos iniciales. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // useEffect 2: Refrescar datos y manejar cambios de ubicación
  useEffect(() => {
    if (!currentLocation) {
      return;
    }

    // Establece el dashboardData a null para mostrar el loader de inmediato
    setDashboardData(null);

    const fetchAndSetData = async () => {
      try {
        const data = await getSingleDashboardData(currentLocation);
        setDashboardData(data);
      } catch (err) {
        console.error("Error al actualizar datos:", err);
        setError("Error al actualizar datos del medidor.");
      }
    };

    fetchAndSetData();

    const intervalId = setInterval(fetchAndSetData, 30000);

    localStorage.setItem("lastLocation", currentLocation);

    return () => clearInterval(intervalId);
  }, [currentLocation]);

  // Se mueve la lógica de fallback al renderizado para reflejar el estado de carga
  const currentData = dashboardData || {
    locationId: currentLocation,
    locationName: "Cargando...",
    locationImg: null, // Establece la imagen a null para que el Loader se muestre
    sensorData: {
      temperature: 0,
      co2: 0,
      airQuality: 0,
      lastUpdate: new Date().toISOString(),
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    console.log("error temporal:"+error);
  }

  // Lógica de renderizado de la imagen o el loader
  const imageDisplay =
    dashboardData && dashboardData.locationImg ? (
      <img
        src={currentData.locationImg}
        alt={currentData.locationName}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
    ) : (
      <LoaderTime />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900">
      {/* Header */}
      <div className="bg-black px-4 py-5 border-b border-emerald-400/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-center">
            <span className="text-white">LUNEXA</span>
            <span className="text-emerald-400"> Zephy</span>
          </h1>
          <div className="w-full sm:w-64">
            <select
              value={currentLocation || ""}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-emerald-400/50 focus:ring-2 focus:ring-emerald-400"
            >
              <option value="" disabled>
                Selecciona una ubicación
              </option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id} className="bg-gray-800">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-emerald-400/20">
            <EnvironmentalGauge data={currentData.sensorData} />
          </div>
          <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-emerald-400/20">
            <h2 className="text-xl font-bold text-emerald-400 mb-5 flex items-center">
              <span className="inline-block w-2 h-6 bg-emerald-500 mr-3"></span>
              Datos en Tiempo Real
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <DataItem
                label="Lugar"
                value={currentData.locationName}
                icon={
                  <Icon name="location" size={20} className="text-blue-400" />
                }
              />
              <DataItem
                label="Temperatura"
                value={
                  currentData.sensorData
                    ? `${currentData.sensorData.temperature}°C`
                    : "N/A"
                }
                icon={
                  <Icon name="temperature" size={20} className="text-red-400" />
                }
              />
              <DataItem
                label="CO₂"
                value={
                  currentData.sensorData
                    ? `${currentData.sensorData.co2} ppm`
                    : "N/A"
                }
                icon={<Icon name="co2" size={20} className="text-blue-400" />}
              />
              <DataItem
                label="Calidad Aire"
                value={
                  currentData.sensorData
                    ? `${currentData.sensorData.airQuality}/100`
                    : "N/A"
                }
                icon={
                  <Icon
                    name="airQuality"
                    size={20}
                    className="text-green-400"
                  />
                }
              />
            </div>
          </div>
          <div className="lg:col-span-1 overflow-hidden rounded-xl shadow-2xl border border-emerald-400/20 group flex items-center justify-center">
            {imageDisplay}
          </div>
        </div>

        <div className="mt-6">
          <EnvironmentalTabs sensorData={currentData.sensorData} />
        </div>

        <div className="lg:col-span-1 mt-6">
          <TipsCarousel sensorData={currentData.sensorData} />
        </div>

        {/*
          <div className="lg:col-span-2 overflow-hidden rounded-xl shadow-2xl border border-emerald-400/20 group flex items-center justify-center">
            {imageDisplay}
          </div>
        */}

        {/* Botones flotantes */}
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={() => navigate("/ranking")}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Icon
              name="trophy"
              size={20}
              className="text-white relative z-10"
            />
            <span className="text-white font-medium relative z-10">
              Ranking
            </span>
          </button>

          <button
            onClick={() => navigate("/mapa")}
            className="px-5 py-3 bg-gray-800 hover:bg-gray-700 border border-emerald-400/30 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Icon
              name="map"
              size={20}
              className="text-emerald-400 relative z-10"
            />
            <span className="text-emerald-400 font-medium relative z-10">
              Mapa
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default MeasurerPage;
