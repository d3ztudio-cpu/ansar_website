// Public endpoint of the PHP upload handler on the school's Hostinger server.
//
// ansarschool.in is served by Firebase Hosting (static only — it cannot run
// PHP), so all image uploads are POSTed to the dedicated Hostinger subdomain.
// Create `upload.ansarschool.in` in Hostinger hPanel with an A record pointing
// at the server IP (82.25.121.102) and place upload.php in its document root.
// The handler stores files in public_html/UPLOADS/ and they are served from:
//   https://upload.ansarschool.in/UPLOADS/<file-name>
import { compressImageForUpload } from './imageCompression';

const HOSTINGER_UPLOAD_ENDPOINT = 'https://upload.ansarschool.in/upload.php';

// Some Android and iOS gallery providers return an empty or generic MIME type
// for otherwise valid photos. Accept common image filename extensions as a
// client-side fallback; upload.php still inspects the file itself before it is
// stored, so this does not weaken server-side validation.
const IMAGE_FILE_EXTENSION = /\.(?:avif|bmp|gif|heic|heif|jpe?g|png|webp)$/i;

export function isImageFile(file) {
  if (!file || typeof file.name !== 'string') return false;
  return /^image\//i.test(file.type || '') || IMAGE_FILE_EXTENSION.test(file.name);
}

/**
 * Uploads one image file to the school's Hostinger storage via upload.php
 * and resolves with the public URL
 *
 * No client-side size limit: large photos are accepted as-is and the server
 * decides what it can store. Network/browser limits still apply naturally.
 */
export async function uploadImageToHostinger(file) {
  if (!file) throw new Error('No file selected.');
  const uploadFile = await compressImageForUpload(file);

  const formData = new FormData();
  formData.append('file', uploadFile);

  let response;
  try {
    response = await fetch(HOSTINGER_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    });
  } catch (error) {
    throw new Error('Could not reach the upload service. If it was just configured, try again in a few minutes — or paste an image URL instead.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Upload service returned an invalid response (${response.status}).`);
  }

  if (!response.ok || data.status !== 'success' || !data.url) {
    throw new Error(data.message || `Upload failed (${response.status}).`);
  }

  return data.url;
}

/**
 * Uploads several image files (e.g. an event photo gallery) sequentially and
 * resolves with an array of public URLs in the same order as the input files.
 * Stops at the first failure so partial batches are easy to retry.
 */
export async function uploadImagesToHostinger(files) {
  const list = Array.from(files || []);
  if (!list.length) throw new Error('No files selected.');

  const urls = [];
  for (const file of list) {
    urls.push(await uploadImageToHostinger(file));
  }
  return urls;
}

/**
 * Generic upload used by the Library media manager for images AND PDF
 * documents (the server-side handler decides what it accepts). Uses XHR so
 * callers get real upload progress (0–100) instead of an indeterminate wait.
 * Resolves with the public URL, e.g. https://upload.ansarschool.in/UPLOADS/
 */
export function uploadFileToHostinger(file, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected.'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', HOSTINGER_UPLOAD_ENDPOINT);
    xhr.responseType = 'text';

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (onProgress && xhr.status >= 200 && xhr.status < 300) onProgress(100);
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // fall through to the error branch below
      }
      if (xhr.status >= 200 && xhr.status < 300 && data && data.status === 'success' && data.url) {
        resolve({ url: data.url, path: '' });
      } else {
        reject(new Error((data && data.message) || `Upload failed (${xhr.status}).`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Could not reach the upload service. Check the connection and try again — or paste a file URL instead.'));
    };

    xhr.send(formData);
  });
}
