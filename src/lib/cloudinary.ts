const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName || !uploadPreset) {
  throw new Error("Missing Cloudinary env vars: VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET");
}

function buildFormData(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  return formData;
}

async function uploadToCloudinary(endpoint: string, file: File): Promise<string> {
  const response = await fetch(endpoint, {
    method: "POST",
    body: buildFormData(file),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error("Cloudinary upload did not return a secure_url");
  }

  return data.secure_url as string;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  return uploadToCloudinary(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, file);
}

// Supports both images and videos by using Cloudinary's auto resource type.
export async function uploadMediaToCloudinary(file: File): Promise<string> {
  return uploadToCloudinary(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, file);
}

