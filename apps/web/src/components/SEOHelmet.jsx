import { Helmet } from 'react-helmet-async';

/**
 * Componente SEOHelmet para meta tags dinámicos
 * Usar en cada página para optimizar SEO
 */
const SEOHelmet = ({
                     title,
                     description,
                     keywords,
                     canonical,
                     ogImage = '/og-zephy-dashboard.jpg',
                     ogType = 'website',
                     schema
                   }) => {
  const baseUrl = 'https://zephy.app';
  const fullUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullTitle = title ? `${title} | Zephy` : 'Zephy - Monitoreo Ambiental en Tiempo Real | Puerto Maldonado';

  return (
    <Helmet>
      {/* Título */}
      <title>{fullTitle}</title>

      {/* Meta básicos */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />

      {/* Schema.org JSON-LD adicional si se proporciona */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHelmet;


// ============================================
// EJEMPLOS DE USO EN TUS PÁGINAS
// ============================================

/*
// 1. En MeasurerPage.jsx
import SEOHelmet from '../components/SEOHelmet';

const MeasurerPage = () => {
  const { dashboardData, currentLocation } = useMeasurerData();

  return (
    <>
      <SEOHelmet
        title={`Dashboard - ${dashboardData?.locationName || 'Cargando'}`}
        description={`Monitoreo en tiempo real de ${dashboardData?.locationName}. Temperatura: ${dashboardData?.sensorData?.temperature}°C, Humedad: ${dashboardData?.sensorData?.humidity}%, Calidad del aire en tiempo real.`}
        keywords="dashboard ambiental, temperatura puerto maldonado, calidad aire tiempo real, sensor IoT"
        canonical="/medidor"
        ogImage="/og-dashboard.jpg"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900">
        {/* Tu contenido actual... *\/}
      </div>
    </>
  );
};

// 2. En MapPage.jsx
import SEOHelmet from '../components/SEOHelmet';

const MapPage = () => {
  const { filteredLocations } = useMapData();

  const mapSchema = {
    "@context": "https://schema.org",
    "@type": "Map",
    "name": "Mapa de Sensores Zephy",
    "description": "Mapa interactivo con sensores ambientales en Puerto Maldonado"
  };

  return (
    <>
      <SEOHelmet
        title="Mapa de Sensores Ambientales"
        description={`Mapa interactivo con ${filteredLocations.length} sensores ambientales en Puerto Maldonado. Consulta temperatura, humedad y calidad del aire en diferentes zonas de la ciudad.`}
        keywords="mapa sensores IoT, puerto maldonado temperatura, zonas calidad aire, mapa climático"
        canonical="/mapa"
        ogImage="/og-mapa.jpg"
        schema={mapSchema}
      />

      <div className="relative h-screen w-full bg-gray-900">
        {/* Tu contenido actual... *\/}
      </div>
    </>
  );
};

// 3. En RankingPage.jsx
import SEOHelmet from '../components/SEOHelmet';

const RankingPage = () => {
  const { rankingData } = useRankingData();

  const rankingSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ranking de Calidad Ambiental Puerto Maldonado",
    "description": "Clasificación de zonas según calidad ambiental",
    "itemListElement": rankingData.slice(0, 3).map((loc, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": loc.name,
      "description": `Puntuación ambiental: ${loc.score}`
    }))
  };

  return (
    <>
      <SEOHelmet
        title="Ranking de Calidad Ambiental"
        description="Descubre las zonas con mejor calidad ambiental en Puerto Maldonado. Ranking actualizado en tiempo real según temperatura, humedad y calidad del aire."
        keywords="ranking ambiental, mejores zonas puerto maldonado, calidad aire ranking, temperatura por zonas"
        canonical="/ranking"
        ogImage="/og-ranking.jpg"
        schema={rankingSchema}
      />

      <div className="min-h-screen bg-gray-900 text-white">
        {/* Tu contenido actual... *\/}
      </div>
    </>
  );
};
*/
