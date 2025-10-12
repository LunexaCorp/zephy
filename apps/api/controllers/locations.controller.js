import Location from '../models/Location.js';
import Device from '../models/Device.js';

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

    if (!location)
      return res.status(404).json({
        error: `No se encontró la ubicación con el id: ${req.params.id}`
      });

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

// Método para eliminar ubicación
export async function deleteLocation(req, res) {
  try {
    const { id } = req.params;

    // Busca y elimina la ubicación
    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({
        error: `No se encontró la ubicación con el id: ${id}`
      });
    }

    // Opcional: También eliminar los dispositivos asociados
    // await Device.deleteMany({ location: id });

    res.status(200).json({
      message: 'Ubicación eliminada exitosamente',
      location
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Métodos CREATE y UPDATE si los necesitas
export async function createLocation(req, res) {
  try {
    const { name, description, img, coordinates } = req.body;

    const newLocation = new Location({
      name,
      description,
      img,
      coordinates
    });

    console.log(newLocation)

    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
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

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
