import { Thermometer, Droplet, Wind } from 'lucide-react';

export const RANGES_CONFIG = [
  {
    section: 'temperature',
    title: 'Temperatura (°C)',
    icon: Thermometer,
    fields: [
      { key: 'optimalMin', label: 'Rango Óptimo Mínimo' },
      { key: 'optimalMax', label: 'Rango Óptimo Máximo' },
      { key: 'toleranceLow', label: 'Tolerancia hacia Frío' },
      { key: 'toleranceHigh', label: 'Tolerancia hacia Calor' },
    ],
    rangeInfo: ({ temperature }) =>
      `${temperature.optimalMin - temperature.toleranceLow}°C a ${temperature.optimalMax + temperature.toleranceHigh}°C`,
  },
  {
    section: 'humidity',
    title: 'Humedad Relativa (%)',
    icon: Droplet,
    fields: [
      { key: 'optimalMin', label: 'Rango Óptimo Mínimo' },
      { key: 'optimalMax', label: 'Rango Óptimo Máximo' },
      { key: 'toleranceLow', label: 'Tolerancia hacia Seco' },
      { key: 'toleranceHigh', label: 'Tolerancia hacia Húmedo' },
    ],
    rangeInfo: ({ humidity }) =>
      `${humidity.optimalMin - humidity.toleranceLow}% a ${humidity.optimalMax + humidity.toleranceHigh}%`,
  },
  {
    section: 'airQuality',
    title: 'Calidad del Aire (MQ135)',
    icon: Wind,
    fields: [
      { key: 'excellent', label: 'Excelente (≤)' },
      { key: 'good', label: 'Bueno (≤)' },
      { key: 'moderate', label: 'Moderado (≤)' },
      { key: 'poor', label: 'Pobre (≤)' },
      { key: 'hazardous', label: 'Peligroso (≤)', fullWidth: true },
    ],
  },
];

export const WEIGHTS_CONFIG = [
  { key: 'temperature', label: 'Temperatura', icon: Thermometer, color: 'emerald' },
  { key: 'humidity', label: 'Humedad', icon: Droplet, color: 'blue' },
  { key: 'airQuality', label: 'Calidad del Aire', icon: Wind, color: 'purple' },
];
