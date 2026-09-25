<?php
/**
 * Image upload handler for Hostinger (public_html/upload.php).
 *
 * Receives a multipart POST with field name "file", validates it as an image,
 * stores it in public_html/UPLOADS/, and responds with JSON:
 *   { "status": "success", "url": "https://upload.ansarschool.in/UPLOADS/<name>.<ext>" }
 *   { "status": "error",   "message": "..." }
 *
 * The admin front-end (hostingerUpload.js) expects exactly this contract.
 * Existing uploads are never modified — only new files are added.
 *
 * NOTE: If the Hostinger panel later serves this server through a different
 * hostname (e.g. upload.ansarschool.in), only the HOST_BASE constant below
 * needs to change.
 */

// Canonical public host used to build the saved image URLs.
// The srv1090-files.hstgr.io address is Hostinger's internal server name and is
// blocked at their edge (403), so uploads are served through this subdomain
// bound to the same hosting account (A record -> 82.25.121.102).
const HOST_BASE = 'upload.ansarschool.in';

// ----- CORS: allow only the known front-ends -----
$allowed_origins = [
    'https://ansar-english-school.web.app',
    'https://ansar-english-school.firebaseapp.com',
    'https://ansarschool.in'
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Vary: Origin');
}
header('Content-Type: application/json; charset=utf-8');

// Browser preflight
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

function respondError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit;
}

// ----- Validate upload -----
if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    respondError('No file received.');
}

$file = $_FILES['file'];
if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
    respondError('Upload failed (code ' . $file['error'] . '). The file may be too large.');
}
if ($file['size'] <= 0 || $file['size'] > 8 * 1024 * 1024) {
    respondError('Image must be between 1 byte and 8 MB.');
}

// Real image check (blocks disguised files regardless of extension)
$info = @getimagesize($file['tmp_name']);
if ($info === false) {
    respondError('The selected file is not a valid image.');
}

$allowedTypes = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_GIF => 'gif', IMAGETYPE_WEBP => 'webp'];
$extension = $allowedTypes[$info[2]] ?? null;
if ($extension === null) {
    respondError('Only JPG, PNG, GIF, or WebP images are allowed.');
}

// ----- Ensure the target directory exists (public_html/UPLOADS) -----
$uploadDir = __DIR__ . '/UPLOADS';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
    respondError('Server storage folder could not be created.', 500);
}

// ----- Collision-safe, unguessable name: UPLOADS/<timestamp>_<random>.<ext> -----
$name = time() . '_' . bin2hex(random_bytes(5)) . '.' . $extension;
$targetPath = $uploadDir . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    respondError('Could not save the image on the server.', 500);
}
@chmod($targetPath, 0644);

// ----- Public URL (uses the requested host when served via the subdomain) -----
$host = $_SERVER['HTTP_HOST'] ?? HOST_BASE;
$url = 'https://' . $host . '/UPLOADS/' . $name;

echo json_encode(['status' => 'success', 'url' => $url]);
exit;
