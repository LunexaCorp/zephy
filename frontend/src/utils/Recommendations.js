export const getEnvironmentalRecommendations = (sensorData) => {
  const { temperature, co2, airQuality } = sensorData || {};
  const recommendations = [];

  // Recomendaciones basadas en temperatura
  if (temperature > 30) {
    recommendations.push({
      id: "temp-high",
      type: "temperature",
      message: `Temperatura muy alta (${temperature}°C). Evita exposición prolongada al sol, hidrátate frecuentemente y busca espacios con sombra.`,
      severity: "high",
      priority: 1,
    });
  } else if (temperature > 25) {
    recommendations.push({
      id: "temp-warm",
      type: "temperature",
      message: `Temperatura agradable (${temperature}°C). Ideal para actividades al aire libre como caminatas o ejercicio moderado.`,
      severity: "low",
      priority: 3,
    });
  } else if (temperature < 10) {
    recommendations.push({
      id: "temp-low",
      type: "temperature",
      message: `Temperatura baja (${temperature}°C). Abrígate adecuadamente y considera actividades en interiores.`,
      severity: "medium",
      priority: 2,
    });
  } else {
    recommendations.push({
      id: "temp-ideal",
      type: "temperature",
      message: `Temperatura ideal (${temperature}°C). Condiciones perfectas para cualquier actividad.`,
      severity: "low",
      priority: 4,
    });
  }

  // Recomendaciones basadas en calidad del aire
  if (airQuality < 40) {
    recommendations.push({
      id: "air-danger",
      type: "calidadAire", // Cambiado a español
      message: `Calidad del aire PELIGROSA (${airQuality}/100). Evita actividades al exterior y cierra ventanas. Personas sensibles deben extremar precauciones.`,
      severity: "high",
      priority: 1,
    });
  } else if (airQuality < 70) {
    recommendations.push({
      id: "air-moderate",
      type: "calidadAire", // Cambiado a español
      message: `Calidad del aire moderada (${airQuality}/100). Personas sensibles deben reducir actividad física intensa al aire libre.`,
      severity: "medium",
      priority: 2,
    });
  } else {
    recommendations.push({
      id: "air-good",
      type: "calidadAire", // Cambiado a español
      message: `Excelente calidad del aire (${airQuality}/100). ¡Aprovecha para ventilar y disfrutar del aire libre!`,
      severity: "low",
      priority: 3,
    });
  }

  // Recomendaciones basadas en CO₂ (nuevas)
  if (co2 > 1000) {
    recommendations.push({
      id: "co2-high",
      type: "co2",
      message: `Niveles de CO₂ ALTOS (${co2}ppm). Ventila el área inmediatamente. Alta concentración afecta concentración y sueño.`,
      severity: "high",
      priority: 1,
    });
  } else if (co2 > 800) {
    recommendations.push({
      id: "co2-moderate",
      type: "co2",
      message: `Niveles de CO₂ moderados (${co2}ppm). Considera ventilar el espacio para mejorar la calidad del aire.`,
      severity: "medium",
      priority: 2,
    });
  } else {
    recommendations.push({
      id: "co2-good",
      type: "co2",
      message: `Niveles de CO₂ óptimos (${co2}ppm). Ventilación adecuada y aire fresco.`,
      severity: "low",
      priority: 4,
    });
  }

  return recommendations;
};

// Obtener todas las recomendaciones organizadas por tipo
export const getOrganizedRecommendations = (sensorData) => {
  const recommendations = getEnvironmentalRecommendations(sensorData);

  // Organizar por tipo (en español)
  const organized = {
    calidadAire: recommendations.filter((rec) => rec.type === "calidadAire"),
    temperature: recommendations.filter((rec) => rec.type === "temperature"),
    co2: recommendations.filter((rec) => rec.type === "co2"),
  };

  return organized;
};

// Obtener el icono y título para cada tipo (en español)
export const getCategoryInfo = (type) => {
  const categories = {
    calidadAire: {
      iconName: "airQuality",
      title: "Calidad del Aire",
      description: "Recomendaciones basadas en la pureza del aire",
    },
    temperature: {
      iconName: "temperature",
      title: "Temperatura",
      description: "Recomendaciones basadas en la temperatura ambiente",
    },
    co2: {
      iconName: "co2",
      title: "Niveles de CO₂",
      description: "Recomendaciones basadas en dióxido de carbono",
    },
  };

  return categories[type] || { iconName: "info", title: type, description: "" };
};

// Obtener recomendaciones prioritarias para aire y temperatura
export const getPriorityAirTempRecommendations = (sensorData) => {
  const recommendations = getEnvironmentalRecommendations(sensorData);

  // Filtrar solo aire y temperatura
  const airTempRecommendations = recommendations.filter(
    (rec) => rec.type === "airQuality" || rec.type === "temperature"
  );

  // Ordenar por prioridad (número menor = más prioritario)
  return airTempRecommendations.sort((a, b) => a.priority - b.priority);
};

// Obtener estilos según severidad
export const getSeverityStyle = (severity) => {
  const styles = {
    high: "bg-red-500/20 border-red-500/50 text-red-100",
    medium: "bg-amber-500/20 border-amber-500/50 text-amber-100",
    low: "bg-emerald-500/20 border-emerald-500/50 text-emerald-100",
  };
  return styles[severity] || styles.low;
};

// Obtener iconos según severidad
export const getSeverityIcon = (severity) => {
  const icons = {
    high: "⚠️",
    medium: "🔸",
    low: "✅",
  };
  return icons[severity] || icons.low;
};

// Obtener iconos según tipo
export const getTypeIcon = (type) => {
  const icons = {
    temperature: "🌡️",
    airQuality: "🍃",
    co2: "☁️",
  };
  return icons[type] || "ℹ️";
};

//----------------------------------------------------------------------------------------
