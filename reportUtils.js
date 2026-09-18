import { db } from './firebase-init';
import { collection, getDocs } from 'firebase/firestore';
import { fetchSheetCollection, clearGoogleSheetsCache } from './useContentCollection';
import { GOOGLE_SHEETS_DATABASE } from './googleSheetsConfig';
import { normalizeImageUrl, uniqueImageUrls, extractImageUrls } from './imageUrlUtils';
import { parseFlexibleDate } from './dateUtils';

export const SCHOOL_INFO = {
  name: 'Ansar English School',
  tagline: 'CBSE Senior Secondary School',
  affiliation: 'Affiliated to CBSE, New Delhi',
  accreditation: 'NABET Accredited',
  address: 'Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519',
  phone: '+91 81298 08051',
  email: 'hr@ansar.in',
  website: 'www.ansarschool.in'
};

const LOGO_URL = '/ansar-logo.png';

const LOGO_DATAURL_CACHE_KEY = 'ansarReportLogoDataUrl';

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */

function readLogoFromCache() {
  try { return localStorage.getItem(LOGO_DATAURL_CACHE_KEY) || null; } catch { return null; }
}

function writeLogoToCache(dataUrl) {
  try { localStorage.setItem(LOGO_DATAURL_CACHE_KEY, dataUrl); } catch { /* quota */ }
}

export async function getSchoolLogoDataUrl() {
  const cached = readLogoFromCache();
  if (cached) return cached;

  const candidates = [LOGO_URL, 'ansar-logo.png', 'icon-192.png'];
  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: 'force-cache' });
      if (!response.ok) continue;
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) continue;
      const dataUrl = await downscaleLogo(blob);
      if (dataUrl) {
        writeLogoToCache(dataUrl);
        return dataUrl;
      }
    } catch { /* try next candidate */ }
  }
  return null;
}

/** Downscale the logo to a compact square PNG (keeps transparency). */
function downscaleLogo(blob) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        // contain-fit on white-free transparent canvas
        const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        canvas.toBlob(
          (pngBlob) => {
            URL.revokeObjectURL(objectUrl);
            if (!pngBlob) return resolve(null);
            blobToDataUrl(pngBlob).then(resolve).catch(() => resolve(null));
          },
          'image/png'
        );
      } catch {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    img.src = objectUrl;
  });
}

/* ------------------------------------------------------------------ */
/* Item images → data URLs (so they embed in the PDF)                  */
/* ------------------------------------------------------------------ */

const MAX_IMAGES_PER_REPORT = 12;
const IMAGE_FETCH_TIMEOUT_MS = 12000;
const MAX_IMAGE_PIXELS = 1600; // longest side after downscale

/**
 * Fetch an image and convert it to an embeddable JPEG data URL.
 * @returns {Promise<{dataUrl:string,w:number,h:number}|null>} dimensions in px
 */
