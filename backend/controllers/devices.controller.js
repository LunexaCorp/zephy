//import Devices from '../tests/data/devices.json' with { type: 'json' };
import Device from '../models/device.js';
import Sensor from '../models/sensorData.js';

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

export async function getSensorsByDeviceId(req, res) {
  try{
    const { deviceId } = req.params;
    const sensors = await Sensor.find({deviceId});
    res.status(200).json(sensors);
  }catch(err){
    res.status(500).json({error: err});
  }
}

//Traer los ultimos datos lanzados por los sensores
/*export async function getLastDataByDeviceId(req, res) {
  try{
    const { deviceId } = req.params;
    const sensors = await Sensor.find({deviceId});
    res.status(200).json(sensors);
    const last = sensors.
  }catch(err){
    res.status(500).json({error: err});
  }
}
  */
