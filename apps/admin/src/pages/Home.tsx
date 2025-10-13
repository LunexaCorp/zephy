import { MapPin, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Zephy Panel</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenido a Zephy Panel
            </h2>
            <p className="text-gray-600 text-lg">
              Gestiona tus ubicaciones y dispositivos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8">
            {/* Locations Link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <a href="/locations">
                <div className="group relative overflow-hidden rounded-2xl bg-blue-50 border border-blue-200 p-8 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-blue-100/0 group-hover:bg-blue-100/50 transition-all duration-300" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <MapPin className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Ubicaciones
                    </h3>
                    <p className="text-gray-600 text-center text-sm">
                      Administra tus ubicaciones registradas
                    </p>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Devices Link */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a href="/devices">
                <div className="group relative overflow-hidden rounded-2xl bg-purple-50 border border-purple-200 p-8 hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-purple-100/0 group-hover:bg-purple-100/50 transition-all duration-300" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <Cpu className="w-12 h-12 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Dispositivos
                    </h3>
                    <p className="text-gray-600 text-center text-sm">
                      Controla tus dispositivos conectados
                    </p>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
