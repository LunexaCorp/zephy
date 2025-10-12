import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { useDevices } from "../hooks/useDevices";
import LocationDeviceGroup from "../components/devices/LocationDeviceGroup";

type ViewMode = "grouped" | "list";

export default function DevicesPage() {
  const {
    devices,
    devicesByLocation,
    loading,
    fetchDevices,
    removeDevice,
  } = useDevices();

  const [viewMode, setViewMode] = useState<ViewMode>("grouped");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("ID es undefined o vacío");
      return;
    }

    if (confirm("¿Seguro que deseas eliminar este dispositivo?")) {
      const result = await removeDevice(id);

      if (result.success) {
        console.log("✅ Dispositivo eliminado exitosamente");
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  const handleRefresh = async () => {
    await fetchDevices();
  };

  // Filtrado de dispositivos
  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrado de grupos
  const filteredGroups = devicesByLocation
    .map((group) => ({
      ...group,
      devices: group.devices.filter(
        (device) =>
          device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.type.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.devices.length > 0 || !searchTerm);

  const totalDevices = devices.length;
  const activeDevices = devices.filter((d) => d.status === "active").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto" />
          <p className="text-gray-600 font-medium">Cargando dispositivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dispositivos IoT
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona sensores y dispositivos del sistema Zephy
            </p>
          </div>

          <Link to="/devices/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg shadow-md transition-all font-medium"
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo dispositivo
            </motion.button>
          </Link>
        </div>

        {/* Barra de herramientas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, tipo o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Toggle de vista */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grouped")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${
                  viewMode === "grouped"
                    ? "bg-white shadow-sm text-sky-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  Agrupado
                </span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-sky-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  Lista
                </span>
              </button>
            </div>

            {/* Refrescar */}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition"
              title="Refrescar datos"
            >
              <ArrowPathIcon className="h-5 w-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700">Refrescar</span>
            </button>
          </div>

          {/* Estadísticas */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-gray-600">
              <strong className="text-gray-900">{totalDevices}</strong>{" "}
              dispositivo{totalDevices !== 1 ? "s" : ""} total
              {totalDevices !== 1 ? "es" : ""}
            </span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <strong className="text-gray-900">{activeDevices}</strong> activo
              {activeDevices !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <strong className="text-gray-900">
                {totalDevices - activeDevices}
              </strong>{" "}
              offline
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="ml-auto text-sky-600 hover:text-sky-700 font-medium"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        {viewMode === "grouped" ? (
          /* Vista agrupada por ubicación */
          <div className="space-y-6">
            {filteredGroups.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto space-y-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {searchTerm
                      ? "No se encontraron dispositivos"
                      : "No hay dispositivos registrados"}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Intenta con otros términos de búsqueda"
                      : "Comienza agregando tu primer dispositivo"}
                  </p>
                  {!searchTerm && (
                    <Link to="/devices/new">
                      <button className="mt-4 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg transition-all font-medium">
                        <PlusIcon className="h-5 w-5" />
                        Agregar dispositivo
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <LocationDeviceGroup
                  key={group.locationId}
                  group={group}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        ) : (
          /* Vista de lista completa */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500 text-center py-8">
              Vista de tabla completa - Por implementar
            </p>
            {/* Aquí irá tu tabla con todas las columnas */}
          </div>
        )}
      </div>
    </div>
  );
}
