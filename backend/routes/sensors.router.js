import {Router} from 'express';
import { getSensors, getSensorById } from '../controllers/sensors.controller.js';

const router = Router();

router.get('/', getSensors);

router.get('/:id', getSensorById);

export default router;
