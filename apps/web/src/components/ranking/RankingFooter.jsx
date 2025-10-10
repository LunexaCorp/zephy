import { Github, MapPin, Home } from "lucide-react";

const RankingFooter = ({ onHome, onMap }) => {
  return (
    <footer className="relative mt-12 border-t border-emerald-500/40 bg-gray-900/60 backdrop-blur-md py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-5 text-center">

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onHome}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium text-white transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Volver al Medidor
          </button>

          <button
            onClick={onMap}
            className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-gray-200 transition-all hover:scale-105"
          >
            <MapPin className="w-4 h-4" />
            Ver Mapa
          </button>
        </div>

        {/* Línea divisoria */}
        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent my-2" />

        {/* Info del proyecto */}
        <p className="text-sm text-gray-400">
          Proyecto <span className="text-emerald-400 font-semibold">Zephy</span> — código abierto 🌍
        </p>

        {/* Enlace opcional al repositorio */}
        <a
          href="https://github.com/LunexaCorp/zephy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm"
        >
          <Github className="w-4 h-4" />
          Ver en GitHub
        </a>
      </div>
    </footer>
  );
};

export default RankingFooter;
