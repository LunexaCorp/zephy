export const PercentageCalculation = (sensorData) => {
  if (!sensorData) return 0;

  // Valores de referencia (ajústalos según tus necesidades científicas)
  const REFERENCE = {
    TEMP_MAX: 40, // °C (temperaturas superiores son peligrosas)
    CO2_MAX: 1000, // ppm (niveles peligrosos según OSHA)
    AIR_QUALITY_MAX: 100, // Índice de calidad del aire (0-100)
  };

  // Normalización con ajuste científico
  const normalize = (value, max, inverse = false) => {
    const normalized = Math.min(value / max, 1);
    return inverse ? 1 - normalized : normalized;
  };

  // Cálculos con ponderación científica (ajustable)
  const score =
    normalize(sensorData.temperature, REFERENCE.TEMP_MAX, true) * 0.4 + // 40% peso
    normalize(sensorData.co2, REFERENCE.CO2_MAX, true) * 0.3 + // 30% peso
    normalize(sensorData.airQuality, REFERENCE.AIR_QUALITY_MAX) * 0.3; // 30% peso

  return Math.round(score * 100); // Convertir a porcentaje
};

export const getColorByPercentage = (percentage) => {
  // Escala cromática profesional
  if (percentage >= 80) return "#10B981"; // Verde-500 (Excelente)
  if (percentage >= 60) return "#84CC16"; // Verde-lima (Bueno)
  if (percentage >= 40) return "#F59E0B"; // Ámbar (Moderado)
  if (percentage >= 20) return "#EF4444"; // Rojo-500 (Pobre)
  return "#7C2D12"; // Rojo-900 (Peligroso)
};
