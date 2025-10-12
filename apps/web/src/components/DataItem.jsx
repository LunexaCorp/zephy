/**
 * Determina el color del borde según el tipo de dato y su valor
 * @param {string} label - Etiqueta del dato (Temperatura, Humedad, etc.)
 * @param {number|string} value - Valor del sensor
 * @param {number} healthScore - Puntuación de salud (0-100)
 * @returns {string} Clase CSS del color del borde
 */
const getBorderColor = (label, value, healthScore) => {
  // Si no hay datos, usar gris
  if (value === null || value === undefined || value === "Sin datos") {
    return "border-gray-500";
  }

  // Para el porcentaje de salud, usar escala completa
  if (label.toLowerCase().includes("salud") || label.toLowerCase().includes("calidad")) {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numValue >= 80) return "border-emerald-500";
    if (numValue >= 60) return "border-lime-500";
    if (numValue >= 40) return "border-amber-500";
    if (numValue >= 20) return "border-red-500";
    return "border-red-900";
  }

  // Para otros sensores, usar healthScore general
  if (healthScore >= 80) return "border-emerald-500";
  if (healthScore >= 60) return "border-lime-500";
  if (healthScore >= 40) return "border-amber-500";
  if (healthScore >= 20) return "border-red-500";
  return "border-red-900";
};

/**
 * Formatea el valor del sensor
 */
const formatValue = (value, unit = "") => {
  if (value === null || value === undefined || value === "" || isNaN(value)) {
    return "Sin datos";
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "Sin datos";
  }

  return `${numValue.toFixed(1)}${unit}`;
};

export const DataItem = ({
                           label,
                           value,
                           icon,
                           unit = "",
                           healthScore = 0
                         }) => {
  const formattedValue = formatValue(value, unit);
  const isNoData = formattedValue === "Sin datos";
  const borderColor = getBorderColor(label, value, healthScore);

  return (
    <div
      className={`bg-gray-700/50 hover:bg-gray-700/70 p-4 rounded-lg transition-all duration-200 border-l-4 ${borderColor} ${
        isNoData ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-2xl ${isNoData ? 'grayscale opacity-50' : ''}`}>
          {icon}
        </span>
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isNoData ? 'text-gray-400' : 'text-emerald-300'
          }`}>
            {label}
          </p>
          <p className={`text-xl font-bold ${
            isNoData ? 'text-gray-500' : 'text-white'
          }`}>
            {formattedValue}
          </p>
        </div>
        {!isNoData && healthScore > 0 && (
          <div className="text-right">
            <span className="text-xs text-gray-400">Score</span>
            <p className="text-sm font-semibold text-emerald-400">
              {healthScore}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
