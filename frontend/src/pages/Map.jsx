import React, { useState, useEffect } from "react";
import MapwithLocations from "../components/MapwithLocations";
import { getLocations, getLocationSensorData } from "../services/axios.js";
import {
  PercentageCalculation,
  getColorByPercentage,
} from "../utils/PercentageCalculation.js";
import Loader from "../components/Loader"; //mi componente favorito :D
import LocationCard from "../components/LocationCard";
import FilterPanel from "../components/FilterPanel";

const MapPage = () => {
  const [processedLocations, setProcessedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filter, setFilter] = useState("all");

  // Centro por defecto (Puerto Maldonado)
  const defaultCenter = [-12.6, -69.185];

  // Función para validar coordenadas
  const parseCoordinates = (lat, lng) => {
    try {
      return [parseFloat(lat), parseFloat(lng)];
    } catch {
      return defaultCenter; // Si hay error, usa el centro por defecto
    }
  };

  // Carga los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const locations = await getLocations();

        const locationsWithData = await Promise.all(
          locations.map(async (loc) => {
            const sensorData = (await getLocationSensorData(loc._id)) || {};
            const percentage = PercentageCalculation(sensorData);

            return {
              id: loc._id,
              name: loc.name,
              description: loc.description,
              position: parseCoordinates(loc.latitud, loc.longitud), // Usa coordenadas del backend
              img: loc.img,
              percentage,
              color: getColorByPercentage(percentage),
              lastUpdated: new Date().toLocaleTimeString(),
              radius: 80 + percentage / 2, // Radio dinámico basado en calidad
              sensorData: {
                temperature: sensorData.temperature ?? 0,
                co2: sensorData.co2 ?? 0,
                airQuality: sensorData.airQuality ?? 0,
              },
            };
          })
        );

        setProcessedLocations(locationsWithData);
      } catch (err) {
        setError("Error al cargar datos del mapa");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Actualiza 2 minutos
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  // Filtra ubicaciones
  const filteredLocations = processedLocations.filter((loc) => {
    if (filter === "all") return true;
    if (filter === "healthy") return loc.percentage >= 70;
    if (filter === "moderate")
      return loc.percentage >= 40 && loc.percentage < 70;
    return loc.percentage < 40;
  });

  //if (loading) return <Loader message="Cargando mapa ambiental..." />;
  /**
   if (loading) {
    return (
      <div className="absolute top-4 right-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Actualizando datos...</span>
      </div>
    );
  }

  */

  if (error)
    return <div className="text-red-500 text-center p-10">{error}</div>;

  return (
    <div className="relative h-screen w-full bg-gray-900">
      {/* Mapa */}
      <div className="absolute inset-0 z-0">
        <MapwithLocations
          locations={filteredLocations}
          defaultCenter={defaultCenter}
          onMarkerClick={(location) => {
            // Cierra el modal si se hace clic en el mismo marcador
            setSelectedLocation((prev) =>
              prev?.id === location.id ? null : location
            );
          }}
        />
      </div>

      {/* Filtrador */}
      <div className="absolute z-10 p-4 w-full pointer-events-none">
        <header className="bg-black/80 backdrop-blur-sm rounded-xl p-4 max-w-4xl mx-auto border border-emerald-500/30 shadow-2xl">
          <h1 className="text-2xl font-bold text-center text-white">
            <span className="text-emerald-400">Zephy</span> Mapa Ambiental
          </h1>
          <p className="text-center text-emerald-200 text-sm mt-1">
            Monitoreo en tiempo real - {new Date().toLocaleDateString()}
          </p>
        </header>

        <FilterPanel
          currentFilter={filter}
          onChangeFilter={setFilter}
          className="mt-4 mx-auto"
        />
      </div>

      {/* Modal de ubicación seleccionada */}
      {selectedLocation && (
        <div
          className={`
    absolute z-10 pointer-events-auto
    bottom-4 left-8 transform -translate-x-px
    w-[calc(100%-2rem)] max-w-md
    lg:left-4 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:bottom-auto
    transition-all duration-300
  `}
        >
          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}

      {/* Leyenda */}
      <div
        className={`
        absolute bottom-20 right-4 bg-black/70 backdrop-blur rounded-lg p-3 border border-gray-600 pointer-events-auto
        ${
          selectedLocation ? "z-5" : " z-10 " //oculta si el modal esta abierto
        }
        transition-all duration-300
      `}
      >
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
          <span className="text-white text-sm">Saludable (70-100%)</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
          <span className="text-white text-sm">Moderado (40-69%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-white text-sm">Peligroso (0-39%)</span>
        </div>
      </div>

      {/* Actualizacion de datos */}
      {loading && (
        <div className="absolute bottom-20 left-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg flex items-center space-x-2 animate-pulse">
          <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Actualizando datos...</span>
        </div>
      )}
    </div>
  );
};

export default MapPage;

//if (loading) return <Loader message="Cargando mapa ambiental..." />;
