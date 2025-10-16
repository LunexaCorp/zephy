import mqtt from "mqtt";
import pc from "picocolors";
import { loadDevicesAndTopics } from "./topicManager.js";

let mqttClient = null;
let topicToSensorMap = {}; // ✅ Se mantiene como variable del módulo

export const connectMqtt = async ({
                                    MQTT_BROKER_URL,
                                    MQTT_USERNAME,
                                    MQTT_PASSWORD,
                                    MQTT_BROKER_PORT,
                                    NODE_ENV,
                                    handleMqttMessage
                                  }) => {
  mqttClient = mqtt.connect(MQTT_BROKER_URL, {
    port: parseInt(MQTT_BROKER_PORT),
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    protocol: "mqtts",
    reconnectPeriod: 5000,
    connectTimeout: 30000,
    clean: true,
  });

  mqttClient.on("connect", async () => {
    console.log(pc.green("✓ Conectado al Broker MQTT"));

    // ✅ Carga los topics y actualiza la variable del módulo
    topicToSensorMap = await loadDevicesAndTopics(NODE_ENV);

    // ✅ Suscribe a todos los topics cargados
    const topics = Object.keys(topicToSensorMap);
    if (topics.length > 0) {
      mqttClient.subscribe(topics, (err) => {
        if (err) {
          console.error(pc.red("❌ Error al suscribirse:"), err.message);
        } else {
          console.log(pc.green(`✓ Suscrito a ${topics.length} topics`));
        }
      });
    }
  });

  // ✅ El handler NO recibe el mapa, lo accede directamente
  mqttClient.on("message", handleMqttMessage);

  return { client: mqttClient, topicToSensorMap }; // ⚠️ Este retorno ya no es tan útil
};

// ✅ Función para recargar topics dinámicamente
export const reloadTopics = async (NODE_ENV) => {
  if (!mqttClient || !mqttClient.connected) {
    throw new Error("Cliente MQTT no conectado");
  }

  try {
    // 1. Desuscribirse de los topics antiguos
    const oldTopics = Object.keys(topicToSensorMap);
    if (oldTopics.length > 0) {
      mqttClient.unsubscribe(oldTopics, (err) => {
        if (err) {
          console.error(pc.red("❌ Error al desuscribirse:"), err.message);
        } else {
          console.log(pc.yellow(`🔄 Desuscrito de ${oldTopics.length} topics antiguos`));
        }
      });
    }

    // 2. Cargar nuevos topics
    topicToSensorMap = await loadDevicesAndTopics(NODE_ENV);

    // 3. Suscribirse a los nuevos topics
    const newTopics = Object.keys(topicToSensorMap);
    if (newTopics.length > 0) {
      mqttClient.subscribe(newTopics, (err) => {
        if (err) {
          console.error(pc.red("❌ Error al suscribirse:"), err.message);
          throw err;
        } else {
          console.log(pc.green(`✓ Suscrito a ${newTopics.length} topics nuevos`));
        }
      });
    }

    return {
      oldCount: oldTopics.length,
      newCount: newTopics.length,
      topics: newTopics
    };
  } catch (error) {
    console.error(pc.red("❌ Error al recargar topics:"), error.message);
    throw error;
  }
};

// ✅ Exportar acceso directo al cliente y mapa
export const getMqttClient = () => mqttClient;
export const getTopicMap = () => topicToSensorMap;
