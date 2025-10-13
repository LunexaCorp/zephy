import { useState } from 'react';
import LoaderTime from "../common/LoaderTime.jsx";

const MeasurerImage = ({ currentData }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenMaps = (e) => {
    e.stopPropagation();
    if (currentData?.coordinates?.latitude && currentData?.coordinates?.longitude) {
      const { latitude, longitude } = currentData.coordinates;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const hasCoordinates = currentData?.coordinates?.latitude && currentData?.coordinates?.longitude;
  const hasImage = currentData?.locationImg;

  return (
    <>
      <div className="relative h-full overflow-hidden rounded-xl shadow-2xl border border-emerald-400/20
                      group flex items-center justify-center
                      transition-all duration-300 hover:shadow-emerald-500/20 hover:shadow-3xl
                      hover:border-emerald-400/40">
        {hasImage ? (
          <>
            <img
              src={currentData.locationImg}
              alt={currentData.locationName || 'Ubicación'}
              className="w-full h-full object-cover transform
                         group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badge con nombre de ubicación */}
            {currentData.locationName && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-600 to-emerald-700
                              backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-semibold">{currentData.locationName}</p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="absolute bottom-4 right-4 flex gap-2
                            opacity-0 group-hover:opacity-100
                            transform translate-y-2 group-hover:translate-y-0
                            transition-all duration-300">

              {/* Botón Ver en Pantalla Completa */}
              <button
                onClick={handleFullscreen}
                className="bg-white/90 backdrop-blur-sm hover:bg-white
                           text-gray-700 p-3 rounded-lg shadow-lg
                           transform hover:scale-110 active:scale-95
                           transition-all duration-200
                           group/btn"
                title="Ver en pantalla completa"
              >
                <svg
                  className="w-5 h-5 group-hover/btn:text-emerald-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>

              {/* Botón Google Maps */}
              {hasCoordinates && (
                <button
                  onClick={handleOpenMaps}
                  className="bg-emerald-600 hover:bg-emerald-700
                             text-white p-3 rounded-lg shadow-lg
                             transform hover:scale-110 active:scale-95
                             transition-all duration-200
                             group/btn"
                  title="Ver en Google Maps"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </button>
              )}
            </div>
          </>
        ) : (
          <LoaderTime />
        )}
      </div>

      {/* Modal Pantalla Completa */}
      {isFullscreen && hasImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm
                     flex items-center justify-center p-4
                     animate-in fade-in duration-300"
          onClick={closeFullscreen}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20
                       text-white p-3 rounded-full shadow-2xl
                       transform hover:scale-110 hover:rotate-90 active:scale-95
                       transition-all duration-300 z-10"
            title="Cerrar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Información superior */}
          {currentData.locationName && (
            <div className="absolute top-6 left-6 bg-gradient-to-r from-emerald-600 to-emerald-700
                            text-white px-6 py-3 rounded-xl shadow-2xl z-10
                            animate-in slide-in-from-left duration-500">
              <p className="text-lg font-bold">{currentData.locationName}</p>
              {hasCoordinates && (
                <p className="text-sm text-emerald-100 mt-1">
                  📍 {Number(currentData.coordinates.latitude).toFixed(4)}, {Number(currentData.coordinates.longitude).toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* Imagen en pantalla completa */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full
                       animate-in zoom-in duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentData.locationImg}
              alt={currentData.locationName || 'Ubicación'}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />

            {/* Botón Maps en modal */}
            {hasCoordinates && (
              <button
                onClick={handleOpenMaps}
                className="absolute bottom-6 right-6
                           bg-emerald-600 hover:bg-emerald-700
                           text-white px-6 py-3 rounded-xl shadow-2xl
                           flex items-center gap-2
                           transform hover:scale-105 active:scale-95
                           transition-all duration-200
                           animate-in slide-in-from-bottom duration-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="font-semibold">Ver en Google Maps</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MeasurerImage;
