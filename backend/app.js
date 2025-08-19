import express, { json } from "express";
import dotenv from "dotenv";
import "./config/database.js";
import pc from "picocolors";
import { connect } from "mongoose";
import devicesRoutes from "./routes/devices.routes.js";
import locationsRouter from "./routes/locations.router.js";
import sensorDataRouter from "./routes/sensorData.router.js";
import dashboardRoutes from "./routes/dashboard.router.js";
import { addSensorData } from "./controllers/sensorData.controller.js";
import mqtt from "mqtt";
import cors from "cors";

//cargar variables de entorno
dotenv.config();

const IO_USERNAME = process.env.IO_USERNAME;
const IO_KEY = process.env.IO_KEY;
const client = mqtt.connect("mqtts://io.adafruit.com", {
  port: 8883,
  username: IO_USERNAME,
  password: IO_KEY,
});

const app = express();

app.disable("x-powered-by");

const port = process.env.PORT;

//-----middlewares
app.use(json());
app.use(cors());

//-----rutas
// Ruta de inicio
app.get("/", (req, res) => {
  res.status(200).send("<h1>The server is running</h1>");
});

const apiRouter = express.Router();

// Usa el enrutador de la API para todas las rutas
apiRouter.use("/devices", devicesRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/locations", locationsRouter);
apiRouter.use("/sensordata", sensorDataRouter);

app.use("/api", apiRouter);

// Mapeo de cada topic al sensorId correcto en Mongo
const idLeonVelarde = "68a3601ad4ad2f865334896f";
const id15deAgosto = "68a3601ad4ad2f8653348970";
const idPlazaDeArmas = "68a3601ad4ad2f865334896d";
const idPuertoCapitania = "68a3601ad4ad2f865334896e";
const idAvAlameda = "68a3601ad4ad2f865334896c";

const topicToSensorMap = {
  // Leon Velarde
  [`${IO_USERNAME}/feeds/co2`]: idLeonVelarde,
  [`${IO_USERNAME}/feeds/airQuality`]: idLeonVelarde,
  [`${IO_USERNAME}/feeds/temperature`]: idLeonVelarde,
  [`${IO_USERNAME}/feeds/uvIndex`]: idLeonVelarde,

  // 15 de agosto
  [`${IO_USERNAME}/feeds/1da.co2`]: id15deAgosto,
  [`${IO_USERNAME}/feeds/1da.airQuality`]: id15deAgosto,
  [`${IO_USERNAME}/feeds/1da.temperature`]: id15deAgosto,
  [`${IO_USERNAME}/feeds/1da.uvIndex`]: id15deAgosto,

  // Plaza de Armas
  [`${IO_USERNAME}/feeds/plar.co2`]: idPlazaDeArmas,
  [`${IO_USERNAME}/feeds/plar.airQuality`]: idPlazaDeArmas,
  [`${IO_USERNAME}/feeds/plar.temperature`]: idPlazaDeArmas,
  [`${IO_USERNAME}/feeds/plar.uvIndex`]: idPlazaDeArmas,

  // Puerto Capitanía
  [`${IO_USERNAME}/feeds/puca.co2`]: idPuertoCapitania,
  [`${IO_USERNAME}/feeds/puca.airQuality`]: idPuertoCapitania,
  [`${IO_USERNAME}/feeds/puca.temperature`]: idPuertoCapitania,
  [`${IO_USERNAME}/feeds/puca.uvIndex`]: idPuertoCapitania,

  // Av. Alameda
  [`${IO_USERNAME}/feeds/al.co2`]: idAvAlameda,
  [`${IO_USERNAME}/feeds/al.airQuality`]: idAvAlameda,
  [`${IO_USERNAME}/feeds/al.temperature`]: idAvAlameda,
  [`${IO_USERNAME}/feeds/al.uvIndex`]: idAvAlameda,
};

// buffer por sensorId
let buffers = {};
// Buffer para guardar los timeouts
let timeouts = {};
const TIMEOUT_MS = 60000; // 60 segundos, ajusta según necesidad

client.on("connect", () => {
  console.log(pc.green("Conectado a Adafruit IO a través de MQTT!"));

  // Suscribirse a todos los topics del mapa automáticamente
  const topics = Object.keys(topicToSensorMap);

  client.subscribe(topics, (err) => {
    if (!err) {
      console.log(pc.cyan(`Suscrito a los feeds:`));
      topics.forEach((t) => console.log(pc.cyan(` - ${t}`)));
    } else {
      console.error(pc.red("Error al suscribirse a los feeds:"), err);
    }
  });
});

client.on("message", async (topic, message) => {
  console.log(
    pc.yellow(`Mensaje recibido del feed ${topic}: ${message.toString()}`)
  );

  try {
    const value = parseFloat(message.toString());
    const timestamp = new Date();
    const sensorId = topicToSensorMap[topic];

    if (!sensorId) {
      console.warn("⚠️ Topic no reconocido:", topic);
      return;
    }

    // Inicializar buffer si no existe
    if (!buffers[sensorId]) {
      buffers[sensorId] = {
        temperature: null,
        co2: null,
        airQuality: null,
        uvIndex: null,
      };
    }

    const buffer = buffers[sensorId];

    // Decidir qué campo actualizar
    if (topic.includes("temperature")) {
      buffer.temperature = value;
    } else if (topic.includes("co2")) {
      buffer.co2 = value;
    } else if (topic.toLowerCase().includes("airquality")) {
      buffer.airQuality = value;
    } else if (topic.toLowerCase().includes("uvindex")) {
      buffer.uvIndex = value;
    }

    // Limpiar el timeout existente para este sensor y crear uno nuevo
    if (timeouts[sensorId]) {
      clearTimeout(timeouts[sensorId]);
    }
    timeouts[sensorId] = setTimeout(async () => {
      console.log(
        pc.yellow(`⌛ Timeout para el sensor ${sensorId}. Guardando datos parciales.`)
      );
      // Guardar los datos que se hayan recibido hasta ahora
      const dataToSave = {
        sensorId,
        temperature: buffer.temperature ?? 0,
        co2: buffer.co2 ?? 0,
        airQuality: buffer.airQuality ?? 0,
        uvIndex: buffer.uvIndex ?? 0,
        lastUpdate: new Date(),
      };
      await addSensorData(dataToSave);

      // Reiniciar el buffer y el timeout
      buffers[sensorId] = {
        temperature: null,
        co2: null,
        airQuality: null,
        uvIndex: null,
      };
      delete timeouts[sensorId];
    }, TIMEOUT_MS);

    // Cuando tenemos los 4 datos, guardamos de inmediato y limpiamos el buffer
    if (
      buffer.temperature !== null &&
      buffer.co2 !== null &&
      buffer.airQuality !== null &&
      buffer.uvIndex !== null
    ) {
      const dataToSave = {
        sensorId,
        temperature: buffer.temperature,
        co2: buffer.co2,
        airQuality: buffer.airQuality,
        uvIndex: buffer.uvIndex,
        lastUpdate: new Date(),
      };

      const newData = await addSensorData(dataToSave);
      console.log(
        pc.green("✅ Datos completos guardados en MongoDB:"),
        newData
      );

      // Limpiar el buffer y el timeout para este sensor
      buffers[sensorId] = {
        temperature: null,
        co2: null,
        airQuality: null,
        uvIndex: null,
      };
      if (timeouts[sensorId]) {
        clearTimeout(timeouts[sensorId]);
        delete timeouts[sensorId];
      }
    }
  } catch (err) {
    console.error(pc.red("Error al guardar datos en MongoDB:"), err);
  }
});

client.on("error", (err) => {
  console.error(pc.red("Error en la conexión MQTT con Adafruit IO:"), err);
});

// Ruta de error 404
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(pc.green(`Server is running on port ${port}`));
});
