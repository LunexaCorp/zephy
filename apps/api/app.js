
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

const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 3000;

app.use(json());
app.use(cors({
  origin: [
    "https://zephy-mdd.vercel.app", //dominio en producción
    "http://localhost:5173",     // entorno local
    "http://localhost:5174",      // cms
  ],
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

// Búfers y timeouts
let buffers = {};
let timeouts = {};
const TIMEOUT_MS = 60000; // 60 segundos

const init = async () => {
  try {
    console.log(pc.green("Iniciando el servidor..."));

    const devices = await Device.find({ isEnabled: true }).populate('location');

    if (devices.length === 0) {
      console.warn(pc.yellow("No se encontraron dispositivos habilitados."));
    }

    const topicToSensorMap = {};
    devices.forEach(device => {
      if (!device.location || !device.location.name) {
        console.warn(pc.yellow(`Dispositivo ID ${device._id} no tiene ubicación válida.`));
        return;
      }

      const locationName = device.location.name.toLowerCase().replace(/[^a-z0-9]/g, '');

      Object.keys(topicToFieldMap).forEach(sensorType => {
        const topic = `${locationName}/${sensorType}`;
        topicToSensorMap[topic] = device._id.toString();
      });
    });

    if (!MQTT_BROKER_URL || !MQTT_USERNAME || !MQTT_PASSWORD) {
      console.error(pc.red("Variables de conexión MQTT no definidas."));
    } else {
      const connectionUrl = MQTT_BROKER_URL.startsWith('mqtts://')
        ? MQTT_BROKER_URL
        : `mqtts://${MQTT_BROKER_URL}`;

      const client = mqtt.connect(connectionUrl, {
        port: parseInt(MQTT_BROKER_PORT),
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        protocol: 'mqtts'
      });

      client.on("connect", () => {
        console.log(pc.green("Conectado al Broker MQTT (HiveMQ)!"));
        const topics = Object.keys(topicToSensorMap);

        if (topics.length > 0) {
          client.subscribe(topics, (err) => {
            if (!err) {
              console.log(pc.cyan(`Suscrito a ${topics.length} feeds:`));
              topics.forEach(t => console.log(pc.cyan(`   - ${t}`)));
            } else {
              console.error(pc.red("Error al suscribirse:"), err);
            }
          });
        } else {
          console.warn(pc.yellow("No hay feeds a los que suscribirse."));
        }
      });

      client.on("message", async (topic, message) => {
        console.log(pc.blue(`Mensaje recibido: ${topic} = ${message.toString()}`));

        try {
          const value = parseFloat(message.toString());
          const deviceId = topicToSensorMap[topic];

          if (!deviceId) {
            console.warn(pc.yellow(`Topic no reconocido: ${topic}`));
            return;
          }

          // Inicializar buffer con campos correctos
          if (!buffers[deviceId]) {
            buffers[deviceId] = {
              temperature: null,
              humidity: null,
              airQuality: null,
            };
          }

          const buffer = buffers[deviceId];

          // ✅ Extraer tipo de sensor del topic
          const topicParts = topic.split('/');
          const sensorTypeFromTopic = topicParts[topicParts.length - 1].toLowerCase();

          // ✅ MAPEAR el tipo del topic al nombre del campo correcto
          const fieldName = topicToFieldMap[sensorTypeFromTopic];

          if (fieldName) {
            buffer[fieldName] = value;
            console.log(pc.magenta(`   Buffer actualizado para ${deviceId}: ${fieldName} = ${value}`));
          } else {
            console.warn(pc.yellow(`Tipo de sensor no mapeado: ${sensorTypeFromTopic}`));
          }

          // Limpiar timeout anterior
          if (timeouts[deviceId]) {
            clearTimeout(timeouts[deviceId]);
          }

          // Nuevo timeout para datos parciales
          timeouts[deviceId] = setTimeout(async () => {
            console.log(pc.yellow(`⌛ Timeout para dispositivo ${deviceId}. Guardando datos parciales...`));
            console.log(pc.yellow(`   Datos: ${JSON.stringify(buffer)}`));

            const dataToSave = {
              deviceId,
              temperature: buffer.temperature,
              humidity: buffer.humidity,
              airQuality: buffer.airQuality,
              uvIndex: buffer.uvIndex,
            };

            try {
              await addSensorData(dataToSave);
              console.log(pc.green( `Datos parciales guardados`));
            } catch (err) {
              console.error(pc.red(`Error al guardar datos parciales: ${err.message}`));
            }

            buffers[deviceId] = { temperature: null, humidity: null, airQuality: null };
            delete timeouts[deviceId];
          }, TIMEOUT_MS);

          // Verificar si el buffer está completo
          const isComplete = Object.values(buffer).every(val => val !== null);
          console.log(pc.cyan(`   Buffer completo: ${isComplete}`));
          console.log(pc.cyan(`   Estado actual: ${JSON.stringify(buffer)}`));

          if (isComplete) {
            const dataToSave = {
              deviceId,
              temperature: buffer.temperature,
              humidity: buffer.humidity,
              airQuality: buffer.airQuality,
            };

            console.log(pc.green(`Guardando datos completos: ${JSON.stringify(dataToSave)}`));

            try {
              const newData = await addSensorData(dataToSave);
              console.log(pc.green("Datos completos guardados en MongoDB"), newData);
            } catch (err) {
              console.error(pc.red(`Error al guardar: ${err.message}`));
            }

            // Limpiar buffer y timeout
            buffers[deviceId] = { temperature: null, humidity: null, airQuality: null};
            if (timeouts[deviceId]) {
              clearTimeout(timeouts[deviceId]);
              delete timeouts[deviceId];
            }
          }
        } catch (err) {
          console.error(pc.red("Error al procesar mensaje MQTT:"), err);
        }
      });

      client.on("error", (err) => {
        console.error(pc.red("Error en conexión MQTT:"), err);
      });

      client.on("close", () => {
        console.log(pc.yellow("Conexión MQTT cerrada"));
      });

      client.on("offline", () => {
        console.log(pc.yellow("⚠Cliente MQTT offline"));
      });
    }

    app.use((req, res) => {
      res.status(404).send("404 Not Found");
    });

    app.listen(port, () => {
      console.log(pc.green(`Server corriendo en puerto ${port}`));
    });

  } catch (err) {
    console.error(pc.red("Error al iniciar servidor:"), err);
    process.exit(1);
  }
};

init();
