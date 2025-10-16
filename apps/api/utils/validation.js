export const SENSOR_RANGES = {
  temperature: { min: -50, max: 100 },
  humidity: { min: 0, max: 100 },
  airQuality: { min: 0, max: 500 }
};

export const isValidSensorValue = (fieldName, value) => {
  if (isNaN(value) || !isFinite(value)) return false;
  const range = SENSOR_RANGES[fieldName];
  return range ? value >= range.min && value <= range.max : true;
};
