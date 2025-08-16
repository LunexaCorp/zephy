import React from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para íconos rotos en producción
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapwithLocations = ({
  locations = [],
  defaultCenter = [-12.6, -69.185],
  onMarkerClick = () => {},
}) => {
  // Estilo dinámico para los círculos
  const getCircleStyle = (color) => ({
    color,
    fillColor: color,
    fillOpacity: 0.4,
    weight: 2,
    opacity: 0.8,
  });

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {locations.map((location) => (
        <Circle
          key={location.id}
          center={location.position}
          radius={location.radius}
          pathOptions={getCircleStyle(location.color)}
          eventHandlers={{
            click: () => onMarkerClick(location),
          }}
        >
          <Popup className="custom-popup">
            <div className="text-center p-2 min-w-[180px]">
              <h3
                className="font-bold text-lg mb-1"
                style={{ color: location.color }}
              >
                {location.name}
              </h3>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${location.percentage}%`,
                    backgroundColor: location.color,
                  }}
                />
              </div>

              <p className="text-sm mb-2">
                Calidad: <strong>{location.percentage}%</strong>
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkerClick(location);
                }}
                className="px-3 py-1 rounded text-white font-medium transition-colors"
                style={{ backgroundColor: location.color }}
              >
                Ver detalles
              </button>
            </div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
};

export default MapwithLocations;
