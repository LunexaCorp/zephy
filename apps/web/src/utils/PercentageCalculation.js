// ═══════════════════════════════════════════════════════════════════════
// EVALUACIÓN DE CALIDAD AMBIENTAL
// ═══════════════════════════════════════════════════════════════════════
// Basado en: ASHRAE 55-2020, OMS, ISO 7730
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE PESOS POR PARÁMETRO
// ───────────────────────────────────────────────────────────────────────
const SENSOR_WEIGHTS = {
  temperature: 0.30,  // 30% - Confort térmico
  humidity: 0.30,     // 30% - Confort higrotérmico
  airQuality: 0.40,   // 40% - Calidad del aire (mayor impacto en salud)
};

// ───────────────────────────────────────────────────────────────────────
// PARÁMETROS DE TEMPERATURA
// ───────────────────────────────────────────────────────────────────────
// Referencia: ASHRAE 55-2020 (Thermal Environmental Conditions)
// Adaptado para clima tropical de Puerto Maldonado
const TEMPERATURE_CONFIG = {
  OPTIMAL_MIN: 22,        // °C - Límite inferior de confort (ASHRAE 55)
  OPTIMAL_MAX: 26,        // °C - Límite superior de confort (ASHRAE 55)
  TOLERANCE_LOW: 10,      // °C - Margen hacia frío extremo (12°C mínimo)
  TOLERANCE_HIGH: 12,     // °C - Margen hacia calor extremo (38°C máximo)
  SENSOR_MIN: -40,        // °C - Límite físico del DHT11
  SENSOR_MAX: 80,         // °C - Límite físico del DHT11
};

// ───────────────────────────────────────────────────────────────────────
// PARÁMETROS DE HUMEDAD RELATIVA
// ───────────────────────────────────────────────────────────────────────
// Referencia: ISO 7730, OMS (WHO Housing and Health Guidelines)
// Adaptado para trópico húmedo (60-90% frecuente)
const HUMIDITY_CONFIG = {
  OPTIMAL_MIN: 50,        // % - Límite inferior confort (OMS: 40-70%)
  OPTIMAL_MAX: 70,        // % - Límite superior confort
  TOLERANCE_LOW: 30,      // % - Margen hacia sequedad (20% mínimo)
  TOLERANCE_HIGH: 25,     // % - Margen hacia saturación (95% máximo)
  SENSOR_MIN: 0,          // % - Límite físico del DHT11
  SENSOR_MAX: 100,        // % - Límite físico del DHT11
};

// ───────────────────────────────────────────────────────────────────────
// PARÁMETROS DE CALIDAD DEL AIRE (MQ135)
// ───────────────────────────────────────────────────────────────────────
// IMPORTANTE: El MQ135 es un sensor multi-gas (NH₃, NOx, alcohol, humo, VOCs)
// Umbrales basados en:
// - Curva característica del datasheet MQ135
// - Estudios de calidad del aire interior (Indoor Air Quality)
// - Adaptación experimental para ambientes tropicales
const AIR_QUALITY_CONFIG = {
  EXCELLENT: 500,         // Índice MQ135 - Aire muy limpio (exterior ventilado)
  GOOD: 1000,             // Buena calidad - Ventilación adecuada
  MODERATE: 2500,         // Moderada - Ventilación insuficiente
  POOR: 5000,             // Pobre - Contaminación notable
  HAZARDOUS: 8000,        // Peligroso - Alta contaminación
  SENSOR_MIN: 300,        // Límite práctico inferior del MQ135
  SENSOR_MAX: 10000,      // Límite práctico superior del MQ135
};

// ═══════════════════════════════════════════════════════════════════════
// FUNCIONES DE NORMALIZACIÓN
// ═══════════════════════════════════════════════════════════════════════

/**
 * Normaliza valores con rango óptimo central y degradación gradual
 * Usado para temperatura y humedad (ideal: estar dentro del rango)
 *
 * @param {number} value - Valor medido del sensor
 * @param {number} optimalMin - Límite inferior del rango óptimo
 * @param {number} optimalMax - Límite superior del rango óptimo
 * @param {number} toleranceLow - Distancia hacia abajo antes de score=0
 * @param {number} toleranceHigh - Distancia hacia arriba antes de score=0
 * @returns {number} Score normalizado entre 0 y 1
 */
