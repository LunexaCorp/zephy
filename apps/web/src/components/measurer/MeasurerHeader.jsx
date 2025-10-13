import { motion } from "framer-motion";
import { Activity, MapPin, ChevronDown } from "lucide-react";

const MeasurerHeader = ({ locations, currentLocation, setCurrentLocation }) => {
  // Obtener nombre de la ubicación actual
  const currentLocationName = locations.find(loc => loc._id === currentLocation)?.name;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black border-b border-emerald-400/30 shadow-2xl overflow-hidden"
    >
      {/* Efecto de fondo animado */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

          {/* Sección de título */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/50"
              >
                <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent tracking-tight">
                Monitoreo Ambiental
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-gray-400 max-w-md"
            >
              Datos de la ciudad en {" "}
              <span className="text-emerald-400 font-medium">tiempo real</span>
            </motion.p>
          </motion.div>

          {/* Selector de ubicación moderno */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full lg:w-80"
          >
            <div className="relative group">
              {/* Label flotante */}
              <motion.label
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2.5 left-3 px-2 bg-gray-900 text-xs font-medium text-emerald-400 z-10"
              >
                Ubicación
              </motion.label>

              {/* Icono de ubicación */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <MapPin className="w-5 h-5 text-emerald-400/70 group-focus-within:text-emerald-400 transition-colors" />
              </div>

              {/* Select personalizado */}
              <select
                value={currentLocation || ""}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="w-full h-14 pl-12 pr-10 rounded-xl bg-gray-800/80 backdrop-blur-sm text-white border-2 border-emerald-400/30
                  hover:border-emerald-400/50 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20
                  transition-all duration-300 outline-none appearance-none cursor-pointer
                  shadow-lg shadow-black/20 group-hover:shadow-emerald-400/10"
              >
                <option value="" disabled>
                  Selecciona una ubicación
                </option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id} className="bg-gray-900">
                    {loc.name}
                  </option>
                ))}
              </select>

              {/* Icono de chevron animado */}
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <ChevronDown className="w-5 h-5 text-emerald-400/70" />
              </motion.div>

              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

          </motion.div>
        </div>

        {/* Barra de estado inferior */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-6 h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent rounded-full"
        />
      </div>
    </motion.header>
  );
};

export default MeasurerHeader;
