import mongoose from 'mongoose';

//Primero se define el modelo del esquema
const deviceSchema = new mongoose.Schema({
  name : String,
  type:  String,
  isEnabled: Boolean,
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Location',
    required: true
  }
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
