import express, { json } from "express";
import dotenv from "dotenv";
import "./config/database.js";
import pc from "picocolors";
import { addSensorData } from "./controllers/sensorData.controller.js";
import mqtt from "mqtt";
import cors from "cors";

import Device from './models/device.js';
import Location from './models/location.js';
import Sensors from './models/sensorData.js';
import devicesRoutes from "./routes/devices.routes.js";
import locationsRouter from "./routes/locations.router.js";
import sensorDataRouter from "./routes/sensorData.router.js";
import dashboardRoutes from "./routes/dashboard.router.js";


//cargar variables de entorno
dotenv.config();

const IO_USERNAME = process.env.IO_USERNAME;
const IO_KEY = process.env.IO_KEY;

const app = express();
app.disable("x-powered-by");
const port = process.env.PORT;

//-----middlewares
app.use(json());
app.use(cors());

//-----rutas
app.get("/", (req, res) => {
  res.status(200).send("<h1>The server is running</h1>");
});

const apiRouter = express.Router();
apiRouter.use("/devices", devicesRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/locations", locationsRouter);
apiRouter.use("/sensordata", sensorDataRouter);
app.use("/api", apiRouter);

// Búfers y timeouts
let buffers = {};
let timeouts = {};
const TIMEOUT_MS = 60000;
// Normalizado el arreglo a minúsculas para consistencia
const sensorTypes = ["co2", "airquality", "temperature", "uvindex"];

// Función asíncrona para inicializar el servidor y MQTT
const init = async () => {
  try {
    console.log(pc.green("Iniciando el servidor..."));

    // Obtener todos los dispositivos y sus ubicaciones
    const devices = await Device.find({ isEnabled: true }).populate('locationId');

    if (devices.length === 0) {
      console.warn(pc.yellow("No se encontraron dispositivos habilitados. El servidor se iniciará, pero no se suscribirá a ningún feed MQTT."));
    }

    // Mapeo dinámico de topics
    const topicToSensorMap = {};
    devices.forEach(device => {
      // Normalizar el nombre de la ubicación a minúsculas y sin espacios o caracteres especiales
      const locationName = device.locationId.name.toLowerCase().replace(/[^a-z0-9]/g, '');

      sensorTypes.forEach(sensorType => {
        // Asegurarse de que el tipo de sensor también esté en minúsculas
        const topic = `${IO_USERNAME}/feeds/${locationName}.${sensorType}`;
        topicToSensorMap[topic] = device._id.toString(); // Usar el ID del dispositivo
      });
    });

    const client = mqtt.connect("mqtts://io.adafruit.com", {
      port: 8883,
      username: IO_USERNAME,
      password: IO_KEY,
    });

    // Lógica de suscripción y manejo de mensajes MQTT
    client.on("connect", () => {
      console.log(pc.green("Conectado a Adafruit IO a través de MQTT!"));
      const topics = Object.keys(topicToSensorMap);

      if (topics.length > 0) {
        client.subscribe(topics, (err) => {
          if (!err) {
            console.log(pc.cyan(`Suscrito a los feeds:`));
            topics.forEach((t) => console.log(pc.cyan(` - ${t}`)));
          } else {
            console.error(pc.red("❌ Error al suscribirse a los feeds:"), err);
          }
        });
      } else {
        console.warn(pc.yellow("No hay feeds a los que suscribirse."));
      }
    });

    client.on("message", async (topic, message) => {
      console.log(pc.yellow(`Mensaje recibido del feed ${topic}: ${message.toString()}`));

      try {
        const value = parseFloat(message.toString());
        const sensorId = topicToSensorMap[topic];

        if (!sensorId) {
          console.warn("Topic no reconocido:", topic);
          return;
        }

        if (!buffers[sensorId]) {
          buffers[sensorId] = { temperature: null, co2: null, airQuality: null, uvIndex: null };
        }

        const buffer = buffers[sensorId];
        const topicName = topic.split('/').pop().toLowerCase();

        if (topicName.includes("temperature")) {
          buffer.temperature = value;
        } else if (topicName.includes("co2")) {
          buffer.co2 = value;
        } else if (topicName.includes("airquality")) {
          buffer.airQuality = value;
        } else if (topicName.includes("uvindex")) {
          buffer.uvIndex = value;
        }

        if (timeouts[sensorId]) {
          clearTimeout(timeouts[sensorId]);
        }

        timeouts[sensorId] = setTimeout(async () => {
          console.log(pc.yellow(`⌛ Timeout para el sensor ${sensorId}. Guardando datos parciales.`));
          const dataToSave = {
            sensorId,
            temperature: buffer.temperature,
            co2: buffer.co2,
            airQuality: buffer.airQuality,
            uvIndex: buffer.uvIndex,
          };
          await addSensorData(dataToSave);

          buffers[sensorId] = { temperature: null, co2: null, airQuality: null, uvIndex: null };
          delete timeouts[sensorId];
        }, TIMEOUT_MS);

        if (buffer.temperature !== null && buffer.co2 !== null && buffer.airQuality !== null && buffer.uvIndex !== null) {
          const dataToSave = {
            sensorId,
            temperature: buffer.temperature,
            co2: buffer.co2,
            airQuality: buffer.airQuality,
            uvIndex: buffer.uvIndex,
          };
          const newData = await addSensorData(dataToSave);
          console.log(pc.green("✅ Datos completos guardados en MongoDB:"), newData);

          buffers[sensorId] = { temperature: null, co2: null, airQuality: null, uvIndex: null };
          if (timeouts[sensorId]) {
            clearTimeout(timeouts[sensorId]);
            delete timeouts[sensorId];
          }
        }
      } catch (err) {
        console.error(pc.red("❌ Error al guardar datos en MongoDB:"), err);
      }
    });

    client.on("error", (err) => {
      console.error(pc.red("❌ Error en la conexión MQTT con Adafruit IO:"), err);
    });

    app.use((req, res) => {
      res.status(404).send("404 Not Found");
    });

    app.listen(port, () => {
      console.log(pc.green(`Server is running on port ${port}`));
    });

  } catch (err) {
    console.error(pc.red("❌ Error al iniciar el servidor:"), err);
    process.exit(1);
  }
};

init();
