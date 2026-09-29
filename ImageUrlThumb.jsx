import React, { useEffect, useState } from 'react';
import { repairLegacyUploadHost } from './imageUrlUtils';

// Small square preview rendered inline next to an image URL input in the admin
// panel, so the admin can see which image occupies which position (first = cover)
// and swap them by priority.
const SIZES = {
  sm: 'h-16 w-16',
  md: 'h-20 w-20'
};

export default function ImageUrlThumb({ url, alt, size = 'md' }) {
  const [failed, setFailed] = useState(false);

  // Old records may hold URLs from Hostinger's internal server name
  // (srv*-files.hstgr.io) which is 403-blocked publicly; rewrite them to the
  // canonical upload subdomain so previews render.
  const displayUrl = repairLegacyUploadHost(url);

  useEffect(() => {
    setFailed(false);
  }, [displayUrl]);

  const dims = SIZES[size] || SIZES.md;

  if (!displayUrl) {
    return (
      <div
        className={`${dims} flex flex-none items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-[10px] font-bold uppercase text-slate-300`}
        title="No image yet"
      >
        —
      </div>
    );
  }

  if (failed) {
    return (
      <div
        className={`${dims} flex flex-none items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-[10px] font-bold uppercase text-slate-400`}
        title="Image failed to load"
      >
        Error
      </div>
    );
  }

  return (
    <div className={`${dims} flex-none overflow-hidden rounded-lg border border-slate-200 bg-slate-100`} title={alt || displayUrl}>
      <img
        src={displayUrl}
        alt={alt || 'Image preview'}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
