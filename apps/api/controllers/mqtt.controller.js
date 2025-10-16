import { reloadTopics } from "../mqtt/client.js";

/**
 * Endpoint para recargar topics MQTT sin reiniciar el servidor
 * POST /api/v1/mqtt/reload
 */
export async function reloadMqttTopics(req, res) {
  try {
    const NODE_ENV = process.env.NODE_ENV || 'development';

    const result = await reloadTopics(NODE_ENV);

    res.status(200).json({
      message: 'Topics MQTT recargados exitosamente',
      oldTopicsCount: result.oldCount,
      newTopicsCount: result.newCount,
      topics: result.topics
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error al recargar topics MQTT',
      details: err.message
    });
  }
}
