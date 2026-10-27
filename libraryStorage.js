import { uploadFileToHostinger } from './hostingerUpload';
import { auth, authPersistenceReady } from './firebase-auth';

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

export async function uploadLibraryPdf(segments, file, { onProgress } = {}) {
  if (!file || file.type !== 'application/pdf') throw new Error('Only PDF files can be uploaded.');
  if (file.size > MAX_LIBRARY_PDF_BYTES) throw new Error('Each PDF must be 25 MB or smaller.');
  await authPersistenceReady;
  if (!auth.currentUser) throw new Error('Please sign in again before uploading a PDF.');
  if (onProgress) onProgress(10);
  const response = await fetch('https://asia-south1-ansar-english-school.cloudfunctions.net/uploadLibraryPdf', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
      'Content-Type': 'application/pdf',
      'X-File-Name': encodeURIComponent(file.name),
      'X-Library-Folders': JSON.stringify(Array.isArray(segments) ? segments : [segments])
    },
    body: file
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.url) throw new Error(data.error || `PDF upload failed (${response.status}).`);
  if (onProgress) onProgress(100);
  return { url: data.url, path: data.id || '' };
}

/** Best-effort delete — Hostinger uploads are immutable, so this is a no-op. */
export async function deleteLibraryFile(path) {
  void path;
  return Promise.resolve();
}
