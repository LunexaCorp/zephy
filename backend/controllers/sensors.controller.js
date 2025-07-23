//import sensors from '../tests/data/sensors.json' with { type: 'json' };
import Sensors from '../models/sensor.js';

export async function getSensors(req, res) {
  try{
    const sensors = await Sensors.find();
    res.status(200).json(sensors);
  }catch(err){
    res.status(500).json({error: err});
  }
};

export async function getSensorById(req, res) {
  try{
    const sensors = await Sensors.findById(req.params.id);

    if(!sensors)
      return res.status(404).json({error: `No se encontró los datos del sensor con el id: ${req.params.id}`});
    res.status(200).json(sensors);
  }catch(err){
    res.status(500).json({error: err});
  }
};

