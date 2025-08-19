import Sensors from "../models/sensorData.js";

export async function getSensors(req, res) {
  try {
    const sensors = await Sensors.find();
    res.status(200).json(sensors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function getSensorById(req, res) {
  try {
    const sensor = await Sensors.findById(req.params.id);

    if (!sensor) {
      return res
        .status(404)
        .json({
          error: `No se encontró el sensor con el id: ${req.params.id}`,
        });
    }
    res.status(200).json(sensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addSensorData(data) {
  const { sensorId, temperature, co2, airQuality, uvIndex } = data;

  try {
    const sensor = await Sensors.findOne({ deviceId: sensorId });
    if (!sensor) {
      throw new Error("Sensor no encontrado.");
    }

    const newData = { lastUpdate: new Date() };

    if (temperature !== null) newData.temperature = temperature;
    if (co2 !== null) newData.co2 = co2;
    if (airQuality !== null) newData.airQuality = airQuality;
    if (uvIndex !== null) newData.uvIndex = uvIndex;

    // evitar duplicados: revisamos el último dato guardado
    const lastEntry = sensor.sensorData[sensor.sensorData.length - 1];

    if (
      lastEntry &&
      lastEntry.temperature === newData.temperature &&
      lastEntry.co2 === newData.co2 &&
      lastEntry.airQuality === newData.airQuality &&
      lastEntry.uvIndex === newData.uvIndex
    ) {
      console.log("⏩ Lectura duplicada, no se guardó.");
      return lastEntry;
    }

    // si no es duplicado, lo guardamos
    sensor.sensorData.push(newData);
    await sensor.save();

    return newData;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Handler HTTP, usa addSensorData internamente
export async function addSensorDataHttp(req, res) {
  try {
    const newData = await addSensorData(req.body);
    res
      .status(201)
      .json({
        message: "Datos del sensor agregados correctamente",
        data: newData,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
