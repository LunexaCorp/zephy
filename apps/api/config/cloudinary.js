import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Usar la URL directa
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

console.log("🔧 Cloudinary Config:", process.env.CLOUDINARY_URL ? "✅ Configurado" : "❌ No configurado");

export default cloudinary;
