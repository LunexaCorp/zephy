import React from "react";
import MapwithLocations from "../components/MapwithLocations";
import { locations } from "../data/locations";
import { sensorData } from "../data/sensorData";
import { PercentageCalculation } from "../utils/PercentageCalculation";
import { getColorByPercentage } from "../utils/PercentageCalculation";

const processLocationData = () => {
  return locations.map((location) => {
    const data = sensorData[location.id];
    const percentage = PercentageCalculation(data);
    const color = getColorByPercentage(percentage);

    return {
      ...location,
      sensorData: data,
      percentage,
      color,
    };
  });
};

const Map = () => {
  const processedLocations = processLocationData();

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapwithLocations locations={processedLocations} />
    </div>
  );
};

export default Map;
