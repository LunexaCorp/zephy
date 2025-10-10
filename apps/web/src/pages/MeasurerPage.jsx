import { useNavigate } from "react-router-dom";
import { useMeasurerData } from "../hooks/useMeasurerData.js";

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
  const { dashboardData, locations, loading, error, currentLocation, setCurrentLocation } = useMeasurerData();

  if (loading)
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Loader />
      </div>
    );

  const currentData = dashboardData || {
    locationName: "Cargando...",
    sensorData: { temperature: 0, co2: 0, airQuality: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900">
      <MeasurerHeader {...{ locations, currentLocation, setCurrentLocation }} />

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
