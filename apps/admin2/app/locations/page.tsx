"use client";

import { motion } from "framer-motion";
import AddButton from "@/app/components/AddButton";
import LocationDataProvider from "@/app/components/LocationDataProvider";

export default function LocationsPage() {
  return (
    <motion.div
      className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header animado */}
      <motion.div
        className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight">
          Administración de Ubicaciones
        </h1>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <AddButton href="/locations/new" text="Añadir Nueva Ubicación" />
        </motion.div>
      </motion.div>

      {/* Contenido principal con leve fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
      >
        <LocationDataProvider />
      </motion.div>
    </motion.div>
  );
}
