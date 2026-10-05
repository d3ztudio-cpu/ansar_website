/**
 * AdminReportGenerator — Reusable website-performance report generation protocol.
 *
 * Purpose
 *  -------
 *  Replace the inline PDF "report()" routine in AdminAnalytics.jsx with a
 *  well-defined, testable generation protocol. The protocol exposes one
 *  async entry point, generateWebsitePerformanceReport(), that turns the
 *  live Search Console / GA4 metrics into a branded A4 PDF (the same report
 *  the public "Website Performance Report" page derives its numbers from).
 *
 * Protocol
 *  --------
 *  const report = await generateWebsitePerformanceReport(metrics, { period, token });
 *  // report.pdfBytes, report.pdfBlob, report.filename, report.download(pdfBlob)
 *
 * Public surface (keep this stable — every caller uses it)
 *  ------------------------------------------------------
 *  generateWebsitePerformanceReport(metrics, opts)
 *  - metrics: { period, metrics: {...} }  (same shape AdminAnalytics uses)
 *  - opts: { onProgress, download }
 *  - returns: { pdfBytes, pdfBlob, filename, download }
 *
 * Design invariants (no regression)
 *  --------------------------------
 *  - Keeps the exact metric layout from AdminAnalytics.jsx so the visual
 *    matches the public page's "Website Performance Report" card.
 *  - Produces branded A4 PDF with jspdf (already installed).
 *  - Progress callbacks fire in 5 increments so consumers can show a
 *    indeterminate/progress spinner and no database-warning noise appears.
 *
 * Notes
 *  -----
 *  - `report()` in AdminAnalytics.jsx remains a thin, event-only call that
 *    delegates to this protocol (single source of truth for the PDF logic).
 *  - `generateEventReport()` in reportUtils.js is a separate, single-item
 *    report path for listing cards/news/events; this module does NOT touch it.
 */

import { jsPDF } from 'jspdf';

/** School branding (emerald/amber, matches AdminLayout & public live page). */
const BRAND = {
  primary: [6, 78, 59], // emerald-900
  accent: [16, 185, 129], // emerald-500
  text: [15, 23, 42], // slate-900
  muted: [71, 85, 105], // slate-600
  light: [226, 232, 240], // slate-200
  bg: [248, 250, 252], // slate-50
  warning: [234, 88, 12], // amber-600
};

const SCHOOL_INFO = {
  name: 'Ansar English School',
  tagline: 'CBSE Senior Secondary School',
  accreditation: 'NABET Accredited',
  address: 'Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519',
  phone: '+91 81298 08051',
  email: 'hr@ansar.in',
  website: 'www.ansarschool.in'
};

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 32;

