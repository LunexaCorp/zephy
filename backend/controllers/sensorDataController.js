//import sensorData from '../tests/data/sensorData.json' with { type: 'json' };
import SensorData from '../models/sensorData.js';

export async function getSensorData(req, res) {
  try{
    const sensorData = await SensorData.find();
    res.status(200).json(sensorData);
  }catch(err){
    res.status(500).json({error: err});
  }
};

export async function getSensorDataById(req, res) {
  try{
    const sensorData = await SensorData.findById(req.params.id);

    if(!sensorData)
      return res.status(404).json({error: `No se encontró la ubicación con el id: ${req.params.id}`});
    res.status(200).json(sensorData);
  }catch(err){
    res.status(500).json({error: err});
  }
};

