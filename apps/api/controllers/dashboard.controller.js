import Location from "../models/location.js";
import Device from "../models/device.js";
import SensorData from "../models/sensorData.js";

export async function getDashboardData(req, res) {
  try {
    const { locationId } = req.params;

    // 1. Buscar la ubicación
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // 2. Buscar el dispositivo de esa ubicación
    const device = await Device.findOne({ locationId: location._id });
    if (!device) {
      return res.status(200).json({
        locationId: location._id,
        locationName: location.name,
        locationImg: location.img,
        deviceId: null,
        sensorData: null,
      });
    }

    // 3. Buscar el documento sensorData de ese dispositivo
    const sensorDoc = await SensorData.findOne({ deviceId: device._id });

    // 4. Tomar solo el último registro de sensorData
    let latestData = null;
    if (sensorDoc && sensorDoc.sensorData && sensorDoc.sensorData.length > 0) {
      latestData = sensorDoc.sensorData[sensorDoc.sensorData.length - 1];
    }
    // 5. Responder con el formato esperado
    res.status(200).json({
      locationId: location._id,
      locationName: location.name,
      locationImg: location.img,
      deviceId: device._id,
      sensorData: latestData || null,
    });
  } catch (err) {
    console.log("fallo")
    res.status(500).json({ error: err.message });
  }
}
