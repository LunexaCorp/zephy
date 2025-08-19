import { useState } from "react";
import {
  getOrganizedRecommendations,
  getCategoryInfo,
  getSeverityStyle,
  getSeverityIcon,
} from "../utils/Recommendations";

const TabButton = ({ active, onClick, icon, title }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
      active
        ? "bg-emerald-500/30 text-white border-t border-l border-r border-emerald-400/50"
        : "bg-gray-700/50 text-gray-400 hover:text-gray-300"
    }`}
  >
    <span className="mr-2">{icon}</span>
    {title}
  </button>
);

const EnvironmentalTabs = ({ sensorData }) => {
  const [activeTab, setActiveTab] = useState("airQuality");
  const organizedRecommendations = getOrganizedRecommendations(sensorData);

  if (!sensorData) {
    return <div>Cargando...</div>;
  }

  const tabs = Object.entries(organizedRecommendations)
    .filter(([_, recs]) => recs.length > 0)
    .map(([type]) => type);

  if (tabs.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-emerald-900/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-emerald-400/20">
      <h2 className="flex items-center text-xl font-bold text-emerald-400 mb-4">
        <span className="inline-block w-2 h-6 bg-emerald-500 mr-3 rounded"></span>
        <span>Recomendaciones Ambientales</span>
      </h2>
      {/* Navegación por pestañas */}
      <div className="flex border-b border-gray-700">
        {tabs.map((type) => {
          const categoryInfo = getCategoryInfo(type);
          return (
            <TabButton
              key={type}
              active={activeTab === type}
              onClick={() => setActiveTab(type)}
              icon={categoryInfo.icon}
              title={categoryInfo.title}
            />
          );
        })}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="p-4">
        {organizedRecommendations[activeTab].map((rec) => (
          <div
            key={rec.id}
            className={`p-3 rounded-lg mb-2 border ${getSeverityStyle(
              rec.severity
            )}`}
          >
            <div className="flex items-start">
              <span className="text-lg mr-2 mt-0.5">
                {getSeverityIcon(rec.severity)}
              </span>
              <p className="text-sm">{rec.message}</p>
            </div>
          </div>
        ))}

        {organizedRecommendations[activeTab].length === 0 && (
          <p className="text-gray-400 text-center py-4">
            No hay recomendaciones para esta categoría
          </p>
        )}
      </div>

      {/* Resumen de datos */}
      <div className="px-4 pb-3 pt-2 bg-gray-900/50 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
          <div>🌡️ {sensorData.temperature}°C</div>
          <div>🍃 {sensorData.airQuality}/100</div>
          <div>☁️ {sensorData.co2}ppm</div>
          <div>🕒 {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalTabs;
