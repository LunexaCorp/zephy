// ../utils/PercentageCalculation.js
// VERSIÓN CORREGIDA PARA PUERTO MALDONADO, PERÚ
// Sensores: DHT11 (temperatura/humedad) + MQ135 (calidad del aire)

/**
 * Normaliza un valor entre 0 y 1 (usado para CO₂ donde más es peor)
 * @param {number} value - Valor actual del sensor
 * @param {number} min - Valor mínimo aceptable (baseline)
 * @param {number} max - Valor máximo antes de salud crítica
 * @returns {number} Puntuación normalizada (0 a 1)
 */
const normalizeInverse = (value, min, max) => {
  if (value <= min) return 1; // Excelente: aire limpio
  if (value >= max) return 0; // Peligroso: límite crítico

  // Interpolación lineal inversa
  return 1 - (value - min) / (max - min);
};

/**
 * Normaliza un valor usando un RANGO ÓPTIMO con degradación gradual
 * @param {number} value - Valor del sensor
 * @param {number} optimalMin - Límite inferior ideal
 * @param {number} optimalMax - Límite superior ideal
 * @param {number} toleranceLow - Distancia hacia abajo antes de 0%
 * @param {number} toleranceHigh - Distancia hacia arriba antes de 0%
 * @returns {number} Puntuación normalizada (0 a 1)
 */
const normalizeOptimalRange = (value, optimalMin, optimalMax, toleranceLow, toleranceHigh) => {
  // Dentro del rango óptimo = 100%
  if (value >= optimalMin && value <= optimalMax) {
    return 1;
  }

  // Por debajo del rango óptimo
  if (value < optimalMin) {
    const lowFailure = optimalMin - toleranceLow;
    if (value <= lowFailure) return 0;
    return (value - lowFailure) / (optimalMin - lowFailure);
  }

  // Por encima del rango óptimo
  if (value > optimalMax) {
    const highFailure = optimalMax + toleranceHigh;
    if (value >= highFailure) return 0;
    return (highFailure - value) / (highFailure - optimalMax);
  }

  return 0;
};

/**
 * FUNCIÓN PRINCIPAL: Calcula el porcentaje de salud ambiental
 * Adaptado para Puerto Maldonado con sensores DHT11 y MQ135
 */