async function fetchAsDataUrl(url, timeoutMs = IMAGE_FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, mode: 'cors', cache: 'force-cache' });
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) return null;
    return await downscaleBlob(blob);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function downscaleBlob(blob) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const naturalW = img.naturalWidth || 800;
      const naturalH = img.naturalHeight || 600;
      try {
        const scale = Math.min(1, MAX_IMAGE_PIXELS / Math.max(naturalW, naturalH));
        const finish = (dataUrl) => {
          URL.revokeObjectURL(objectUrl);
          resolve(dataUrl ? { dataUrl, w: naturalW, h: naturalH } : null);
        };

        if (scale === 1 && (blob.type === 'image/jpeg' || blob.type === 'image/png') && blob.size <= 900_000) {
          // Small enough already – keep original bytes
          blobToDataUrl(blob).then(finish).catch(() => finish(null));
          return;
        }

        const targetW = Math.max(1, Math.round(naturalW * scale));
        const targetH = Math.max(1, Math.round(naturalH * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(img, 0, 0, targetW, targetH);
        canvas.toBlob(
          (jpegBlob) => {
            blobToDataUrl(jpegBlob).then(finish).catch(() => finish(null));
          },
          'image/jpeg',
          0.82
        );
      } catch {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    img.src = objectUrl;
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* ------------------------------------------------------------------ */
/* Data collection: events + news, from Firestore + Google Sheets      */
/* ------------------------------------------------------------------ */

export const REPORT_KIND_LABELS = {
  events: 'Event',
  news: 'News'
};

function toMillis(value) {
  const parsed = parseFlexibleDate(value);
  return parsed ? parsed.getTime() : 0;
}

function collectImageUrls(item) {
  const raw = [
    item?.thumbnailUrl,
    item?.coverImageUrl,
    item?.imageUrl,
    item?.eventImages,
    item?.imageUrls,
    item?.galleryImages
  ];
  const urls = new Set();
  raw.forEach((entry) => {
    if (Array.isArray(entry)) {
      entry.forEach((u) => { const n = normalizeImageUrl(u); if (n) urls.add(n); });
    } else if (typeof entry === 'string') {
      // Multi-URL text fields (comma/newline separated or pasted HTML)
      uniqueImageUrls(entry).forEach((u) => urls.add(u));
      extractImageUrls(entry).forEach((u) => urls.add(u));
    }
  });
  return [...urls];
}

function normalizeItem(raw, kind, source) {
  const id = String(raw?.id || raw?.slug || '').trim();
  if (!id) return null;
  const title = String(raw?.title || '').trim() || 'Untitled';
  const description = String(raw?.description ?? raw?.excerpt ?? raw?.content ?? '').trim();
  const images = collectImageUrls(raw).slice(0, MAX_IMAGES_PER_REPORT);

  const report = {
    id,
    kind,
    kindLabel: REPORT_KIND_LABELS[kind] || kind,
    title,
    description,
    date: raw?.date ? String(raw.date) : '',
    dateMillis: toMillis(raw?.date),
    createdAtMillis: toMillis(raw?.createdAt),
    location: String(raw?.location || raw?.venue || '').trim(),
    category: String(raw?.category || '').trim(),
    images,
    source
  };
  return report;
}

async function fetchFirestoreItems(collectionName) {
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn(`reportUtils: Firestore fetch failed for ${collectionName}`, error);
    return [];
  }
}

async function fetchSheetItems(collectionName) {
  if (!GOOGLE_SHEETS_DATABASE.enabled) return [];
  try {
    return await fetchSheetCollection(collectionName);
  } catch (error) {
    console.warn(`reportUtils: Google Sheets fetch failed for ${collectionName}`, error);
    return [];
  }
}

function mergeAndDedupe(firestoreItems, sheetItems, kind) {
  const merged = new Map();

  firestoreItems.forEach((raw) => {
    if (raw?.published === false) return;
    const normalized = normalizeItem(raw, kind, 'firestore');
    if (normalized) merged.set(normalized.id, normalized);
  });

  sheetItems.forEach((raw) => {
    if (raw?.published === false) return;
    const normalized = normalizeItem(raw, kind, 'sheets');
    if (!normalized) return;
    const existing = merged.get(normalized.id);
    if (existing) {
      // Sheet data wins for scalar fields, but keep union of images
      merged.set(normalized.id, {
        ...existing,
        ...normalized,
        images: [...new Set([...normalized.images, ...existing.images])].slice(0, 12)
      });
    } else {
      merged.set(normalized.id, normalized);
    }
  });

  return [...merged.values()].sort((a, b) =>
    (b.dateMillis || b.createdAtMillis) - (a.dateMillis || a.createdAtMillis)
  );
}

/**
 * Fetch every published event & news item (Firestore + Google Sheets merged,
 * same as the live site) plus the school logo. Called once when the Reports
 * modal opens; results are cached in memory for the session.
 */
export async function collectReportData() {
  clearGoogleSheetsCache(); // bypass the 5-min sheet cache so reports use fresh data

  const [fsEvents, fsUpdates, sheetEvents, sheetUpdates, logo] = await Promise.all([
    fetchFirestoreItems('events'),
    fetchFirestoreItems('updates'),
    fetchSheetItems('events'),
    fetchSheetItems('updates'),
    getSchoolLogoDataUrl()
  ]);

  const events = mergeAndDedupe(fsEvents, sheetEvents, 'events');
  const news = mergeAndDedupe(fsUpdates, sheetUpdates, 'news');

  // A news item that is really an event (has category 'Events') is shown as an event;
  // news items stay in news. Events collection is always 'events'.
  const eventItems = [...events, ...news.filter((n) => /^event/i.test(n.category) && !events.some((e) => e.id === n.id))];
  const newsItems = news.filter((n) => !/^event/i.test(n.category));

  return { logo, events: eventItems, news: newsItems, fetchedAt: new Date() };
}

/* ------------------------------------------------------------------ */
/* Single item lookup (for the per-card / per-article button)           */
/* ------------------------------------------------------------------ */

export async function findReportItem(kind, id, preloaded = null) {
  if (preloaded && (preloaded.id === id || preloaded.slug === id)) {
    return normalizeItem(preloaded, kind, 'current-page');
  }
  const { events, news } = await collectReportData();
  const pool = kind === 'news' ? news : events;
  return pool.find((item) => item.id === id || item.slug === id) || null;
}

/* ------------------------------------------------------------------ */
/* PDF generation                                                      */
/* ------------------------------------------------------------------ */

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 30;

const BRAND = {
  primary: [6, 78, 59],    // emerald-900
  accent: [16, 185, 129],  // emerald-500
  text: [15, 23, 42],      // slate-900
  muted: [71, 85, 105],    // slate-600
  light: [226, 232, 240],  // slate-200
  bg: [248, 250, 252]      // slate-50
};

function setFillColor(doc, rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
function setDrawColor(doc, rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]); }
function setTextColor(doc, rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }

function drawBrandedHeader(doc, logoDataUrl, subtitle) {
  // Banner background
  setFillColor(doc, BRAND.primary);
  doc.rect(0, 0, PAGE_W, HEADER_H, 'F');

  // Logo (white rounded box behind it for contrast)
  const logoBoxSize = 22;
  const logoBoxX = MARGIN;
  const logoBoxY = (HEADER_H - logoBoxSize) / 2;
  setFillColor(doc, [255, 255, 255]);
  doc.roundedRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 3, 3, 'F');
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', logoBoxX + 2.5, logoBoxY + 2.5, logoBoxSize - 5, logoBoxSize - 5, undefined, 'FAST');
    } catch { /* ignore malformed image */ }
  }

  // School name + tagline
  setTextColor(doc, [255, 255, 255]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(SCHOOL_INFO.name, logoBoxX + logoBoxSize + 5, 12.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${SCHOOL_INFO.tagline} • ${SCHOOL_INFO.accreditation}`, logoBoxX + logoBoxSize + 5, 18.5);
  doc.setFontSize(7.5);
  doc.text(`${SCHOOL_INFO.address}`, logoBoxX + logoBoxSize + 5, 23.5);
  doc.text(`Tel: ${SCHOOL_INFO.phone}  •  ${SCHOOL_INFO.email}  •  ${SCHOOL_INFO.website}`, logoBoxX + logoBoxSize + 5, 27.5);

  // Accent line under the header
  setDrawColor(doc, BRAND.accent);
  doc.setLineWidth(1.2);
  doc.line(0, HEADER_H, PAGE_W, HEADER_H);

  // Subtitle band (report type)
  if (subtitle) {
    setFillColor(doc, BRAND.bg);
    doc.rect(0, HEADER_H, PAGE_W, 10, 'F');
    setTextColor(doc, BRAND.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(subtitle.toUpperCase(), MARGIN, HEADER_H + 6.8);
    setDrawColor(doc, BRAND.light);
    doc.setLineWidth(0.3);
    doc.line(0, HEADER_H + 10, PAGE_W, HEADER_H + 10);
  }
}

function drawFooter(doc, pageNumber, totalPages) {
  setDrawColor(doc, BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);
  setTextColor(doc, BRAND.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${SCHOOL_INFO.name} • ${SCHOOL_INFO.website}`, MARGIN, PAGE_H - 9);
  doc.text(`Page ${pageNumber} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 9, { align: 'right' });
  doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, PAGE_W / 2, PAGE_H - 9, { align: 'center' });
}

function ensureSpace(doc, neededMm, y, drawHeader) {
  if (y + neededMm <= PAGE_H - 20) return y;
  drawFooter(doc, doc.getCurrentPageInfo().pageNumber, doc.getNumberOfPages());
  doc.addPage();
  drawHeader();
  return HEADER_H + 14; // skip subtitle band on continuation pages
}

function wrapText(doc, text, widthMm) {
  return doc.splitTextToSize(String(text || ''), widthMm);
}

function drawReportBody(doc, report, logoDataUrl) {
  const pageHeader = () => drawBrandedHeader(doc, logoDataUrl, `${report.kindLabel} Report`);

  let y = HEADER_H + 14;

  // ----- Title block -----
  setTextColor(doc, BRAND.text);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const titleLines = wrapText(doc, report.title, CONTENT_W);
  titleLines.forEach((line) => {
    y = ensureSpace(doc, 9, y, pageHeader);
    doc.text(line, MARGIN, y + 4);
    y += 8;
  });
  y += 2;

  // ----- Meta chips row -----
  const chips = [];
  if (report.date) chips.push(`Date: ${formatDateForReport(report)}`);
  if (report.location) chips.push(`Venue: ${report.location}`);
  if (report.category) chips.push(`Category: ${report.category}`);

  if (chips.length) {
    y = ensureSpace(doc, 14, y, pageHeader);
    let chipX = MARGIN;
    const chipY = y + 2;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    chips.forEach((chip) => {
      const chipW = doc.getTextWidth(chip) + 6;
      if (chipX + chipW > PAGE_W - MARGIN) {
        chipX = MARGIN;
        y += 8;
      }
      setFillColor(doc, [236, 253, 245]); // emerald-50
      setDrawColor(doc, BRAND.accent);
      doc.setLineWidth(0.2);
      doc.roundedRect(chipX, chipY + (y - chipY), chipW, 6, 3, 3, 'FD');
      setTextColor(doc, BRAND.primary);
      doc.text(chip, chipX + 3, chipY + (y - chipY) + 4.2);
      chipX += chipW + 3;
    });
    y += 12;
  }

  // ----- Description -----
  if (report.description) {
    y = ensureSpace(doc, 12, y, pageHeader);
    setTextColor(doc, BRAND.text);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    const descLines = wrapText(doc, report.description, CONTENT_W);
    descLines.forEach((line) => {
      y = ensureSpace(doc, 6, y, pageHeader);
      doc.text(line, MARGIN, y + 3);
      y += 5.4;
    });
    y += 4;
  }

  // ----- Images -----
  if (report.images.length) {
    y = ensureSpace(doc, 10, y, pageHeader);
    setTextColor(doc, BRAND.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Event Photographs', MARGIN, y + 4);
    y += 8;
    setDrawColor(doc, BRAND.accent);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, MARGIN + 30, y);
    y += 6;
  }

  let column = 0;
  let rowStartY = y;
  const colW = (CONTENT_W - 6) / 2; // 2 columns
  const imgH = 55;

  for (let i = 0; i < report.images.length; i++) {
    const photo = report.imageDataUrls?.[i];
    if (!photo?.dataUrl) continue;

    const x = MARGIN + column * (colW + 6);
    y = ensureSpace(doc, imgH + 12, y, pageHeader);
    if (y !== rowStartY && column === 0) rowStartY = y;

    // Frame + centred image (fit inside the frame, no distortion)
    setFillColor(doc, BRAND.bg);
    doc.roundedRect(x, y, colW, imgH, 2, 2, 'F');
    try {
      const fit = Math.min(colW / photo.w, imgH / photo.h);
      const drawW = photo.w * fit;
      const drawH = photo.h * fit;
      doc.addImage(photo.dataUrl, 'JPEG', x + (colW - drawW) / 2, y + (imgH - drawH) / 2, drawW, drawH, undefined, 'FAST');
    } catch { /* skip broken image */ }
    setTextColor(doc, BRAND.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Fig. ${i + 1}`, x + colW / 2, y + imgH + 4, { align: 'center' });

    column += 1;
    if (column === 2) {
      column = 0;
      y += imgH + 10;
      rowStartY = y;
    } else {
      y = rowStartY;
    }
  }
  if (column !== 0) y += imgH + 10;

  // ----- Closing note -----
  y = ensureSpace(doc, 18, y, pageHeader);
  setDrawColor(doc, BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;
  setTextColor(doc, BRAND.muted);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  const note = wrapText(doc, `This report was generated automatically from the ${report.kindLabel.toLowerCase()} records published on ${SCHOOL_INFO.website}. For verification or more details, please contact the school office.`, CONTENT_W);
  note.forEach((line) => {
    doc.text(line, MARGIN, y + 3);
    y += 4.4;
  });
}

