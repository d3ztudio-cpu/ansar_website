import { uploadFileToHostinger } from './hostingerUpload';

export const MAX_LIBRARY_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_LIBRARY_PDF_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Upload one Library file (photo, poster, cover or PDF document) to the
 * school's Hostinger storage (public_html/UPLOADS) and resolve with
 * { url, path }. Reports progress (0–100) through onProgress.
 *
 * All school media lives on Hostinger — nothing is stored in Firebase
 * Storage. `path` is always '' because Hostinger keeps uploads immutable;
 * there is no delete endpoint, so removed files simply stay on disk.
 */
export function uploadLibraryFile(segments, file, { onProgress } = {}) {
  const folder = ['library', ...(Array.isArray(segments) ? segments : [segments])]
    .filter(Boolean)
    .join('/');
  // The Hostinger endpoint stores every file in a single UPLOADS folder;
  // make the intended Library folder part of the user-facing context only.
  return uploadFileToHostinger(file, { onProgress })
    .then(({ url }) => {
      if (onProgress) onProgress(100);
      return { url, path: '' };
    });
}

/** Best-effort delete — Hostinger uploads are immutable, so this is a no-op. */
export async function deleteLibraryFile(path) {
  void path;
  return Promise.resolve();
}
