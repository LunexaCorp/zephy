import SensorReading from "../models/SensorReading.js";
import Device from "../models/Device.js";

// 1. Obtener todas las lecturas
export async function getSensors(req, res) {
  try {
    const readings = await SensorReading.find().sort({ timestamp: -1 });
    res.status(200).json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 2. Obtener una lectura por su ID
export async function getSensorById(req, res) {
  try {
    const reading = await SensorReading.findById(req.params.id);

    if (!reading) {
      return res.status(404).json({
        error: `No se encontró la lectura con el id: ${req.params.id}`,
      });
    }
    res.status(200).json(reading);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addSensorData(data) {
  const { deviceId, temperature, humidity, co2, airQuality, uvIndex, noiseLevel, distance } = data;

  if (!deviceId) {
    throw new Error("El ID del dispositivo es obligatorio.");
  }

  try {
    const newReading = await SensorReading.create({
      device: deviceId, // Usamos el campo 'device'
      timestamp: new Date(), // Usamos la hora del servidor (más fiable)
      temperature: temperature,
      humidity: humidity,
      co2: co2,
      airQuality: airQuality,
      uvIndex: uvIndex,
    });

    await Device.findByIdAndUpdate(deviceId, { lastActivity: new Date() });


    console.log(`✅ Nueva lectura guardada para Device: ${deviceId}`);
    return newReading;

  } catch (err) {
    throw new Error(`Error al guardar la lectura: ${err.message}`);
  }
}

// 4. Handler HTTP para la ingesta (Endpoint IoT)
export async function addSensorDataHttp(req, res) {
  try {
    // Los datos del cuerpo de la solicitud (req.body) se pasan a la función central
    const newReading = await addSensorData(req.body);
    res.status(201).json({
      message: "Datos del sensor agregados correctamente",
      data: newReading,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
