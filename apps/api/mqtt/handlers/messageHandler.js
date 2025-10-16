import pc from "picocolors";
import { addSensorData } from "../../controllers/sensorReading.controller.js";
import { isValidSensorValue } from "../../utils/validation.js";
import { topicToFieldMap } from "../topicManager.js";
import { getTopicMap } from "../client.js";

// ✅ Ahora NO recibe topicToSensorMap como parámetro
export const handleMqttMessage = (buffers, timeouts, NODE_ENV, TIMEOUT_MS) =>
  async (topic, message) => {
    try {
      const value = parseFloat(message.toString());

      // ✅ Obtenemos el mapa actualizado en cada mensaje
      const topicToSensorMap = getTopicMap();
      const deviceId = topicToSensorMap[topic];

      if (!deviceId) {
        return console.warn(pc.yellow(`⚠️ Topic no reconocido: ${topic}`));
      }

      // Inicializar buffer si no existe
      buffers[deviceId] = buffers[deviceId] || {
        temperature: null,
        humidity: null,
        airQuality: null
      };

      // Determinar el tipo de sensor desde el topic
      const sensorType = topic.split('/').pop().toLowerCase();
      const fieldName = topicToFieldMap[sensorType];

      if (!fieldName || !isValidSensorValue(fieldName, value)) {
        return;
      }

      // Guardar valor en el buffer
      buffers[deviceId][fieldName] = value;
      clearTimeout(timeouts[deviceId]);

      // Función para guardar datos
      const saveData = async () => {
        const data = { deviceId, ...buffers[deviceId] };

        // ✅ VALIDAR: Solo guardar si hay al menos un valor válido
        const hasValidData = Object.values(buffers[deviceId]).some(v => v !== null);

        if (!hasValidData) {
          console.warn(pc.yellow(`⚠️ No hay datos válidos para guardar (Device: ${deviceId})`));
          return;
        }

        try {
          await addSensorData(data);
          // Limpiar buffer después de guardar exitosamente
          buffers[deviceId] = {
            temperature: null,
            humidity: null,
            airQuality: null
          };
        } catch (err) {
          console.error(pc.red(`❌ Error al guardar datos del device ${deviceId}:`), err.message);
        }
      };

      // Establecer timeout para guardar
      timeouts[deviceId] = setTimeout(saveData, TIMEOUT_MS);

      // Si el buffer está completo, guardar inmediatamente
      if (Object.values(buffers[deviceId]).every(v => v !== null)) {
        clearTimeout(timeouts[deviceId]); // Cancelar timeout
        await saveData();
      }
    } catch (err) {
      console.error(pc.red("❌ Error al procesar mensaje MQTT:"), err);
    }
  };
