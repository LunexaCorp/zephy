import Device from '../models/Device.js';
import SensorReading from '../models/SensorReading.js';
import { reloadTopics } from '../mqtt/client.js';
import pc from 'picocolors';

const generateSerialNumber = () => {
  return 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase();
};

// 1. Obtener todos los dispositivos
export async function getDevices(req, res) {
  try {
    const devices = await Device.find().populate('location');
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 2. Obtener un dispositivo por ID
export async function getDeviceById(req, res) {
  try {
    const device = await Device.findById(req.params.id).populate('location');

    if (!device)
      return res.status(404).json({
        error: `No se encontró el dispositivo con el id: ${req.params.id}`
      });

    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 3. Obtener TODAS las lecturas de un dispositivo
export async function getSensorsByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;
    const readings = await SensorReading.find({ device: deviceId })
      .sort({ timestamp: -1 });
    res.status(200).json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 4. Traer los últimos datos lanzados por los sensores
export async function getLastDataByDeviceId(req, res) {
  try {
    const { deviceId } = req.params;

    const latestReading = await SensorReading.findOne({ device: deviceId })
      .sort({ timestamp: -1 })
      .limit(1)
      .exec();

    if (!latestReading) {
      return res.status(404).json({
        error: "No se encontraron datos para este dispositivo."
      });
    }

    res.status(200).json(latestReading);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 5. Eliminar dispositivo + recargar topics
export async function deleteDevice(req, res) {
  try {
    const { id } = req.params;

    const deletedDevice = await Device.findByIdAndDelete(id);
    if (!deletedDevice) {
      return res.status(404).json({
        error: `No se encontró el dispositivo con el id: ${id}`
      });
    }

    console.log(pc.yellow(`🗑️ Dispositivo eliminado: ${deletedDevice._id}`));

    // ✅ Recargar topics después de eliminar
    try {
      const NODE_ENV = process.env.NODE_ENV || 'development';
      const result = await reloadTopics(NODE_ENV);
      console.log(pc.green(`✓ Topics recargados: ${result.newCount} topics activos`));

      return res.status(200).json({
        message: 'Dispositivo eliminado exitosamente',
        device: deletedDevice,
        mqtt: {
          reloaded: true,
          topicsCount: result.newCount
        }
      });
    } catch (reloadErr) {
      console.warn(pc.yellow('⚠️ No se pudieron recargar los topics:'), reloadErr.message);

      return res.status(200).json({
        message: 'Dispositivo eliminado',
        device: deletedDevice,
        mqtt: {
          reloaded: false,
          warning: 'Llama manualmente a POST /api/v1/mqtt/reload'
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 6. Crear dispositivo + recargar topics
export const createDevice = async (req, res) => {
  try {
    let deviceData = req.body;

    // Generar serialNumber si no viene
    if (!deviceData.serialNumber) {
      deviceData.serialNumber = generateSerialNumber();
    }

    // Validar type
    if (deviceData.type && !['ESP32', 'Arduino', 'Otro'].includes(deviceData.type)) {
      deviceData.type = 'Otro';
    }

    // Crear el dispositivo
    const newDevice = await Device.create(deviceData);
    console.log(pc.green(`✓ Dispositivo creado: ${newDevice._id}`));

    // ✅ Recargar topics automáticamente
    try {
      const NODE_ENV = process.env.NODE_ENV || 'development';
      const result = await reloadTopics(NODE_ENV);

      console.log(pc.green(`✓ Topics recargados: ${result.newCount} topics activos`));

      // Obtener el dispositivo poblado con su ubicación
      const populatedDevice = await Device.findById(newDevice._id).populate('location');

      return res.status(201).json({
        device: populatedDevice,
        mqtt: {
          reloaded: true,
          topicsCount: result.newCount,
          newTopics: populatedDevice.location ?
            result.topics.filter(t => {
              const locationSlug = populatedDevice.location.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-');
              return t.includes(locationSlug);
            }) : []
        }
      });
    } catch (reloadErr) {
      console.warn(pc.yellow('⚠️ Dispositivo creado pero no se pudieron recargar los topics:'), reloadErr.message);

      return res.status(201).json({
        device: newDevice,
        mqtt: {
          reloaded: false,
          warning: 'Dispositivo creado, pero llama manualmente a POST /api/v1/mqtt/reload'
        }
      });
    }
  } catch (error) {
    console.error('Error al crear dispositivo:', error);

    // Manejo de errores específicos
    if (error.code && error.code === 11000) {
      return res.status(409).json({
        message: 'Error de duplicidad: Ya existe un dispositivo con el mismo serial o nombre.',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: `Error de validación: ${error.message}`,
      });
    }

    return res.status(500).json({
      message: 'Error interno del servidor al procesar la solicitud.',
    });
  }
};

// 7. Actualizar dispositivo + recargar topics si cambió la ubicación
export async function updateDevice(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const device = await Device.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('location');

    if (!device) {
      return res.status(404).json({
        error: `No se encontró el dispositivo con el id: ${id}`
      });
    }

    console.log(pc.cyan(`✏️ Dispositivo actualizado: ${device._id}`));

    // ✅ Si se cambió la ubicación, recargar topics
    if (updates.location) {
      try {
        const NODE_ENV = process.env.NODE_ENV || 'development';
        const result = await reloadTopics(NODE_ENV);
        console.log(pc.green(`✓ Topics recargados tras cambio de ubicación`));

        return res.status(200).json({
          device,
          mqtt: {
            reloaded: true,
            topicsCount: result.newCount
          }
        });
      } catch (reloadErr) {
        console.warn(pc.yellow('⚠️ No se pudieron recargar los topics:'), reloadErr.message);
      }
    }

    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
