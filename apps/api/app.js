import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import pc from "picocolors";
import "./config/database.js";
import { connectMqtt } from "./mqtt/client.js";
import { handleMqttMessage } from "./mqtt/handlers/messageHandler.js";
import uploadRoutes from "./routes/upload.routes.js";
import devicesRoutes from "./routes/devices.router.js";
import dashboardRoutes from "./routes/dashboard.router.js";
import locationsRouter from "./routes/locations.router.js";
import sensorReadingRouter from "./routes/sensorReading.router.js";
import mqttRouter from "./routes/mqtt.router.js";
import statisticsRoutes from './routes/statistics.routes.js';



dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(json());
app.use(cors());

app.get("/", (_, res) => res.send("<h1>Zephy Server Running</h1>"));

const apiRouter = express.Router();
apiRouter.use("/devices", devicesRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/locations", locationsRouter);
apiRouter.use("/readings", sensorReadingRouter);
apiRouter.use("/upload", uploadRoutes);
apiRouter.use("/mqtt", mqttRouter);
apiRouter.use("/statistics", statisticsRoutes);
app.use("/api/v1", apiRouter);


// ✅ MQTT setup - Configuración mejorada
let buffers = {}, timeouts = {};
const TIMEOUT_MS = 60000;

// ✅ Crear el handler SIN pasar topicToSensorMap (ya no es necesario)
const mqttMessageHandler = handleMqttMessage(
  buffers,
  timeouts,
  NODE_ENV,
  TIMEOUT_MS
);

// ✅ Conectar a MQTT con el handler configurado
const { client: mqttClient } = await connectMqtt({
  MQTT_BROKER_URL: process.env.MQTT_BROKER_URL,
  MQTT_USERNAME: process.env.MQTT_USERNAME,
  MQTT_PASSWORD: process.env.MQTT_PASSWORD,
  MQTT_BROKER_PORT: process.env.MQTT_BROKER_PORT,
  NODE_ENV,
  handleMqttMessage: mqttMessageHandler // ✅ Pasamos el handler ya configurado
});

app.listen(port, () => {
  console.log(pc.green(`✓ Servidor corriendo en puerto ${port}`));
});
