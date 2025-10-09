import Device from '../models/Device.js';
import SensorReading from '../models/SensorReading.js';

// 1. Obtener todos los dispositivos, poblando la ubicación
export async function getDevices(req, res) {
  try{
    const devices = await Device.find().populate('location'); // ✅ Usamos 'location'
    res.status(200).json(devices);
  }catch(err){
    // Es mejor devolver el error.message en lugar del objeto error
    res.status(500).json({error: err.message});
  }
};

// 2. Obtener un dispositivo por ID, poblando la ubicación
export async function getDeviceById(req, res) {
  try{
    const device = await Device.findById(req.params.id).populate('location'); // ✅ Usamos 'location'

    if(!device)
      return res.status(404).json({error: `No se encontró el dispositivo con el id: ${req.params.id}`});
    res.status(200).json(device);
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

// 3. Obtener TODAS las lecturas de un dispositivo
export async function getSensorsByDeviceId(req, res) {
  try{
    const { deviceId } = req.params;
    // El campo de referencia ahora se llama 'device'
    const readings = await SensorReading.find({ device: deviceId }).sort({ timestamp: -1 });
    res.status(200).json(readings);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

// 4. Traer los ultimos datos lanzados por los sensores (Función activada y mejorada)
export async function getLastDataByDeviceId(req, res) {
  try{
    const { deviceId } = req.params;

    // Busca y devuelve solo el documento más reciente
    const latestReading = await SensorReading.findOne({ device: deviceId })
      .sort({ timestamp: -1 })
      .limit(1)
      .exec();

    if (!latestReading) {
      return res.status(404).json({ error: "No se encontraron datos para este dispositivo." });
    }

    res.status(200).json(latestReading);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}
