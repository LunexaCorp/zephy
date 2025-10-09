import {Router} from 'express';
import { getLocations, getLocationById, getDevicesByLocationId } from '../controllers/locations.controller.js';

const router = Router();

// ruta raíz /locations

router.get('/', getLocations); // Lista todas las ubicaciones

router.get('/:id', getLocationById); // Detalle de una ubicación por ID

router.get('/:locationId/devices', getDevicesByLocationId); // Dispositivos en una ubicación

export default router;
