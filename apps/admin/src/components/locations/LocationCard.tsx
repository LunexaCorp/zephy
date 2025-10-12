import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPinIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Location } from "./LocationCardGrid";

interface LocationCardProps {
  location: Location;
  onDelete: (id: string) => void;
}

export default function LocationCard({ location, onDelete }: LocationCardProps) {
  const lat = Number(location.coordinates?.latitude);
  const lon = Number(location.coordinates?.longitude);
  const hasValidCoords = !isNaN(lat) && !isNaN(lon);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-200 flex flex-col h-full"
    >
      {/* Imagen + botones */}
      <div className="relative">
        <img
          src={
            location.img ||
            "https://via.placeholder.com/400x200?text=No+Image"
          }
          alt={location.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onDelete(location.id)}
            className="bg-red-600/90 hover:bg-red-700 p-2 rounded-lg transition shadow-md"
            title="Eliminar"
          >
            <TrashIcon className="h-5 w-5 text-white" />
          </button>
          <Link
            to={`/locations/edit/${location.id}`}
            className="bg-sky-600/90 hover:bg-sky-700 p-2 rounded-lg transition shadow-md"
            title="Editar"
          >
            <PencilIcon className="h-5 w-5 text-white" />
          </Link>
        </div>
      </div>

      {/* Información */}
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
        <p className="text-sm text-gray-600 flex-1">
          {location.description || "Sin descripción disponible."}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto pt-2 border-t border-gray-200">
          <MapPinIcon className="h-4 w-4 text-sky-600" />
          <span>
            {hasValidCoords
              ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
              : "Coordenadas no válidas"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
