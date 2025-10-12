// EnvironmentalGauge.jsx (Modificado)

import { GaugeComponent } from "react-gauge-component";
import { PercentageCalculation } from "../utils/PercentageCalculation.js";
import { useState, useEffect } from "react";
import { Icon } from "./Icons.jsx";

export const EnvironmentalGauge = ({ data }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  // 💡 1. Definir si hay datos válidos
  const hasValidData = data && typeof data.temperature === 'number';

  useEffect(() => {
    let finalValue = 0;

    if (hasValidData) {
      // Calcular porcentaje solo si hay datos válidos
      finalValue = PercentageCalculation(data);
    }

    // Animación (se usa 0 si no hay datos válidos)
    const timer = setTimeout(() => {
      setAnimatedValue(finalValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [data, hasValidData]); // 💡 Agregar hasValidData a las dependencias

  // 💡 2. Determinar estado y color para la UI
  const status = hasValidData ? (
    animatedValue >= 70
      ? { text: "Saludable", color: "green", icon: "success" }
      : animatedValue >= 40
        ? { text: "Moderado", color: "amber", icon: "warning" }
        : { text: "Peligroso", color: "red", icon: "alert" }
  ) : { text: "Sin Datos", color: "gray", icon: "warning" };

  const statusClasses = hasValidData
    ? `text-${status.color}-400 bg-${status.color}-400/10 animate-pulse`
    : `text-${status.color}-400 bg-${status.color}-400/10`;

  // 💡 3. Bloqueo visual si no hay datos
  const isBlocked = !hasValidData;

  return (
    <div className="h-full border-4 border-emerald-700 bg-gradient-to-tr from-gray-900 to-emerald-900 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg relative">
      {/* Bloqueador visual si no hay datos */}
      {isBlocked && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl z-10 backdrop-blur-sm">
          <p className="text-xl text-white font-bold animate-pulse">
            Medidor inactivo o sin lecturas
          </p>
        </div>
      )}

      <div className={`w-full max-w-xs ${isBlocked ? 'opacity-50' : ''}`}>
        <GaugeComponent
          value={animatedValue}
          minValue={0}
          maxValue={100}
          arc={{
            subArcs: [
              { limit: 40, color: "#DC2626", showTick: true },
              { limit: 70, color: "#F59E0B", showTick: true },
              { color: "#10B981", showTick: true },
            ],
            gradient: false,
            padding: 0.03,
            width: 0.25,
          }}
          pointer={{
            type: "arrow",
            color: "#1F2937",
            elastic: true,
            animationDelay: 0,
            animationDuration: 2000,
            length: 0.7,
          }}
          labels={{
            valueLabel: {
              // Si no hay datos, muestra 'N/A' o '0/100'
              formatTextValue: (value) => hasValidData ? `${Math.round(value)}/100` : `N/A`,
              style: {
                fontSize: "30px",
                fontWeight: "bold",
                fill: "white",
              },
            },
          }}
        />

        <div className="text-center mt-6">
          <h2 className="text-2xl font-bold text-white">Medición ambiente</h2>
          <p
            className={`text-lg mt-2 font-semibold px-2 py-1 rounded-md inline-flex items-center ${statusClasses}`}
          >
            <Icon
              name={status.icon}
              size={16}
              className="mr-1.5"
            />
            {status.text}
          </p>
        </div>
      </div>
    </div>
  );
};
