import { motion } from "framer-motion";
import { Thermometer, Factory, Leaf, Trophy } from "lucide-react";

const RankingTable = ({ rankingData }) => {
  if (!rankingData || rankingData.length === 0) {
    return (
      <div className="text-center text-gray-400 p-6 italic">
        No hay datos del ranking disponibles.
      </div>
    );
  }

  const getStatus = (index) => {
    if (index >= 70) return { label: "SALUDABLE", color: "emerald" };
    if (index >= 40) return { label: "MODERADO", color: "amber" };
    return { label: "PELIGROSO", color: "red" };
  };

  return (
    <div className="bg-gray-900/80 rounded-2xl shadow-2xl border border-emerald-400/10 p-6 backdrop-blur-lg">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/20 pb-3">
        <Trophy size={22} className="text-yellow-400" />
        <h2 className="text-xl font-bold text-emerald-100">
          Ranking Ambiental - Zonas Monitoreadas
        </h2>
      </div>

      {/* Cards con animaciones */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rankingData.map((loc, index) => {
          const status = getStatus(loc.index);

          return (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-emerald-500/40 hover:scale-[1.02] transition-all cursor-pointer"
            >
              {/* Imagen */}
              <div className="h-32 w-full overflow-hidden">
                <img
                  src={loc.img}
                  alt={loc.location}
                  className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all"
                />
              </div>

              {/* Contenido */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold text-emerald-400 capitalize">
                    {loc.location}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full bg-${status.color}-900/40 text-${status.color}-300 border border-${status.color}-700/40`}
                  >
                    #{index + 1}
                  </span>
                </div>

                {/* Barra de índice */}
                <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2 overflow-hidden">
                  <motion.div
                    className={`h-2 rounded-full bg-${status.color}-500`}
                    initial={{ width: 0 }}
                    animate={{ width: `${loc.index}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-400 mb-3">
                  <span>Puntaje: </span>
                  <span className="font-semibold text-gray-200">
                    {Math.round(loc.index)} / 100
                  </span>
                </div>

                {/* Indicadores ambientales */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="flex flex-col items-center">
                    <Thermometer size={16} className="text-amber-400 mb-1" />
                    <span>{loc.temperature}°C</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Factory size={16} className="text-red-400 mb-1" />
                    <span>{loc.airQuality} ppm</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Leaf size={16} className="text-emerald-400 mb-1" />
                    <span>{status.label}</span>
                  </div>
                </div>
              </div>

              {/* Glow dinámico */}
              <div
                className={`absolute inset-0 opacity-10 bg-gradient-to-br from-${status.color}-400 via-transparent to-gray-900`}
              ></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RankingTable;
