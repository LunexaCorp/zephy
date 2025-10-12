import { motion } from "framer-motion";
import LocationCard from "./LocationCard";

export type Location = {
  id: string;
  name: string;
  description?: string | null;
  img?: string;
  coordinates: {
    latitude: number | string;
    longitude: number | string;
  };
};

interface LocationCardGridProps {
  locations: Location[];
  onDelete: (id: string) => void;
}

export default function LocationCardGrid({
                                           locations,
                                           onDelete,
                                         }: LocationCardGridProps) {
  if (locations.length === 0)
    return (
      <p className="text-gray-600 text-center mt-10 bg-white/80 backdrop-blur-sm p-8 rounded-xl">
        No hay ubicaciones registradas aún.
      </p>
    );

  console.log(locations)

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 auto-rows-fr"
    >
      {locations.map((loc, index) => (
        <motion.div
          key={loc.id || index}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex"
        >
          <LocationCard location={loc} onDelete={onDelete} />
        </motion.div>
      ))}
    </motion.div>
  );
}
