import { useState } from "react";
import { uploadImage } from "../services/axios.config";

export const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('La imagen debe ser menor a 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setUploadError('Solo se permiten imágenes');
        return;
      }

      setUploadError("");
      setSelectedImage(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (): Promise<string> => {
    if (!selectedImage) return "";

    setUploadingImage(true);
    setUploadError("");

    const result = await uploadImage(selectedImage);

    setUploadingImage(false);

    if (result.success) {
      return result.url || "";
    } else {
      setUploadError(result.error || "Error al subir imagen");
      throw new Error(result.error);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setUploadError("");
  };

  return {
    selectedImage,
    imagePreview,
    uploadingImage,
    uploadError,
    handleImageChange,
    uploadToCloudinary,
    clearImage,
  };
};
