// controllers/statistics.controller.js
import SensorReading from "../models/SensorReading.js";
import Device from "../models/Device.js";
import Location from "../models/Location.js";

// Resumen de todas las ubicaciones
export async function getStatisticsSummaries(req, res) {
  try {
    const locations = await Location.find();

    const summaries = await Promise.all(
      locations.map(async (location) => {
        const devices = await Device.find({ location: location._id });
        const deviceIds = devices.map(d => d._id);

        // Última lectura de cada dispositivo
        const latestReadings = await Promise.all(
          deviceIds.map(deviceId =>
            SensorReading.findOne({ device: deviceId })
              .sort({ timestamp: -1 })
              .limit(1)
          )
        );

        const validReadings = latestReadings.filter(r => r);

        // Calcular promedios y estado
        const avgTemp = validReadings.length > 0
          ? validReadings.reduce((sum, r) => sum + (r.temperature || 0), 0) / validReadings.length
          : null;

        const avgHum = validReadings.length > 0
          ? validReadings.reduce((sum, r) => sum + (r.humidity || 0), 0) / validReadings.length
          : null;

        const avgAirQuality = validReadings.length > 0
          ? validReadings.reduce((sum, r) => sum + (r.airQuality || 0), 0) / validReadings.length
          : null;

        // Determinar estado (puedes personalizar estos límites)
        let status = "offline";
        if (validReadings.length > 0) {
          const lastUpdate = new Date(Math.max(...validReadings.map(r => new Date(r.timestamp).getTime())));
          const minutesAgo = (Date.now() - lastUpdate.getTime()) / 60000;

          if (minutesAgo < 5) {
            status = "ok";
            if (avgTemp > 30 || avgAirQuality > 1000) status = "warning";
            if (avgTemp > 35 || avgAirQuality > 2000) status = "danger";
          }
        }

        return {
          locationId: location._id,
          locationName: location.name,
          locationImage: location.img,
          deviceCount: devices.length,
          latestValues: {
            temperature: avgTemp,
            humidity: avgHum,
            airQuality: avgAirQuality,
          },
          status,
          lastUpdate: validReadings.length > 0
            ? new Date(Math.max(...validReadings.map(r => new Date(r.timestamp).getTime())))
            : null,
        };
      })
    );

    res.status(200).json(summaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Estadísticas detalladas de una ubicación
export async function getLocationStatistics(req, res) {
  try {
    const { locationId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }

    const devices = await Device.find({ location: locationId });
    const deviceIds = devices.map(d => d._id);

    // Últimas N lecturas de todos los dispositivos
    const readings = await SensorReading.find({ device: { $in: deviceIds } })
      .sort({ timestamp: -1 })
      .limit(limit);

    // Calcular promedios
    const avgTemp = readings.length > 0
      ? readings.reduce((sum, r) => sum + (r.temperature || 0), 0) / readings.length
      : null;

    const avgHum = readings.length > 0
      ? readings.reduce((sum, r) => sum + (r.humidity || 0), 0) / readings.length
      : null;

    const avgAirQuality = readings.length > 0
      ? readings.reduce((sum, r) => sum + (r.airQuality || 0), 0) / readings.length
      : null;

    // Calcular rangos
    const temps = readings.map(r => r.temperature).filter(t => t !== undefined);
    const hums = readings.map(r => r.humidity).filter(h => h !== undefined);
    const airQualities = readings.map(r => r.airQuality).filter(a => a !== undefined);

    const statistics = {
      locationId: location._id,
      locationName: location.name,
      locationImage: location.img,
      deviceCount: devices.length,
      latestReadings: readings,
      averages: {
        temperature: avgTemp,
        humidity: avgHum,
        airQuality: avgAirQuality,
      },
      ranges: {
        temperature: temps.length > 0 ? { min: Math.min(...temps), max: Math.max(...temps) } : null,
        humidity: hums.length > 0 ? { min: Math.min(...hums), max: Math.max(...hums) } : null,
        airQuality: airQualities.length > 0 ? { min: Math.min(...airQualities), max: Math.max(...airQualities) } : null,
      },
      lastUpdate: readings.length > 0 ? readings[0].timestamp : null,
    };

    res.status(200).json(statistics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
