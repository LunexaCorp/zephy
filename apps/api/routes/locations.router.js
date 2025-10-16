import { Router } from 'express';
import {
  getLocations,
  getLocationById,
  getDevicesByLocationId,
  deleteLocation,
  createLocation,
  updateLocation
} from '../controllers/location.controller.js';

const router = Router();

// CRUD completo
router.get('/', getLocations);                      // Listar todas
router.get('/:id', getLocationById);                // Obtener una por ID
router.post('/', createLocation);                   // Crear nueva
router.put('/:id', updateLocation);                 // Actualizar
router.delete('/:id', deleteLocation);              // Eliminar

// Ruta adicional
router.get('/:locationId/devices', getDevicesByLocationId);

export default router;
