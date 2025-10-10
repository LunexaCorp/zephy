import { motion } from "framer-motion";

const Podium = ({ rankingData }) => {
  if (!rankingData || rankingData.length < 3) return null;

  const [first, second, third] = rankingData.slice(0, 3);

  const podiums = [
    { place: 2, data: second, color: "from-gray-300 to-gray-100 text-gray-800", height: "h-40", delay: 0.1 },
    { place: 1, data: first, color: "from-yellow-400 via-amber-300 to-yellow-200 text-amber-900", height: "h-52", delay: 0.2 },
    { place: 3, data: third, color: "from-amber-700 via-orange-600 to-amber-500 text-white", height: "h-32", delay: 0.3 },
  ];

  return (
    <div className="flex justify-center items-end gap-6 mt-12 mb-16 relative">
      {/* Halo animado detrás del primero */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.3, opacity: 0.4 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-[-50px] w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-40"
      />

      {podiums.map((podium, i) => (
        <motion.div
          key={podium.place}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: podium.delay }}
          className="flex flex-col items-center"
        >
          {/* Bloque del podio */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-24 ${podium.height} flex flex-col justify-center items-center
              bg-gradient-to-t ${podium.color} rounded-t-2xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]
              border border-white/20 backdrop-blur-md transition-all duration-300`}
          >
            <span className="font-extrabold text-3xl drop-shadow-md">{podium.place}</span>
          </motion.div>

          {/* Nombre y puntos */}
          <div className="text-center mt-3">
            <p className="font-semibold text-gray-100">{podium.data.location}</p>
            <span className="text-sm text-gray-400">
              {Math.round(podium.data.index)} pts
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Podium;
