import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase-init';

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

function safeFileName(name) {
  const extension = String(name || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
}

export async function uploadLearningFeatureImages(slug, files) {
  const selectedFiles = Array.from(files || []);
  if (!selectedFiles.length) return [];
  if (selectedFiles.some(file => !file.type.startsWith('image/'))) throw new Error('Only image files can be uploaded.');
  if (selectedFiles.some(file => file.size > MAX_IMAGE_SIZE_BYTES)) throw new Error('Each image must be 15 MB or smaller.');

  return Promise.all(selectedFiles.map(async (file) => {
    const destination = ref(storage, `learning-features/${slug}/${safeFileName(file.name)}`);
    await uploadBytes(destination, file, { contentType: file.type, cacheControl: 'public,max-age=31536000,immutable' });
    return getDownloadURL(destination);
  }));
}
