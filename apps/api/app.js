import express, { json } from "express";
import dotenv from "dotenv";
import "./config/database.js";
import pc from "picocolors";
import { addSensorData } from "./controllers/sensorReading.controller.js";
import mqtt from "mqtt";
import cors from "cors";
import uploadRoutes from './routes/upload.routes.js';

import Device from './models/Device.js';
import locationsRouter from "./routes/locations.router.js";
import devicesRoutes from "./routes/devices.router.js";
import sensorReadingRouter from "./routes/sensorReading.router.js";
import dashboardRoutes from "./routes/dashboard.router.js";

dotenv.config();

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 3000;

app.use(json());

// CORS mejorado con configuración dinámica
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
    "https://zephy-mdd.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.status(200).send("<h1>The Zephy Server is Running</h1>");
});

const apiRouter = express.Router();
apiRouter.use("/devices", devicesRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/locations", locationsRouter);
apiRouter.use("/readings", sensorReadingRouter);
apiRouter.use("/upload", uploadRoutes);
app.use("/api/v1", apiRouter);

// MAPEO DE TOPICS A NOMBRES DE CAMPOS DEL MODELO
const topicToFieldMap = {
  'airquality': 'airQuality',
  'temperature': 'temperature',
  'humidity': 'humidity'
};

// Rangos de validación para sensores
const SENSOR_RANGES = {
  temperature: { min: -50, max: 100 },
  humidity: { min: 0, max: 100 },
  airQuality: { min: 0, max: 500 }
};

// Búfers y timeouts
let buffers = {};
let timeouts = {};
let topicToSensorMap = {};
let mqttClient = null;
const TIMEOUT_MS = 60000; // 60 segundos
const BUFFER_CLEANUP_INTERVAL = 3600000; // 1 hora

// Función para validar valores de sensores
const isValidSensorValue = (fieldName, value) => {
  if (isNaN(value) || !isFinite(value)) {
    return false;
  }

  const range = SENSOR_RANGES[fieldName];
  if (range) {
    return value >= range.min && value <= range.max;
  }

  return true;
};

// Función para limpiar buffers inactivos
const cleanupInactiveBuffers = () => {
  const activeDeviceIds = new Set(Object.values(topicToSensorMap));
  let cleanedCount = 0;

  Object.keys(buffers).forEach(deviceId => {
    if (!activeDeviceIds.has(deviceId)) {
      delete buffers[deviceId];

      if (timeouts[deviceId]) {
        clearTimeout(timeouts[deviceId]);
        delete timeouts[deviceId];
      }
      cleanedCount++;
    }
  });

  if (cleanedCount > 0 && NODE_ENV === 'development') {
    console.log(pc.gray(`🧹 Limpiados ${cleanedCount} buffers inactivos`));
  }
};

// Función para cargar dispositivos y crear mapeo de topics
const loadDevicesAndTopics = async () => {
  try {
    const devices = await Device.find({ isEnabled: true }).populate('location');

    if (devices.length === 0) {
      console.warn(pc.yellow("⚠️  No se encontraron dispositivos habilitados."));
      return {};
    }

    const newTopicMap = {};
    const locationNames = new Set();
    const devicesWithoutLocation = [];

    devices.forEach(device => {
      if (!device.location || !device.location.name) {
        devicesWithoutLocation.push(device._id.toString());
        return;
      }

      // Sanitización más robusta del nombre de ubicación
      const locationName = device.location.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/[^a-z0-9-]/g, '') // Solo alfanuméricos y guiones
        .replace(/-+/g, '-') // Múltiples guiones a uno solo
        .replace(/^-|-$/g, ''); // Eliminar guiones al inicio/final

      // Detectar colisiones de nombres
      if (locationNames.has(locationName)) {
        console.warn(pc.yellow(`⚠️  Colisión de nombre de ubicación: "${locationName}" (Device: ${device._id})`));
      }
      locationNames.add(locationName);

      Object.keys(topicToFieldMap).forEach(sensorType => {
        const topic = `${locationName}/${sensorType}`;
        newTopicMap[topic] = device._id.toString();
      });
    });

    // Mostrar resumen de dispositivos sin ubicación (solo una vez)
    if (devicesWithoutLocation.length > 0) {
      console.warn(pc.yellow(`⚠️  ${devicesWithoutLocation.length} dispositivo(s) sin ubicación válida`));
      if (NODE_ENV === 'development') {
        console.warn(pc.gray(`   IDs: ${devicesWithoutLocation.join(', ')}`));
      }
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

// Función para suscribirse a topics MQTT
const subscribeToTopics = (client, topics) => {
  if (topics.length === 0) {
    console.warn(pc.yellow("⚠️  No hay topics a los que suscribirse."));
    return;
  }

  client.subscribe(topics, (err) => {
    if (!err) {
      console.log(pc.cyan(`✓ Suscrito a ${topics.length} feeds:`));
      if (NODE_ENV === 'development') {
        topics.forEach(t => console.log(pc.cyan(`   - ${t}`)));
      }
    } else {
      console.error(pc.red("❌ Error al suscribirse:"), err);
    }
  });
};

// Función para procesar mensajes MQTT
const handleMqttMessage = async (topic, message) => {
  if (NODE_ENV === 'development') {
    console.log(pc.blue(`📨 Mensaje: ${topic} = ${message.toString()}`));
  }

  try {
    const value = parseFloat(message.toString());
    const deviceId = topicToSensorMap[topic];

    if (!deviceId) {
      console.warn(pc.yellow(`⚠️  Topic no reconocido: ${topic}`));
      return;
    }

    // Inicializar buffer si no existe
    if (!buffers[deviceId]) {
      buffers[deviceId] = {
        temperature: null,
        humidity: null,
        airQuality: null,
      };
    }

    const buffer = buffers[deviceId];

    // Extraer tipo de sensor del topic
    const topicParts = topic.split('/');
    const sensorTypeFromTopic = topicParts[topicParts.length - 1].toLowerCase();

    // Mapear el tipo del topic al nombre del campo
    const fieldName = topicToFieldMap[sensorTypeFromTopic];

    if (!fieldName) {
      console.warn(pc.yellow(`⚠️  Tipo de sensor no mapeado: ${sensorTypeFromTopic}`));
      return;
    }

    // Validar el valor del sensor
    if (!isValidSensorValue(fieldName, value)) {
      console.warn(pc.yellow(`⚠️  Valor inválido para ${fieldName}: ${value} (topic: ${topic})`));
      return;
    }

    buffer[fieldName] = value;

    if (NODE_ENV === 'development') {
      console.log(pc.magenta(`   ✓ Buffer actualizado [${deviceId}]: ${fieldName} = ${value}`));
    }

    // Limpiar timeout anterior
    if (timeouts[deviceId]) {
      clearTimeout(timeouts[deviceId]);
    }

    // Nuevo timeout para datos parciales
    timeouts[deviceId] = setTimeout(async () => {
      console.log(pc.yellow(`⌛ Timeout [${deviceId}]. Guardando datos parciales...`));

      const dataToSave = {
        deviceId,
        temperature: buffer.temperature,
        humidity: buffer.humidity,
        airQuality: buffer.airQuality,
      };

      try {
        await addSensorData(dataToSave);
        console.log(pc.green(`✓ Datos parciales guardados [${deviceId}]`));
      } catch (err) {
        console.error(pc.red(`❌ Error al guardar datos parciales [${deviceId}]: ${err.message}`));
      }

      // Reiniciar buffer
      buffers[deviceId] = { temperature: null, humidity: null, airQuality: null };
      delete timeouts[deviceId];
    }, TIMEOUT_MS);

    // Verificar si el buffer está completo
    const isComplete = Object.values(buffer).every(val => val !== null);

    if (NODE_ENV === 'development') {
      console.log(pc.cyan(`   Buffer completo: ${isComplete}`));
      console.log(pc.cyan(`   Estado: ${JSON.stringify(buffer)}`));
    }

    if (isComplete) {
      const dataToSave = {
        deviceId,
        temperature: buffer.temperature,
        humidity: buffer.humidity,
        airQuality: buffer.airQuality,
      };

      if (NODE_ENV === 'development') {
        console.log(pc.green(`💾 Guardando datos completos: ${JSON.stringify(dataToSave)}`));
      }

      try {
        await addSensorData(dataToSave);
        console.log(pc.green(`✓ Datos completos guardados [${deviceId}]`));
      } catch (err) {
        console.error(pc.red(`❌ Error al guardar [${deviceId}]: ${err.message}`));
      }

      // Limpiar buffer y timeout
      buffers[deviceId] = { temperature: null, humidity: null, airQuality: null };
      if (timeouts[deviceId]) {
        clearTimeout(timeouts[deviceId]);
        delete timeouts[deviceId];
      }
    }
  } catch (err) {
    console.error(pc.red("❌ Error al procesar mensaje MQTT:"), err);
  }
};

// Función para conectar al broker MQTT
const connectMqtt = async () => {
  if (!MQTT_BROKER_URL || !MQTT_USERNAME || !MQTT_PASSWORD) {
    throw new Error("Variables de conexión MQTT no definidas");
  }

  const connectionUrl = MQTT_BROKER_URL.startsWith('mqtts://')
    ? MQTT_BROKER_URL
    : `mqtts://${MQTT_BROKER_URL}`;

  const client = mqtt.connect(connectionUrl, {
    port: parseInt(MQTT_BROKER_PORT),
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    protocol: 'mqtts',
    reconnectPeriod: 5000,
    connectTimeout: 30000,
    clean: true,
  });

  client.on("connect", async () => {
    console.log(pc.green("✓ Conectado al Broker MQTT (HiveMQ)"));

    try {
      // Recargar dispositivos y topics en cada reconexión
      topicToSensorMap = await loadDevicesAndTopics();
      const topics = Object.keys(topicToSensorMap);

      if (topics.length > 0) {
        subscribeToTopics(client, topics);
      } else {
        console.warn(pc.yellow("⚠️  No hay topics disponibles para suscribirse"));
      }
    } catch (error) {
      console.error(pc.red("❌ Error al recargar topics después de reconexión:"), error.message);
    }
  });

  client.on("message", handleMqttMessage);

  client.on("error", (err) => {
    console.error(pc.red("❌ Error en conexión MQTT:"), err.message);
  });

  client.on("close", () => {
    console.log(pc.yellow("⚠️  Conexión MQTT cerrada"));
  });

  client.on("offline", () => {
    console.log(pc.yellow("⚠️  Cliente MQTT offline"));
  });

  client.on("reconnect", () => {
    console.log(pc.blue("🔄 Intentando reconectar a MQTT..."));
  });

  return client;
};

// Inicialización del servidor
const init = async () => {
  try {
    console.log(pc.green("🚀 Iniciando el servidor Zephy..."));
    console.log(pc.gray(`   Entorno: ${NODE_ENV}`));

    // Cargar dispositivos y topics
    topicToSensorMap = await loadDevicesAndTopics();

    // Conectar a MQTT
    try {
      mqttClient = await connectMqtt();
    } catch (error) {
      console.error(pc.red("❌ Error al conectar a MQTT:"), error.message);
      console.warn(pc.yellow("⚠️  El servidor continuará sin conexión MQTT"));
    }

    // Iniciar limpieza periódica de buffers
    setInterval(cleanupInactiveBuffers, BUFFER_CLEANUP_INTERVAL);
    console.log(pc.gray(`✓ Limpieza automática de buffers configurada (cada ${BUFFER_CLEANUP_INTERVAL / 60000} min)`));

    // Manejador 404
    app.use((req, res) => {
      res.status(404).json({
        error: "Not Found",
        message: "La ruta solicitada no existe",
        path: req.path
      });
    });

    // Iniciar servidor Express
    app.listen(port, () => {
      console.log(pc.green(`✓ Servidor corriendo en puerto ${port}`));
      console.log(pc.cyan(`   http://localhost:${port}`));
    });

  } catch (err) {
    console.error(pc.red("❌ Error crítico al iniciar servidor:"), err);
    process.exit(1);
  }
};

// Manejo de señales de cierre
const gracefulShutdown = (signal) => {
  console.log(pc.yellow(`\n⚠️  Señal ${signal} recibida. Cerrando servidor...`));

  // Limpiar timeouts
  Object.values(timeouts).forEach(timeout => clearTimeout(timeout));

  // Cerrar cliente MQTT
  if (mqttClient) {
    mqttClient.end(true, () => {
      console.log(pc.green("✓ Cliente MQTT cerrado"));
    });
  }

  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Iniciar aplicación
init();