const normalizeOptimalRange = (value, optimalMin, optimalMax, toleranceLow, toleranceHigh) => {
  // Dentro del rango óptimo → 100%
  if (value >= optimalMin && value <= optimalMax) {
    return 1.0;
  }

  // Por debajo del rango óptimo → degradación lineal
  if (value < optimalMin) {
    const failurePoint = optimalMin - toleranceLow;
    if (value <= failurePoint) return 0;
    return (value - failurePoint) / (optimalMin - failurePoint);
  }

  // Por encima del rango óptimo → degradación lineal
  if (value > optimalMax) {
    const failurePoint = optimalMax + toleranceHigh;
    if (value >= failurePoint) return 0;
    return (failurePoint - value) / (failurePoint - optimalMax);
  }

  return 0;
};

/**
 * Normaliza valores donde "menos es mejor" (inverso)
 * Usado para calidad del aire (menor índice = mejor aire)
 *
 * @param {number} value - Valor medido del sensor MQ135
 * @param {Object} thresholds - Umbrales de calidad {EXCELLENT, GOOD, MODERATE, POOR, HAZARDOUS}
 * @returns {number} Score normalizado entre 0 y 1
 */
const normalizeAirQuality = (value, thresholds) => {
  // Aire excelente
  if (value <= thresholds.EXCELLENT) {
    return 1.0;
  }

  // Buena calidad (degradación suave: 100% → 80%)
  if (value <= thresholds.GOOD) {
    const range = thresholds.GOOD - thresholds.EXCELLENT;
    const position = (value - thresholds.EXCELLENT) / range;
    return 1.0 - (0.2 * position);
  }

  // Calidad moderada (degradación media: 80% → 50%)
  if (value <= thresholds.MODERATE) {
    const range = thresholds.MODERATE - thresholds.GOOD;
    const position = (value - thresholds.GOOD) / range;
    return 0.8 - (0.3 * position);
  }

  // Calidad pobre (degradación acelerada: 50% → 20%)
  if (value <= thresholds.POOR) {
    const range = thresholds.POOR - thresholds.MODERATE;
    const position = (value - thresholds.MODERATE) / range;
    return 0.5 - (0.3 * position);
  }

  // Calidad peligrosa (degradación crítica: 20% → 0%)
  if (value <= thresholds.HAZARDOUS) {
    const range = thresholds.HAZARDOUS - thresholds.POOR;
    const position = (value - thresholds.POOR) / range;
    return 0.2 - (0.2 * position);
  }

  // Fuera de escala
  return 0;
};

// ═══════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL DE CÁLCULO
// ═══════════════════════════════════════════════════════════════════════

/**
 * Calcula el porcentaje de salud ambiental basado en múltiples parámetros
 *
 * @param {Object} sensorData - Datos de los sensores
 * @param {number} sensorData.temperature - Temperatura en °C (DHT11)
 * @param {number} sensorData.humidity - Humedad relativa en % (DHT11)
 * @param {number} sensorData.airQuality - Índice de calidad del aire (MQ135)
 * @returns {number} Porcentaje de salud ambiental (0-100)
 */
