import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  serialNumber: { type: String, required: true, unique: true, index: true }, // Clave para el IoT
  type: { type: String, enum: ['ESP32', 'Arduino', 'Otro'], default: 'ESP32' },
  isEnabled: { type: Boolean, default: true },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    index: true
  },
  lastActivity: { type: Date, default: Date.now }
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);
export default Device;
