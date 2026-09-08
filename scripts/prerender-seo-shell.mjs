/*
 * Firebase Hosting serves this React SPA for its public routes.  Search engines
 * should not have to wait for Firestore, route chunks, and hydration merely to
 * discover the page subject.  This build step emits small, route-specific HTML
 * documents alongside the SPA. Firebase serves static files before rewrites;
 * React then takes over normally for visitors.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://ansarschool.in';
const dist = path.resolve('dist');
const schoolSchema = {
  '@context': 'https://schema.org',
  '@type': ['School', 'EducationalOrganization'],
  '@id': `${siteUrl}/#school`,
  name: 'Ansar English School',
  url: `${siteUrl}/`,
  logo: `${siteUrl}/ansar-logo.png`,
  telephone: '+918129808051',
  email: 'hr@ansar.in',
  address: {
    '@type': 'PostalAddress', streetAddress: 'Perumpilavu, Karikkad P.O',
    addressLocality: 'Perumpilavu', addressRegion: 'Kerala', postalCode: '680519', addressCountry: 'IN'
  },
  geo: { '@type': 'GeoCoordinates', latitude: 10.69946, longitude: 76.08981 }
};

const pages = {
  '/': ['Ansar English School | CBSE School in Perumpilavu, Thrissur', 'Ansar English School is a CBSE Senior Secondary School in Perumpilavu, Thrissur, Kerala. Explore academics, admissions, facilities, school life, news, and contact information.', 'CBSE Senior Secondary School in Perumpilavu, Thrissur', 'Explore Ansar English School, its academics, admissions, student life, facilities, news, and ways to contact the school.'],
  '/about': ['About Ansar English School | Perumpilavu, Thrissur', 'Learn about Ansar English School, a CBSE Senior Secondary School in Perumpilavu, Thrissur, Kerala.', 'About Ansar English School', 'Learn about the school, its educational approach, leadership, and community.'],
  '/academics': ['CBSE Academics | Ansar English School, Thrissur', 'Explore the CBSE academic programme and learning approach at Ansar English School in Perumpilavu, Thrissur.', 'CBSE Academics', 'Explore the curriculum, learning resources, and academic opportunities at Ansar English School.'],
  '/admission': ['Admissions | Ansar English School, Perumpilavu', 'Find admission information for Ansar English School, a CBSE Senior Secondary School in Perumpilavu, Thrissur.', 'Admissions', 'Find admission guidance and contact the school for current application information.'],
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
  '/ansar-family': ['Our Faculty | Ansar English School', 'Meet the faculty and school community of Ansar English School in Perumpilavu, Thrissur.', 'Our Faculty', 'Meet the people who support learning at Ansar English School.'],
  '/alumni': ['Alumni | Ansar English School', 'Explore alumni stories and the alumni community of Ansar English School.', 'Ansar Alumni', 'Explore alumni stories, achievements, and community connections.'],
  '/extension-services': ['Extension Services | Ansar English School', 'Learn about community outreach and service activities at Ansar English School.', 'Extension Services', 'Learn about community outreach and service activities.'],
  '/ansar-media-production': ['Ansar Media Productions | Ansar English School', 'Explore student media and creative production at Ansar English School.', 'Ansar Media Productions', 'Explore photography, videography, design, and student media work.'],
  '/sop': ['Standard Operating Procedures | Ansar English School', 'View official standard operating procedures from Ansar English School.', 'Standard Operating Procedures', 'View school operational procedure documents.'],
  '/school-policies': ['School Policies | Ansar English School', 'View official school policy documents from Ansar English School.', 'School Policies', 'View policy documents for the school community.'],
  '/mandatory-public-disclosure': ['Mandatory Public Disclosure | Ansar English School', 'View official mandatory public disclosure information for Ansar English School.', 'Mandatory Public Disclosure', 'View official public disclosure information and documents.']
};
Object.assign(pages, {
  '/learning/cctv-enabled-safety': ['Campus Safety | Ansar English School', 'Learn about campus safety at Ansar English School in Perumpilavu, Thrissur.', 'Campus Safety', 'Explore safety measures and student support at the school.'],
  '/learning/smart-classrooms': ['Smart Classrooms | Ansar English School', 'Explore smart classroom learning at Ansar English School in Perumpilavu, Thrissur.', 'Smart Classrooms', 'Learn about technology-supported classroom learning.'],
  '/learning/qualified-support-staff': ['Student Support | Ansar English School', 'Learn about student support at Ansar English School in Perumpilavu, Thrissur.', 'Student Support', 'Explore the support available to students during the school day.'],
  '/learning/special-play-area': ['Play Areas | Ansar English School', 'Explore play and activity spaces at Ansar English School in Perumpilavu, Thrissur.', 'Play Areas', 'Discover spaces for play, movement, and student activity.'],
  '/learning/advanced-labs': ['Advanced Labs | Ansar English School', 'Explore practical learning labs at Ansar English School in Perumpilavu, Thrissur.', 'Advanced Labs', 'Learn about hands-on laboratory learning opportunities.'],
  '/learning/multi-sports-play-area': ['Sports Facilities | Ansar English School', 'Explore sports facilities at Ansar English School in Perumpilavu, Thrissur.', 'Sports Facilities', 'Discover spaces for games, fitness, and physical activity.'],
  '/learning/safe-school-transport': ['School Transport | Ansar English School', 'Learn about school transport at Ansar English School in Perumpilavu, Thrissur.', 'School Transport', 'Find information about school transport and student travel.'],
  '/learning/healthy-dining-spaces': ['Dining Spaces | Ansar English School', 'Explore student dining spaces at Ansar English School in Perumpilavu, Thrissur.', 'Dining Spaces', 'Learn about campus dining spaces for students.']
});
const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const links = [['About', '/about'], ['Academics', '/academics'], ['Admissions', '/admission'], ['Facilities', '/learning/smart-classrooms'], ['Gallery', '/gallery'], ['News', '/news'], ['Events', '/events'], ['Contact', '/contact']]
  .map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('');

const builtIndex = await readFile(path.join(dist, 'index.html'), 'utf8');
const entry = builtIndex.match(/<script type="module"(?: crossorigin)? src="([^"]+)"><\/script>/)?.[1];
const stylesheet = builtIndex.match(/<link rel="stylesheet"(?: crossorigin)? href="([^"]+)">/)?.[1];
if (!entry) throw new Error('Could not find Vite entry script in dist/index.html.');

for (const [route, [title, description, h1, body]] of Object.entries(pages)) {
  const canonical = `${siteUrl}${route}`;
  const pageSchema = { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description, isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': `${siteUrl}/#school` } };
  const cssLink = stylesheet ? `<link rel="stylesheet" href="${stylesheet}">` : '';
  const html = `<!doctype html><html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><link rel="canonical" href="${canonical}">${cssLink}<meta property="og:type" content="website"><meta property="og:site_name" content="Ansar English School"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${siteUrl}/ansar-logo.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify([schoolSchema, pageSchema])}</script></head><body><div id="root"><main><header><a href="/">Ansar English School</a></header><article><h1>${esc(h1)}</h1><p>${esc(body)}</p></article><nav aria-label="Main navigation"><ul>${links}</ul></nav></main></div><script type="module" src="/assets/PLACEHOLDER"></script></body></html>`;
  const finalHtml = html.replace('/assets/PLACEHOLDER', entry);
  const output = route === '/' ? path.join(dist, 'index.html') : path.join(dist, 'seo', `${route.slice(1)}.html`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, finalHtml);
}
