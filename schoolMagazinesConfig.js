export const SCHOOL_MAGAZINE_KINDS = ['Annual', 'Special Edition', 'Souvenir'];

export const SCHOOL_MAGAZINES_START_YEAR = 2020;

export function getSchoolMagazineYears(extraYears = 2) {
  const currentYear = new Date().getFullYear();
  const endYear = Math.max(SCHOOL_MAGAZINES_START_YEAR, currentYear + extraYears);
  return Array.from({ length: endYear - SCHOOL_MAGAZINES_START_YEAR + 1 }, (_, index) => SCHOOL_MAGAZINES_START_YEAR + index);
}

/**
 * Magazines belong to an academic year, so 2025 is displayed as "2025-2026".
 * Records keep the numeric start year for grouping and sorting.
 */
export function getSchoolMagazineYearLabel(year) {
  const value = Number(String(year ?? '').trim().split('-')[0]);
  if (!Number.isFinite(value) || !value) return String(year ?? '');
  return `${value}-${value + 1}`;
}

export function getSchoolMagazineId(year, title) {
  const cleanTitle = String(title || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return cleanTitle ? `${year}-${cleanTitle}` : `${year}-magazine`;
}

export function getSchoolMagazineUrl(item) {
  return item?.pdfUrl || item?.documentUrl || item?.fileUrl || item?.driveLink || item?.link || item?.url || '';
}

/** Best-effort direct download link for Google Drive files (others open as-is). */
export function getSchoolMagazineDownloadUrl(item) {
  const url = getSchoolMagazineUrl(item);
  const driveMatch = String(url).match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (driveMatch) return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;

  const openMatch = String(url).match(/[?&]id=([^&]+)/);
  if (openMatch && String(url).includes('drive.google.com')) {
    return `https://drive.google.com/uc?export=download&id=${openMatch[1]}`;
  }

  return url;
}

export function getSchoolMagazineTitle(item) {
  const title = String(item?.title || '').trim();
  if (title) return title;
  const year = Number(item?.year);
  return Number.isFinite(year) && year ? `School Magazine ${getSchoolMagazineYearLabel(year)}` : 'School Magazine';
}

export function getSchoolMagazineRecordId(item) {
  if (item?.id) return String(item.id);
  const year = Number(item?.year);
  if (Number.isFinite(year) && year) return getSchoolMagazineId(year, item?.title);
  return '';
}

/**
 * Google Sheets can auto-format values (e.g. `2026-annual` becomes a date),
 * so the year/title pair is the stable identity for a magazine record.
 */
export function markSchoolMagazineDeleted(itemOrId) {
  const id = typeof itemOrId === 'string' ? itemOrId : getSchoolMagazineRecordId(itemOrId);
  if (!id) return;
  writeDeletedIds([...readDeletedIds(), id]);
}

export function clearSchoolMagazineDeleted(itemOrId) {
  const id = typeof itemOrId === 'string' ? itemOrId : getSchoolMagazineRecordId(itemOrId);
  if (!id) return;
  writeDeletedIds(readDeletedIds().filter(item => item !== id));
}

export function isSchoolMagazineDeleted(item) {
  const id = getSchoolMagazineRecordId(item);
  return Boolean(id && readDeletedIds().includes(id));
}

const SCHOOL_MAGAZINES_DELETED_KEY = 'schoolMagazinesDeletedIds';

function readDeletedIds() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(SCHOOL_MAGAZINES_DELETED_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function writeDeletedIds(ids) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SCHOOL_MAGAZINES_DELETED_KEY, JSON.stringify([...new Set(ids)]));
}
