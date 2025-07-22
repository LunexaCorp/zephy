import mongoose from 'mongoose';

//Primero se define el modelo del esquema
const deviceSchema = new mongoose.Schema({
  name : String,
  type:  String,
  isEnabled: Boolean,
  locationId: Number
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
