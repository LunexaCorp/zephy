import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PlusIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import DeviceCard from "./DeviceCard";
import { DevicesByLocation } from "../../hooks/useDevices";

interface LocationDeviceGroupProps {
  group: DevicesByLocation;
  onDelete: (id: string) => void;
}

export default function LocationDeviceGroup({
                                              group,
                                              onDelete,
                                            }: LocationDeviceGroupProps) {
  const activeCount = group.devices.filter((d) => d.status === "active").length;
  const offlineCount = group.devices.filter((d) => d.status === "offline").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header de la ubicación */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              📍 {group.locationName}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{group.devices.length} dispositivo{group.devices.length !== 1 ? "s" : ""}</span>
              {activeCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {activeCount} activo{activeCount !== 1 ? "s" : ""}
                </span>
              )}
              {offlineCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  {offlineCount} offline
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/devices/new?location=${group.locationId}`}
              className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Agregar aquí</span>
            </Link>

            <Link
              to={`/devices/location/${group.locationId}`}
              className="flex items-center gap-1 text-sky-600 hover:text-sky-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-sky-50 transition"
            >
              Ver todos
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de dispositivos */}
      <div className="p-6">
        {group.devices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-3">No hay dispositivos en esta ubicación</p>
            <Link
              to={`/devices/new?location=${group.locationId}`}
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Agregar el primero
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {group.devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
