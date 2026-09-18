/*
 * Generates the complete favicon / touch-icon set from the school logo
 * (public/ansar-logo.png) so every browser, OS, and tab shows the logo —
 * including legacy browsers that only read favicon.ico.
 *
 * Outputs (all written to public/, Vite copies them to dist/ as-is):
 *   favicon.ico              multi-size 16/32/48 — universal fallback
 *   favicon-16x16.png        16×16
 *   favicon-32x32.png        32×32
 *   favicon-48.png           48×48 (already referenced by index.html)
 *   apple-touch-icon-180.png 180×180 (iOS home screen)
 *   android-chrome-192x192.png / android-chrome-512x512.png (Android/manifest)
 *   icon-192.png / icon-512.png (maskable PWA variants)
 *   mstile-150x150.png       (Windows tile)
 *   site.webmanifest         (canonical icon declarations)
 *
 * Run manually with: node scripts/generate-favicons.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import ico from 'png-to-ico';

const source = path.resolve('public/ansar-logo.png');
const outDir = path.resolve('public');

// Square PNG builder; nearest-neighbour-free lanczos keeps small sizes crisp.
async function png(size, fileName, { fit = 'cover' } = {}) {
  const pipeline = sharp(source).resize(size, size, { fit, background: { r: 255, g: 255, b: 255, alpha: 0 } });
  const out = path.join(outDir, fileName);
  await pipeline.png({ compressionLevel: 9 }).toFile(out);
  console.log(`✓ ${fileName} (${size}×${size})`);
  return out;
}

await mkdir(outDir, { recursive: true });

// Core favicons.
const icoSources = [
  await png(16, 'favicon-16x16.png'),
  await png(32, 'favicon-32x32.png'),
  await png(48, 'favicon-48.png')
];

// Universal multi-resolution .ico — the fallback every browser understands.
const icoBuffer = await ico(icoSources);
await writeFile(path.join(outDir, 'favicon.ico'), icoBuffer);
console.log(`✓ favicon.ico (${(icoBuffer.length / 1024).toFixed(1)} KB, 16/32/48)`);

// Touch / platform icons.
await png(180, 'apple-touch-icon-180.png');
await png(192, 'android-chrome-192x192.png');
await png(512, 'android-chrome-512x512.png');
await png(192, 'icon-192.png');
await png(512, 'icon-512.png');
await png(150, 'mstile-150x150.png');

// Canonical webmanifest for the icon set.
const webmanifest = {
  name: 'Ansar English School Perumpilavu',
  short_name: 'Ansar School',
  icons: [
    { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
  ],
  theme_color: '#047857',
  background_color: '#f8fbff',
  display: 'standalone'
};
await writeFile(path.join(outDir, 'site.webmanifest'), JSON.stringify(webmanifest, null, 2));
console.log('✓ site.webmanifest');

console.log('Favicon set generated from public/ansar-logo.png.');
