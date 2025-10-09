// components/LocationMap.tsx
"use client";

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import Swal from 'sweetalert2'; // Opcional: para mostrar errores de geolocalización

interface LocationMapProps {
  initialLat: string;
  initialLng: string;
  onCoordinatesChange: (lat: string, lng: string) => void;
  disabled: boolean;
}

// ----------------------------------------------------
// Componente interno para manejar clics y centrado
// ----------------------------------------------------
function MapEventHandler({ initialLat, initialLng, onCoordinatesChange, disabled }: LocationMapProps) {
  const map = useMapEvents({
    click: (e) => {
      if (disabled) return;
      onCoordinatesChange(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
    },
    load: () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  });

  // Lógica para centrar la vista SOLO cuando las props de edición cambian
  useEffect(() => {
    const newLat = parseFloat(initialLat);
    const newLng = parseFloat(initialLng);

    if (!isNaN(newLat) && !isNaN(newLng)) {
        const currentCenter = map.getCenter();
        const newPosition = L.latLng(newLat, newLng);

        // Si la nueva posición es significativamente diferente, centramos el mapa.
        if (!currentCenter.equals(newPosition, 1e-4)) {
            map.setView(newPosition, map.getZoom());
        }
    }
  }, [initialLat, initialLng, map]);

  return null;
}

// ----------------------------------------------------
// Componente principal del mapa
// ----------------------------------------------------
export default function LocationMap(props: LocationMapProps) {
  const { initialLat, initialLng, onCoordinatesChange, disabled } = props;

  // Coordenadas iniciales por defecto (ej. Lima)
  const DEFAULT_LAT = -12.0464;
  const DEFAULT_LNG = -77.0428;

  // Determinamos si ya tenemos una ubicación de edición válida
  const hasInitialData = !isNaN(parseFloat(initialLat)) && !isNaN(parseFloat(initialLng));
  const initialCoords: [number, number] = hasInitialData
    ? [parseFloat(initialLat), parseFloat(initialLng)]
    : [DEFAULT_LAT, DEFAULT_LNG];

  const [position, setPosition] = useState<[number, number]>(initialCoords);
  const [isGeolocated, setIsGeolocated] = useState(hasInitialData);


  // 🚨 NUEVO: useEffect para obtener la ubicación del usuario
  useEffect(() => {
    // Solo intentamos geolocalizar si NO estamos en modo edición con datos existentes
    if (!hasInitialData && 'geolocation' in navigator && !isGeolocated) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Actualizamos el estado local del mapa
          setPosition([lat, lng]);
          // Notificamos al formulario para que guarde esta posición
          onCoordinatesChange(lat.toFixed(6), lng.toFixed(6));
          setIsGeolocated(true);
        },
        (error) => {
          // Manejar errores (ej. usuario denegó permiso)
          console.error("Error de geolocalización:", error);
          Swal.fire({
            icon: 'warning',
            title: 'Ubicación no disponible',
            text: 'No pudimos obtener tu ubicación actual. Usando ubicación por defecto.',
          });
          setIsGeolocated(true); // Evitar reintentos
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [hasInitialData, onCoordinatesChange, isGeolocated]); // Dependencias para que se ejecute solo al inicio


  // Sincronizar el estado del marcador con las props (para edición o clic manual)
  useEffect(() => {
    const newLat = parseFloat(initialLat);
    const newLng = parseFloat(initialLng);

    if (!isNaN(newLat) && !isNaN(newLng)) {
      if (newLat !== position[0] || newLng !== position[1]) {
        setPosition([newLat, newLng]);
      }
    }
  }, [initialLat, initialLng]);


  // Función para manejar el cambio y actualizar el estado local y la prop externa (al hacer clic en el mapa)
  const handleMapChange = (lat: string, lng: string) => {
    if (disabled) return;
    setPosition([parseFloat(lat), parseFloat(lng)]);
    onCoordinatesChange(lat, lng);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Seleccionar Ubicación en el Mapa (Clic para mover marcador)
      </label>
      <div className={`h-80 w-full rounded-md shadow-inner overflow-hidden ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={!disabled}
          style={{ height: '100%', width: '100%' }}
          className={disabled ? 'pointer-events-none' : ''}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />

          <MapEventHandler {...props} />
        </MapContainer>
      </div>
    </div>
  );
}
