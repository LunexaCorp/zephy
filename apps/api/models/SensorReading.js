import mongoose from 'mongoose';

const sensorReadingSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
    index: true // Indice clave para buscar por dispositivo
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true // Indice clave para series de tiempo
  },
  // Datos Ambientales
  temperature: { type: Number  },
  humidity: { type: Number },
  co2: { type: Number },
  airQuality: { type: Number },
  uvIndex: { type: Number },
});

// Índice compuesto para optimizar las consultas de series de tiempo
sensorReadingSchema.index({ device: 1, timestamp: -1 });

const SensorReading = mongoose.model('SensorReading', sensorReadingSchema, 'sensorReadings');
export default SensorReading;
