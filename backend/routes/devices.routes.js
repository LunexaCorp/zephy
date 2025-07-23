import {Router} from 'express';
import { getDevices, getDeviceById, getSensorsByDeviceId } from '../controllers/devices.controller.js';

const router = Router();

//aquí se definen las rutas a partir de la ruta raíz /devices
router.get('/', getDevices);

router.get('/:id', getDeviceById);

router.get('/:deviceId/sensors', getSensorsByDeviceId);

export default router;
