import React, { useRef, useState } from 'react';
import { extractImageUrls } from './imageUrlUtils';
import { uploadImageToHostinger } from './hostingerUpload';

const UploadIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8-4-4m0 0L8 8m4-4v8" />
  </svg>
);

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
  </svg>
);

export default function ImgBbUrlImporter({ multiple = false, onExtracted, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [uploadState, setUploadState] = useState({ busy: false, done: 0, total: 0 });
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

  const handleFileSelection = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;

    setUploadState({ busy: true, done: 0, total: files.length });
    try {
      const uploadedUrls = [];
      for (let index = 0; index < files.length; index += 1) {
        uploadedUrls.push(await uploadImageToHostinger(files[index]));
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

  const uploadButton = (compact = false) => (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      disabled={uploadState.busy}
      className={`inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-60 ${compact ? '' : ''}`}
    >
      {uploadState.busy ? (
        <>
          <Spinner />
          Uploading{uploadState.total > 1 ? ` ${uploadState.done}/${uploadState.total}` : ''}...
        </>
      ) : (
        <>
          <UploadIcon />
          Upload from device{multiple ? 's' : ''}
        </>
      )}
    </button>
  );

  const hiddenFileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      {...(multiple ? { multiple: true } : {})}
      onChange={handleFileSelection}
      className="hidden"
    />
  );

  if (!isOpen) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
        >
          {label || (multiple ? 'Paste Image URLs' : 'Paste Image URL')}
        </button>
        {uploadButton(true)}
        {hiddenFileInput}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
      <textarea
        value={rawText}
        onChange={(event) => setRawText(event.target.value)}
        placeholder="Paste image-host HTML code, markdown, or direct image URLs here"
        className="h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={applyExtractedUrls}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          Use URL{multiple ? 's' : ''}
        </button>
        {uploadButton(true)}
        {hiddenFileInput}
        <button
          type="button"
          onClick={() => {
            setRawText('');
            setIsOpen(false);
          }}
          className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
