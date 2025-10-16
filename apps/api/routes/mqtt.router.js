import { Router } from 'express';
import { reloadMqttTopics } from '../controllers/mqtt.controller.js';

const router = Router();

// POST /api/v1/mqtt/reload - Recargar topics MQTT
router.post('/reload', reloadMqttTopics);

export default router;
