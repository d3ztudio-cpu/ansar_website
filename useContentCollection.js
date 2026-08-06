import { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from './firebase-init';
import { GOOGLE_SHEETS_DATABASE } from './googleSheetsConfig';
import { normalizeImageUrl, splitImageUrls } from './imageUrlUtils';

const SHEET_CACHE = new Map();
const SHEET_CACHE_TTL_MS = 5 * 60 * 1000;
let sheetCacheVersion = Math.floor(Date.now() / SHEET_CACHE_TTL_MS);
const SHEET_CACHE_CLEAR_EVENT = 'ansar-sheets-cache-cleared';
const SHEET_CACHE_CLEAR_KEY = 'ansarSheetsCacheClearedAt';

export function clearGoogleSheetsCache() {
  SHEET_CACHE.clear();
  sheetCacheVersion = Date.now();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SHEET_CACHE_CLEAR_EVENT));
    try {
      window.localStorage.setItem(SHEET_CACHE_CLEAR_KEY, String(Date.now()));
    } catch (error) {
      console.warn('Unable to broadcast Sheets cache refresh:', error);
    }
  }
}

export function subscribeGoogleSheetsRefresh(callback) {
  if (typeof window === 'undefined') return () => {};

  const onLocalRefresh = () => callback();
  const onStorage = (event) => {
    if (event.key === SHEET_CACHE_CLEAR_KEY) callback();
  };

  window.addEventListener(SHEET_CACHE_CLEAR_EVENT, onLocalRefresh);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(SHEET_CACHE_CLEAR_EVENT, onLocalRefresh);
    window.removeEventListener('storage', onStorage);
  };
}

function normalizeHeader(header) {
  return String(header || '')
    .trim()
    .replace(/^\uFEFF/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/[^a-z0-9]/g, '');
}

function readCell(cell) {
  if (!cell) return '';
  if (cell.f != null && cell.v instanceof Date) return cell.f;
  if (cell.v == null) return '';
  return cell.f != null && typeof cell.v !== 'boolean' && typeof cell.v !== 'number' ? cell.f : cell.v;
}

function parseBoolean(value, fallback = true) {
  if (value === '' || value == null) return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).trim().toLowerCase();
  if (['false', 'no', '0', 'draft', 'unpublished'].includes(normalized)) return false;
  if (['true', 'yes', '1', 'published'].includes(normalized)) return true;
  return fallback;
}

function splitList(value) {
  if (Array.isArray(value)) return value;
  return String(value || '')
    .split(/\r?\n|,\s*/)
    .map(item => item.trim())
    .filter(Boolean);
}

function normalizeImageFields(item) {
  ['imageUrl', 'coverImageUrl', 'thumbnailUrl', 'heroImageUrl', 'logoUrl', 'directorImageUrl', 'principalImageUrl', 'sustainabilityLogoUrl'].forEach((key) => {
    if (item[key]) item[key] = normalizeImageUrl(item[key]);
  });

  ['imageUrls', 'eventImages', 'galleryImages', 'outdoorGymImageUrls', 'premisesImages', 'kgImages'].forEach((key) => {
    if (item[key]) item[key] = splitImageUrls(item[key]);
  });
}

function normalizeContentItem(item) {
  const normalized = { ...item };
  normalizeImageFields(normalized);
  return normalized;
}

