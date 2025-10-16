import Location from '../models/Location.js';
import Device from '../models/Device.js';
import { reloadTopics } from '../mqtt/client.js';
import pc from 'picocolors';

export async function getLocations(req, res) {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getLocationById(req, res) {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        error: `No se encontró la ubicación con el id: ${req.params.id}`
      });
    }

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getDevicesByLocationId(req, res) {
  try {
    const { locationId } = req.params;
    const devices = await Device.find({ location: locationId });
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteLocation(req, res) {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({
        error: `No se encontró la ubicación con el id: ${id}`
      });
    }

    // ⚠️ Advertencia: Los dispositivos asociados quedarán sin ubicación
    // Puedes descomentar la siguiente línea para eliminarlos también
    await Device.deleteMany({ location: id });

    // ✅ Recargar topics después de eliminar (porque los dispositivos asociados quedarán huérfanos)
    try {
      const NODE_ENV = process.env.NODE_ENV || 'development';
      await reloadTopics(NODE_ENV);
      console.log(pc.green('✓ Topics MQTT recargados tras eliminar ubicación'));
    } catch (reloadErr) {
      console.warn(pc.yellow('⚠️ No se pudieron recargar los topics:'), reloadErr.message);
    }

    res.status(200).json({
      message: 'Ubicación eliminada exitosamente',
      location,
      warning: 'Los dispositivos asociados ahora están sin ubicación'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createLocation(req, res) {
  try {
    const { name, description, img, coordinates } = req.body;

    const newLocation = new Location({
      name,
      description,
      img,
      coordinates
    });

    const savedLocation = await newLocation.save();

    // ℹ️ No es necesario recargar topics aquí porque:
    // - Los topics se generan desde los DISPOSITIVOS, no desde las ubicaciones
    // - Cuando crees un dispositivo para esta ubicación, los topics se recargarán automáticamente

    res.status(201).json({
      ...savedLocation.toObject(),
      info: 'Crea dispositivos para esta ubicación usando POST /api/v1/devices'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateLocation(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const location = await Location.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({
        error: `No se encontró la ubicación con el id: ${id}`
      });
    }

    // ✅ Si se cambió el nombre, recargar topics (porque los topics usan el nombre de la ubicación)
    if (updates.name) {
      try {
        const NODE_ENV = process.env.NODE_ENV || 'development';
        await reloadTopics(NODE_ENV);
        console.log(pc.green('✓ Topics MQTT recargados tras actualizar nombre de ubicación'));

        return res.status(200).json({
          ...location.toObject(),
          mqtt: {
            reloaded: true,
            reason: 'El nombre de la ubicación cambió, los topics se actualizaron'
          }
        });
      } catch (reloadErr) {
        console.warn(pc.yellow('⚠️ No se pudieron recargar los topics:'), reloadErr.message);
      }
    }

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
