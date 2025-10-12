"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import LocationCardGrid from "../components/locations/LocationCardGrid";
import { useLocations } from "../hooks/useLocations";

export default function LocationsPage() {
  const { locations, loading, fetchLocations, removeLocation } = useLocations();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "recent">("name");

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("ID es undefined o vacío");
      return;
    }

    if (confirm("¿Seguro que deseas eliminar esta ubicación?")) {
      const result = await removeLocation(id);

      if (result.success) {
        // Notificación de éxito (puedes usar toast libraries)
        console.log("✅ Ubicación eliminada exitosamente");
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  const handleRefresh = async () => {
    await fetchLocations();
  };

  // Filtrado y ordenamiento
  const filteredLocations = locations
    .filter((loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      // Para "recent", necesitarías un campo createdAt en tu modelo
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Cargando ubicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con título y botón de acción */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Localidades
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona las ubicaciones del sistema Zephy
            </p>
          </div>

          <Link to="/locations/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg shadow-md transition-all font-medium"
            >
              <PlusIcon className="h-5 w-5" />
              Nueva ubicación
            </motion.button>
          </Link>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Ordenar */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "recent")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none cursor-pointer"
              >
                <option value="name">Alfabético</option>
                <option value="recent">Más recientes</option>
              </select>
            </div>

            {/* Refrescar */}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition"
              title="Refrescar lista"
            >
              <ArrowPathIcon className="h-5 w-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700">Refrescar</span>
            </button>
          </div>

          {/* Estadísticas */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {filteredLocations.length} {filteredLocations.length === 1 ? "ubicación" : "ubicaciones"}
              {searchTerm && ` encontrada${filteredLocations.length !== 1 ? "s" : ""}`}
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </div>

        {/* Grid de ubicaciones */}
        {filteredLocations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {searchTerm ? "No se encontraron resultados" : "No hay ubicaciones"}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando tu primera ubicación"}
              </p>
              {!searchTerm && (
                <Link to="/locations/new">
                  <button className="mt-4 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg transition-all font-medium">
                    <PlusIcon className="h-5 w-5" />
                    Agregar ubicación
                  </button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <LocationCardGrid
            locations={filteredLocations}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
