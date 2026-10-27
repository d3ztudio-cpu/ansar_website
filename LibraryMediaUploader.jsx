import React, { useRef, useState } from 'react';
import { uploadLibraryFile, uploadLibraryPdf, deleteLibraryFile, MAX_LIBRARY_IMAGE_BYTES, MAX_LIBRARY_PDF_BYTES } from './libraryStorage';
import { normalizeImageUrl } from './imageUrlUtils';
import { isImageFile } from './hostingerUpload';

let uploadCounter = 0;
const newId = () => `lib-upload-${Date.now()}-${++uploadCounter}`;

/**
 * mode 'image' → image files only, values stored as URLs.
 * mode 'pdf'   → PDF documents, published just after Source.
 * value: array of { url, path, name } · single mode: string URL
 */
export default function LibraryMediaUploader({ mode = 'image', multiple = false, value, onChange, folder, label }) {
  const isImage = mode === 'image';
  const maxBytes = isImage ? MAX_LIBRARY_IMAGE_BYTES : MAX_LIBRARY_PDF_BYTES;
  const sizeLimit = isImage ? '15 MB' : '25 MB';
  const acceptAttr = isImage ? 'image/*' : 'application/pdf';
  const typeLabel = isImage ? 'image files' : 'PDF files';

  const items = Array.isArray(value) ? value : (value ? [{ url: value, path: '', name: '' }] : []);
  const [uploads, setUploads] = useState([]); // in-flight / failed uploads before they join the list
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const updateUpload = (id, patch) => setUploads(list => list.map(item => (item.id === id ? { ...item, ...patch } : item)));

  const removeFromValue = (item) => {
    if (item.path) deleteLibraryFile(item.path);
    onChange(multiple ? items.filter(entry => entry.url !== item.url) : '');
  };

  const startUpload = async (file, existingId) => {
    const id = existingId || newId();
    if (!existingId) {
      setUploads(list => [...list, { id, file, name: file.name, size: file.size, progress: 0, status: 'uploading', error: '' }]);
    }
    try {
      const upload = isImage ? uploadLibraryFile : uploadLibraryPdf;
      const { url, path } = await upload(
        Array.isArray(folder) ? folder : [folder].filter(Boolean),
        file,
        { onProgress: (progress) => updateUpload(id, { progress }) }
      );
      setUploads(list => list.filter(item => item.id !== id));
      if (multiple) {
        const collection = Array.isArray(value) ? value : (value ? [{ url: value, path: '', name: '' }] : []);
        const isDuplicate = collection.some(entry => entry.url === url);
        if (!isDuplicate) onChange([...collection, { url: isImage ? normalizeImageUrl(url) : url, path, name: file.name }]);
      } else {
        onChange(isImage ? normalizeImageUrl(url) : url);
      }
    } catch (error) {
      updateUpload(id, { status: 'error', error: error.message || 'Upload failed. Please retry.' });
    }
  };

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    let pending = files;
    if (!multiple && files.length > 1) pending = files.slice(0, 1);
    for (const file of pending) {
      // iOS and some Android gallery providers often omit or misreport the MIME type.
      // Hostinger's upload.php still validates the real file contents before storage.
      const wrongType = isImage ? !isImageFile(file) : file.type !== 'application/pdf';
      if (wrongType) {
        setUploads(list => [...list, { id: newId(), name: file.name, size: file.size, progress: 0, status: 'error', error: `Only ${typeLabel} are allowed.` }]);
        continue;
      }
      if (file.size > maxBytes) {
        setUploads(list => [...list, { id: newId(), name: file.name, size: file.size, progress: 0, status: 'error', error: `Each file must be ${sizeLimit} or smaller. This one is ${(file.size / (1024 * 1024)).toFixed(1)} MB.` }]);
        continue;
      }
      startUpload(file);
    }
  };

  const handleInput = (event) => {
    // Snapshot before clearing so repeat selections keep their File objects.
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    handleFiles(files);
  };

  const pendingUploads = uploads.filter(item => item.status === 'uploading');
  const pendingErrors = uploads.filter(item => item.status === 'error');
  const busy = pendingUploads.length > 0;

  return (
    <div className="w-full">
      {!multiple && items.length > 0 && !busy ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {isImage
            ? <img src={items[0].url} alt="" className="h-16 w-24 rounded-lg object-cover" />
            : <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">📄 {items[0].name || 'PDF document'}</span>}
          <span className="text-xs text-slate-500">{items[0].name || 'Saved'}</span>
          <button type="button" onClick={() => removeFromValue(items[0])} className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Remove</button>
          <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50">Replace</button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); if (!busy) setIsDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
          onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFiles(event.dataTransfer.files); }}
          disabled={busy}
          aria-busy={busy}
          className={`flex min-h-24 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-4 text-center transition ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-emerald-400'} disabled:opacity-70`}
        >
          <span className="text-2xl" aria-hidden="true">{busy ? '⏳' : isImage ? '🖼️' : '📄'}</span>
          <span className="mt-2 text-sm font-bold text-slate-700">{busy ? `Uploading ${items.length + pendingUploads.length}… ${Math.round(pendingUploads.reduce((sum, i) => sum + i.progress, 0) / Math.max(pendingUploads.length, 1))}%` : label || (multiple ? `Select or drop multiple ${typeLabel}` : `Select or drop ${aOrAn(typeLabel)}`)}</span>
          <span className="mt-1 text-xs text-slate-500">Stored on the school's server (Hostinger) · {sizeLimit} max per file</span>
        </button>
      )}

      <input ref={inputRef} type="file" accept={acceptAttr} multiple={multiple} onChange={handleInput} className="hidden" />

      {multiple && items.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map(item => (
            <li key={item.url} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {isImage
                ? <img src={item.url} alt={item.name || 'Library image'} className="h-24 w-full object-cover" loading="lazy" />
                : <span className="flex h-24 w-full items-center justify-center text-2xl" aria-hidden="true">📄</span>}
              <span className="absolute inset-x-0 bottom-0 truncate bg-slate-900/60 px-2 py-1 text-[11px] font-bold text-white" title={item.name || item.url}>{item.name || 'Saved'}</span>
              <button type="button" onClick={() => removeFromValue(item)} aria-label={`Remove ${item.name || 'item'}`} className="absolute right-1.5 top-1.5 rounded-full bg-white/95 px-2 py-0.5 text-xs font-black text-red-600 shadow hover:bg-white">✕</button>
            </li>
          ))}
        </ul>
      )}

      {pendingUploads.map(item => (
        <div key={item.id} className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <span className="truncate">{item.name}</span><span>{item.progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.max(item.progress, 4)}%` }} /></div>
        </div>
      ))}

      {pendingErrors.map(item => (
        <div key={item.id} className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-bold text-red-700">⚠ {item.name || 'File'} — {item.error}</p>
          {item.file && <button type="button" onClick={() => { setUploads(list => list.filter(entry => entry.id !== item.id)); startUpload(item.file); }} className="mt-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700">Retry upload</button>}
          {!item.file && <button type="button" onClick={() => setUploads(list => list.filter(entry => entry.id !== item.id))} className="mt-2 rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100">Dismiss</button>}
        </div>
      ))}
    </div>
  );
}

function aOrAn(word) {
  return (/^[aeiou]/i.test(word) ? 'an ' : 'one ') + word;
}
