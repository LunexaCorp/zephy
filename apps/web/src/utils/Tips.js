// ═══════════════════════════════════════════════════════════
// CONSEJOS PRÁCTICOS - PUERTO MALDONADO, PERÚ
// Para espacios públicos abiertos (parques, plazas)
// Usa los mismos umbrales exactos de PercentageCalculation.js
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

// Umbrales del sensor MQ135 (valor ADC raw del ESP32)
const AIR_QUALITY_CONFIG = {
  EXCELLENT: 500,         // Aire muy limpio
  GOOD: 1000,             // Buena calidad
  MODERATE: 2500,         // Moderada
  POOR: 5000,             // Pobre
  HAZARDOUS: 8000,        // Peligroso
};

export const Tips = (sensorData) => {
  const { temperature, humidity, airQuality } = sensorData || {};

  const hasTemp = typeof temperature === 'number' && !isNaN(temperature);
  const hasHumidity = typeof humidity === 'number' && !isNaN(humidity);
  const hasAirQuality = typeof airQuality === 'number' && !isNaN(airQuality);

  return [
    {
      id: "explanation",
      type: "education",
      icon: "book",
      title: "¿Qué miden estos sensores?",
      content:
        `Estos datos provienen de sensores en espacios públicos de Puerto Maldonado. Temperatura óptima: ${TEMPERATURE_CONFIG.OPTIMAL_MIN}-${TEMPERATURE_CONFIG.OPTIMAL_MAX}°C. Humedad ideal: ${HUMIDITY_CONFIG.OPTIMAL_MIN}-${HUMIDITY_CONFIG.OPTIMAL_MAX}%. Calidad del Aire: Menor índice = mejor aire.`,
      severity: "info",
    },
    {
      id: "air-excellent",
      type: "tip",
      icon: "wind",
      title: "¡Excelente momento para salir!",
      content:
        "La calidad del aire en este lugar está óptima. Perfecto para pasear por el parque, hacer ejercicio al aire libre, o simplemente relajarte en el área verde. Aprovecha estas condiciones.",
      severity: "advice",
      condition: hasAirQuality && airQuality <= AIR_QUALITY_CONFIG.EXCELLENT, // <= 500
    },
    {
      id: "air-good",
      type: "tip",
      icon: "wind",
      title: "Buena calidad del aire",
      content:
        "El aire está en buenas condiciones. Es seguro realizar actividades al aire libre como caminar, trotar o disfrutar del espacio público. Respira tranquilo.",
      severity: "advice",
      condition: hasAirQuality && airQuality > AIR_QUALITY_CONFIG.EXCELLENT && airQuality <= AIR_QUALITY_CONFIG.GOOD, // 500-1000
    },
    {
      id: "air-moderate",
      type: "tip",
      icon: "alert",
      title: "Calidad del aire moderada",
      content:
        "El aire está aceptable pero no ideal. Si tienes problemas respiratorios (asma, alergias), considera reducir actividades intensas. Para la mayoría es seguro, pero evita ejercicio prolongado.",
      severity: "warning",
      condition: hasAirQuality && airQuality > AIR_QUALITY_CONFIG.GOOD && airQuality <= AIR_QUALITY_CONFIG.MODERATE, // 1000-2500
    },
    {
      id: "air-poor",
      type: "tip",
      icon: "alert",
      title: "⚠️ Aire contaminado",
      content:
        "La calidad del aire está deteriorada (posiblemente por humo de quemas cercanas o tráfico intenso). Si puedes, limita tu tiempo en este espacio público. Personas sensibles deben evitar ejercicio al aire libre.",
      severity: "warning",
      condition: hasAirQuality && airQuality > AIR_QUALITY_CONFIG.MODERATE && airQuality <= AIR_QUALITY_CONFIG.POOR, // 2500-5000
    },
    {
      id: "air-danger",
      type: "tip",
      icon: "alert",
      title: "🚨 Evita permanecer en el área",
      content:
        "La calidad del aire es peligrosa. Si estás en esta plaza o parque, considera retirarte. Si debes permanecer, usa mascarilla. Personas con asma, niños y ancianos deben evitar totalmente el área.",
      severity: "danger",
      condition: hasAirQuality && airQuality > AIR_QUALITY_CONFIG.POOR, // > 5000
    },
    {
      id: "temp-extreme-heat",
      type: "tip",
      icon: "temperature",
      title: "⚠️ Calor extremo en el área",
      content: "La temperatura en este espacio público es muy alta. Si vas a permanecer aquí: busca sombra urgente, toma agua cada 30 minutos, evita actividad física intensa. Considera regresar después de las 3pm cuando baje el calor.",
      severity: "danger",
      condition: hasTemp && temperature >= 35,
    },
    {
      id: "temp-high",
      type: "tip",
      icon: "sun",
      title: "☀️ Calor intenso",
      content: "Hace bastante calor en la zona. Si planeas estar en el parque o plaza: busca áreas con sombra, lleva agua contigo, usa bloqueador solar y gorra. El horario más fresco es antes de las 10am o después de las 4pm.",
      severity: "advice",
      condition: hasTemp && temperature >= 30 && temperature < 35,
    },
    {
      id: "temp-ideal",
      type: "tip",
      icon: "temperature",
      title: "✅ Temperatura perfecta",
      content: "La temperatura en este lugar está ideal para disfrutar del espacio público. Perfecto para pasear, sentarse en las bancas, hacer ejercicio o simplemente relajarte al aire libre. ¡Aprovecha!",
      severity: "advice",
      condition: hasTemp && temperature >= TEMPERATURE_CONFIG.OPTIMAL_MIN && temperature <= TEMPERATURE_CONFIG.OPTIMAL_MAX,
    },
    {
      id: "temp-cool",
      type: "tip",
      icon: "temperature",
      title: "🍃 Clima fresco",
      content: "¡Qué agradable! La temperatura está fresca, poco común en Puerto Maldonado. Excelente momento para disfrutar del parque sin el calor agobiante. Ideal para caminatas largas.",
      severity: "advice",
      condition: hasTemp && temperature >= 18 && temperature < TEMPERATURE_CONFIG.OPTIMAL_MIN,
    },
    {
      id: "temp-cold",
      type: "tip",
      icon: "alert",
      title: "❄️ Friaje detectado",
      content: "Hay friaje en la zona. Si estás en el parque o plaza, abrígate bien. Este fenómeno puede durar varios días. Recomendado para personas vulnerables (ancianos, niños) usar ropa abrigadora.",
      severity: "warning",
      condition: hasTemp && temperature < 18,
    },
    {
      id: "humidity-extreme",
      type: "tip",
      icon: "droplet",
      title: "💦 Humedad muy alta",
      content: "La humedad en este espacio es muy elevada, lo que aumenta la sensación de bochorno. Si permaneces en el área, busca sombra, usa ropa ligera de algodón, e hidrátate constantemente. Evita esfuerzos físicos intensos.",
      severity: "warning",
      condition: hasHumidity && humidity >= 85,
    },
    {
      id: "humidity-high",
      type: "tip",
      icon: "droplet",
      title: "🌧️ Humedad alta",
      content: "La humedad está alta, típico de nuestra selva. Si estás en el parque, es normal que sientas el ambiente pesado. Mantente hidratado y busca áreas ventiladas.",
      severity: "advice",
      condition: hasHumidity && humidity >= HUMIDITY_CONFIG.OPTIMAL_MAX && humidity < 85,
    },
    {
      id: "humidity-ideal",
      type: "tip",
      icon: "droplet",
      title: "✅ Humedad confortable",
      content: "La humedad en este lugar está en niveles ideales. Disfruta de condiciones perfectas para pasar tiempo al aire libre. La sensación térmica es agradable.",
      severity: "advice",
      condition: hasHumidity && humidity >= HUMIDITY_CONFIG.OPTIMAL_MIN && humidity <= HUMIDITY_CONFIG.OPTIMAL_MAX,
    },
    {
      id: "humidity-low",
      type: "tip",
      icon: "droplet",
      title: "🏜️ Humedad baja (raro aquí)",
      content: "La humedad está inusualmente baja para Puerto Maldonado. Si estás en el parque, lleva agua extra para mantenerte hidratado. Puede irritar las vías respiratorias.",
      severity: "advice",
      condition: hasHumidity && humidity < HUMIDITY_CONFIG.OPTIMAL_MIN && humidity >= 30,
    },
    {
      id: "heat-index-danger",
      type: "tip",
      icon: "alert",
      title: "🥵 Sensación térmica peligrosa",
      content: "¡Alerta! La combinación de calor + humedad alta en este espacio público crea una sensación térmica peligrosa. Riesgo de golpe de calor. Si estás aquí, busca sombra inmediata, reduce actividad física y toma agua constantemente. Considera retirarte.",
      severity: "danger",
      condition: hasTemp && hasHumidity && temperature >= 30 && humidity >= 70,
    },
  ].filter((tip) => tip.condition !== false);
};

export const getTipCardStyle = (severity) => {
  const styles = {
    info: "bg-blue-500/10 border-blue-500/30",
    advice: "bg-emerald-500/10 border-emerald-500/30",
    warning: "bg-amber-500/10 border-amber-500/30",
    danger: "bg-red-500/10 border-red-500/30",
  };
  return styles[severity] || styles.info;
};
