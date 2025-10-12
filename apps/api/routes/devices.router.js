import {Router} from 'express';
// Se importa la nueva función del controlador
import {
  getDevices,
  getDeviceById,
  getSensorsByDeviceId,
  getLastDataByDeviceId,
  createDevice, updateDevice, deleteDevice
} from '../controllers/devices.controller.js';

const router = Router();

// Rutas para /devices
router.get('/', getDevices); // Lista todos los dispositivos con su ubicación poblada

router.get('/:id', getDeviceById); // Detalle de un dispositivo por ID

router.post('/', createDevice);

router.put('/:id', updateDevice);

router.delete('/:id', deleteDevice);

// Obtiene todas las lecturas
router.get('/:deviceId/sensors', getSensorsByDeviceId);

// Obtiene SOLO la última lectura de un dispositivo
router.get('/:deviceId/last-reading', getLastDataByDeviceId);

export default router;
