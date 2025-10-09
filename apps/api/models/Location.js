import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  img: { type: String, default: '' },
  coordinates: {
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
  }
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);
export default Location;
