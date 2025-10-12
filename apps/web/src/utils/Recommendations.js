// ═══════════════════════════════════════════════════════════
// RECOMENDACIONES AMBIENTALES - PUERTO MALDONADO, PERÚ
// Sensores: DHT11 (temp/humedad) + MQ135 (calidad aire)
// ═══════════════════════════════════════════════════════════

export const getEnvironmentalRecommendations = (sensorData) => {
  const { temperature, humidity, airQuality } = sensorData || {};
  const recommendations = [];

  // ───────────────────────────────────────────────────────────
  // 🌡️ TEMPERATURA (Adaptado a clima tropical de Puerto Maldonado)
  // ───────────────────────────────────────────────────────────
  if (temperature >= 35) {
    recommendations.push({
      id: "temp-extreme",
      type: "temperature",
      message: `🔥 Temperatura EXTREMA (${temperature}°C). Evita actividades al sol entre 11am-3pm. Toma agua cada 30min. Usa ropa clara y busca sombra urgente.`,
      severity: "high",
      priority: 1,
    });
  } else if (temperature >= 30) {
    recommendations.push({
      id: "temp-high",
      type: "temperature",
      message: `☀️ Calor intenso (${temperature}°C). Normal en Puerto Maldonado, pero hidrátate bien. Usa bloqueador solar y evita el sol directo prolongado.`,
      severity: "medium",
      priority: 2,
    });
  } else if (temperature >= 22 && temperature < 30) {
    recommendations.push({
      id: "temp-ideal",
      type: "temperature",
      message: `✅ Temperatura ideal (${temperature}°C). Perfecto para pasear por la plaza, ir al malecón o hacer ejercicio al aire libre.`,
      severity: "low",
      priority: 4,
    });
  } else if (temperature >= 18 && temperature < 22) {
    recommendations.push({
      id: "temp-cool",
      type: "temperature",
      message: `🍃 Clima fresco (${temperature}°C). Poco común aquí, ¡aprovecha! Ideal para caminatas largas sin calor agobiante.`,
      severity: "low",
      priority: 3,
    });
  } else if (temperature < 18) {
    recommendations.push({
      id: "temp-cold",
      type: "temperature",
      message: `❄️ Friaje detectado (${temperature}°C). Abrígate bien, especialmente ancianos y niños. Puede durar varios días.`,
      severity: "medium",
      priority: 2,
    });
  }

  // ───────────────────────────────────────────────────────────
  // 💧 HUMEDAD RELATIVA (CRÍTICO en selva tropical)
  // ───────────────────────────────────────────────────────────
  if (humidity >= 85) {
    recommendations.push({
      id: "hum-extreme",
      type: "humidity",
      message: `💦 Humedad MUY ALTA (${humidity}%). Sensación bochornosa. Usa ropa de algodón ligera, ventila tu casa y evita esfuerzos físicos intensos.`,
      severity: "high",
      priority: 1,
    });
  } else if (humidity >= 70 && humidity < 85) {
    recommendations.push({
      id: "hum-high",
      type: "humidity",
      message: `🌧️ Humedad alta (${humidity}%). Típico de nuestra selva. Mantén espacios ventilados para prevenir hongos y moho en casa.`,
      severity: "medium",
      priority: 3,
    });
  } else if (humidity >= 50 && humidity < 70) {
    recommendations.push({
      id: "hum-ideal",
      type: "humidity",
      message: `✅ Humedad confortable (${humidity}%). Condiciones ideales para tu piel y respiración. ¡Disfruta el día!`,
      severity: "low",
      priority: 4,
    });
  } else if (humidity >= 30 && humidity < 50) {
    recommendations.push({
      id: "hum-low",
      type: "humidity",
      message: `🏜️ Humedad baja (${humidity}%). Raro en Puerto Maldonado. Hidrátate bien y usa crema hidratante. Puede irritar las vías respiratorias.`,
      severity: "medium",
      priority: 2,
    });
  } else if (humidity < 30) {
    recommendations.push({
      id: "hum-very-low",
      type: "humidity",
      message: `⚠️ Humedad CRÍTICA (${humidity}%). Ambiente muy seco. Protege tu piel, bebe abundante agua y evita ejercicio intenso.`,
      severity: "high",
      priority: 1,
    });
  }

  // ───────────────────────────────────────────────────────────
  // 🌫️ CALIDAD DEL AIRE (CO₂ equivalente - MQ135)
  // ───────────────────────────────────────────────────────────
  // IMPORTANTE: airQuality viene de PercentageCalculation como SCORE (0-100)
  // NO confundir con PPM de CO₂

  if (airQuality < 20) {
    recommendations.push({
      id: "air-danger",
      type: "airQuality",
      message: `🚨 Calidad del aire PELIGROSA (${airQuality}/100). Cierra puertas/ventanas. Si es por quema de chacras cercanas, usa mascarilla. Personas con asma: manténganse en interior.`,
      severity: "high",
      priority: 1,
    });
  } else if (airQuality >= 20 && airQuality < 40) {
    recommendations.push({
      id: "air-poor",
      type: "airQuality",
      message: `⚠️ Aire contaminado (${airQuality}/100). Probablemente por humo de quemas o tráfico pesado. Limita actividades exteriores intensas.`,
      severity: "high",
      priority: 1,
    });
  } else if (airQuality >= 40 && airQuality < 60) {
    recommendations.push({
      id: "air-moderate",
      type: "airQuality",
      message: `🔸 Calidad del aire moderada (${airQuality}/100). Aceptable para la mayoría, pero personas sensibles (asmáticos, ancianos) deben reducir esfuerzos prolongados al exterior.`,
      severity: "medium",
      priority: 2,
    });
  } else if (airQuality >= 60 && airQuality < 80) {
    recommendations.push({
      id: "air-good",
      type: "airQuality",
      message: `✅ Buena calidad del aire (${airQuality}/100). Ventila tu casa, sal a caminar. Es seguro para todos.`,
      severity: "low",
      priority: 3,
    });
  } else {
    recommendations.push({
      id: "air-excellent",
      type: "airQuality",
      message: `🌟 Aire EXCELENTE (${airQuality}/100). ¡Respira profundo! Aprovecha para hacer deporte, pasear por la Reserva Nacional Tambopata o el Río Madre de Dios.`,
      severity: "low",
      priority: 4,
    });
  }

  // ───────────────────────────────────────────────────────────
  // 🌡️💧 COMBINACIONES CRÍTICAS (Índice de Calor Real)
  // ───────────────────────────────────────────────────────────
  // Heat Index = Temperatura + Humedad (peligro en trópico)
  if (temperature >= 30 && humidity >= 70) {
    recommendations.push({
      id: "heatindex-danger",
      type: "combined",
      message: `🥵 ALERTA: Calor + humedad alta = Sensación térmica PELIGROSA. Riesgo de golpe de calor. Reduce actividad física, busca sombra y toma agua constantemente.`,
      severity: "high",
      priority: 1,
    });
  }

  // Quemas + Calor = Riesgo respiratorio elevado
  if (airQuality < 50 && temperature >= 30) {
    recommendations.push({
      id: "airtemp-risk",
      type: "combined",
      message: `🔥 Aire contaminado + calor intenso. Si ves humo de chacras quemadas, permanece en interior con ventanas cerradas. Usa ventilador pero sin traer aire exterior.`,
      severity: "high",
      priority: 1,
    });
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
