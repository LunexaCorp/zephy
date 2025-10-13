// ═══════════════════════════════════════════════════════════
// RECOMENDACIONES AMBIENTALES - PUERTO MALDONADO, PERÚ
// Para espacios públicos abiertos (parques, plazas)
// Sensores: DHT11 (temp/humedad) + MQ135 (calidad aire)
// Usa umbrales exactos de PercentageCalculation.js
// ═══════════════════════════════════════════════════════════

// Umbrales EXACTOS de PercentageCalculation.js
const TEMPERATURE_CONFIG = {
  OPTIMAL_MIN: 22,
  OPTIMAL_MAX: 26,
};

const HUMIDITY_CONFIG = {
  OPTIMAL_MIN: 50,
  OPTIMAL_MAX: 70,
};

// Umbrales del sensor MQ135 (valor ADC raw 0-4095 del ESP32)
const AIR_QUALITY_CONFIG = {
  EXCELLENT: 500,
  GOOD: 1000,
  MODERATE: 2500,
  POOR: 5000,
  HAZARDOUS: 8000,
};

export const getEnvironmentalRecommendations = (sensorData) => {
  const { temperature, humidity, airQuality } = sensorData || {};
  const recommendations = [];

  // ───────────────────────────────────────────────────────────
  // 🌡️ TEMPERATURA (en espacios públicos abiertos)
  // ───────────────────────────────────────────────────────────
  if (typeof temperature === 'number' && !isNaN(temperature)) {
    if (temperature >= 35) {
      recommendations.push({
        id: "temp-extreme",
        type: "temperature",
        message: `🔥 Calor EXTREMO en el área (${temperature.toFixed(1)}°C). Si estás en este parque/plaza, busca sombra urgente. Toma agua cada 30min. Evita permanecer aquí entre 11am-3pm. Considera regresar más tarde.`,
        severity: "high",
        priority: 1,
      });
    } else if (temperature >= 30) {
      recommendations.push({
        id: "temp-high",
        type: "temperature",
        message: `☀️ Calor intenso en la zona (${temperature.toFixed(1)}°C). Si vas a estar en el parque, busca áreas con sombra, lleva agua y usa bloqueador solar. Las horas más frescas son antes de 10am o después de 4pm.`,
        severity: "medium",
        priority: 2,
      });
    } else if (temperature >= TEMPERATURE_CONFIG.OPTIMAL_MIN && temperature <= TEMPERATURE_CONFIG.OPTIMAL_MAX) {
      recommendations.push({
        id: "temp-ideal",
        type: "temperature",
        message: `✅ Temperatura ideal en este espacio (${temperature.toFixed(1)}°C). Perfecto para disfrutar del parque, caminar, hacer ejercicio o simplemente relajarte en las bancas.`,
        severity: "low",
        priority: 4,
      });
    } else if (temperature >= 18 && temperature < TEMPERATURE_CONFIG.OPTIMAL_MIN) {
      recommendations.push({
        id: "temp-cool",
        type: "temperature",
        message: `🍃 Clima fresco en el área (${temperature.toFixed(1)}°C). ¡Poco común aquí! Excelente momento para disfrutar del espacio público sin calor agobiante. Ideal para caminatas largas.`,
        severity: "low",
        priority: 3,
      });
    } else if (temperature < 18) {
      recommendations.push({
        id: "temp-cold",
        type: "temperature",
        message: `❄️ Friaje detectado en la zona (${temperature.toFixed(1)}°C). Si visitas este lugar, abrígate bien. Personas vulnerables (ancianos, niños) deben protegerse especialmente.`,
        severity: "medium",
        priority: 2,
      });
    }
  }

  // ───────────────────────────────────────────────────────────
  // 💧 HUMEDAD RELATIVA (en espacios públicos)
  // ───────────────────────────────────────────────────────────
  if (typeof humidity === 'number' && !isNaN(humidity) && humidity > 0) {
    if (humidity >= 85) {
      recommendations.push({
        id: "hum-extreme",
        type: "humidity",
        message: `💦 Humedad MUY ALTA en este espacio (${humidity.toFixed(1)}%). Sensación bochornosa. Si permaneces en el parque, busca sombra, usa ropa ligera de algodón y evita esfuerzos físicos intensos.`,
        severity: "high",
        priority: 1,
      });
    } else if (humidity >= HUMIDITY_CONFIG.OPTIMAL_MAX && humidity < 85) {
      recommendations.push({
        id: "hum-high",
        type: "humidity",
        message: `🌧️ Humedad alta en el área (${humidity.toFixed(1)}%). Típico de nuestra selva. Si estás en el parque, es normal sentir el ambiente pesado. Mantente hidratado.`,
        severity: "medium",
        priority: 3,
      });
    } else if (humidity >= HUMIDITY_CONFIG.OPTIMAL_MIN && humidity <= HUMIDITY_CONFIG.OPTIMAL_MAX) {
      recommendations.push({
        id: "hum-ideal",
        type: "humidity",
        message: `✅ Humedad confortable en este lugar (${humidity.toFixed(1)}%). Condiciones ideales para disfrutar del espacio público. La sensación térmica es agradable.`,
        severity: "low",
        priority: 4,
      });
    } else if (humidity >= 30 && humidity < HUMIDITY_CONFIG.OPTIMAL_MIN) {
      recommendations.push({
        id: "hum-low",
        type: "humidity",
        message: `🏜️ Humedad baja en la zona (${humidity.toFixed(1)}%). Raro en Puerto Maldonado. Si estás en el parque, lleva agua extra. Puede irritar las vías respiratorias.`,
        severity: "medium",
        priority: 2,
      });
    } else if (humidity < 30) {
      recommendations.push({
        id: "hum-very-low",
        type: "humidity",
        message: `⚠️ Humedad CRÍTICA (${humidity.toFixed(1)}%). Ambiente muy seco. Si permaneces en este espacio público, hidrátate constantemente y evita ejercicio intenso.`,
        severity: "high",
        priority: 1,
      });
    }
  }

  // ───────────────────────────────────────────────────────────
  // 🌫️ CALIDAD DEL AIRE (Sensor MQ135 - valor ADC)
  // ───────────────────────────────────────────────────────────
  // Menor valor = Mejor calidad

  if (typeof airQuality === 'number' && !isNaN(airQuality)) {
    if (airQuality <= AIR_QUALITY_CONFIG.EXCELLENT) {
      // <= 500 = Excelente
      recommendations.push({
        id: "air-excellent",
        type: "airQuality",
        message: `🌟 Aire EXCELENTE en este espacio público (índice: ${airQuality.toFixed(0)}). ¡Respira profundo! Perfecto para hacer deporte, pasear o simplemente disfrutar del área verde.`,
        severity: "low",
        priority: 4,
      });
    } else if (airQuality <= AIR_QUALITY_CONFIG.GOOD) {
      // 501-1000 = Bueno
      recommendations.push({
        id: "air-good",
        type: "airQuality",
        message: `✅ Buena calidad del aire en la zona (índice: ${airQuality.toFixed(0)}). Es seguro realizar actividades al aire libre en este parque/plaza. Disfruta del espacio.`,
        severity: "low",
        priority: 3,
      });
    } else if (airQuality <= AIR_QUALITY_CONFIG.MODERATE) {
      // 1001-2500 = Moderado
      recommendations.push({
        id: "air-moderate",
        type: "airQuality",
        message: `🔸 Calidad del aire moderada aquí (índice: ${airQuality.toFixed(0)}). Aceptable para la mayoría, pero si tienes asma o alergias, considera reducir actividades intensas en este espacio.`,
        severity: "medium",
        priority: 2,
      });
    } else if (airQuality <= AIR_QUALITY_CONFIG.POOR) {
      // 2501-5000 = Pobre
      recommendations.push({
        id: "air-poor",
        type: "airQuality",
        message: `⚠️ Aire contaminado en el área (índice: ${airQuality.toFixed(0)}). Probablemente por humo de quemas o tráfico pesado. Si puedes, limita tu tiempo en este parque/plaza. Personas sensibles deben evitar ejercicio aquí.`,
        severity: "high",
        priority: 1,
      });
    } else {
      // > 5000 = Peligroso
      recommendations.push({
        id: "air-danger",
        type: "airQuality",
        message: `🚨 Calidad del aire PELIGROSA en este espacio (índice: ${airQuality.toFixed(0)}). Si estás en esta plaza/parque, considera retirarte. Si debes permanecer, usa mascarilla. Personas con asma, niños y ancianos deben evitar el área.`,
        severity: "high",
        priority: 1,
      });
    }
  }

  // ───────────────────────────────────────────────────────────
  // 🌡️💧 COMBINACIONES CRÍTICAS
  // ───────────────────────────────────────────────────────────
  if (typeof temperature === 'number' && typeof humidity === 'number' &&
    !isNaN(temperature) && !isNaN(humidity)) {

    if (temperature >= 30 && humidity >= 70) {
      recommendations.push({
        id: "heatindex-danger",
        type: "combined",
        message: `🥵 ALERTA en este espacio: Calor + humedad alta = Sensación térmica PELIGROSA. Riesgo de golpe de calor. Si estás en el parque, busca sombra inmediata, reduce actividad física y toma agua constantemente.`,
        severity: "high",
        priority: 1,
      });
    }
  }

  // Aire contaminado + Calor
  if (typeof temperature === 'number' && typeof airQuality === 'number' &&
    !isNaN(temperature) && !isNaN(airQuality)) {

    if (airQuality > AIR_QUALITY_CONFIG.MODERATE && temperature >= 30) {
      recommendations.push({
        id: "airtemp-risk",
        type: "combined",
        message: `🔥 Aire contaminado + calor intenso en la zona. Si ves humo de chacras quemadas, considera retirarte del área. Si permaneces, evita ejercicio al aire libre.`,
        severity: "high",
        priority: 1,
      });
    }
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
};

// ═══════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════

export const getOrganizedRecommendations = (sensorData) => {
  const recommendations = getEnvironmentalRecommendations(sensorData);
  return {
    airQuality: recommendations.filter((r) => r.type === "airQuality"),
    temperature: recommendations.filter((r) => r.type === "temperature"),
    humidity: recommendations.filter((r) => r.type === "humidity"),
    combined: recommendations.filter((r) => r.type === "combined"),
  };
};

export const getCategoryInfo = (type) => {
  const categories = {
    airQuality: {
      iconName: "wind",
      title: "Calidad del Aire",
      description: "Nivel de contaminación y partículas",
    },
    temperature: {
      iconName: "thermometer",
      title: "Temperatura",
      description: "Calor y confort térmico",
    },
    humidity: {
      iconName: "droplet",
      title: "Humedad",
      description: "Humedad relativa del ambiente",
    },
    combined: {
      iconName: "alert-triangle",
      title: "Alertas Combinadas",
      description: "Riesgos por múltiples factores",
    },
  };
  return categories[type] || { iconName: "info", title: type, description: "" };
};

export const getSeverityStyle = (severity) => {
  const styles = {
    high: "bg-red-500/20 border-red-500/50 text-red-100",
    medium: "bg-amber-500/20 border-amber-500/50 text-amber-100",
    low: "bg-emerald-500/20 border-emerald-500/50 text-emerald-100",
  };
  return styles[severity] || styles.low;
};

export const getSeverityIcon = (severity) => {
  return { high: "⚠️", medium: "🔸", low: "✅" }[severity] || "ℹ️";
};

export const getTypeIcon = (type) => {
  return {
    temperature: "🌡️",
    humidity: "💧",
    airQuality: "🍃",
    combined: "⚡",
  }[type] || "ℹ️";
};
