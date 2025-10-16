import Location from '../models/Location.js';
import { mqttService } from './mqtt.service.js';

export const locationService = {
  async create(locationData) {
    const location = new Location(locationData);
    const saved = await location.save();

    // Notificar al servicio MQTT
    await mqttService.subscribeToLocation(saved.name);

    return saved;
  },

  async delete(id) {
    // Validar dispositivos asociados
    const deviceCount = await Device.countDocuments({ location: id });
    if (deviceCount > 0) {
      throw new Error('No se puede eliminar una ubicación con dispositivos asociados');
    }

    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      throw new Error('Ubicación no encontrada');
    }

    // Desuscribir de MQTT
    await mqttService.unsubscribeFromLocation(location.name);

    return location;
  }
};
