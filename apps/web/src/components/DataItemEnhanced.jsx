export const DataItemEnhanced = ({
                                   label,
                                   value,
                                   icon,
                                   unit = "",
                                   healthScore = 0,
                                   status = null, // "excellent", "good", "moderate", "poor", "critical"
                                   tooltip = null
                                 }) => {
  const formattedValue = formatValue(value, unit);
  const isNoData = formattedValue === "Sin datos";
  const borderColor = getBorderColor(label, value, healthScore);

  // Determinar el estado si no se proporciona
  const getStatus = () => {
    if (status) return status;
    if (isNoData) return "nodata";
    if (healthScore >= 80) return "excellent";
    if (healthScore >= 60) return "good";
    if (healthScore >= 40) return "moderate";
    if (healthScore >= 20) return "poor";
    return "critical";
  };

  const currentStatus = getStatus();

  const statusConfig = {
    nodata: {
      bg: "bg-gray-600/30",
      text: "text-gray-400",
      badge: "Sin datos",
      badgeColor: "bg-gray-600"
    },
    excellent: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      badge: "Excelente",
      badgeColor: "bg-emerald-500"
    },
    good: {
      bg: "bg-lime-500/10",
      text: "text-lime-300",
      badge: "Bueno",
      badgeColor: "bg-lime-500"
    },
    moderate: {
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      badge: "Moderado",
      badgeColor: "bg-amber-500"
    },
    poor: {
      bg: "bg-red-500/10",
      text: "text-red-300",
      badge: "Pobre",
      badgeColor: "bg-red-500"
    },
    critical: {
      bg: "bg-red-900/20",
      text: "text-red-400",
      badge: "Crítico",
      badgeColor: "bg-red-900"
    },
  };

  const config = statusConfig[currentStatus];

  return (
    <div
      className={`relative group ${config.bg} hover:bg-opacity-20 p-4 rounded-lg transition-all duration-200 border-l-4 ${borderColor}`}
      title={tooltip}
    >
      {/* Badge de Estado */}
      {!isNoData && (
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full ${config.badgeColor} text-white font-semibold`}>
            {config.badge}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        <span className={`text-3xl ${isNoData ? 'grayscale opacity-50' : ''}`}>
          {icon}
        </span>
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.text}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold ${
            isNoData ? 'text-gray-500' : 'text-white'
          }`}>
            {formattedValue}
          </p>
          {tooltip && (
            <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {tooltip}
            </p>
          )}
        </div>
      </div>

      {/* Barra de Progreso (solo si hay datos) */}
      {!isNoData && healthScore > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${config.badgeColor} transition-all duration-500`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
