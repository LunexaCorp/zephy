import Location from "../models/Location.js";
import Device from "../models/Device.js";
import SensorReading from "../models/SensorReading.js";

// Obtener datos de UN medidor específico
export async function getDashboardData(req, res) {
  try {
    const { locationId } = req.params;
    console.log(`[Dashboard] Solicitando datos para locationId: ${locationId}`);

    // 1. Buscar la ubicación
    const location = await Location.findById(locationId);
    if (!location) {
      console.log(`[Dashboard] Ubicación ${locationId} no encontrada`);
      return res.status(404).json({ error: "Location not found" });
    }
    console.log(`[Dashboard] Ubicación encontrada: ${location.name}`);

    // 2. Buscar dispositivo asociado
    const device = await Device.findOne({
      location: location._id,
      isEnabled: true
    });

    if (!device) {
      console.log(`[Dashboard] No hay dispositivo activo para ${location.name}`);
      return res.status(200).json({
        locationId: location._id,
        locationName: location.name,
        locationImg: location.img || null,
        sensorData: null,
        message: "No hay dispositivo activo"
      });
    }
    console.log(`[Dashboard] Dispositivo encontrado: ${device._id}`);

    // 3. Contar lecturas existentes (debug)
    const totalReadings = await SensorReading.countDocuments({ device: device._id });
    console.log(`[Dashboard] Total lecturas para ${device._id}: ${totalReadings}`);

    // 4. Obtener la lectura más reciente
    const latestReading = await SensorReading.findOne({ device: device._id })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestReading) {
      console.log(`⚠[Dashboard] No hay lecturas para ${device._id}`);
      return res.status(200).json({
        locationId: location._id,
        locationName: location.name,
        locationImg: location.img || null,
        sensorData: null,
        message: "Sin datos disponibles"
      });
    }

    console.log(`[Dashboard] Lectura encontrada:`, {
      timestamp: latestReading.timestamp,
      temperature: latestReading.temperature,
      humidity: latestReading.humidity,
      airQuality: latestReading.airQuality,
    });

    // 5. Construir respuesta en el formato que espera el frontend
    const response = {
      locationId: location._id,
      locationName: location.name,
      locationImg: location.img || null,
      sensorData: {
        temperature: latestReading.temperature ?? 0,
        humidity: latestReading.humidity ?? 0,
        airQuality: latestReading.airQuality ?? 0,
        lastUpdate: latestReading.timestamp
      }
    };

    res.status(200).json(response);

  } catch (err) {
    console.error("[Dashboard] Error:", err);
    res.status(500).json({
      error: "Error al obtener datos del dashboard",
      details: err.message
    });
  }
}

// Obtener datos de TODOS los medidores
export async function getAllDashboards(req, res) {
  try {
    console.log(`[Dashboard] Solicitando datos de todas las ubicaciones`);

    const locations = await Location.find();
    const dashboards = [];
    let defaultLocationId = null; // 💡 Renombrado para claridad

    for (const location of locations) {
      const device = await Device.findOne({
        location: location._id,
        isEnabled: true
      });

      let latestReading = null;
      if (device) {
        latestReading = await SensorReading.findOne({ device: device._id })
          .sort({ timestamp: -1 })
          .lean();
      }

      // 1. Construir el objeto del dashboard (con o sin sensorData)
      const sensorData = latestReading ? {
        temperature: latestReading.temperature ?? 0,
        humidity: latestReading.humidity ?? 0,
        airQuality: latestReading.airQuality ?? 0,
        lastUpdate: latestReading.timestamp
      } : null;

      const dashboardItem = {
        locationId: location._id,
        locationName: location.name,
        locationImg: location.img || null,
        sensorData: sensorData
      };

      // 2. Agregar el item UNA SOLA VEZ
      dashboards.push(dashboardItem);

      // 3. 💡 Lógica CLAVE: Establecer el ID por defecto (el primero que tenga datos válidos)
      if (!defaultLocationId && dashboardItem.sensorData) {
        defaultLocationId = location._id;
        console.log(`[Dashboard] Estableciendo default: ${location.name}`);
      }

      if (!device) {
        console.log(`[Dashboard] ${location.name}: Sin dispositivo`);
      } else if (!latestReading) {
        console.log(`[Dashboard] ${location.name}: Sin lecturas`);
      } else {
        console.log(`[Dashboard] ${location.name}: Datos encontrados`);
      }
    }

    // 4. Retornar el array y el ID por defecto
    const finalDefaultId = defaultLocationId || (locations.length > 0 ? locations[0]._id : null);

    console.log(`[Dashboard] Retornando ${dashboards.length} ubicaciones. Default: ${finalDefaultId}`);

    res.status(200).json({
      dashboards: dashboards,
      defaultLocationId: finalDefaultId
    });

  } catch (err) {
    console.error("[Dashboard] Error:", err);
    res.status(500).json({
      error: "Error al obtener dashboards",
      details: err.message
    });
  }
}
