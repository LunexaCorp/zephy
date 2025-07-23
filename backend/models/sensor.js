import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  name : String,
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Device',
    required: true
  },
  isConnected: Boolean
});

const Sensor = mongoose.model('Sensor', sensorSchema);

export default Sensor;
