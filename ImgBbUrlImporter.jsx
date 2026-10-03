import React, { useRef, useState } from 'react';
import { extractImageUrls, normalizeImageUrl } from './imageUrlUtils';
import { uploadImageToHostinger } from './hostingerUpload';

const Spinner = () => (
  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2 1.6-1.6a2 2 0 012.8 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12z" />
  </svg>
);

export default function ImgBbUrlImporter({ multiple = false, onExtracted, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [uploadState, setUploadState] = useState({ busy: false, done: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const applyExtractedUrls = () => {
    const urls = extractImageUrls(rawText);
    if (!urls.length) {
      alert('No image URL found. Paste image-host HTML code, markdown, or a direct hosted image URL.');
      return;
    }
    onExtracted(multiple ? urls : urls[0]);
    setRawText('');
    setIsOpen(false);
  };

  const uploadFiles = async (selectedFiles) => {
    const files = Array.from(selectedFiles || []).filter(file => file.type.startsWith('image/'));
    if (!files.length) {
      alert('Please select image files only.');
      return;
    }
    if (!multiple && files.length > 1) {
      alert('This field stores a single image — only the first selected photo will be used. Use a carousel/gallery field to attach multiple images.');
    }

    const filesToUpload = multiple ? files : files.slice(0, 1);
    setUploadState({ busy: true, done: 0, total: filesToUpload.length });
    try {
      const uploadedUrls = [];
      for (let index = 0; index < filesToUpload.length; index += 1) {
        uploadedUrls.push(normalizeImageUrl(await uploadImageToHostinger(filesToUpload[index])));
        setUploadState(prev => ({ ...prev, done: index + 1 }));
      }
      onExtracted(multiple ? uploadedUrls : uploadedUrls[0]);
      setRawText('');
      setIsOpen(false);
    } catch (error) {
      alert(error.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadState({ busy: false, done: 0, total: 0 });
    }
  };

  const handleFileSelection = (event) => {
    const files = event.target.files;
    event.target.value = '';
    uploadFiles(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (!uploadState.busy) uploadFiles(event.dataTransfer.files);
  };

  const hiddenFileInput = <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelection} className="hidden" />;

  const dropZone = (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={(event) => { event.preventDefault(); if (!uploadState.busy) setIsDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
      onDrop={handleDrop}
      disabled={uploadState.busy}
      className={`group flex min-h-28 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-4 text-center transition ${isDragging ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50/60'} disabled:cursor-wait disabled:opacity-70`}
    >
      {uploadState.busy ? <Spinner /> : <span className="rounded-full bg-white p-2 text-emerald-600 shadow-sm group-hover:bg-emerald-100"><ImageIcon /></span>}
      <span className="mt-2 text-sm font-bold">{uploadState.busy ? `Uploading ${uploadState.done}/${uploadState.total}…` : 'Drop image files here or click to browse'}</span>
      <span className="mt-1 text-xs text-slate-500">{multiple ? 'Select or drop multiple images — they keep this order.' : 'Select or drop one image.'}</span>
    </button>
  );

  if (!isOpen) {
    return (
      <div className="w-full max-w-xl space-y-2">
        {dropZone}
        {hiddenFileInput}
        <button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-50">
          {label || (multiple ? 'Or paste image URLs' : 'Or paste an image URL')}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
      <textarea value={rawText} onChange={(event) => setRawText(event.target.value)} placeholder="Paste image-host HTML code, markdown, or direct image URLs here" className="h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
      <div className="mt-3 space-y-3">
        {dropZone}
        {hiddenFileInput}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={applyExtractedUrls} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700">Use URL{multiple ? 's' : ''}</button>
          <button type="button" onClick={() => { setRawText(''); setIsOpen(false); }} className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>
        </div>
      </div>
    </div>
  );
}
