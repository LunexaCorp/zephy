import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-all duration-300">
              EcoRoute
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/measurer" className="text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300">
              Measurer
            </a>
            <a href="/ranking" className="text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300">
              Ranking
            </a>
            <a href="#" className="text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300">
              Mapa Interactivo
            </a>
            <a href="#" className="text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300">
              ¿Cómo Funciona?
            </a>
            <a href="#" className="ml-4 bg-green-500 text-gray-900 font-semibold px-4 py-2 rounded-full hover:bg-green-400 shadow-md transition-all duration-300">
              LUNEXA
            </a>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 focus:outline-none transition-all duration-300 transform hover:scale-110"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-2 pt-2 pb-4 space-y-2 bg-gray-900">
          <a href="#" className="block text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300">
            Inicio
          </a>
          <a href="#" className="block text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300">
            Ranking
          </a>
          <a href="#" className="block text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300">
            Mapa Interactivo
          </a>
          <a href="#" className="block text-gray-300 hover:text-green-400 px-3 py-2 rounded-md transition-colors duration-300">
            ¿Cómo Funciona?
          </a>
          <a href="#" className="block mt-3 bg-green-500 text-gray-900 font-semibold px-4 py-2 rounded-full text-center hover:bg-green-400 shadow-md transition-all duration-300">
            Ver Rutas
          </a>
        </div>
      </div>
    </nav>
  );
}
