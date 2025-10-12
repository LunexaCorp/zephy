import { useState, useEffect } from "react";
import { Tips, getTipCardStyle } from "../utils/Tips.js";
import { Icon } from "./Icons.jsx";

const TipCard = ({ tip, isActive }) => (
  <div
    className={`
    relative rounded-2xl p-6 shadow-lg border backdrop-blur-lg transition-all duration-500
    ${getTipCardStyle(tip.severity)}
    ${isActive ? "opacity-100" : "opacity-60"}
    hover:opacity-100
    h-full flex flex-col
  `}
  >
    <div className="flex items-start gap-4 mb-4">
      <div
        className={`p-3 rounded-xl flex-shrink-0 ${
          tip.severity === "info"
            ? "bg-blue-500/20"
            : tip.severity === "advice"
              ? "bg-emerald-500/20"
              : tip.severity === "warning"
                ? "bg-amber-500/20"
                : "bg-red-500/20"
        }`}
      >
        <Icon name={tip.icon} size={24} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full"></div>
      </div>
    </div>

    <p className="text-gray-200 leading-relaxed text-sm flex-1">{tip.content}</p>

    <div
      className={`mt-4 px-3 py-1 rounded-full text-xs font-medium inline-block self-end ${
        tip.severity === "info"
          ? "bg-blue-500/30 text-blue-200"
          : tip.severity === "advice"
            ? "bg-emerald-500/30 text-emerald-200"
            : tip.severity === "warning"
              ? "bg-amber-500/30 text-amber-200"
              : "bg-red-500/30 text-red-200"
      }`}
    >
      {tip.severity === "info"
        ? "Informativo"
        : tip.severity === "advice"
          ? "Consejo"
          : tip.severity === "warning"
            ? "Advertencia"
            : "Crítico"}
    </div>
  </div>
);

const NavigationDots = ({ count, activeIndex, onSelect }) => (
  <div className="flex justify-center gap-2">
    {Array.from({ length: count }).map((_, index) => (
      <button
        key={index}
        onClick={() => onSelect(index)}
        className={`transition-all duration-300 rounded-full ${
          index === activeIndex
            ? "w-8 h-3 bg-emerald-400"
            : "w-3 h-3 bg-gray-600 hover:bg-gray-500"
        }`}
        aria-label={`Ir a consejo ${index + 1}`}
      />
    ))}
  </div>
);

const TipsCarousel = ({ sensorData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tips = Tips(sensorData);

  useEffect(() => {
    if (tips.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [tips.length, isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (!tips.length) {
    return (
      <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-emerald-900/20 backdrop-blur-lg rounded-2xl p-8 border border-emerald-400/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500/20 p-2 rounded-xl">
            <Icon name="idea" size={24} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Consejos Prácticos</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-700/50 rounded-xl"></div>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-emerald-900/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-400/30 shadow-xl hover:shadow-2xl transition-shadow duration-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl">
            <Icon name="idea" size={24} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Consejos Prácticos</h2>
            <p className="text-emerald-200/70 text-xs">
              Basado en condiciones actuales
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 px-3 py-1 rounded-full text-xs text-gray-400">
          {activeIndex + 1} / {tips.length}
        </div>
      </div>

      {/* Tarjeta activa */}
      <div className="mb-6 min-h-[240px]">
        {tips[activeIndex] ? (
          <TipCard tip={tips[activeIndex]} isActive={true} />
        ) : (
          <div className="text-gray-400 text-center py-8">
            No hay consejos disponibles.
          </div>
        )}
      </div>


      {/* Navegación */}
      <div className="flex items-center justify-between">
        <NavigationDots
          count={tips.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />

        {tips.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-gray-700 hover:bg-emerald-600 transition-colors duration-300"
              aria-label="Consejo anterior"
            >
              <Icon name="prev" size={18} className="text-white" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-gray-700 hover:bg-emerald-600 transition-colors duration-300"
              aria-label="Siguiente consejo"
            >
              <Icon name="next" size={18} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Indicador de estado */}
      <div className="flex items-center justify-center mt-4 gap-1 text-xs text-gray-500">
        <Icon name="time" size={12} />
        <span>Rotación {isPaused ? "pausada" : "automática"}</span>
      </div>
    </div>
  );
};

export default TipsCarousel;
