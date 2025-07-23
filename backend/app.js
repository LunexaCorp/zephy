
import express, { json } from 'express';
import dotenv from 'dotenv';
import './config/database.js';
import pc from 'picocolors';
import { connect } from 'mongoose';
import devicesRoutes from './routes/devices.routes.js';
import locationsRouter from './routes/locations.router.js';
import sensorDataRoutes from './routes/sensorData.routes.js';
import sensorsRouter from './routes/sensors.router.js';
import mqtt from "mqtt";
let client = mqtt.connect("mqtt://test.mosquitto.org"); // crea un cliente

//cargar variables de entorno
dotenv.config();

const app = express();

const port = process.env.PORT;

//-----middlewares
app.use(json());

app.use((req, res, next) => {
  console.log(pc.green("middleware en proceso..."));
  // trackear la request a la base de datos
  // revisar si el usuario tiene cookies
  next();
});

//-----rutas
// Ruta de inicio
app.get("/", (req, res) => {
  res.status(200).send("<h1>The server is running</h1>");
});

app.use("/devices", devicesRoutes);
app.use("/locations", locationsRouter);
app.use("/sensors", sensorsRouter);
app.use("/sensorData", sensorDataRoutes);

//MQTT

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

// Ruta de error 404
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(pc.green(`Server is running on port http://localhost:${port}`));
});
