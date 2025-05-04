import { GaugeComponent } from 'react-gauge-component'
import { PercentageCalculation } from '../utils/PercentageCalculation.js';
import { useState, useEffect } from 'react';


export const EnvironmentalGauge = ({ data }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {

    const calculateIndex = () => {
      const { temperature, co2, airQuality } = data;

      const maxValues = {
        temperature: 40,  // >40°C = peligroso
        co2: 1000,       // >1000ppm = peligroso
        airQuality: 100   // Escala 0-100 (a mayor = mejor)
      };

      const normalizedTemp = 1 - Math.min(temperature / maxValues.temperature, 1);
      const normalizedCO2 = 1 - Math.min(co2 / maxValues.co2, 1);
      const normalizedAir = airQuality / maxValues.airQuality;

      return (
        (normalizedTemp * 0.4 +
          normalizedCO2 * 0.3 +
          normalizedAir * 0.3) * 100
      );
    };


    const timer = setTimeout(() => {
      setAnimatedValue(PercentageCalculation(data));//calculateIndex()
    }, 500);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className=" border-4 border-emerald-200 bg-emerald-500 rounded-2xl p-6 h-96 flex flex-col items-center justify-center">
      <div className="w-full max-w-xs">
        <GaugeComponent
          value={animatedValue}
          minValue={0}
          maxValue={100}
          arc={{
            subArcs: [
              { limit: 40, color: '#EF4444' },
              { limit: 70, color: '#F59E0B' },
              { color: '#10B981' }
            ],
            gradient: true
          }}
          pointer={{
            type: "arrow",
            color: "#4B5563",
            elastic: true,
            animationDelay: 0,
            animationDuration: 2000
          }}
          labels={{
            valueLabel: { formatTextValue: value => `${Math.round(value)}/100` }
          }}
        />

        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-white">
            Medidor Ambiental
          </h2>
          <p className={`text-xl mt-2 font-semibold ${animatedValue >= 70 ? "text-green-600" :
            animatedValue >= 40 ? "text-amber-600" : "text-red-600"
            }`}>
            {animatedValue >= 70 ? "✅ Saludable" :
              animatedValue >= 40 ? "⚠️ Moderado" : "❌ Peligroso"}
          </p>
        </div>
      </div>
    </div>
  );
};
