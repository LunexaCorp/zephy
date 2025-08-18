import express, { json } from "express";
import dotenv from "dotenv";
import "./config/database.js";
import pc from "picocolors";
import { connect } from "mongoose";
import devicesRoutes from "./routes/devices.routes.js";
import locationsRouter from "./routes/locations.router.js";
import sensorDataRouter from "./routes/sensorData.router.js";
import dashboardRoutes from "./routes/dashboard.router.js";
import mqtt from "mqtt";
import cors from "cors";
let client = mqtt.connect("mqtt://test.mosquitto.org");
//cargar variables de entorno
dotenv.config();

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

/*MQTT

client.on("connect", () => {
  client.subscribe("/ecoroute/th11", (err) => {
    if (!err) {
      client.publish("temperatura", "Hello mqtt");
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === `${process.env.TOPIC_RAIZ}/th11`) {
    console.log("Mensaje recibido en TH11: ", message.toString());
  }
});

*/

// Ruta de error 404
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(pc.green(`Server is running on port ${port}`));
});
