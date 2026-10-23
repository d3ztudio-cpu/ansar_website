// Shared helpers for the Library page and Library Admin Manager.

const DRIVE_ID = '[a-zA-Z0-9_-]{10,}';

// ---------------------------------------------------------------
// Google Drive link handling
// ---------------------------------------------------------------

/**
 * Extract a Google Drive file ID from common share-link shapes:
 *  - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *  - https://drive.google.com/open?id=FILE_ID
 *  - https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function getDriveFileId(value) {
  const url = String(value || '');
  let match = url.match(new RegExp(`drive\\.google\\.com\\/file\\/d\\/(${DRIVE_ID})`));
  if (match) return match[1];
  match = url.match(new RegExp(`drive\\.google\\.com\\/(?:open|uc)\\?[^#]*[?&]?id=(${DRIVE_ID})`));
  if (match) return match[1];
  return '';
}

/** Match hosts like docs.google.com/document|presentation|spreadsheets|forms/d/ID */
function getGoogleDocsId(url) {
  const match = String(url).match(new RegExp(`docs\\.google\\.com\\/(document|presentation|spreadsheets|forms)\\/d\\/?e?\\/(${DRIVE_ID})`));
  return match ? { kind: match[1], id: match[2] } : null;
}

/** True when the URL points at a PDF file (Drive file or direct .pdf link). */
export function isPdfUrl(value) {
  const url = String(value || '');
  if (!url) return false;
  if (/\.pdf(?:[?#].*)?$/i.test(url)) return true;
  return Boolean(getDriveFileId(url)) && !getGoogleDocsId(url);
}

function withoutQuery(url) {
  return String(url).split(/[?#]/)[0];
}

/**
 * Normalise any pasted library file link into the most reliable "View" URL.
 * Returns '' for empty values. Keeps non-Drive URLs untouched (already direct).
 */
export function normalizeFileUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw.replace(/&amp;/g, '&'));
    const driveId = getDriveFileId(url.toString());
    if (driveId) {
      // Always route through the standard file viewer; works for PDFs.
      return `https://drive.google.com/file/d/${driveId}/view`;
    }
    const docsInfo = getGoogleDocsId(url.toString());
    if (docsInfo) {
      const { kind, id } = docsInfo;
      if (kind === 'forms') return `https://docs.google.com/forms/d/${id}/viewform`;
      return `https://docs.google.com/${kind}/d/${id}/view`;
    }
    return url.toString();
  } catch {
    return raw;
  }
}

/**
 * Best-effort direct download URL for a library document.
 * Google Drive: uc?export=download for uploaded files, export?format=pdf for
 * Docs/Slides/Sheets. Everything else is treated as already-direct.
 */
export function getFileDownloadUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const normalized = normalizeFileUrl(raw);
  const driveId = getDriveFileId(raw);
  if (driveId) return `https://drive.google.com/uc?export=download&id=${driveId}`;
  const docsMatch = normalized.match(
    new RegExp(`^https:\\/\\/docs\\.google\\.com\\/(document|presentation|spreadsheets)\\/d\\/(${DRIVE_ID})\\/view$`)
  );
  if (docsMatch) return `https://docs.google.com/${docsMatch[1]}/d/${docsMatch[2]}/export?format=pdf`;
  return normalized;
}

/**
 * A small thumbnail for PDF cards: Google Drive serves a preview thumbnail for
 * public files; local/static files fall back to the generic PDF chip.
 */
export function getDocumentThumbnail(value) {
  const driveId = getDriveFileId(value);
  if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;
  return '';
}

/** Detect archive images migrated from the local /library/one-fact folder. */
export function isArchivePosterUrl(value) {
  return /^\/library\/one-fact\/\d+\.jpg$/i.test(String(value || '').trim());
}

/** Parse a poster number out of an archive URL (e.g. 143 for /.../143.jpg). */
export function getArchivePosterNumber(value) {
  const match = String(value || '').trim().match(/^\/library\/one-fact\/(\d+)\.jpg$/i);
  return match ? Number(match[1]) : 0;
}

// ---------------------------------------------------------------
// One Fact a Day
// ---------------------------------------------------------------

export const TOTAL_ARCHIVE_POSTERS = 143;
/** Poster 143.jpg is the current fact for 22 October 2026. */
export const ARCHIVE_BASE = { year: 2026, month: 10, day: 22 };

/** YYYY-MM-DD key for a Date (in the machine's local calendar). */
export function dateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey() {
  return dateKey(new Date());
}

export function addDaysKey(key, days) {
  const base = new Date(`${key}T00:00:00`);
  if (Number.isNaN(base.getTime())) return '';
  base.setDate(base.getDate() + days);
  return dateKey(base);
}

export function daysBetweenKeys(fromKey, toKey) {
  const from = new Date(`${fromKey}T00:00:00`);
  const to = new Date(`${toKey}T00:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

/**
 * Before the archive has been migrated to Firestore/public entries, the public
 * page still falls back to the imported static posters: poster 143 sits on
 * 22 Oct 2026 and earlier posters step back one calendar day each.
 */
export function guessArchivePosterForDate(key) {
  const offset = daysBetweenKeys(`${ARCHIVE_BASE.year}-${ARCHIVE_BASE.month}-${ARCHIVE_BASE.day}`, key);
  const posterNumber = TOTAL_ARCHIVE_POSTERS - offset;
  if (posterNumber >= 1 && posterNumber <= TOTAL_ARCHIVE_POSTERS) return posterNumber;
  return 0;
}

export function archivePosterUrl(posterNumber) {
  return `/library/one-fact/${posterNumber}.jpg`;
}

/** Human display: 22 October 2026 (en-IN). */
export function prettyDate(key) {
  const date = new Date(`${key}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

// ---------------------------------------------------------------
// Shared Library vocabulary
// ---------------------------------------------------------------

export const LIBRARY_POST_TYPES = [
  'Announcement', 'Event', 'Activity', 'New Arrival', 'Resource', 'Publication',
  'E-Book', 'E-Learning', 'Short Film', 'Quiz', 'Winner', 'Clipping',
  'Question Paper', 'File', 'Vocabulary'
];

export const QUESTION_PAPER_CATEGORIES = [
  'Model Exam', 'First Terminal', 'Second Terminal', 'Annual', 'Unit Test',
  'Periodic Test', 'Practice Paper', 'Olympiad', 'Entrance', 'Other'
];

export const LIBRARY_FILE_TYPES = ['PDF', 'Image', 'Google Drive document', 'Web link', 'Other'];

export const QUESTION_PAPER_CLASSES = [
  'Pre-KG', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

export const PUBLIC_CATEGORIES = [
  'All', 'Event', 'Activity', 'New Arrival', 'Resource', 'Publication',
  'Announcement', 'E-Book', 'E-Learning', 'Short Film', 'Quiz', 'Winner', 'Clipping',
  'Question Paper', 'File'
];

export function displayPostDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

export function postTime(post) {
  const timestamp = Date.parse(post.date || '');
  if (!Number.isNaN(timestamp)) return timestamp;
  if (post.createdAt?.toMillis) return post.createdAt.toMillis();
  return 0;
}

export function sortPostsNewestFirst(list) {
  return [...(list || [])].sort((a, b) => postTime(b) - postTime(a));
}
