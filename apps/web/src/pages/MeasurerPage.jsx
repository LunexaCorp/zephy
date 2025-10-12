import { useNavigate } from "react-router-dom";
import { useMeasurerData } from "../hooks/useMeasurerData.js";
import { useEffect } from "react"; // <--- asegúrate de importar esto

import Loader from "../components/common/Loader.jsx";
import MeasurerHeader from "../components/measurer/MeasurerHeader.jsx";
import DataPanel from "../components/measurer/DataPanel.jsx";
import MeasurerImage from "../components/measurer/MeasurerImage.jsx";
import MeasurerButtons from "../components/measurer/MeasurerButtons.jsx";
import { EnvironmentalGauge } from "../components/EnvironmentalGauge.jsx";
import EnvironmentalTabs from "../components/EnvironmentalTabs.jsx";
import TipsCarousel from "../components/TipsCarousel.jsx";

const MeasurerPage = () => {

  const navigate = useNavigate();
  const {
    dashboardData,
    locations,
    loading,
    error,
    currentLocation,
    setCurrentLocation,
  } = useMeasurerData();

  // 1. localStorage al montar el componente
  useEffect(() => {
    const storedLocationId = localStorage.getItem("selectedLocationId");
    // Si hay un ID guardado y aún no hemos establecido una ubicación actual
    if (storedLocationId && !currentLocation) {
      setCurrentLocation(storedLocationId);
    }
  }, []);

  // 2. Efecto para guardar en localStorage
  useEffect(() => {
    const locationIdToStore = currentLocation?.id || currentLocation;

    if (locationIdToStore) {
      localStorage.setItem("selectedLocationId", locationIdToStore);
    }
  }, [currentLocation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Loader/>
      </div>
    );
  }

  // Si hay error y no hay datos, mostrar mensaje
  if (error && !dashboardData) {
    return (
      <div
        className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-gray-900 to-emerald-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-2">Sin datos disponibles</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Datos seguros con valores por defecto
  const currentData = dashboardData || {
    locationName: "Sin datos",
    sensorData: {temperature: 0, humidity: 0, airQuality: 0},
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900">
      <MeasurerHeader {...{ locations, currentLocation, setCurrentLocation }} />

      {/* Mostrar advertencia si hay error pero sí hay datos */}
      {error && dashboardData && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-lg">
            <strong>⚠️ Advertencia:</strong> {error}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1 h-full flex">
            <div className="w-full h-full">
              <EnvironmentalGauge data={currentData.sensorData} />
            </div>
          </div>

          <div className="lg:col-span-1 h-full flex">
            <div className="w-full h-full">
              <DataPanel currentData={currentData} />
            </div>
          </div>

          <div className="lg:col-span-1 h-full flex">
            <div className="w-full h-full">
              <MeasurerImage currentData={currentData} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <EnvironmentalTabs sensorData={currentData.sensorData} />
        </div>

        <div className="mt-6 mb-20">
          <TipsCarousel sensorData={currentData.sensorData} />
        </div>

        <MeasurerButtons navigate={navigate} />
      </main>
    </div>
  );
};

export default MeasurerPage;
