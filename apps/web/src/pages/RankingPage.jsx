import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader.jsx";
import RankingHeader from "../components/ranking/RankingHeader.jsx";
import RankingCard from "../components/ranking/RankingCard.jsx";
import RankingTable from "../components/ranking/RankingTable.jsx";
import RankingFooter from "../components/ranking/RankingFooter.jsx";
import { useRankingData } from "../hooks/useRankingData.js";
import Podium from "../components/ranking/Podium.jsx";
import SEOHelmet from "../components/SEOHelmet.jsx";



const RankingPage = () => {
  const navigate = useNavigate();
  const { rankingData, loading, error } = useRankingData();



  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  const rankingSchema = {
    // ... definición de tu esquema List/ItemList
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ranking de Calidad Ambiental Puerto Maldonado",
    "itemListElement": rankingData.slice(0, 3).map((loc, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": loc.name,
      // ... más datos
    }))
  };

  return (
    <>
      <SEOHelmet
        title="Ranking de Calidad Ambiental"
        description="Descubre las zonas con mejor calidad ambiental en Puerto Maldonado..."
        keywords="ranking ambiental, mejores zonas puerto maldonado"
        canonical="/ranking"
        // 2. Pasa el objeto Schema a la propiedad 'schema'
        schema={rankingSchema}
      />

      <div className="min-h-screen bg-gray-900 text-white">
        <RankingHeader />

        <Podium rankingData={rankingData}/>
        <main className="max-w-6xl mx-auto p-4">
          {/* Versión mobile */}
          <div className="lg:hidden space-y-4">
            {rankingData.map((loc, index) => (
              <RankingCard key={loc.id} loc={loc} index={index} />
            ))}
          </div>

          {/* Versión escritorio */}
          <div className="hidden lg:block">
            <RankingTable rankingData={rankingData} />
          </div>

          <RankingFooter
            onHome={() => navigate("/")}
            onMap={() => navigate("/mapa")}
          />
        </main>
      </div>
    </>

  );
};

export default RankingPage;
