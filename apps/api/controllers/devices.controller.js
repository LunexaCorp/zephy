import Device from '../models/Device.js';
import SensorReading from '../models/SensorReading.js';

const generateSerialNumber = () => {
  // Genera una cadena aleatoria corta para usar como serialNumber
  return 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase();
};


// 1. Obtener todos los dispositivos
export async function getDevices(req, res) {
  try{
    const devices = await Device.find().populate('location'); // ✅ Usamos 'location'
    res.status(200).json(devices);
  }catch(err){
    // Es mejor devolver el error.message en lugar del objeto error
    res.status(500).json({error: err.message});
  }
};

// 2. Obtener un dispositivo por ID, poblando la ubicación
export async function getDeviceById(req, res) {
  try{
    const device = await Device.findById(req.params.id).populate('location'); // ✅ Usamos 'location'

    if(!device)
      return res.status(404).json({error: `No se encontró el dispositivo con el id: ${req.params.id}`});
    res.status(200).json(device);
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

// 3. Obtener TODAS las lecturas de un dispositivo
export async function getSensorsByDeviceId(req, res) {
  try{
    const { deviceId } = req.params;
    // El campo de referencia ahora se llama 'device'
    const readings = await SensorReading.find({ device: deviceId }).sort({ timestamp: -1 });
    res.status(200).json(readings);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

// 4. Traer los ultimos datos lanzados por los sensores (Función activada y mejorada)
export async function getLastDataByDeviceId(req, res) {
  try{
    const { deviceId } = req.params;

    // Busca y devuelve solo el documento más reciente
    const latestReading = await SensorReading.findOne({ device: deviceId })
      .sort({ timestamp: -1 })
      .limit(1)
      .exec();

    if (!latestReading) {
      return res.status(404).json({ error: "No se encontraron datos para este dispositivo." });
    }

    res.status(200).json(latestReading);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}


export async function deleteDevice(req, res) {
  try {
    const { id } = req.params;

    // Busca y elimina el dispositivo
    const deletedDevice = await Device.findByIdAndDelete(id);
    if (!deletedDevice) {
      return res.status(404).json({
        error: `No se encontró el dispositivo con el id: ${id}`
      });
    }

    res.status(200).json({
      message: 'Dispositivo eliminado exitosamente',
      device
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Métodos CREATE
export const createDevice = async (req, res) => {
  try {
    let deviceData = req.body;

    // 1. Verificar y Asignar el serialNumber
    // Si el cliente no lo envía (lo que está sucediendo ahora), lo generamos automáticamente.
    if (!deviceData.serialNumber) {
      deviceData.serialNumber = generateSerialNumber();
    }

    // 2. Opcional: Asegurar que el type esté dentro de los enums válidos si se envía un 'Otro'
    if (deviceData.type && !['ESP32', 'Arduino', 'Otro'].includes(deviceData.type)) {
      deviceData.type = 'Otro';
    }

    // El campo isEnabled tiene default: true, así que no es necesario enviarlo.

    // 3. Crear el dispositivo en la base de datos
    const newDevice = await Device.create(deviceData);

    // 4. Éxito: Enviar respuesta 201
    return res.status(201).json(newDevice);

  } catch (error) {
    console.error('Error al crear dispositivo:', error);

    // 5. Manejo de Errores Específicos (Clave para evitar el 500)

    // A. Manejar Duplicidad (serialNumber o cualquier otro campo unique)
    if (error.code && error.code === 11000) {
      return res.status(409).json({ // 409 Conflict
        message: 'Error de duplicidad: Ya existe un dispositivo con el mismo serial o nombre.',
      });
    }

    // B. Manejar Error de Validación (Ej: locationId inválido, o falta algún required)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ // 400 Bad Request
        message: `Error de validación: ${error.message}`,
      });
    }

    // C. Manejar Errores de Mongoose CastError (Ej: location no es un ObjectID válido)
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ // 400 Bad Request
        message: `Formato de dato inválido: ${error.message}`,
      });
    }

    // D. Cualquier otro error no capturado
    return res.status(500).json({
      message: 'Error interno del servidor al procesar la solicitud.',
    });
  }
};

export async function updateDevice(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const device = await Device.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({
        error: `No se encontró la dispositivo con el id: ${id}`
      });
    }

    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
