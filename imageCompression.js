const MAX_DIMENSION = 2560;
const WEBP_QUALITY = 0.82;

export async function compressImageForUpload(file) {
  if (!file || !/^image\/(jpeg|png|webp|bmp)$/i.test(file.type || '') || typeof document === 'undefined') return file;
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => { const element = new Image(); element.onload = () => resolve(element); element.onerror = reject; element.src = sourceUrl; });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d', { alpha: true }).drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY));
    return blob && blob.size < file.size ? new File([blob], String(file.name || 'image').replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp', lastModified: file.lastModified }) : file;
  } catch { return file; } finally { URL.revokeObjectURL(sourceUrl); }
}
