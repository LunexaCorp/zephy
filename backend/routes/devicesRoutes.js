import {Router} from 'express';
import { getDevices, getDeviceById } from '../controllers/devicesController.js';

const router = Router();

//aquí se definen las rutas a partir de la ruta raíz /devices
router.get('/', getDevices);

router.get('/:id', getDeviceById);

export default router;
