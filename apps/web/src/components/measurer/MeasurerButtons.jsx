import { Icon } from "../Icons.jsx";

const MeasurerButtons = ({ navigate }) => (
  <div className="fixed bottom-6 right-6 flex gap-3">
    <button
      onClick={() => navigate("/ranking")}
      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 group relative overflow-hidden"
    >
      <Icon name="trophy" className="text-white relative z-10" />
      <span className="text-white font-medium relative z-10">Ranking</span>
    </button>

    <button
      onClick={() => navigate("/mapa")}
      className="px-5 py-3 bg-gray-800 hover:bg-gray-700 border border-emerald-400/30 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 group relative overflow-hidden"
    >
      <Icon name="map" className="text-emerald-400 relative z-10" />
      <span className="text-emerald-400 font-medium relative z-10">Mapa</span>
    </button>
  </div>
);

export default MeasurerButtons;
