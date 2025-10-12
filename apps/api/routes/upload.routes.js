import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// ✅ Ruta: POST /api/v1/upload
router.post('/', upload.single('image'), async (req, res) => {
  console.log("📥 Recibida petición de upload");
  console.log("📎 Archivo recibido:", req.file?.originalname);

  try {
    if (!req.file) {
      console.log("❌ No hay archivo");
      return res.status(400).json({
        error: 'No se envió ninguna imagen'
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log("☁️ Subiendo a Cloudinary...");

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'iot-locations',
      resource_type: 'auto',
    });

    console.log("✅ Imagen subida:", result.secure_url);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('💥 Error al subir imagen:', error);
    res.status(500).json({
      error: 'Error al subir la imagen',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// ✅ Ruta: DELETE /api/v1/upload/:publicId
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);

    const result = await cloudinary.uploader.destroy(decodedPublicId);

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({
      error: 'Error al eliminar la imagen'
    });
  }
});

export default router;
