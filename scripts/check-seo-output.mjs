import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const urls = ['/', '/about', '/academics', '/admission', '/contact', '/gallery', '/news', '/events', '/learning/smart-classrooms'];
for (const route of urls) {
  const file = route === '/' ? 'dist/index.html' : path.join('dist', 'seo', `${route.slice(1)}.html`);
  try {
    const html = await readFile(file, 'utf8');
    for (const marker of ['<title>', 'name="description"', 'rel="canonical"', '<h1>', 'application/ld+json']) {
      if (!html.includes(marker)) throw new Error(`missing ${marker}`);
    }
    if (!html.includes(`https://ansarschool.in${route}`)) throw new Error('incorrect canonical');
  } catch (error) {
    console.error(`${route}: ${error.message}`);
    process.exitCode = 1;
  }
}
await stat('dist/sitemap.xml');
await stat('dist/robots.txt');
if (!process.exitCode) console.log(`SEO output audit passed for ${urls.length} representative public routes.`);
