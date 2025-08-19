
// --- INSTRUCCIONES DE CLOUDINARY ---
// ¡Hola! Para subir imágenes de verdad, necesitas una cuenta de Cloudinary.

// 1. Ve a https://cloudinary.com/ y crea una cuenta gratuita.
// 2. En tu panel de control (Dashboard), copia tu "Cloud Name".
// 3. Ve a Configuración (icono de engranaje) -> Pestaña "Upload".
// 4. Busca la sección "Upload Presets", y crea un nuevo "upload preset".
//    - Dale un nombre.
//    - Asegúrate que el "Signing Mode" esté en "Unsigned".
//    - Guarda y copia el nombre del "Upload Preset".
// 5. Ahora, pon tu "Cloud Name" y "Upload Preset" en las constantes de abajo.

export const uploadImage = async (file: File): Promise<string> => {
  console.log('Subiendo imagen a Cloudinary:', file.name);

  /*
  // --- Lógica MOCK (desactivada) ---
  await new Promise(res => setTimeout(res, 1500));
  const randomId = Math.floor(Math.random() * 1000) + 1;
  const imageUrl = `https://picsum.photos/400/300?random=${randomId}`;
  console.log('Imagen de ejemplo generada:', imageUrl);
  return imageUrl;
  */
  // ------------------------------------


  // --- Lógica REAL con CLOUDINARY ---
  const CLOUD_NAME = "dsmzpsool"; // <-- PON TU CLOUD NAME AQUÍ
  const UPLOAD_PRESET = "Comida-Lore"; // <-- PON TU UPLOAD PRESET AQUÍ
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al subir la imagen.");
    }

    const data = await response.json();
    console.log("Imagen subida con éxito:", data.secure_url);
    return data.secure_url; // Esta es la URL de tu imagen en Cloudinary
  } catch (error) {
    console.error("Error en Cloudinary:", error);
    throw error;
  }
};