export const PercentageCalculation = (sensorData) => {
  if (!sensorData) return 0;

  // ═══════════════════════════════════════════════════════════
  // CONFIGURACIÓN DE PESOS DINÁMICOS
  // ═══════════════════════════════════════════════════════════
  const BASE_WEIGHTS = {
    temperature: 0.30,  // 30% del peso total
    humidity: 0.30,     // 30% del peso total
    airQuality: 0.40,   // 40% del peso total (más crítico para salud)
  };

  // ═══════════════════════════════════════════════════════════
  // PARÁMETROS DE REFERENCIA CIENTÍFICOS
  // ═══════════════════════════════════════════════════════════
  const REFERENCE = {
    // ─────────────────────────────────────────────────────────
    // TEMPERATURA (DHT11 - Precisión ±2°C)
    // ─────────────────────────────────────────────────────────
    // Rango óptimo: 22-26°C (confort térmico tropical)
    // Puerto Maldonado: Clima tropical cálido (18-32°C típico)
    // Tolerancia adaptada a condiciones locales
    TEMP_MIN: 22,           // Límite inferior de confort
    TEMP_MAX: 26,           // Límite superior de confort
    TEMP_TOLERANCE_LOW: 10,  // 22-10=12°C → 0% salud (frío extremo)
    TEMP_TOLERANCE_HIGH: 12, // 26+12=38°C → 0% salud (calor extremo)

    // ─────────────────────────────────────────────────────────
    // HUMEDAD RELATIVA (DHT11 - Precisión ±5%)
    // ─────────────────────────────────────────────────────────
    // Rango óptimo: 50-70% (confort en trópico húmedo)
    // Puerto Maldonado: Humedad alta (60-90% frecuente)
    HUM_MIN: 50,            // Límite inferior ideal
    HUM_MAX: 70,            // Límite superior ideal
    HUM_TOLERANCE_LOW: 30,   // 50-30=20% → 0% salud (muy seco)
    HUM_TOLERANCE_HIGH: 25,  // 70+25=95% → 0% salud (saturación)

    // ─────────────────────────────────────────────────────────
    // CALIDAD DEL AIRE - CO₂ (MQ135 - Analógico)
    // ─────────────────────────────────────────────────────────
    // Baseline: 400-450 ppm (aire exterior limpio)
    // ASHRAE: <1000 ppm (aceptable en interiores)
    // OMS/ACGIH: >2000 ppm (problemas cognitivos)
    // Peligro: >5000 ppm (TWA industrial máximo)
    CO2_MIN: 400,     // Aire limpio exterior (100% salud)
    CO2_WARNING: 1000, // Umbral ASHRAE (buena ventilación)
    CO2_POOR: 2000,    // Problemas de concentración/fatiga
    CO2_DANGER: 5000,  // Límite seguridad industrial (0% salud)
  };

  // ═══════════════════════════════════════════════════════════
  // CÁLCULO DE PUNTUACIONES CON VALIDACIÓN ROBUSTA
  // ═══════════════════════════════════════════════════════════

  let totalScore = 0;
  let activeWeights = 0;

  // ───────────────────────────────────────────────────────────
  // 🌡️ TEMPERATURA
  // ───────────────────────────────────────────────────────────
  const isTempValid =
    typeof sensorData.temperature === 'number' &&
    !isNaN(sensorData.temperature) &&
    sensorData.temperature >= -40 && // Límite físico DHT11
    sensorData.temperature <= 80;    // Límite físico DHT11

  if (isTempValid) {
    const tempScore = normalizeOptimalRange(
      sensorData.temperature,
      REFERENCE.TEMP_MIN,
      REFERENCE.TEMP_MAX,
      REFERENCE.TEMP_TOLERANCE_LOW,
      REFERENCE.TEMP_TOLERANCE_HIGH
    );
    activeWeights += BASE_WEIGHTS.temperature;
    totalScore += tempScore * BASE_WEIGHTS.temperature;
  }

  // ───────────────────────────────────────────────────────────
  // 💧 HUMEDAD RELATIVA
  // ───────────────────────────────────────────────────────────
  const isHumValid =
    typeof sensorData.humidity === 'number' &&
    !isNaN(sensorData.humidity) &&
    sensorData.humidity > 0 &&  // ← Ya lo tienes
    sensorData.humidity < 100;

  if (isHumValid) {
    const humScore = normalizeOptimalRange(
      sensorData.humidity,
      REFERENCE.HUM_MIN,
      REFERENCE.HUM_MAX,
      REFERENCE.HUM_TOLERANCE_LOW,
      REFERENCE.HUM_TOLERANCE_HIGH
    );
    activeWeights += BASE_WEIGHTS.humidity;
    totalScore += humScore * BASE_WEIGHTS.humidity;
  }

  // ───────────────────────────────────────────────────────────
  // 🌫️ CALIDAD DEL AIRE (CO₂ - MQ135)
  // ───────────────────────────────────────────────────────────
  // El MQ135 devuelve un valor analógico (0-1023) que debe convertirse
  // a PPM mediante calibración. Aquí asumimos que recibes PPM ya convertido.
  const isAQValid =
    typeof sensorData.airQuality === 'number' &&
    !isNaN(sensorData.airQuality) &&
    sensorData.airQuality >= 0;

  if (isAQValid) {
    let aqScore;

    if (sensorData.airQuality <= REFERENCE.CO2_MIN) {
      // Aire excepcional (exterior limpio)
      aqScore = 1;
    } else if (sensorData.airQuality <= REFERENCE.CO2_WARNING) {
      // Bueno: entre aire limpio y límite ASHRAE
      // Degradación suave: 400→1000 ppm = 100%→80%
      const range = REFERENCE.CO2_WARNING - REFERENCE.CO2_MIN;
      const excess = sensorData.airQuality - REFERENCE.CO2_MIN;
      aqScore = 1 - (0.2 * (excess / range));
    } else if (sensorData.airQuality <= REFERENCE.CO2_POOR) {
      // Moderado: ventilación insuficiente
      // 1000→2000 ppm = 80%→40%
      const range = REFERENCE.CO2_POOR - REFERENCE.CO2_WARNING;
      const excess = sensorData.airQuality - REFERENCE.CO2_WARNING;
      aqScore = 0.8 - (0.4 * (excess / range));
    } else if (sensorData.airQuality <= REFERENCE.CO2_DANGER) {
      // Pobre a peligroso: efectos en salud
      // 2000→5000 ppm = 40%→0%
      const range = REFERENCE.CO2_DANGER - REFERENCE.CO2_POOR;
      const excess = sensorData.airQuality - REFERENCE.CO2_POOR;
      aqScore = 0.4 - (0.4 * (excess / range));
    } else {
      // Crítico: >5000 ppm
      aqScore = 0;
    }

    activeWeights += BASE_WEIGHTS.airQuality;
    totalScore += aqScore * BASE_WEIGHTS.airQuality;
  }

  // ═══════════════════════════════════════════════════════════
  // NORMALIZACIÓN Y RESULTADO FINAL
  // ═══════════════════════════════════════════════════════════

  if (activeWeights === 0) {
    return 0; // Sin sensores válidos
  }

  // Normalizar por el peso total de sensores activos
  const finalScoreNormalized = totalScore / activeWeights;

  // Retornar porcentaje entero (0-100)
  return Math.round(finalScoreNormalized * 100);
};

// ═══════════════════════════════════════════════════════════
// FUNCIÓN AUXILIAR: COLOR POR CATEGORÍA DE SALUD
// ═══════════════════════════════════════════════════════════
export const getColorByPercentage = (percentage) => {
  if (percentage >= 80) return "#10B981"; // Verde Esmeralda (Excelente)
  if (percentage >= 60) return "#84CC16"; // Lima (Bueno)
  if (percentage >= 40) return "#F59E0B"; // Ámbar (Moderado)
  if (percentage >= 20) return "#EF4444"; // Rojo (Pobre)
  return "#991B1B";                       // Rojo Oscuro (Peligroso)
};

// ═══════════════════════════════════════════════════════════
// FUNCIÓN AUXILIAR: ETIQUETA DESCRIPTIVA
// ═══════════════════════════════════════════════════════════
export const getHealthLabel = (percentage) => {
  if (percentage >= 80) return "Excelente";
  if (percentage >= 60) return "Bueno";
  if (percentage >= 40) return "Moderado";
  if (percentage >= 20) return "Pobre";
  return "Peligroso";
};
