import { useState, useEffect } from "react";
import { Tips, getTipCardStyle } from "../utils/Tips.js";
import { Icon } from "./Icons.jsx"; // Importamos nuestro componente de iconos

const TipCard = ({ tip, isActive }) => (
  <div
    className={`
    relative rounded-2xl p-6 shadow-2xl border-2 backdrop-blur-lg transition-all duration-700 transform
    ${getTipCardStyle(tip.severity)}
    ${
      isActive
        ? "scale-105 opacity-100 z-10 shadow-2xl ring-2 ring-white/20"
        : "scale-95 opacity-70 z-0 blur-[1px]"
    }
    hover:shadow-3xl hover:scale-[1.03] hover:opacity-100
    overflow-hidden
  `}
  >
    {/* Efecto de brillo en tarjeta activa */}
    {isActive && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
    )}

    <div className="flex items-start mb-5">
      <div
        className={`p-3 rounded-xl mr-4 ${
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
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{tip.title}</h3>
        <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full"></div>
      </div>
    </div>

    <p className="text-gray-200 leading-relaxed text-sm pl-16">{tip.content}</p>

    {/* Indicador de severidad */}
    <div
      className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
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
  <div className="flex justify-center space-x-3 mt-8">
    {Array.from({ length: count }).map((_, index) => (
      <button
        key={index}
        onClick={() => onSelect(index)}
        className={`w-4 h-4 rounded-full transition-all duration-300 relative group ${
          index === activeIndex
            ? "bg-emerald-400 scale-125 ring-2 ring-emerald-400/30"
            : "bg-gray-600 hover:bg-gray-500"
        }`}
        aria-label={`Ir a consejo ${index + 1}`}
      >
        {/* Tooltip */}
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Consejo {index + 1}
        </span>
      </button>
    ))}
  </div>
);

const TipsCarousel = ({ sensorData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tips = Tips(sensorData);

  // Auto-rotación cada 8 segundos (pausable)
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
      <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-emerald-900/20 backdrop-blur-lg rounded-2xl p-8 border border-emerald-400/30 shadow-2xl">
        <div className="flex items-center mb-6">
          <div className="bg-emerald-500/20 p-2 rounded-xl mr-3">
            <Icon name="idea" size={24} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Consejos Prácticos</h2>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-700/50 rounded-xl mb-4"></div>
          <div className="flex justify-center space-x-3">
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-emerald-900/20 backdrop-blur-lg rounded-2xl p-8 border border-emerald-400/30 shadow-2xl hover:shadow-3xl transition-all duration-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header con icono */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-emerald-500/20 p-2 rounded-xl mr-3">
            <Icon name="idea" size={24} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Consejos Prácticos</h2>
            <p className="text-emerald-200/70 text-sm">
              Basado en condiciones actuales
            </p>
          </div>
        </div>

        {/* Contador */}
        <div className="bg-gray-800/50 px-3 py-1 rounded-full text-xs text-gray-400">
          {activeIndex + 1} / {tips.length}
        </div>
      </div>

      {/* Carrusel */}
      <div className="relative h-72 overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          <div className="flex w-full h-full">
            {tips.map((tip, index) => (
              <div key={tip.id} className="w-full flex-shrink-0 px-3">
                <TipCard tip={tip} isActive={index === activeIndex} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between mt-8">
        <NavigationDots
          count={tips.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />

        {/* Controles de navegación mejorados */}
        {tips.length > 1 && (
          <div className="flex space-x-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-gray-700 hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110 group"
              aria-label="Consejo anterior"
            >
              <Icon
                name="prev"
                size={18}
                className="text-gray-300 group-hover:text-white"
              />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-gray-700 hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110 group"
              aria-label="Siguiente consejo"
            >
              <Icon
                name="next"
                size={18}
                className="text-gray-300 group-hover:text-white"
              />
            </button>
          </div>
        )}
      </div>

      {/* Indicador de pausa automática */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center text-xs text-gray-500">
          <Icon name="time" size={12} className="mr-1" />
          <span>Rotación automática {isPaused ? "pausada" : "activada"}</span>
        </div>
      </div>
    </div>
  );
};

export default TipsCarousel;