export const PercentageCalculation = (sensorData) => {
  if (!sensorData) return 0;

  let totalScore = 0;
  let activeWeights = 0;

  // ─────────────────────────────────────────────────────────────────────
  // EVALUACIÓN DE TEMPERATURA
  // ─────────────────────────────────────────────────────────────────────
  const isTempValid =
    typeof sensorData.temperature === 'number' &&
    !isNaN(sensorData.temperature) &&
    sensorData.temperature >= TEMPERATURE_CONFIG.SENSOR_MIN &&
    sensorData.temperature <= TEMPERATURE_CONFIG.SENSOR_MAX;

  if (isTempValid) {
    const tempScore = normalizeOptimalRange(
      sensorData.temperature,
      TEMPERATURE_CONFIG.OPTIMAL_MIN,
      TEMPERATURE_CONFIG.OPTIMAL_MAX,
      TEMPERATURE_CONFIG.TOLERANCE_LOW,
      TEMPERATURE_CONFIG.TOLERANCE_HIGH
    );

    activeWeights += SENSOR_WEIGHTS.temperature;
    totalScore += tempScore * SENSOR_WEIGHTS.temperature;
  }

  // ─────────────────────────────────────────────────────────────────────
  // EVALUACIÓN DE HUMEDAD
  // ─────────────────────────────────────────────────────────────────────
  const isHumValid =
    typeof sensorData.humidity === 'number' &&
    !isNaN(sensorData.humidity) &&
    sensorData.humidity > HUMIDITY_CONFIG.SENSOR_MIN &&
    sensorData.humidity < HUMIDITY_CONFIG.SENSOR_MAX;

  if (isHumValid) {
    const humScore = normalizeOptimalRange(
      sensorData.humidity,
      HUMIDITY_CONFIG.OPTIMAL_MIN,
      HUMIDITY_CONFIG.OPTIMAL_MAX,
      HUMIDITY_CONFIG.TOLERANCE_LOW,
      HUMIDITY_CONFIG.TOLERANCE_HIGH
    );

    activeWeights += SENSOR_WEIGHTS.humidity;
    totalScore += humScore * SENSOR_WEIGHTS.humidity;
  }

  // ─────────────────────────────────────────────────────────────────────
  // EVALUACIÓN DE CALIDAD DEL AIRE
  // ─────────────────────────────────────────────────────────────────────
  const isAQValid =
    typeof sensorData.airQuality === 'number' &&
    !isNaN(sensorData.airQuality) &&
    sensorData.airQuality >= AIR_QUALITY_CONFIG.SENSOR_MIN &&
    sensorData.airQuality <= AIR_QUALITY_CONFIG.SENSOR_MAX;

  if (isAQValid) {
    const aqScore = normalizeAirQuality(
      sensorData.airQuality,
      AIR_QUALITY_CONFIG
    );

    activeWeights += SENSOR_WEIGHTS.airQuality;
    totalScore += aqScore * SENSOR_WEIGHTS.airQuality;
  }

  // ─────────────────────────────────────────────────────────────────────
  // CÁLCULO FINAL
  // ─────────────────────────────────────────────────────────────────────
  if (activeWeights === 0) {
    return 0; // Sin sensores válidos
  }

  // Normalizar por el peso total de sensores activos
  const normalizedScore = totalScore / activeWeights;

  // Retornar porcentaje entero (0-100)
  return Math.round(normalizedScore * 100);
};

// ═══════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES PARA UI
// ═══════════════════════════════════════════════════════════════════════

/**
 * Retorna el color asociado al porcentaje de salud
 * Escala basada en índices de calidad del aire estándar (AQI)
 *
 * @param {number} percentage - Porcentaje de salud (0-100)
 * @returns {string} Código hexadecimal de color
 */
export const getColorByPercentage = (percentage) => {
  if (percentage >= 80) return "#10B981"; // Verde - Excelente
  if (percentage >= 60) return "#84CC16"; // Lima - Bueno
  if (percentage >= 40) return "#F59E0B"; // Ámbar - Moderado
  if (percentage >= 20) return "#EF4444"; // Rojo - Pobre
  return "#991B1B";                       // Rojo oscuro - Peligroso
};

/**
 * Retorna la etiqueta descriptiva del nivel de salud
 *
 * @param {number} percentage - Porcentaje de salud (0-100)
 * @returns {string} Etiqueta descriptiva
 */
export const getHealthLabel = (percentage) => {
  if (percentage >= 80) return "Excelente";
  if (percentage >= 60) return "Bueno";
  if (percentage >= 40) return "Moderado";
  if (percentage >= 20) return "Pobre";
  return "Peligroso";
};

// ═══════════════════════════════════════════════════════════════════════
// EXPORTACIÓN DE CONFIGURACIONES (PARA TESTING Y ESCALABILIDAD)
// ═══════════════════════════════════════════════════════════════════════

export const CONFIG = {
  WEIGHTS: SENSOR_WEIGHTS,
  TEMPERATURE: TEMPERATURE_CONFIG,
  HUMIDITY: HUMIDITY_CONFIG,
  AIR_QUALITY: AIR_QUALITY_CONFIG,
};
