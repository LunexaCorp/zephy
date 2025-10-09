//import locations from '../tests/data/locations.json' with { type: 'json' };
import Location from '../models/location.js';
import Device from '../models/device.js';

export async function getLocations(req, res) {
  try{
    const locations = await Location.find();
    res.status(200).json(locations);
  }catch(err){
    res.status(500).json({error: err});
  }
};

export async function getLocationById(req, res) {
  try{
    const location = await Location.findById(req.params.id);

    if(!location)
      return res.status(404).json({error: `No se encontró la ubicación ${location.name}`});
    res.status(200).json(location);
  }catch(err){
    res.status(500).json({error: err});
  }
};

export async function getDevicesByLocationId(req, res) {
  try{
    const { locationId } = req.params;
    const devices = await Device.find({locationId});
    res.status(200).json(devices);
  }catch(err){
    res.status(500).json({error: err});
  }
}


