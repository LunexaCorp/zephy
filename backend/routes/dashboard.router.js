import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';

// Crea un nuevo enrutador
const router = express.Router();

// Define la ruta para obtener un solo medidor por su ID
// Usa el parámetro :locationId para capturar el ID de la URL
router.get("/medidor/:locationId", getDashboardData); // devuelve uno filtrado

// Exporta el enrutador para que pueda ser utilizado en app.js
export default router;
