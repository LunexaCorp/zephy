import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  co2: { type: Number, required: true },
  airQuality: { type: Number, required: true },
  lastUpdate: { type: Date, default: Date.now },
});

const deviceSensorSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  sensorData: [sensorDataSchema],
}, { timestamps: true });

const sensorData = mongoose.model('sensorData', deviceSensorSchema, 'sensorData');

export default sensorData;
