import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name : String,
  description : String,
  img : String
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
