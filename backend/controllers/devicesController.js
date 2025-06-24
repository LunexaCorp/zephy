//import Devices from '../tests/data/devices.json' with { type: 'json' };
import Device from '../models/device.js';


//2. rescata los datos de la base de datos y los devuelve en un json
export async function getDevices(req, res) {
  try{
    const devices = await Device.find();
    res.status(200).json(devices);
  }catch(err){
    res.status(500).json({error: err});
  }
};

export async function getDeviceById(req, res) {
  try{
    const device = await Device.findById(req.params.id);

    if(!device)
      return res.status(404).json({error: `No se encontró el dispositivo con el id: ${req.params.id}`});
    res.status(200).json(device);
  }catch(err){
    res.status(500).json({error: err});
  }
};
