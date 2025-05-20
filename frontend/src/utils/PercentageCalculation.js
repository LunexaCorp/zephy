export const PercentageCalculation = (data) => {
  const { temperature, co2, airQuality } = data;

  const maxValues = {
    temperature: 40,  // >40°C = peligroso
    co2: 1000,       // >1000ppm = peligroso
    airQuality: 100   // 0-100 (mayor = mejor)
  };

  // Normalización invertida para métricas negativas
  const normalizedTemp = 1 - Math.min(temperature / maxValues.temperature, 1);
  const normalizedCO2 = 1 - Math.min(co2 / maxValues.co2, 1);
  const normalizedAir = airQuality / maxValues.airQuality;

  return (
    (normalizedTemp * 0.4 +
     normalizedCO2 * 0.3 +
     normalizedAir * 0.3) * 100
  );
  /**
   *  return Math.round(
    (normalizedTemp * 0.4 +
     normalizedCO2 * 0.3 +
     normalizedAir * 0.3) * 100
  );
   */
};
