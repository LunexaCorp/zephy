import Sensors from '../models/sensorData.js';

// GET /api/sensors
// Esta función ahora buscará el sensor y devolverá todo el documento,
// incluyendo el sub-arreglo 'sensorData'.
export async function getSensors(req, res) {
  try {
    const sensors = await Sensors.find();
    res.status(200).json(sensors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/sensors/:id
// Esta función busca un sensor específico por su ID.
export async function getSensorById(req, res) {
  try {
    const sensor = await Sensors.findById(req.params.id);

    if (!sensor) {
      return res.status(404).json({ error: `No se encontró el sensor con el id: ${req.params.id}` });
    }
    res.status(200).json(sensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscará el sensor por su ID y agregará el nuevo objeto de dato al arreglo 'sensorData'.
export async function addSensorData(req, res) {
  const { sensorId, temperature, co2, airQuality } = req.body;

  try {
    const sensor = await Sensors.findById(sensorId);

    if (!sensor) {
      return res.status(404).json({ error: 'Sensor no encontrado.' });
    }

    // Crea el nuevo objeto de dato
    const newData = {
      temperature,
      co2,
      airQuality,
      lastUpdate: new Date()
    };

    // Agrega el nuevo dato al arreglo 'sensorData'
    sensor.sensorData.push(newData);

    // Guarda el documento actualizado en la base de datos
    await sensor.save();

    res.status(201).json({ message: 'Datos del sensor agregados correctamente.', data: newData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
