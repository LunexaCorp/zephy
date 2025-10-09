import {Router} from 'express';
import { getLocations, getLocationById, getDevicesByLocationId } from '../controllers/locations.controller.js';

const router = Router();

// ruta raíz /locations

router.get('/', getLocations);

router.get('/:id', getLocationById);

router.get('/:locationId/devices', getDevicesByLocationId);


export default router;
