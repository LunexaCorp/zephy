import {Router} from 'express';
// Importamos las funciones del controlador de lecturas
import { getSensors, getSensorById, addSensorDataHttp } from '../controllers/sensorReading.controller.js';

const router = Router();

// Rutas de Lectura de Sensores (Admin/Técnico)
router.get('/', getSensors);
router.get('/:id', getSensorById);

// 💡 RUTA CLAVE: Ingesta de Datos IoT
// Este endpoint debe estar protegido, idealmente con un API key o un token de dispositivo
router.post('/ingest', addSensorDataHttp);

export default router;