/** Produce report.pdfBytes + pdfBlob + filename + a download() helper. */
export async function generateWebsitePerformanceReport(metrics, { onProgress = () => {}, download = true } = {}) {
  onProgress(5, 'Preparing website performance report…');

  // ----- Metric display helpers (unchanged from AdminAnalytics.jsx) -----
  const displayMetric = (value, suffix = '') => value === null || value === undefined || value === ''
    ? '—'
    : `${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}${suffix}`;

  const percent = (value) => value === null || value === undefined ? '—' : `${Number(value).toFixed(2)}%`;

  // ----- Build the PDF (branded, table-like, no inline literals) -----
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  // Header: school name, tagline, accreditation, address, contact, white branding strip
  const headerY = 0;
  const headerContentH = 32;
  doc.setFillColor(...BRAND.primary);
  doc.rect(0, headerY, PAGE_W, headerContentH, 'F');
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(16, 10, 22, 22, 3, 3, 'F');
  // Keep the export self-contained: a relative browser URL is interpreted as
  // a filesystem path by jsPDF's Node build and can abort generation.
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(SCHOOL_INFO.name, 43, 12.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`${SCHOOL_INFO.tagline} • ${SCHOOL_INFO.accreditation}`, 43, 18);
  doc.setFontSize(7.5);
  doc.text(SCHOOL_INFO.address, 43, 22.5);
  doc.text(`Tel: ${SCHOOL_INFO.phone}  •  ${SCHOOL_INFO.email}  •  ${SCHOOL_INFO.website}`, 43, 27);

  // Accent line under header
  doc.setDrawColor(...BRAND.accent);
  doc.setLineWidth(1.2);
  doc.line(0, headerContentH, PAGE_W, headerContentH);

  // Subtitle band (report type + period)
  const period = metrics.period || {};
  const periodLabel = [period.start, period.end].filter(Boolean).join(' to ');
  const subtitle = 'Website Performance Report';

  doc.setFillColor(...BRAND.bg);
  doc.rect(0, headerContentH, PAGE_W, 10, 'F');
  doc.setTextColor(...BRAND.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`${subtitle}`, MARGIN, headerContentH + 6.8);
  doc.setDrawColor(...BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(0, headerContentH + 10, PAGE_W, headerContentH + 10);

  // Reporting period (top of body)
  setTextColor(doc, BRAND.muted);
  doc.setFontSize(9);
  doc.text(`Reporting period: ${periodLabel || '—'}`, MARGIN, headerContentH + 16);

  // Metrics table (metrics list, exact format from the image)
  const rows = [
    ['Users', displayMetric(metrics?.users)],
    ['Sessions', displayMetric(metrics?.sessions)],
    ['Page views', displayMetric(metrics?.pageViews)],
    ['Search clicks', displayMetric(metrics?.clicks)],
    ['Impressions', displayMetric(metrics?.impressions)],
    ['CTR', percent(metrics?.ctr)],
    ['Average position', displayMetric(metrics?.position)]
  ];

  const startY = headerContentH + 26;
  setTextColor(doc, BRAND.text);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Performance metrics', MARGIN, startY);
  let y = startY + 8;
  const pageHeader = () => {};

  const columnWidths = [48, CONTENT_W - 48];
  const columnX = (x) => x;
  const labelW = 48;
  const labelMaxWidth = labelW - 6;
  doc.setFontSize(9);

  const drawTableRow = (index, label, value, y) => {
    const isOdd = index % 2 === 1;
    setFillColor(doc, isOdd ? [255, 255, 255] : [248, 250, 252]);
    doc.roundedRect(MARGIN, y - 1, labelW + columnWidths[1], 7, 1, 1, 'F');

    setTextColor(doc, BRAND.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, MARGIN + 3, y + 5.4);

    setTextColor(doc, BRAND.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(value, MARGIN + labelW + 4, y + 5.4);
  };

  rows.forEach(([label, value], index) => {
    y = ensureSpace(doc, 8, y, pageHeader);
    drawTableRow(index, label, value, y);
    y += 7;
  });

  // ----- Performance highlights (top pages) -----
  const pages = (metrics?.pages || []).slice(0, 5);
  if (pages.length) {
    y = ensureSpace(doc, 8, y, pageHeader);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Performance highlights', MARGIN, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const topPages = pages.map((p, i) => {
      const path = p.path || p.url || p.name || 'Untitled';
      const views = displayMetric(p.views ?? p.value);
      return `${i + 1}. ${path} — ${views} views`;
    });
    topPages.forEach((line) => {
      doc.text(line, MARGIN, y);
      y += 7;
    });
  }

  // ----- Closing note -----
  y = ensureSpace(doc, 12, y, pageHeader);
  setDrawColor(doc, BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;
  setTextColor(doc, BRAND.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const note = `This website performance report was generated automatically from the live Search Console and Google Analytics data requested through the protected Firebase reporting service. No credentials or bridge URL are stored in the browser.`;
  const noteLines = wrapText(doc, note, CONTENT_W);
  noteLines.forEach((line) => {
    doc.text(line, MARGIN, y + 3);
    y += 4.4;
  });

  // ----- Footer -----
  doc.setDrawColor(...BRAND.light);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);
  doc.setTextColor(...BRAND.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${SCHOOL_INFO.name} • ${SCHOOL_INFO.website}`, MARGIN, PAGE_H - 9);
  doc.text(`Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`, PAGE_W - MARGIN, PAGE_H - 9, { align: 'right' });
  doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, PAGE_W / 2, PAGE_H - 9, { align: 'center' });

  // ----- Save / return protocol -----
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...BRAND.light);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);
    doc.setTextColor(...BRAND.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`${SCHOOL_INFO.name} • ${SCHOOL_INFO.website}`, MARGIN, PAGE_H - 9);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 9, { align: 'right' });
    doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, PAGE_W / 2, PAGE_H - 9, { align: 'center' });
  }

  const pdfBytes = doc.output('arraybuffer');
  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  const filename = `ansar-performance-${period.start || 'report'}-to-${period.end || period.start || 'report'}.pdf`;
  const triggerDownload = (blob = pdfBlob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { pdfBytes, pdfBlob, filename, download: triggerDownload, triggerDownload };
}

/* ------------------------------------------------------------------ */
/* Helpers (reused by the same pattern elsewhere)                      */
/* ------------------------------------------------------------------ */

function ensureSpace(doc, neededMm, y, drawHeader) {
  if (y + neededMm <= PAGE_H - 20) return y;
  doc.setPage(doc.getCurrentPageInfo().pageNumber);
  doc.addPage();
  drawHeader();
  return HEADER_H + 14;
}

function wrapText(doc, text, widthMm) {
  return doc.splitTextToSize(String(text || ''), widthMm);
}

function setTextColor(doc, rgb) { doc.setTextColor(rgb[0], rgb[1], rgb[2]); }
function setFillColor(doc, rgb) { doc.setFillColor(rgb[0], rgb[1], rgb[2]); }
function setDrawColor(doc, rgb) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]); }
