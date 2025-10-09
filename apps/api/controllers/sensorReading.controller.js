import SensorReading from "../models/SensorReading.js"; // Usamos el nombre del modelo actualizado
import Device from "../models/Device.js"; // Lo necesitamos para verificar el deviceId

// 1. Obtener todas las lecturas (usar solo para testing/admin con cuidado)
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

// 3. Lógica central para la ingesta de datos IoT
// Esta función debe ser RAPIDÍSIMA.
export async function addSensorData(data) {
  // Asegúrate de que tu ESP32 envíe 'deviceId' y no 'sensorId' o algo diferente
  const { deviceId, temperature, co2, airQuality, uvIndex, noiseLevel, distance } = data;

  if (!deviceId) {
    throw new Error("El ID del dispositivo es obligatorio.");
  }

  // Opcional: Podrías querer verificar si el dispositivo existe
  /*
  const deviceExists = await Device.findById(deviceId).lean();
  if (!deviceExists) {
     throw new Error("Dispositivo no encontrado.");
  }
  */

  try {
    // 💡 EL CAMBIO CLAVE: CREAR UN NUEVO DOCUMENTO en lugar de actualizar un array
    const newReading = await SensorReading.create({
      device: deviceId, // ✅ Usamos el campo 'device'
      timestamp: new Date(), // Usamos la hora del servidor (más fiable)
      temperature: temperature,
      co2: co2,
      airQuality: airQuality,
      uvIndex: uvIndex,
      // Agrega otros campos de sensor si vienen en la data
      noiseLevel: noiseLevel,
      distance: distance,
    });

    // Opcional: Actualizar el campo lastActivity en el dispositivo
    await Device.findByIdAndUpdate(deviceId, { lastActivity: new Date() });


    console.log(`✅ Nueva lectura guardada para Device: ${deviceId}`);
    return newReading;

  } catch (err) {
    // Es vital que la lógica IoT maneje los errores adecuadamente
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
    // En el contexto de IoT, un error 400 (Bad Request) o 500 (Server Error) es apropiado
    res.status(500).json({ error: err.message });
  }
}
