import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceExtensions = new Set(['.js', '.jsx', '.html']);
const ignoredDirectories = new Set(['.git', '.firebase', 'dist', 'node_modules', 'public', 'scripts']);
const exactRoutes = new Set([
  '/', '/about', '/academics', '/admission', '/news', '/events', '/contact', '/gallery',
  '/sports-page', '/atl', '/library', '/library/quiz', '/ansar-sprouts', '/extension-services', '/life-at-ansar',
  '/field-trips', '/ansar-family',
  '/ansar-times', '/alumni', '/achievements', '/ansar-media-production', '/sop',
  '/school-policies', '/mandatory-public-disclosure', '/admin', '/admin/dashboard', '/admin/updates', '/admin/news', '/admin/events',
  '/admin/atl',
  '/admin/achievements', '/admin/sports-achievements', '/admin/learning-features',
  '/admin/life-at-ansar', '/admin/learning-labs',
  '/admin/ansar-sprouts',
  '/admin/field-trips',
  '/admin/ansar-times', '/admin/leadership', '/admin/academics', '/admin/public-disclosure',
  '/admin/gallery', '/admin/notices', '/admin/settings', '/admin/library', '/admin/library/quiz', '/admin/alumni'
]);
const parameterizedRoutes = [
  /^\/(?:news|events|achievements|sports-achievements)\/[^/]+$/,
  /^\/alumni\/(?:events|success-stories)\/\d+$/,
  /^\/learning\/[^/]+$/
];
const redirectOnlyRoutes = new Set([
  '/staff', '/leadership', '/event', '/index.html', '/about.html',
  '/academics.html', '/admission.html', '/contact.html', '/gallery-page.html',
  '/events.html', '/news.html', '/admin.html'
]);

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectSourceFiles(absolutePath));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(absolutePath);
  }
  return files;
}

function normalizeTarget(target) {
  const withoutOrigin = target.replace(/^https:\/\/ansarschool\.in/i, '');
  return (withoutOrigin.split(/[?#]/)[0] || '/').replace(/\/$/, '') || '/';
}

async function publicFileExists(target) {
  const relativePath = target.replace(/^\//, '');
  if (!relativePath || !path.extname(relativePath)) return false;
  try {
    return (await stat(path.join(root, 'public', relativePath))).isFile();
  } catch {
    return false;
  }
}

const findings = [];
for (const file of await collectSourceFiles(root)) {
  const source = await readFile(file, 'utf8');
  const attributePattern = /\b(?:to|href)\s*=\s*(?:\{\s*)?["'](\/?[^"']*)["']\s*}?/g;
  for (const match of source.matchAll(attributePattern)) {
    const rawTarget = match[1];
    if (!rawTarget.startsWith('/') && !rawTarget.startsWith('https://ansarschool.in')) continue;
    const target = normalizeTarget(rawTarget);
    const valid = exactRoutes.has(target)
      || parameterizedRoutes.some(pattern => pattern.test(target))
      || await publicFileExists(target);
    if (!valid) {
      findings.push({
        file: path.relative(root, file),
        target: rawTarget,
        reason: redirectOnlyRoutes.has(target) ? 'points to a redirect instead of its canonical destination' : 'has no known route or public file'
      });
    }
  }
}

if (findings.length) {
  console.error('Internal link audit failed:');
  findings.forEach(({ file, target, reason }) => console.error(`- ${file}: ${target} (${reason})`));
  process.exitCode = 1;
} else {
  console.log('Internal link audit passed: all literal internal links point directly to known canonical routes or public files.');
}
