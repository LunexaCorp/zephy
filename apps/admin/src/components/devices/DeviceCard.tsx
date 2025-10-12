import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  SignalIcon,
  SignalSlashIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { Device } from "../../hooks/useDevices";

interface DeviceCardProps {
  device: Device;
  onDelete: (id: string) => void;
}

export default function DeviceCard({ device, onDelete }: DeviceCardProps) {
  const isOnline = device.status === "active";
  const statusColors = {
    active: "bg-green-500",
    offline: "bg-gray-400",
    error: "bg-red-500",
  };

  const statusLabels = {
    active: "Activo",
    offline: "Desconectado",
    error: "Error",
  };

  // Calcula el tiempo desde el último dato
  const getLastSeenText = () => {
    if (!device.lastDataReceived) return "Sin datos";

    const lastSeen = new Date(device.lastDataReceived);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / 60000);

    if (diffMinutes < 1) return "Hace un momento";
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    if (diffMinutes < 1440) return `Hace ${Math.floor(diffMinutes / 60)} h`;
    return `Hace ${Math.floor(diffMinutes / 1440)} días`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Header con estado */}
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isOnline ? (
                <SignalIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <SignalSlashIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
              <h3 className="font-semibold text-gray-900 truncate">
                {device.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  statusColors[device.status]
                } animate-pulse`}
              />
              <span className="text-xs text-gray-600">
                {statusLabels[device.status]}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-1 flex-shrink-0">
            <Link
              to={`/devices/edit/${device.id}`}
              className="p-1.5 hover:bg-sky-50 rounded-lg transition"
              title="Editar"
            >
              <PencilIcon className="h-4 w-4 text-sky-600" />
            </Link>
            <button
              onClick={() => onDelete(device.id)}
              className="p-1.5 hover:bg-red-50 rounded-lg transition"
              title="Eliminar"
            >
              <TrashIcon className="h-4 w-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Información del dispositivo */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Tipo:</span>
          <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
            {device.type}
          </span>
        </div>

        {device.topic && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Topic:</span>
            <code className="text-xs text-gray-700 bg-gray-50 px-2 py-0.5 rounded">
              {device.topic}
            </code>
          </div>
        )}

        {device.lastDataReceived && (
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>{getLastSeenText()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
