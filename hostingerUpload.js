// Public endpoint of the PHP upload handler on the school's Hostinger server.
//
// ansarschool.in is served by Firebase Hosting (static only — it cannot run
// PHP), so all image uploads are POSTed to the dedicated Hostinger subdomain.
// Create `upload.ansarschool.in` in Hostinger hPanel with an A record pointing
// at the server IP (82.25.121.102) and place upload.php in its document root.
// The handler stores files in public_html/UPLOADS/ and they are served from:
//   https://upload.ansarschool.in/UPLOADS/<file-name>
const HOSTINGER_UPLOAD_ENDPOINT = 'https://upload.ansarschool.in/upload.php';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB per image

/**
 * Uploads a single image file to the school's Hostinger storage via upload.php
 * and resolves with the public URL
 * (e.g. https://upload.ansarschool.in/UPLOADS/1737500000_ab12c.jpg).
 */
export async function uploadImageToHostinger(file) {
  if (!file) throw new Error('No file selected.');

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Image is larger than 8 MB. Please compress it first.');
  }

  const formData = new FormData();
  formData.append('file', file);

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
