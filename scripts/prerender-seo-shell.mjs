/*
 * Firebase Hosting serves this React SPA for its public routes.  Search engines
 * should not have to wait for Firestore, route chunks, and hydration merely to
 * discover the page subject.  This build step emits small, route-specific HTML
 * documents alongside the SPA. Firebase serves static files before rewrites;
 * React then takes over normally for visitors.
 *
 * Every shell inherits the optimized <head> from the built index.html (geo tags,
 * Dublin Core, og:geo, WebSite JSON-LD, preloads) so crawlers see the same
 * metadata story on every route; title/description/canonical/OG/JSON-LD are then
 * overridden per route. Only the <head> is inherited — the shell body carries
 * its own crawlable navigation content and the SPA entry script, so the output
 * is always a single, valid HTML document.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://ansarschool.in';
const dist = path.resolve('dist');
const today = new Date().toISOString().slice(0, 10);
const schoolSchema = {
  '@context': 'https://schema.org',
  '@type': ['School', 'EducationalOrganization'],
  '@id': `${siteUrl}/#school`,
  name: 'Ansar English School',
  alternateName: 'Ansar English School Perumpilavu',
  url: `${siteUrl}/`,
  logo: `${siteUrl}/brand-logo-512.png`,
  image: [`${siteUrl}/brand-logo-512.png`, `${siteUrl}/og-image.jpg`],
  telephone: '+918129808051',
  email: 'hr@ansar.in',
  foundingDate: '1982',
  numberOfStudents: '5000',
  slogan: 'Empowering Minds, Enriching Futures',
  address: {
    '@type': 'PostalAddress', streetAddress: 'Perumpilavu, Karikkad P.O',
    addressLocality: 'Perumpilavu', addressRegion: 'Kerala', postalCode: '680519', addressCountry: 'IN'
  },
  geo: { '@type': 'GeoCoordinates', latitude: 10.69946, longitude: 76.08981 },
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Ansar+English+School+Perumpilavu',
  areaServed: ['Thrissur', 'Perumpilavu', 'Kunnamkulam', 'Wadakkanchery', 'Pattambi', 'Kerala'],
  contactPoint: [
    {
      '@type': 'ContactPoint', contactType: 'admissions', telephone: '+91-81298-08051',
      email: 'hr@ansar.in', areaServed: 'IN', availableLanguage: ['English', 'Malayalam']
    }
  ],
  sameAs: [
    'https://www.facebook.com/ansarenglishschool.perumbillavu/',
    'https://www.youtube.com/c/ansarenglishschoolperumpilavu'
  ]
};

const pages = {
  '/': ['Best CBSE School in Thrissur, Kerala | Ansar English School', 'Ansar English School, Perumpilavu is a leading CBSE Senior Secondary School in Thrissur, Kerala with NABET accreditation, 42+ years of excellence, 5000+ students, smart classrooms, ATL labs, safe transport, and value-based education.', 'Ansar English School – CBSE School in Thrissur', 'A NABET-accredited CBSE Senior Secondary School in Perumpilavu, Thrissur, nurturing curious learners, ethical leaders, and responsible global citizens.'],
  '/about': ['About Ansar English School | Perumpilavu, Thrissur', 'Learn about Ansar English School, a CBSE Senior Secondary School in Perumpilavu, Thrissur, Kerala.', 'About Ansar English School', 'Learn about the school, its educational approach, leadership, and community.'],
  '/academics': ['CBSE Academics | Ansar English School, Thrissur', 'Explore the CBSE academic programme and learning approach at Ansar English School in Perumpilavu, Thrissur.', 'CBSE Academics', 'Explore the curriculum, learning resources, and academic opportunities at Ansar English School.'],
  '/admission': ['Admissions | Ansar English School, Perumpilavu', 'Find admission information for Ansar English School, a CBSE Senior Secondary School in Perumpilavu, Thrissur, Kerala.', 'Admissions', 'Find admission guidance and contact the school for current application information.'],
  '/contact': ['Contact Ansar English School | Perumpilavu, Thrissur', 'Contact Ansar English School in Perumpilavu, Karikkad P.O, Thrissur, Kerala for official school and admission enquiries.', 'Contact Ansar English School', 'Find official contact and campus-location information for Ansar English School.'],
  '/gallery': ['Campus Gallery | Ansar English School', 'View campus moments and school activities at Ansar English School in Perumpilavu, Thrissur.', 'Campus Gallery', 'Explore photographs from campus life and school activities.'],
  '/news': ['School News | Ansar English School', 'Read news and announcements from Ansar English School in Perumpilavu, Thrissur.', 'School News', 'Read the latest school news and announcements.'],
  '/events': ['School Events | Ansar English School', 'Explore events and activities at Ansar English School in Perumpilavu, Thrissur.', 'School Events', 'Explore school events, celebrations, and activities.'],
  '/achievements': ['Achievements | Ansar English School', 'Explore student and school achievements at Ansar English School in Perumpilavu, Thrissur.', 'Achievements', 'Discover academic, cultural, and sporting achievements from the school community.'],
  '/sports-page': ['Sports and Athletics | Ansar English School', 'Explore sports and athletics at Ansar English School in Perumpilavu, Thrissur.', 'Sports and Athletics', 'Learn about sports, fitness, games, and team activities at the school.'],
  '/atl': ['Atal Tinkering Lab | Ansar English School', 'Explore hands-on STEM learning and innovation at the Atal Tinkering Lab at Ansar English School.', 'Atal Tinkering Lab', 'Learn about student innovation, practical STEM learning, and project work.'],
  '/library': ['Library | Ansar English School', 'Explore library resources, reading activities, and learning opportunities at Ansar English School.', 'School Library', 'Discover library resources, reading activities, and school publications.'],
  '/ansar-sprouts': ['Ansar Sprouts | Ansar English School', 'Discover the early-learning programme at Ansar Sprouts in Perumpilavu, Thrissur.', 'Ansar Sprouts', 'Explore the school’s early-learning programme.'],
  '/field-trips': ['Field Trips | Ansar English School', 'Explore educational visits and field trips at Ansar English School.', 'Field Trips', 'Discover learning beyond the classroom through educational visits.'],
  '/life-at-ansar': ['Life at Ansar | Ansar English School', 'Explore student life, clubs, celebrations, arts, and campus activities at Ansar English School.', 'Life at Ansar', 'Discover student life and campus activities at Ansar English School.'],
  '/ansar-times': ['Ansar Times | Ansar English School', 'Read school magazines, newsletters, and student contributions from Ansar English School.', 'Ansar Times', 'Read school publications and student stories.'],
  '/ansar-family': ['Our Faculty | Ansar Family | Ansar English School', 'Meet the leadership, counsellors, teaching faculty, and physical education staff of Ansar English School for the current academic year.', 'Our Faculty – Ansar Family', 'Meet the leadership and faculty who support learning at Ansar English School.'],
  '/alumni': ['Ansar Alumni | Ansar English School', 'Connect with the Ansar English School alumni community and explore alumni stories, achievements, mentorship, and events.', 'Ansar Alumni', 'Explore alumni stories, achievements, and community connections.'],
  '/extension-services': ['Extension Services | Ansar English School', 'Learn about community outreach, service learning, awareness programmes, and student volunteering at Ansar English School.', 'Extension Services', 'Learn about community outreach and service activities.'],
  '/ansar-media-production': ['Ansar Media Productions | Ansar English School', 'Explore photography, videography, drone visuals, podcasting, design, and editing by the in-house media unit at Ansar English School.', 'Ansar Media Productions', 'Explore photography, videography, design, and student media work.'],
  '/sop': ['Standard Operating Procedures | Ansar English School', 'View approved academic, administrative, safety, and student-support standard operating procedures at Ansar English School.', 'Standard Operating Procedures', 'View school operational procedure documents.'],
  '/school-policies': ['AES School Policies | Ansar English School', 'View safeguarding, academic, staff, student-life, and governance policies followed at Ansar English School.', 'School Policies', 'View policy documents for the school community.'],
  '/mandatory-public-disclosure': ['Mandatory Public Disclosure | Ansar English School', 'View CBSE mandatory public disclosure documents and official school information for Ansar English School, Perumpilavu, Thrissur.', 'Mandatory Public Disclosure', 'View official public disclosure information and documents.']
};
Object.assign(pages, {
  '/learning/cctv-enabled-safety': ['A Safe & Secure Campus | Ansar English School', 'Learn about campus safety at Ansar English School in Perumpilavu, Thrissur.', 'A Safe & Secure Campus', 'Explore safety measures and student support at the school.'],
  '/learning/smart-classrooms': ['Future-Ready Learning Spaces | Ansar English School', 'Explore smart classroom learning at Ansar English School in Perumpilavu, Thrissur.', 'Future-Ready Learning Spaces', 'Learn about technology-supported classroom learning.'],
  '/learning/qualified-support-staff': ['Dedicated Support Team | Ansar English School', 'Learn about student support at Ansar English School in Perumpilavu, Thrissur.', 'Dedicated Support Team', 'Explore the support available to students during the school day.'],
  '/learning/special-play-area': ['Joyful Play Zone | Ansar English School', 'Explore play and activity spaces at Ansar English School in Perumpilavu, Thrissur.', 'Joyful Play Zone', 'Discover spaces for play, movement, and student activity.'],
  '/learning/advanced-labs': ['Experiential Learning Labs | Ansar English School', 'Explore practical learning labs at Ansar English School in Perumpilavu, Thrissur.', 'Experiential Learning Labs', 'Learn about hands-on laboratory learning opportunities.'],
  '/learning/multi-sports-play-area': ["Champions' Arena | Ansar English School", 'Explore sports facilities at Ansar English School in Perumpilavu, Thrissur.', "Champions' Arena", 'Discover spaces for games, fitness, and physical activity.'],
  '/learning/safe-school-transport': ['Safe School Transport | Ansar English School', 'Learn about school transport at Ansar English School in Perumpilavu, Thrissur.', 'Safe School Transport', 'Find information about school transport and student travel.'],
  '/learning/healthy-dining-spaces': ['Healthy Dining Spaces | Ansar English School', 'Explore student dining spaces at Ansar English School in Perumpilavu, Thrissur.', 'Healthy Dining Spaces', 'Learn about campus dining spaces for students.']
});

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: 'Ansar English School',
  inLanguage: 'en-IN',
  publisher: { '@id': `${siteUrl}/#school` }
};

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Navigation + section links used inside every shell body for crawlable internal linking.
const navLinks = [['Home', '/'], ['About', '/about'], ['Academics', '/academics'], ['Admission', '/admission'], ['Ansar Sprouts', '/ansar-sprouts'], ['News', '/news'], ['Events', '/events'], ['Contact', '/contact']];
const sectionLinks = [
  ['Gallery', '/gallery'], ['Achievements', '/achievements'], ['Sports', '/sports-page'], ['Atal Tinkering Lab', '/atl'],
  ['Library', '/library'], ['Ansar Times', '/ansar-times'], ['Ansar Family', '/ansar-family'], ['Alumni', '/alumni'],
  ['Life at Ansar', '/life-at-ansar'], ['Field Trips', '/field-trips'], ['Extension Services', '/extension-services'],
  ['School Policies', '/school-policies'], ['Mandatory Public Disclosure', '/mandatory-public-disclosure']
];
const facilityLinks = [
  ['Safe & Secure Campus', '/learning/cctv-enabled-safety'], ['Smart Classrooms', '/learning/smart-classrooms'],
  ['Dedicated Support Team', '/learning/qualified-support-staff'], ['Joyful Play Zone', '/learning/special-play-area'],
  ['Experiential Learning Labs', '/learning/advanced-labs'], ["Champions' Arena", '/learning/multi-sports-play-area'],
  ['Safe School Transport', '/learning/safe-school-transport'], ['Healthy Dining Spaces', '/learning/healthy-dining-spaces']
];
const renderLinks = (pairs) => pairs.map(([label, href]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('');

const builtIndex = await readFile(path.join(dist, 'index.html'), 'utf8');
const entry = builtIndex.match(/<script type="module"(?: crossorigin)? src="([^"]+)"><\/script>/)?.[1];
const stylesheet = builtIndex.match(/<link rel="stylesheet"(?: crossorigin)? href="([^"]+)">/)?.[1];
if (!entry) throw new Error('Could not find Vite entry script in dist/index.html.');

// Inherit ONLY the built <head>. The previous approach inlined the whole SPA
// document inside the shell head, which produced malformed HTML (nested
// <!doctype>, duplicated #root, and per-route metadata appearing after
// </html>) — the source of the unstyled flash seen on refresh.
const headStart = builtIndex.indexOf('<head>');
const headEnd = builtIndex.indexOf('</head>');
if (headStart === -1 || headEnd === -1) throw new Error('Could not locate <head> in dist/index.html.');
const inheritedHead = builtIndex.slice(headStart + '<head>'.length, headEnd);

// Strip head elements the per-route head below re-declares, plus every module
// script (the shell body re-adds the entry exactly once; leaving Vite's module
// script in the inherited head executed the whole app twice).
const cleanedHead = inheritedHead
  .replace(/<script type="module"[^>]*><\/script>/g, '')
  .replace(/<title>[\s\S]*?<\/title>/, '')
  .replace(/<meta name="description"[^>]*>/, '')
  .replace(/<meta name="keywords"[^>]*>/, '')
  .replace(/<link rel="canonical"[^>]*>/, '')
  .replace(/<link rel="stylesheet"[^>]*>/g, '')
  .replace(/<meta property="og:(?:type|site_name|title|description|url|image)"[^>]*>/g, '')
  .replace(/<meta name="twitter:(?:title|description|image)"[^>]*>/g, '')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

function buildHead(route, title, description) {
  const canonical = `${siteUrl}${route}`;
  const pageSchema = { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description, isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': `${siteUrl}/#school` } };
  const cssLink = stylesheet ? `<link rel="stylesheet" href="${stylesheet}">` : '';
  return {
    canonical,
    head: `${cleanedHead}<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><link rel="canonical" href="${canonical}">${cssLink}<meta property="og:type" content="website"><meta property="og:site_name" content="Ansar English School"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${siteUrl}/og-image.jpg"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Ansar English School, Perumpilavu — NABET Accredited CBSE School in Thrissur, Kerala"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${siteUrl}/og-image.jpg"><meta name="twitter:image:alt" content="Ansar English School, Perumpilavu — CBSE School in Thrissur"><script type="application/ld+json">${JSON.stringify([schoolSchema, websiteSchema, pageSchema])}</script>`
  };
}

// Boot splash style + failsafe: identical to index.html's slim top progress bar so
// route shells never flash a full-screen green overlay on hard refresh. The static
// content stays in the DOM for crawlers but is visually hidden once scripting is on.
const bootSplashCss = `<style>html{background:#f8fafc;color:#0f172a}body{margin:0;min-width:320px;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#root{min-height:100vh}#boot-splash{position:fixed;top:0;left:0;right:0;height:3px;z-index:9998;background:linear-gradient(90deg,#059669 0%,#34d399 40%,#fbbf24 100%);background-size:50% 100%;transform-origin:left;animation:boot-slide 1.1s ease-in-out infinite;opacity:1;transition:opacity 250ms ease-out}#boot-splash.is-hidden{opacity:0;pointer-events:none}@keyframes boot-slide{0%{background-position:-50% 0}100%{background-position:150% 0}}@media (prefers-reduced-motion:reduce){#boot-splash{animation:none;opacity:.6}#boot-splash.is-hidden{transition:none}}.seo-static{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}</style><script>window.setTimeout(function(){var s=document.getElementById('boot-splash');if(s&&!s.classList.contains('is-hidden')){s.classList.add('is-hidden');window.setTimeout(function(){s.remove()},400)}},8000);</script>`;

for (const [route, [title, description, h1, body]] of Object.entries(pages)) {
  const { head } = buildHead(route, title, description);
  const isHome = route === '/';
  const html = `<!doctype html><html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${head}${bootSplashCss}</head><body><div id="root"><div id="boot-splash" aria-hidden="true"></div><main class="seo-static"><header><nav aria-label="Main navigation"><ul>${renderLinks(navLinks)}</ul></nav></header><article><h1>${esc(h1)}</h1><p>${esc(body)}</p>${isHome ? `<h2>CBSE facilities that support every school day</h2><ul>${renderLinks(facilityLinks)}</ul><h2>Explore school life</h2><ul>${renderLinks(sectionLinks)}</ul>` : ''}</article><nav aria-label="More pages"><ul>${renderLinks(isHome ? [...navLinks.slice(1), ...sectionLinks] : sectionLinks)}</ul></nav></main></div><script type="module" src="${entry}"></script></body></html>`;
  const output = isHome ? path.join(dist, 'index.html') : path.join(dist, 'seo', `${route.slice(1)}.html`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
}

// Regenerate sitemap.xml on every build so lastmod always reflects the deploy.
const sitemapEntries = Object.keys(pages).map((route) => {
  const priority = route === '/' ? '1.0' : route === '/admission' ? '0.95' : route.startsWith('/learning/') ? '0.7' : '0.8';
  const changefreq = route === '/' ? 'weekly' : route === '/news' ? 'daily' : route === '/admission' ? 'weekly' : 'monthly';
  return `  <url>\n    <loc>${siteUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n    <image:image>\n      <image:loc>${siteUrl}/og-image.jpg</image:loc>\n      <image:title>Ansar English School</image:title>\n    </image:image>\n  </url>`;
});
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${sitemapEntries.join('\n')}\n</urlset>\n`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);

console.log(`Prerendered ${Object.keys(pages).length} SEO shells and regenerated dist/sitemap.xml (lastmod ${today}).`);
