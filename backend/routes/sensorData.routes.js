import {Router} from 'express';
import { getSensorData, getSensorDataById } from '../controllers/sensorData.controller.js';

const router = Router();

router.get('/', getSensorData);

router.get('/:id', getSensorDataById);

export default router;
