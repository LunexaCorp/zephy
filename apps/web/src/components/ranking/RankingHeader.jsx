import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const RankingHeader = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-emerald-500/40 shadow-lg">
      {/* Efecto de brillo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-emerald-400/10 to-transparent"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      {/* Contenido */}
      <div className="relative max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-2"
        >
          <Trophy className="w-8 h-8 text-emerald-400 drop-shadow-glow" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">
            Clasificación de <span className="text-emerald-400">Zonas</span>
          </h1>
        </motion.div>

        <p className="text-gray-400 text-sm md:text-base font-light">
          Monitoreo ambiental en tiempo real — Puerto Maldonado 🌿
        </p>
      </div>
    </header>
  );
};

export default RankingHeader;