/**
 * Build a normalized report item from raw card props (no network needed).
 * Used by listing cards so the Download Report button works instantly.
 */
export function normalizeItemForReport(raw, kind) {
  return normalizeItem(raw, kind === 'news' ? 'news' : 'events', 'card-props');
}

function formatDateForReport(report) {
  if (!report.date) return 'Not specified';
  const parsed = parseFlexibleDate(report.date);
  if (!parsed) return report.date;
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function sanitizeFilename(value) {
  return String(value || 'report')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'report';
}

/**
 * Generate and download the PDF report for one item.
 * @param {object} report normalized item from collectReportData()/findReportItem()
 * @param {string|null} logoDataUrl school logo as data URL
 * @param {{onProgress?: (pct:number, label:string)=>void}} opts
 */
export async function generateEventReport(report, logoDataUrl, opts = {}) {
  const onProgress = opts.onProgress || (() => {});
  onProgress(10, 'Preparing report…');

  // Fetch images (max N, sequential with progress)
  const imageUrls = report.images.slice(0, MAX_IMAGES_PER_REPORT);
  const imageDataUrls = [];
  for (let i = 0; i < imageUrls.length; i++) {
    onProgress(10 + Math.round((i / Math.max(1, imageUrls.length)) * 50), `Fetching photo ${i + 1} of ${imageUrls.length}…`);
    const photo = await fetchAsDataUrl(imageUrls[i]);
    if (photo) imageDataUrls.push(photo);
  }

  onProgress(70, 'Building PDF…');
  const { jsPDF } = await import('jspdf'); // loaded on first use (~350 KB, cached afterwards)
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  drawReportBody(doc, { ...report, images: imageUrls, imageDataUrls }, logoDataUrl);

  // Footer on all pages
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, p, total);
  }

  onProgress(95, 'Saving…');
  const filename = `${sanitizeFilename(report.kindLabel + '-' + report.title)}-report.pdf`;
  doc.save(filename);

  onProgress(100, 'Downloaded!');
}

/**
 * Convenience: generate a report straight from a listing card / article page.
 */
export async function generateReportForItem(kind, id, preloadedItem, onProgress) {
  const { logo } = await collectReportData();
  const item = await findReportItem(kind, id, preloadedItem);
  if (!item) throw new Error('Item not found');
  await generateEventReport(item, logo, { onProgress });
}
