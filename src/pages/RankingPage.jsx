import { sensorData } from '../data/sensorData';
import {PercentageCalculation} from '../utils/PercentageCalculation.js';
import { useNavigate } from 'react-router-dom';

const RankingPage = () => {
  const navigate = useNavigate();

  // Ordena las ubicaciones por índice de calidad
  const rankedLocations = Object.entries(sensorData)
    .map(([id, data]) => ({
      id,
      ...data,


      index: PercentageCalculation(data),
    }))
    .sort((a, b) => b.index - a.index);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black px-4 py-5 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">Ranking de Zonas</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-3 text-left">Posición</th>
                <th className="p-3 text-left">Ubicación</th>
                <th className="p-3 text-left">Índice</th>
                <th className="p-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rankedLocations.map((loc, index) => (
                <tr key={loc.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{loc.location}</td>
                  <td className="p-3">{Math.round(loc.index)}/100</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${loc.index >= 70 ? "bg-emerald-100 text-emerald-800" :
                      loc.index >= 40 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                      }`}>
                      {loc.index >= 70 ? "Saludable" : loc.index >= 40 ? "Moderado" : "Peligroso"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