function mergeChunkedListFields(item, key) {
  const chunks = [key, `${key}2`, `${key}3`, `${key}4`]
    .flatMap((field) => splitList(item[field]))
    .filter(Boolean);

  if (chunks.length) item[key] = [...new Set(chunks)];
  [`${key}2`, `${key}3`, `${key}4`].forEach((field) => {
    if (field in item) delete item[field];
  });
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function coerceRow(row, collectionName, rowIndex) {
  const aliases = {
    documenturl: 'documentUrl',
    fileurl: 'fileUrl',
    imageurl: 'imageUrl',
    image: 'imageUrl',
    imageurls: 'imageUrls',
    imageurls2: 'imageUrls2',
    imageurls3: 'imageUrls3',
    imageurls4: 'imageUrls4',
    eventimages: 'eventImages',
    eventimages2: 'eventImages2',
    eventimages3: 'eventImages3',
    eventimages4: 'eventImages4',
    galleryimages: 'galleryImages',
    outdoorgymimageurls: 'outdoorGymImageUrls',
    coverimageurl: 'coverImageUrl',
    thumbnailurl: 'thumbnailUrl',
    thumburl: 'thumbnailUrl',
    studentname: 'studentName',
    facebookurl: 'facebookUrl',
    instagramurl: 'instagramUrl',
    youtubeurl: 'youtubeUrl',
    pdfurl: 'pdfUrl',
    drivelink: 'driveLink',
    googledrivelink: 'driveLink'
  };

  const item = {};
  Object.entries(row).forEach(([key, value]) => {
    const normalizedKey = aliases[key.toLowerCase()] || key;
    item[normalizedKey] = value;
  });

  item.id = String(item.id || item.slug || slugify(item.title) || `${collectionName}-${rowIndex + 1}`);
  if (item.slug) item.slug = slugify(item.slug);
  if (item.order !== '' && item.order != null) item.order = Number(item.order) || 0;
  if (item.year !== '' && item.year != null) item.year = Number(item.year) || item.year;
  if (item.monthIndex !== '' && item.monthIndex != null) item.monthIndex = Number(item.monthIndex) || 0;
  if ('published' in item) item.published = parseBoolean(item.published, true);
  ['imageUrls', 'eventImages', 'sections', 'premisesImages', 'kgImages', 'mandatoryDisclosureSections', 'galleryImages', 'outdoorGymImageUrls', 'points'].forEach((key) => {
    if (item[key]) item[key] = splitList(item[key]);
  });
  mergeChunkedListFields(item, 'imageUrls');
  mergeChunkedListFields(item, 'eventImages');
  normalizeImageFields(item);
  return item;
}

function hasMeaningfulSheetValue(row) {
  return Object.entries(row).some(([key, value]) => {
    if (key === 'id') return false;
    if (Array.isArray(value)) return value.length > 0;
    return String(value ?? '').trim() !== '';
  });
}

function hasDisplayableContent(item) {
  const contentKeys = [
    'title',
    'description',
    'date',
    'documentUrl',
    'fileUrl',
    'pdfUrl',
    'imageUrl',
    'coverImageUrl',
    'thumbnailUrl',
    'studentName',
    'eventImages',
    'imageUrls',
    'galleryImages'
  ];

  return contentKeys.some((key) => {
    const value = item?.[key];
    if (Array.isArray(value)) return value.some((entry) => String(entry || '').trim() !== '');
    return String(value ?? '').trim() !== '';
  });
}

function sortRows(rows, orderByField, orderDir) {
  if (!orderByField) return rows;
  const direction = orderDir === 'asc' ? 1 : -1;

  return [...rows].sort((a, b) => {
    const aValue = a[orderByField];
    const bValue = b[orderByField];
    const aTime = getTimeValue(aValue);
    const bTime = getTimeValue(bValue);

    if (aTime != null || bTime != null) {
      if (aTime == null) return 1;
      if (bTime == null) return -1;
      return (aTime - bTime) * direction;
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') return (aValue - bValue) * direction;
    return String(aValue || '').localeCompare(String(bValue || '')) * direction;
  });
}

function getTimeValue(value) {
  if (value?.toMillis) return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function mergeRows(firestoreRows, sheetRows) {
  const merged = new Map();

  firestoreRows.filter(hasDisplayableContent).forEach((item) => {
    merged.set(item.id, { ...normalizeContentItem(item), _contentSource: 'firestore' });
  });

  sheetRows.filter(hasDisplayableContent).forEach((item) => {
    const existing = merged.get(item.id) || {};
    merged.set(item.id, { ...existing, ...normalizeContentItem(item), _contentSource: existing.id ? 'merged' : 'sheets' });
  });

  return Array.from(merged.values());
}

async function fetchSheetTab(spreadsheetId, tabName) {
  const params = new URLSearchParams({ tqx: 'out:json' });
  if (tabName) params.set('sheet', tabName);
  // Keep one URL stable for the five-minute cache window. A unique URL on every
  // request prevented the browser/CDN from reusing an otherwise identical sheet.
  params.set('v', String(sheetCacheVersion));
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Google Sheets request failed (${response.status})`);

  const text = await response.text();
  const jsonText = text.match(/setResponse\(([\s\S]*)\);?$/)?.[1];
  if (!jsonText) throw new Error('Google Sheets response was not readable.');

  const payload = JSON.parse(jsonText);
  if (payload.status === 'error') {
    throw new Error(payload.errors?.[0]?.detailed_message || payload.errors?.[0]?.message || 'Google Sheets returned an error.');
  }

  const headers = (payload.table?.cols || []).map((col, index) => normalizeHeader(col.label || col.id || `column${index + 1}`));
  return (payload.table?.rows || [])
    .map((row, rowIndex) => {
      const values = {};
      (row.c || []).forEach((cell, index) => {
        if (headers[index]) values[headers[index]] = readCell(cell);
      });
      return hasMeaningfulSheetValue(values) ? coerceRow(values, tabName || 'sheet', rowIndex) : null;
    })
    .filter(Boolean);
}

export async function fetchSheetCollection(collectionName) {
  const config = GOOGLE_SHEETS_DATABASE;
  const tabs = config.collectionTabs[collectionName] || [collectionName];
  let lastError = null;

  for (const tab of tabs) {
    const cacheKey = `${config.spreadsheetId}:${tab || '__first__'}`;
    try {
      const cached = SHEET_CACHE.get(cacheKey);
      if (!cached || cached.expiresAt <= Date.now()) {
        SHEET_CACHE.set(cacheKey, {
          promise: fetchSheetTab(config.spreadsheetId, tab),
          expiresAt: Date.now() + SHEET_CACHE_TTL_MS
        });
      }
      const rows = await SHEET_CACHE.get(cacheKey).promise;
      if (rows.length) return rows.map((item, index) => ({ ...item, id: item.id || `${collectionName}-${index + 1}` }));
    } catch (error) {
      SHEET_CACHE.delete(cacheKey);
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  return [];
}

export function useContentCollection(collectionName, orderByField = 'createdAt', orderDir = 'desc', options = {}) {
  const [state, setState] = useState({ data: [], loading: true, error: null, source: null });
  const maxItems = options.limit || null;
  const refreshKey = options.refreshKey || 0;
  const hasSheetTabs = Object.prototype.hasOwnProperty.call(GOOGLE_SHEETS_DATABASE.collectionTabs, collectionName);
  const useSheets = GOOGLE_SHEETS_DATABASE.enabled && hasSheetTabs && !options.firestoreOnly;
  const sheetsOnly = !!options.sheetsOnly;

  useEffect(() => {
    let cancelled = false;
    let unsubscribe;
    let firestoreRows = [];
    let sheetRows = [];
    let firestoreLoaded = sheetsOnly;
    let sheetLoaded = !useSheets;

    const publish = () => {
      if (cancelled) return;
      const sheetContentRows = sheetRows.filter(hasDisplayableContent);
      const sorted = sortRows(sheetsOnly ? sheetContentRows : mergeRows(firestoreRows, sheetContentRows), orderByField, orderDir);
      setState({
        data: maxItems ? sorted.slice(0, maxItems) : sorted,
        loading: !(firestoreLoaded || sheetLoaded),
        error: null,
        source: sheetsOnly ? 'sheets' : (useSheets ? 'merged' : 'firestore')
      });
    };

    const subscribeFirestore = () => {
      const collectionRef = collection(db, collectionName);
      const constraints = [];
      if (orderByField) constraints.push(orderBy(orderByField, orderDir));
      if (maxItems) constraints.push(limit(maxItems));
      const q = constraints.length ? query(collectionRef, ...constraints) : query(collectionRef);

      unsubscribe = onSnapshot(q, (snapshot) => {
        if (cancelled) return;
        firestoreRows = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        firestoreLoaded = true;
        publish();
      }, (error) => {
        firestoreLoaded = true;
        if (!cancelled) setState({ data: sortRows(sheetRows, orderByField, orderDir), loading: false, error, source: useSheets ? 'sheets' : 'firestore' });
      });
    };

    if (useSheets) {
      fetchSheetCollection(collectionName)
        .then((rows) => {
          if (cancelled) return;
          sheetRows = rows;
          sheetLoaded = true;
          publish();
        })
        .catch((error) => {
          console.warn(`Google Sheets unavailable for ${collectionName}; using Firestore only.`, error);
          sheetLoaded = true;
          if (sheetsOnly && !cancelled) {
            setState({ data: [], loading: false, error, source: 'sheets' });
            return;
          }
          publish();
        });
    }

    if (!sheetsOnly) {
      subscribeFirestore();
    }

    return () => {
      cancelled = true;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [collectionName, orderByField, orderDir, maxItems, useSheets, sheetsOnly, refreshKey]);

  return state;
}

export function useContentDocument(collectionName, id) {
  const { data, loading: collectionLoading, error: collectionError, source } = useContentCollection(collectionName, null);
  const [firestoreState, setFirestoreState] = useState({ data: null, loading: false, error: null });
  const sheetItem = useMemo(() => data.find(item => item.id === id || item.slug === id), [data, id]);

  useEffect(() => {
    let cancelled = false;
    if (!id || sheetItem || source === 'sheets') return undefined;

    setFirestoreState({ data: null, loading: true, error: null });
    getDoc(doc(db, collectionName, id))
      .then((docSnap) => {
        if (cancelled) return;
        setFirestoreState({
          data: docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null,
          loading: false,
          error: null
        });
      })
      .catch((error) => {
        if (!cancelled) setFirestoreState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [collectionName, id, sheetItem, source]);

  return {
    data: sheetItem || firestoreState.data,
    loading: !sheetItem && !firestoreState.data && (collectionLoading || firestoreState.loading),
    error: collectionError || firestoreState.error,
    source: sheetItem ? 'sheets' : source
  };
}
