import { useState } from "react";
import {
  getOrganizedRecommendations,
  getCategoryInfo,
  getSeverityStyle,
} from "../utils/Recommendations";
import { Icon } from "./Icons";

const TabButton = ({ active, onClick, title, hasRecommendations }) => {
  const categoryInfo = getCategoryInfo(title);

  return (
    <button
      onClick={onClick}
      disabled={!hasRecommendations}
      className={`
        relative px-4 py-3 font-medium transition-all duration-300 flex items-center
        min-w-[120px] justify-center flex-1 group
        ${
          active
            ? "text-emerald-300 bg-emerald-500/10 border-b-2 border-emerald-400"
            : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
        }
        ${!hasRecommendations ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div className="flex flex-col items-center">
        <Icon
          name={categoryInfo.iconName}
          size={20}
          className={`mb-1 transition-transform duration-300 ${
            active
              ? "text-emerald-400 scale-110"
              : "text-gray-400 group-hover:text-emerald-300"
          }`}
        />
        <span className="text-xs font-semibold">{categoryInfo.title}</span>
      </div>

      {hasRecommendations && !active && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
      )}
    </button>
  );
};

const RecommendationCard = ({ recommendation }) => {
  const getSeverityIcon = (severity) => {
    const icons = {
      high: "alert",
      medium: "warning",
      low: "success",
    };
    return icons[severity] || "info";
  };

  return (
    <div
      className={`p-4 rounded-xl mb-3 border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getSeverityStyle(
        recommendation.severity
      )}`}
    >
      <div className="flex items-start">
        <div
          className={`p-2 rounded-lg mr-3 ${
            recommendation.severity === "high"
              ? "bg-red-500/20"
              : recommendation.severity === "medium"
              ? "bg-amber-500/20"
              : "bg-emerald-500/20"
          }`}
        >
          <Icon
            name={getSeverityIcon(recommendation.severity)}
            size={20}
            className={
              recommendation.severity === "high"
                ? "text-red-400"
                : recommendation.severity === "medium"
                ? "text-amber-400"
                : "text-emerald-400"
            }
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-white leading-relaxed">
            {recommendation.message}
          </p>
          <div className="flex items-center mt-2 text-xs text-gray-400">
            <Icon name="time" size={12} className="mr-1" />
            <span>
              {recommendation.severity === "high"
                ? "Recomendación importante"
                : recommendation.severity === "medium"
                ? "Recomendación sugerida"
                : "Condición favorable"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnvironmentalTabs = ({ sensorData }) => {
  const [activeTab, setActiveTab] = useState("calidadAire");
  const organizedRecommendations = getOrganizedRecommendations(sensorData);

  if (!sensorData) {
    return (
      <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-emerald-900/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-400/30 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const tabs = Object.entries(organizedRecommendations)
    .filter(([_, recs]) => recs.length > 0)
    .map(([type]) => type);

  if (tabs.length === 0) return null;

  // Orden preferido de pestañas
  const tabOrder = ["calidadAire", "temperature", "co2"];
  const orderedTabs = tabOrder.filter((type) => tabs.includes(type));

  return (
    <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-emerald-900/20 backdrop-blur-lg rounded-2xl overflow-hidden border border-emerald-400/30 shadow-2xl hover:shadow-2xl transition-all duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-transparent p-5 border-b border-emerald-400/20">
        <div className="flex items-center">
          <div className="bg-emerald-500/20 p-2 rounded-xl mr-3">
            <Icon name="idea" size={24} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                Recomendaciones:
              </span>
            </h2>
            <p className="text-emerald-200/70 text-sm mt-1">
              Basado en condiciones actuales de la zona
            </p>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="flex border-b border-gray-700/50 bg-gray-800/30">
        {orderedTabs.map((type) => {
          const hasRecommendations = organizedRecommendations[type]?.length > 0;

          return (
            <TabButton
              key={type}
              active={activeTab === type}
              onClick={() => setActiveTab(type)}
              title={type}
              hasRecommendations={hasRecommendations}
            />
          );
        })}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="p-5 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
        {organizedRecommendations[activeTab]?.length > 0 ? (
          organizedRecommendations[activeTab].map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-700/30 p-4 rounded-xl inline-block">
              <Icon
                name="check"
                size={32}
                className="text-emerald-400 mx-auto mb-2"
              />
              <p className="text-gray-300">Condiciones óptimas</p>
              <p className="text-gray-400 text-sm mt-1">
                No se requieren acciones específicas
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resumen de datos */}
      <div className="px-5 pb-4 pt-3 bg-gradient-to-t from-gray-900/60 to-transparent border-t border-gray-700/30">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center bg-gray-800/40 p-2 rounded-lg">
            <Icon name="temperature" size={14} className="text-red-400 mr-2" />
            <span className="text-white">{sensorData.temperature}°C</span>
          </div>
          <div className="flex items-center bg-gray-800/40 p-2 rounded-lg">
            <Icon name="airQuality" size={14} className="text-green-400 mr-2" />
            <span className="text-white">{sensorData.airQuality}/100</span>
          </div>
          <div className="flex items-center bg-gray-800/40 p-2 rounded-lg">
            <Icon name="co2" size={14} className="text-blue-400 mr-2" />
            <span className="text-white">{sensorData.co2}ppm</span>
          </div>
          <div className="flex items-center bg-gray-800/40 p-2 rounded-lg">
            <Icon name="time" size={14} className="text-gray-400 mr-2" />
            <span className="text-white">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalTabs;
