import pc from "picocolors";
import Device from "../models/Device.js";
import { normalizeText } from "../utils/textUtils.js";

// ✅ Mapa de tipos de sensores a campos en la BD
export const topicToFieldMap = {
  'airquality': 'airQuality',
  'temperature': 'temperature',
  'humidity': 'humidity'
};

/**
 * Carga todos los dispositivos habilitados y genera el mapa de topics
 * @param {string} NODE_ENV - Entorno de ejecución
 * @returns {Object} Mapa de topic -> deviceId
 */
export const loadDevicesAndTopics = async (NODE_ENV) => {
  try {
    const devices = await Device.find({ isEnabled: true }).populate('location');
    const newTopicMap = {};
    const locationNames = new Set();

    for (const device of devices) {
      if (!device.location?.name) {
        console.warn(pc.yellow(`⚠️ Dispositivo ${device._id} sin ubicación válida`));
        continue;
      }

      // Normalizar nombre de ubicación para usar en topics MQTT
      const locationName = normalizeText(device.location.name)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Detectar colisiones de nombres
      if (locationNames.has(locationName)) {
        console.warn(pc.yellow(`⚠️ Colisión de ubicación: "${locationName}"`));
      }

      locationNames.add(locationName);

      // 📍 Imprimir ubicación detectada
      console.log(pc.cyan(`   ✓ ${device.location.name} → ${locationName}`));

      // Generar topics para todos los tipos de sensores
      Object.keys(topicToFieldMap).forEach(sensorType => {
        const topic = `${locationName}/${sensorType}`;
        newTopicMap[topic] = device._id.toString();

        // 📡 Imprimir cada topic generado
        console.log(pc.gray(`      - ${topic}`));
      });
    }

    if (NODE_ENV === 'development') {
      console.log(pc.green(`✓ Cargados ${devices.length} dispositivos con ${Object.keys(newTopicMap).length} topics`));
    }

    return newTopicMap;
  } catch (error) {
    console.error(pc.red("❌ Error al cargar dispositivos:"), error.message);
    throw error;
  }
};

// ❌ ELIMINADA la función subscribeToNewLocation
// Razón: No es confiable suscribirse dinámicamente a topics en MQTT
// Solución: Reiniciar el servidor cuando se creen nuevas ubicaciones
