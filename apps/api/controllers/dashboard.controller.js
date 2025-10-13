import Location from "../models/Location.js";
import Device from "../models/Device.js";
import SensorReading from "../models/SensorReading.js";

// 🎯 Obtener datos de UN medidor específico
export async function getDashboardData(req, res) {
  try {
    const { locationId } = req.params;
    console.log(`[Dashboard] 📍 Solicitando: ${locationId}`);

    const location = await Location.findById(locationId).lean();
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    const device = await Device.findOne({
      location: location._id,
      isEnabled: true
    }).lean();

    if (!device) {
      return res.status(200).json({
        locationId: location._id,
        locationName: location.name,
        locationImg: location.img || null,
        description: location.description || '',
        coordinates: location.coordinates || null,
        sensorData: null,
        message: "No hay dispositivo activo"
      });
    }

    const latestReading = await SensorReading.findOne({ device: device._id })
      .sort({ timestamp: -1 })
      .select('temperature humidity airQuality timestamp')
      .lean();

    if (!latestReading) {
      return res.status(200).json({
        locationId: location._id,
        locationName: location.name,
        locationImg: location.img || null,
        description: location.description || '',
        coordinates: location.coordinates || null,
        sensorData: null,
        message: "Sin datos disponibles"
      });
    }

    const response = {
      locationId: location._id,
      locationName: location.name,
      locationImg: location.img || null,
      description: location.description || '',
      coordinates: location.coordinates || null,
      sensorData: {
        temperature: latestReading.temperature ?? 0,
        humidity: latestReading.humidity ?? 0,
        airQuality: latestReading.airQuality ?? 0,
        lastUpdate: latestReading.timestamp
      }
    };

    res.status(200).json(response);

  } catch (err) {
    console.error("[Dashboard] ❌ Error:", err);
    res.status(500).json({
      error: "Error al obtener datos del dashboard",
      details: err.message
    });
  }
}

// 🚀 Obtener TODOS los medidores (FALLBACK ULTRA-OPTIMIZADO)
export async function getAllDashboards(req, res) {
  try {
    const startTime = Date.now();
    console.log(`[Dashboard] 📊 Solicitando todos los dashboards (método ultra-optimizado)`);

    // 1. Consultas en paralelo para reducir tiempo
    const [locations, devices] = await Promise.all([
      Location.find().select('name img description coordinates').lean(),
      Device.find({ isEnabled: true }).select('location _id').lean()
    ]);

    if (locations.length === 0) {
      return res.status(200).json({
        dashboards: [],
        defaultLocationId: null
      });
    }

    console.log(`[Dashboard] ✓ ${locations.length} locations y ${devices.length} devices cargados`);

    // 2. Crear mapa location -> device (O(1) lookup)
    const locationToDevice = new Map();
    devices.forEach(device => {
      locationToDevice.set(device.location.toString(), device._id);
    });

    // 3. Obtener TODAS las últimas lecturas en UNA SOLA consulta usando aggregate
    const deviceIds = Array.from(locationToDevice.values());

    const latestReadings = await SensorReading.aggregate([
      {
        $match: { device: { $in: deviceIds } }
      },
      {
        $sort: { device: 1, timestamp: -1 }
      },
      {
        $group: {
          _id: '$device',
          temperature: { $first: '$temperature' },
          humidity: { $first: '$humidity' },
          airQuality: { $first: '$airQuality' },
          timestamp: { $first: '$timestamp' }
        }
      }
    ]);

    console.log(`[Dashboard] ✓ ${latestReadings.length} lecturas obtenidas en aggregate`);

    // 4. Crear mapa device -> reading (O(1) lookup)
    const deviceToReading = new Map();
    latestReadings.forEach((reading) => {
      deviceToReading.set(reading._id.toString(), reading);
    });

    // 5. Construir dashboards
    const dashboards = [];
    let defaultLocationId = null;

    for (const location of locations) {
      const locationIdStr = location._id.toString();
      const deviceId = locationToDevice.get(locationIdStr);
      const reading = deviceId ? deviceToReading.get(deviceId.toString()) : null;

      const sensorData = reading ? {
        temperature: reading.temperature ?? 0,
        humidity: reading.humidity ?? 0,
        airQuality: reading.airQuality ?? 0,
        lastUpdate: reading.timestamp
      } : null;

      const dashboardItem = {
        locationId: location._id,
        locationName: location.name,
        locationImg: location.img || null,
        description: location.description || '',
        coordinates: location.coordinates || null,
        sensorData
      };

      dashboards.push(dashboardItem);

      // Establecer default (primer medidor con datos)
      if (!defaultLocationId && sensorData) {
        defaultLocationId = location._id;
      }
    }

    // 6. Fallback si no hay medidores con datos
    const finalDefaultId = defaultLocationId ||
      (locations.length > 0 ? locations[0]._id : null);

    const response = {
      dashboards,
      defaultLocationId: finalDefaultId
    };

    const elapsed = Date.now() - startTime;
    const withData = dashboards.filter(d => d.sensorData).length;
    console.log(`[Dashboard] ✅ Completado en ${elapsed}ms. ${dashboards.length} ubicaciones (${withData} con datos)`);

    res.status(200).json(response);

  } catch (err) {
    console.error("[Dashboard] ❌ Error:", err);
    res.status(500).json({
      error: "Error al obtener dashboards",
      details: err.message
    });
  }
}
