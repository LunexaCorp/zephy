import Location from '../models/Location.js';
import Device from '../models/Device.js';

export async function getLocations(req, res) {
  try{
    const locations = await Location.find();
    res.status(200).json(locations);
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

export async function getLocationById(req, res) {
  try{
    const location = await Location.findById(req.params.id);

    if(!location)
      // Corregido: location.name no existe si location es null
      return res.status(404).json({error: `No se encontró la ubicación con el id: ${req.params.id}`});
    res.status(200).json(location);
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

export async function getDevicesByLocationId(req, res) {
  try{
    const { locationId } = req.params;
    // ✅ Corregido: El campo de referencia en Device ahora es 'location'
    const devices = await Device.find({ location: locationId });
    res.status(200).json(devices);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}
