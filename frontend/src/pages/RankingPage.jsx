import { sensorData } from "../data/sensorData";
import { PercentageCalculation } from "../utils/PercentageCalculation";
import { useNavigate } from "react-router-dom";

const RankingPage = () => {
  const navigate = useNavigate();

  const LocacionRanking = Object.entries(sensorData)
    .map(([id, data]) => ({
      id,
      ...data,
      index: PercentageCalculation(data),
    }))
    .sort((a, b) => b.index - a.index);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-black px-4 py-6 border-b border-emerald-500">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-emerald-400">
            <span className="text-white">LUNEXA</span> EcoRoute
          </h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4">
        {/* Tarjeta de presentacion */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-emerald-400/20 mb-2">
          <div className="p-6 bg-gradient-to-r from-black to-gray-900">
            <h2 className="text-2xl font-bold text-emerald-400 mb-2 flex items-center">
              <span className="inline-block w-3 h-8 bg-emerald-500 mr-3"></span>
              Ranking de Calidad Ambiental
            </h2>
            <p className="text-gray-400">
              Zonas monitoreadas por sensores de EcoRoute
            </p>
          </div>
        </div>
        {/* Versión mobile */}
        <div className="lg:hidden space-y-4">
          {LocacionRanking.map((loc, index) => (
            <div
              key={loc.id}
              className="bg-gray-800 rounded-lg p-4 border-l-4 border-emerald-500 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-gray-400">#{index + 1}</span>
                  <h3 className="text-lg font-bold">{loc.location}</h3>
                </div>
                {/*Estilo dependiendo al index*/}
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    loc.index >= 70
                      ? "bg-emerald-900 text-emerald-300"
                      : loc.index >= 40
                      ? "bg-amber-900 text-amber-300"
                      : "bg-red-900 text-red-300"
                  }`}
                >
                  {loc.index >= 70
                    ? "SALUDABLE"
                    : loc.index >= 40
                    ? "MODERADO"
                    : "PELIGROSO"}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Puntaje</span>
                  <span className="font-bold">{Math.round(loc.index)}/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      loc.index >= 70
                        ? "bg-emerald-500"
                        : loc.index >= 40
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${loc.index}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Versión computadoras*/}
        <div className="hidden lg:block">
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-emerald-400/20">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-900 to-emerald-800">
                <tr>
                  <th className="p-4 text-left text-emerald-200">#</th>
                  <th className="p-4 text-left text-emerald-200">Ubicación</th>
                  <th className="p-4 text-left text-emerald-200">Puntaje</th>
                  <th className="p-4 text-left text-emerald-200">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {LocacionRanking.map((loc, index) => (
                  <tr
                    key={loc.id}
                    className="hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="p-4 font-mono text-gray-300">{index + 1}</td>
                    <td className="p-4 font-medium">{loc.location}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-700 rounded-full h-2.5 mr-3">
                          <div
                            className={`h-2.5 rounded-full ${
                              loc.index >= 70
                                ? "bg-emerald-500"
                                : loc.index >= 40
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${loc.index}%` }}
                          ></div>
                        </div>
                        <span className="font-bold">
                          {Math.round(loc.index)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          loc.index >= 70
                            ? "bg-emerald-900/50 text-emerald-300"
                            : loc.index >= 40
                            ? "bg-amber-900/50 text-amber-300"
                            : "bg-red-900/50 text-red-300"
                        }`}
                      >
                        {loc.index >= 70
                          ? "SALUDABLE"
                          : loc.index >= 40
                          ? "MODERADO"
                          : "PELIGROSO"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Derechos reservados &copy; 2025 EcoRoute. Todos los derechos
          reservados.
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
          >
            Volver al Medidor
          </button>
          <button
            onClick={() => navigate("/mapa")}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Ver Mapa
          </button>
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
