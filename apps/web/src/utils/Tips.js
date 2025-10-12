export const Tips = (sensorData) => {
  const { temperature, humidity, airQuality } = sensorData || {};

  return [
    {
      id: "explanation",
      type: "education",
      icon: "book",
      title: "¿Qué significan estos valores?",
      content:
        "Temperatura: Confort térmico. Calidad de Aire: Pureza del aire (0-100). CO₂: Concentración de dióxido de carbono. Valores altos indican mala ventilación.",
      severity: "info",
    },
    {
      id: "indoor-air",
      type: "tip",
      icon: "home",
      title: "Mejora el aire en interiores",
      content:
        "1. Ventila 10 min cada 3 horas. 2. Usa plantas purificadoras. 3. Evita productos químicos. 4. Mantén limpieza regular. 5. Controla humedad (40-60%).",
      severity: "advice",
      condition: airQuality < 70,
    },
    {
      id: "practical-tips",
      type: "tip",
      icon: "idea",
      title: "Acciones prácticas inmediatas",
      content:
        "• Camina o usa bicicleta • Reduce uso de automóvil • Planta un árbol • Usa transporte público • Comparte vehículo • Consume localmente",
      severity: "advice",
    },
    {
      id: "temp-tips",
      type: "tip",
      icon: "temperature",
      title: "Confort térmico",
      content:
        temperature > 28
          ? "Hace calor: Usa ropa ligera, hidrátate, busca sombra y evita horas pico de sol."
          : temperature < 15
            ? "Hace frío: Abrígate en capas, consume bebidas calientes y mantén actividad física."
            : "Temperatura ideal: Aprovecha para actividades al aire libre.",
      severity: "advice",
    },
  ].filter((tip) => tip.condition !== false); // Filtramos tips condicionales no aplicables
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
