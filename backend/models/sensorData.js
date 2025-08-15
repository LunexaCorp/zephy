import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Sensor',
    required: true
  },
  date: Date,
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true}
  }
);

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;
