import React, { useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "none",
    borderRadius: "10px",
    padding: "20px",
    maxWidth: "80%",
    maxHeight: "80vh",
    overflow: "auto",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

Modal.setAppElement("#root");

const MapwithLocations = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (location) => {
    setSelectedLocation(location);
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  return (
    <div style={{ height: "calc(100vh - 50px)", width: "100%" }}>
      <MapContainer
        center={[-12.59416, -69.176546]}
        zoom={20}
        style={{ height: "100%", width: "100%" }}
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
            color={location.color}
            fillOpacity={0.3}
            eventHandlers={{
              click: () => openModal(location),
            }}
          >
            <Popup>
              <div style={{ textAlign: "center", padding: "10px" }}>
                <h3 style={{ margin: "0 0 5px 0", color: location.color }}>
                  {location.name}
                </h3>
                <p style={{ margin: "5px 0" }}>
                  Estado: {location.percentage}%
                </p>
                <button
                  onClick={() => openModal(location)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: location.color,
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Ver detalles
                </button>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Información de Zona"
      >
        {selectedLocation && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              {selectedLocation.img && (
                <img
                  src={selectedLocation.img}
                  alt={selectedLocation.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginRight: "10px",
                  }}
                />
              )}
              <div>
                <h2
                  style={{ margin: "0 0 5px 0", color: selectedLocation.color }}
                >
                  {selectedLocation.name}
                </h2>
                <p style={{ margin: "0", color: "#666" }}>
                  {selectedLocation.description}
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ marginTop: "0" }}>Estado Ambiental</h3>
              <div
                style={{
                  height: "25px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${selectedLocation.percentage}%`,
                    height: "100%",
                    backgroundColor: selectedLocation.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {selectedLocation.percentage}%
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <h3 style={{ marginTop: "0" }}>Datos del Sensor</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                <div>
                  <strong>Temperatura:</strong>{" "}
                  {selectedLocation.sensorData?.temperature}°C
                </div>
                <div>
                  <strong>CO₂:</strong> {selectedLocation.sensorData?.co2} ppm
                </div>
                <div>
                  <strong>Calidad Aire:</strong>{" "}
                  {selectedLocation.sensorData?.airQuality}/100
                </div>
                <div>
                  <strong>Viento:</strong> {selectedLocation.sensorData?.wind}{" "}
                  km/h
                </div>
              </div>
            </div>

            <button
              onClick={closeModal}
              style={{
                padding: "8px 16px",
                backgroundColor: selectedLocation.color,
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                float: "right",
              }}
            >
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MapwithLocations;
