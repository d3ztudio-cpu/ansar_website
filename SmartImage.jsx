import React, { useEffect, useState } from 'react';

/**
 * Image that falls back to bundled local copies when the primary (remote)
 * source fails to load. Some networks/blocklists cannot reach third-party
 * image hosts, which previously left the school logo and hero graphic blank.
 */
export default function SmartImage({ src, fallbacks = [], alt = '', className = '', style, ...rest }) {
  const sources = [src, ...fallbacks].filter(Boolean);
  const [index, setIndex] = useState(0);

  // Reset the chain whenever the primary source changes (e.g. settings load).
  useEffect(() => {
    setIndex(0);
  }, [src]);

  if (!sources.length) return null;

  return (
    <img
      src={sources[Math.min(index, sources.length - 1)]}
      alt={alt}
      className={className}
      style={style}
      onError={() => setIndex(current => (current < sources.length - 1 ? current + 1 : current))}
      {...rest}
    />
  );
}
