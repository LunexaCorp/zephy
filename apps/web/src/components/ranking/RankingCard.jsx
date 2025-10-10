import { motion } from "framer-motion";

const RankingCard = ({ loc, index }) => {
  const statusColor =
    loc.index >= 70
      ? "emerald"
      : loc.index >= 40
        ? "amber"
        : "red";

  const statusText =
    loc.index >= 70
      ? "SALUDABLE"
      : loc.index >= 40
        ? "MODERADO"
        : "PELIGROSO";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-${statusColor}-500/30`}
    >
      {/* Imagen de la ubicación */}
      <div className="relative h-36">
        <img
          src={loc.img}
          alt={loc.location}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
          #{index + 1}
        </div>
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">{loc.location}</h3>

        {/* Estado */}
        <span
          className={`inline-block px-3 py-1 mb-3 rounded-full text-sm font-semibold bg-${statusColor}-900/40 text-${statusColor}-300`}
        >
          {statusText}
        </span>

        {/* Barra de puntaje */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Puntaje</span>
            <span className="font-semibold text-white">
              {Math.round(loc.index)} / 100
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-${statusColor}-500`}
              style={{ width: `${loc.index}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RankingCard;
