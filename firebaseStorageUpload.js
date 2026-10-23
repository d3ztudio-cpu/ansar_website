import { uploadImageToHostinger } from './hostingerUpload';

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

function friendlyName(name) {
  return String(name || 'image');
}

/**
 * Upload learning-facility photos to the school's Hostinger storage
 * (public_html/UPLOADS) and resolve with their public URLs in file order.
 *
 * All school media lives on Hostinger — nothing is stored in Firebase
 * Storage. Uploads are sequential so a partial batch is easy to retry.
 */
export async function uploadLearningFeatureImages(slug, files, { onProgress } = {}) {
  void slug;
  const selectedFiles = Array.from(files || []);
  if (!selectedFiles.length) return [];
  if (selectedFiles.some(file => !file.type.startsWith('image/'))) throw new Error('Only image files can be uploaded.');
  if (selectedFiles.some(file => file.size > MAX_IMAGE_SIZE_BYTES)) throw new Error('Each image must be 15 MB or smaller.');

  const urls = [];
  for (let index = 0; index < selectedFiles.length; index += 1) {
    const file = selectedFiles[index];
    try {
      urls.push(await uploadImageToHostinger(file));
    } catch (error) {
      throw new Error(`${friendlyName(file.name)}: ${error.message}`);
    }
    if (onProgress) onProgress(Math.round(((index + 1) / selectedFiles.length) * 100));
  }
  return urls;
}
