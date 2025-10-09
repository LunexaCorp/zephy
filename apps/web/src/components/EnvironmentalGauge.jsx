import { GaugeComponent } from "react-gauge-component";
import { PercentageCalculation } from "../utils/PercentageCalculation.js";
import { useState, useEffect } from "react";
import { Icon } from "./Icons";

export const EnvironmentalGauge = ({ data }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(PercentageCalculation(data));
    }, 500);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className=" border-4 border-emerald-700 bg-gradient-to-tr from-gray-900 to-emerald-900 rounded-2xl p-6 h-96 flex flex-col items-center justify-center shadow-lg">
      <div className="w-full max-w-xs">
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
            gradient: false, //gradiente en el arco
            padding: 0.03,
            width: 0.25,
          }}
          pointer={{
            type: "arrow",
            color: "#1F2937",
            elastic: true, //modo elastico
            animationDelay: 0,
            animationDuration: 2000,
            length: 0.7,
          }}
          labels={{
            valueLabel: {
              formatTextValue: (value) => `${Math.round(value)}/100`,
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
            className={`text-lg mt-2 font-semibold px-2 py-1 rounded-md inline-flex items-center animate-pulse ${
              animatedValue >= 70
                ? "text-green-400 bg-green-400/10"
                : animatedValue >= 40
                ? "text-amber-400 bg-amber-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
          >
            <Icon
              name={
                animatedValue >= 70
                  ? "success"
                  : animatedValue >= 40
                  ? "warning"
                  : "alert"
              }
              size={16}
              className="mr-1.5"
            />
            {animatedValue >= 70
              ? "Saludable"
              : animatedValue >= 40
              ? "Moderado"
              : "Peligroso"}
          </p>
        </div>
      </div>
    </div>
  );
};
