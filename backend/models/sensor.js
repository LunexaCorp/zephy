import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  name : String,
  deviceId: Number,
  isConnected: Boolean
});

const Sensor = mongoose.model('Sensor', sensorSchema);

export default Sensor;
