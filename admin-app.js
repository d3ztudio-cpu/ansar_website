import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

const ADMIN_EMAILS = [
  'd3ztudio@gmail.com',
  'ansarmedia@ansarschool.in',
  'shafeeqpulikkal32@gmail.com',
  'ansarschooloffice@gmail.com'
];

const NAV_ITEMS = [
  { label: 'Home', href: 'index.html', type: 'primary', order: 1 },
  { label: 'About', href: 'page.html?slug=about', slug: 'about', type: 'primary', order: 2 },
  { label: 'Academics', href: 'page.html?slug=academics', slug: 'academics', type: 'primary', order: 3 },
  { label: 'Admission', href: 'page.html?slug=admission', slug: 'admission', type: 'primary', order: 4 },
  { label: 'News', href: 'news-page.html', type: 'primary', order: 5 },
  { label: 'Events', href: 'events-page.html', type: 'primary', order: 6 },
  { label: 'Ansar Sports', href: 'page.html?slug=ansar-sports', slug: 'ansar-sports', type: 'more', order: 7 },
  { label: 'ATL', href: 'page.html?slug=atl', slug: 'atl', type: 'more', order: 8 },
  { label: 'Ansar Sprouts', href: 'page.html?slug=ansar-sprouts', slug: 'ansar-sprouts', type: 'more', order: 9 },
  { label: 'Extension Services', href: 'page.html?slug=extension-services', slug: 'extension-services', type: 'more', order: 10 },
  { label: 'Life at Ansar', href: 'page.html?slug=life-at-ansar', slug: 'life-at-ansar', type: 'more', order: 11 },
  { label: 'Ansar Times', href: 'page.html?slug=ansar-times', slug: 'ansar-times', type: 'more', order: 12 },
  { label: 'Alumni', href: 'page.html?slug=alumni', slug: 'alumni', type: 'more', order: 13 },
  { label: 'Achievements', href: 'page.html?slug=achievements', slug: 'achievements', type: 'more', order: 14 },
  { label: 'Gallery', href: 'gallery-page.html', type: 'more', order: 15 },
  { label: 'SOP', href: 'page.html?slug=sop', slug: 'sop', type: 'more', order: 16 },
  { label: 'AES School Policies', href: 'page.html?slug=school-policies', slug: 'school-policies', type: 'more', order: 17 },
  { label: 'Mandatory Public Disclosure', href: 'page.html?slug=mandatory-public-disclosure', slug: 'mandatory-public-disclosure', type: 'more', order: 18 },
  { label: 'Contact Us', href: 'contact-new.html', type: 'primary', order: 18 }
];

const PAGE_SEEDS = [
  {
    slug: 'about',
    title: 'Welcome to Ansar English School Perumpilavu',
    subtitle: 'Founded in 1982 as the flagship project of Ansari Charitable Trust, the school serves 5000+ learners with value-driven CBSE education.',
    category: 'About',
    heroImageUrl: 'https://ibb.co/5gkMgmgB',
    bodyHtml: '<h2>Our Vision</h2><p>Nurture students to thrive as creative and value-driven citizens in a diverse and rapidly changing world.</p><h2>Our Mission</h2><ul><li>Provide an inclusive learning environment for sustained academic growth.</li><li>Empower students with skills, values, and character.</li><li>Conduct programmes that build 21st century skills.</li></ul>',
    published: true,
    order: 1
  },
  {
    slug: 'academics',
    title: 'Academics',
    subtitle: 'A student-centric CBSE learning pathway supported by digital classrooms, enrichment programmes, labs, and regular skill-building activities.',
    category: 'Academics',
    heroImageUrl: 'https://ibb.co/5gkMgmgB',
    bodyHtml: '<p>Ansar English School combines academic rigor with strong values, foundational literacy, digital proficiency, and opportunities in STEAM, literature, sports, and leadership.</p>',
    published: true,
    order: 2
  },
  {
    slug: 'admission',
    title: 'Admission',
    subtitle: 'Admissions information, procedures, fee details, prospectus updates, and TC queries can be maintained from this admin panel.',
    category: 'Admission',
    heroImageUrl: 'https://ibb.co/5gkMgmgB',
    bodyHtml: '<p>Use this page to publish admission procedures, eligibility, important dates, downloadable prospectus links, and frequently asked questions.</p>',
    published: true,
    order: 3
  },
  {
    slug: 'life-at-ansar',
    title: 'Life at Ansar',
    subtitle: 'A living-learning community with co-curricular clubs, student publications, sports, leadership, and service programmes.',
    category: 'Campus Life',
    heroImageUrl: 'https://ibb.co/5gkMgmgB',
    bodyHtml: '<p>Students discover interests beyond the classroom through clubs, competitions, publications, sports, assemblies, and community service.</p>',
    published: true,
    order: 4
  }
];

const SPORTS_FIELDS = [
  ['title', 'Title', 'text', true],
  ['content', 'Content', 'textarea'],
  ['imageUrl', 'Image URL', 'url'],
  ['published', 'Published', 'checkbox']
];

const ANSAR_TIMES_FIELDS = [
  ['title', 'Edition Title', 'text', true],
  ['fileUrl', 'PDF File URL', 'url', true],
  ['coverImageUrl', 'Cover Image URL', 'url'],
  ['date', 'Publication Date', 'date'],
  ['published', 'Published', 'checkbox']
];

const ACHIEVEMENTS_FIELDS = [
  ['title', 'Achievement Title', 'text', true],
  ['description', 'Description', 'textarea'],
  ['imageUrl', 'Image URL', 'url'],
  ['date', 'Date of Achievement', 'date'],
  ['studentName', 'Student(s) Name', 'text'],
  ['published', 'Published', 'checkbox']
];

const DYNAMIC_PAGE_FIELDS = [
  ['title', 'Title', 'text', true],
  ['slug', 'Slug', 'text', true],
  ['subtitle', 'Subtitle', 'textarea'],
  ['category', 'Category', 'text'],
  ['heroImageUrl', 'Hero Image URL', 'url'],
  ['virtualTourUrl', 'Virtual Tour URL', 'url'],
  ['virtualTourText', 'Virtual Tour Button Text', 'text'],
  ['bodyHtml', 'Page Body HTML', 'textarea'],
  ['order', 'Display Order', 'number'],
  ['published', 'Published', 'checkbox']
];

const COLLECTIONS = {
  pages: {
    title: 'Pages',
    list: 'pagesList',
    add: 'addPageBtn',
    fields: [
      ['title', 'Title', 'text', true],
      ...DYNAMIC_PAGE_FIELDS.slice(1)
    ]
  },
  news: {
    title: 'News',
    list: 'newsList',
    add: 'addNewsBtn',
    fields: [
      ['title', 'Title', 'text', true],
      ['excerpt', 'Excerpt', 'textarea'],
      ['content', 'Content', 'textarea'],
      ['image', 'Image URL', 'url'],
      ['date', 'Date', 'date'],
      ['instagramUrl', 'Instagram URL (Optional)', 'url'],
      ['youtubeUrl', 'YouTube URL (Optional)', 'url'],
      ['facebookUrl', 'Facebook URL (Optional)', 'url'],
      ['published', 'Published', 'checkbox']
    ]
  },
  events: {
    title: 'Events',
    list: 'eventsList',
    add: 'addEventBtn',
    fields: [
      ['title', 'Title', 'text', true],
      ['description', 'Description', 'textarea'],
      ['image', 'Image URL', 'url'],
      ['date', 'Date', 'date'],
      ['location', 'Location', 'text'],
      ['instagramUrl', 'Instagram URL (Optional)', 'url'],
      ['youtubeUrl', 'YouTube URL (Optional)', 'url'],
      ['facebookUrl', 'Facebook URL (Optional)', 'url'],
      ['published', 'Published', 'checkbox']
    ]
  },
  gallery: {
    title: 'Gallery',
    list: 'galleryList',
    add: 'addGalleryBtn',
    fields: [
      ['title', 'Title', 'text', true],
      ['caption', 'Caption', 'textarea'],
      ['imageUrl', 'Image URL', 'url', true],
      ['category', 'Category', 'text'],
      ['order', 'Display Order', 'number'],
      ['published', 'Published', 'checkbox']
    ]
  },
  carousel: {
    title: 'Carousel',
    list: 'carouselList',
    add: 'addCarouselBtn',
    fields: [
      ['title', 'Title', 'text', true],
      ['description', 'Description', 'textarea'],
      ['imageUrl', 'Image URL', 'url', true],
      ['linkUrl', 'Link URL', 'url'],
      ['order', 'Display Order', 'number'],
      ['active', 'Active', 'checkbox']
    ]
  },
  notices: {
    title: 'Notices',
    list: 'noticesList',
    add: 'addNoticeBtn',
    fields: [
      ['title', 'Title', 'text', true],
      ['message', 'Message', 'textarea', true],
      ['buttonText', 'Button Text', 'text'],
      ['buttonUrl', 'Button URL', 'url'],
      ['duration', 'Duration Seconds', 'number'],
      ['active', 'Active', 'checkbox']
    ]
  },
  sports: {
    title: 'Sports',
    list: 'sportsList',
    add: 'addSportsBtn',
    fields: SPORTS_FIELDS
  },
  ansarTimes: {
    title: 'Ansar Times',
    list: 'ansarTimesList',
    add: 'addAnsarTimesBtn',
    fields: ANSAR_TIMES_FIELDS
  },
  achievements: {
    title: 'Achievements',
    list: 'achievementsList',
    add: 'addAchievementsBtn',
    fields: ACHIEVEMENTS_FIELDS
  },
  publicDisclosure: {
    title: 'Public Disclosure',
    list: 'publicDisclosureList',
    add: 'addPublicDisclosureBtn',
    fields: [
      ['title', 'Document Title', 'text', true],
      ['fileUrl', 'File URL', 'url', true],
      ['date', 'Date', 'date'],
      ['published', 'Published', 'checkbox']
    ]
  }
};

let app;
let auth;
let db;
let currentUser;
let cache = {};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function showLogin() {
  document.body.innerHTML = `
    <main class="admin-login">
      <form id="loginForm" class="login-card">
        <p class="eyebrow">Ansar English School</p>
        <h1>Admin Panel</h1>
        <label>Email <input type="email" name="email" required autocomplete="email"></label>
        <label>Password <input type="password" name="password" required autocomplete="current-password"></label>
        <button type="submit" class="btn-primary">Sign In</button>
        <p id="loginError" class="login-error"></p>
      </form>
    </main>`;

  document.getElementById('loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const errorEl = document.getElementById('loginError');
    const submitBtn = event.target.querySelector('button[type="submit"]');

    errorEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';

    try {
      await signInWithEmailAndPassword(auth, form.get('email'), form.get('password'));
      // Reload the page to ensure the admin panel initializes correctly
      // with the new authentication state and the proper HTML structure.
      window.location.reload();
    } catch (error) {
      errorEl.textContent = error.message;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}

function showUnauthorized(user) {
  document.body.innerHTML = `
    <main class="admin-login">
      <section class="login-card">
        <h1>Access denied</h1>
        <p>${escapeHtml(user.email)} is signed in, but is not approved for website administration.</p>
        <button id="signOutBlocked" class="btn-primary">Sign out</button>
      </section>
    </main>`;
  document.getElementById('signOutBlocked').addEventListener('click', () => signOut(auth));
}

function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  document.querySelector('.main-content').prepend(alert);
  setTimeout(() => alert.remove(), 3200);
}

function switchPanel(panelName) {
  document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.panel === panelName));
  document.getElementById(panelName)?.classList.add('active');
  if (panelName === 'dashboard') loadDashboard();
  if (panelName === 'settings') loadSettings();
  if (COLLECTIONS[panelName]) loadCollection(panelName);
}

async function getCollectionItems(name) {
  const q = query(collection(db, name), orderBy(name === 'news' || name === 'events' ? 'date' : 'order'));
  const snap = await getDocs(q).catch(() => getDocs(collection(db, name)));
  return snap.docs.map(item => ({ id: item.id, ...item.data() }));
}

async function loadDashboard() {
  const names = Object.keys(COLLECTIONS);
  const counts = await Promise.all(names.map(async name => [name, (await getDocs(collection(db, name))).size]));
  document.getElementById('statsGrid').innerHTML = counts.map(([name, count]) => `
    <article class="stat-card"><h3>${COLLECTIONS[name].title}</h3><div class="number">${count}</div></article>
  `).join('');
  document.getElementById('dashboardContent').innerHTML = `
    <section class="form-group">
      <h3>Content workflow</h3>
      <p>Signed in as <strong>${escapeHtml(currentUser.email)}</strong>. Use Pages for all main website tabs, News and Events for updates, Gallery and Carousel for visuals, and Settings for school contact details.</p>
      <div class="button-group">
        <button class="btn-success" id="seedBtn">Install Starter School Content</button>
        <button class="btn-primary" id="seedNavBtn">Refresh Navigation Items</button>
      </div>
    </section>`;
  document.getElementById('seedBtn').addEventListener('click', seedStarterContent);
  document.getElementById('seedNavBtn').addEventListener('click', seedNavigation);
}

function renderField([name, label, type, required], data = {}) {
  const value = data[name] ?? '';
  const requiredAttr = required ? 'required' : '';
  if (type === 'textarea') {
    return `<div class="form-group"><label>${label}</label><textarea name="${name}" ${requiredAttr}>${escapeHtml(value)}</textarea></div>`;
  }
  if (type === 'checkbox') {
    return `<div class="form-group compact-field"><label><input type="checkbox" name="${name}" ${value ? 'checked' : ''}> ${label}</label></div>`;
  }
  return `<div class="form-group"><label>${label}</label><input type="${type}" name="${name}" value="${escapeHtml(value)}" ${requiredAttr}></div>`;
}

function renderForm(name, docId = '', data = {}) {
  const config = COLLECTIONS[name];
  const form = `
    <form class="editor-form" data-collection="${name}" data-doc="${docId}">
      ${config.fields.map(field => renderField(field, data)).join('')}
      <div class="button-group">
        <button type="submit" class="btn-success">Save ${config.title}</button>
        <button type="button" class="btn-danger" data-cancel>Cancel</button>
      </div>
    </form>`;
  document.getElementById(config.list).innerHTML = form;
  document.querySelector('.editor-form').addEventListener('submit', saveItem);
  document.querySelector('[data-cancel]').addEventListener('click', () => loadCollection(name));
}

function coerceValue(type, value, checked) {
  if (type === 'checkbox') return checked;
  if (type === 'number') return Number(value || 0);
  return value.trim();
}

async function saveItem(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.dataset.collection;
  const docId = form.dataset.doc;
  const config = COLLECTIONS[name];
  const data = {};
  config.fields.forEach(([field, , type]) => {
    const input = form.elements[field];
    data[field] = coerceValue(type, input.value, input.checked);
  });
  if (name === 'pages') {
    data.slug = slugify(data.slug || data.title);
    data.href = `page.html?slug=${data.slug}`;
  }
  data.updatedAt = new Date();

  if (docId) {
    await updateDoc(doc(db, name, docId), data);
  } else if (name === 'pages' && data.slug) {
    await setDoc(doc(db, name, data.slug), { ...data, createdAt: new Date() }, { merge: true });
  } else {
    await addDoc(collection(db, name), { ...data, createdAt: new Date() });
  }
  showAlert(`${config.title} saved`);
  await loadCollection(name);
}

async function loadCollection(name) {
  const config = COLLECTIONS[name];
  const items = await getCollectionItems(name);
  cache[name] = items;
  const empty = `<p>No ${config.title.toLowerCase()} yet. Add the first one above.</p>`;
  document.getElementById(config.list).innerHTML = `
    <div class="items-list">
      ${items.length ? items.map(item => `
        <article class="item-card">
          <div class="item-content">
            <h3>${escapeHtml(item.title || item.slug || 'Untitled')}</h3>
            <p>${escapeHtml(item.subtitle || item.excerpt || item.description || item.message || item.caption || '')}</p>
            ${item.imageUrl || item.image || item.heroImageUrl ? `<img class="image-preview" src="${escapeHtml(item.imageUrl || item.image || item.heroImageUrl)}" alt="">` : ''}
          </div>
          <div class="item-actions">
            <button class="btn-primary" data-edit="${item.id}">Edit</button>
            <button class="btn-danger" data-delete="${item.id}">Delete</button>
          </div>
        </article>
      `).join('') : empty}
    </div>`;
  document.querySelectorAll(`[data-edit]`).forEach(btn => {
    btn.addEventListener('click', () => renderForm(name, btn.dataset.edit, cache[name].find(item => item.id === btn.dataset.edit)));
  });
  document.querySelectorAll(`[data-delete]`).forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this item?')) return;
      await deleteDoc(doc(db, name, btn.dataset.delete));
      await loadCollection(name);
    });
  });
}

async function seedNavigation() {
  await Promise.all(NAV_ITEMS.map(item => setDoc(doc(db, 'navigation', slugify(item.label)), item, { merge: true })));
  showAlert('Navigation refreshed from Ansar School tabs');
}

async function seedStarterContent() {
  await Promise.all(PAGE_SEEDS.map(page => setDoc(doc(db, 'pages', page.slug), { ...page, updatedAt: new Date(), createdAt: new Date() }, { merge: true })));
  await seedNavigation();
  await setDoc(doc(db, 'settings', 'general'), {
    schoolName: 'Ansar English School',
    email: 'ansarschooloffice@gmail.com',
    phone: '',
    address: 'Perumpilavu, Thrissur, Kerala',
    siteDescription: 'Ansar English School is a NABET accredited CBSE school in Perumpilavu, Thrissur.',
    updatedAt: new Date()
  }, { merge: true });
  showAlert('Starter content installed');
}

async function loadSettings() {
  const snap = await getDocs(collection(db, 'settings'));
  const settings = {};
  snap.forEach(item => settings[item.id] = item.data());
  document.getElementById('settingsContent').innerHTML = `
    <form id="settingsForm">
      ${renderField(['schoolName', 'School Name', 'text'], settings.general)}
      ${renderField(['email', 'School Email', 'email'], settings.general)}
      ${renderField(['phone', 'Phone Number', 'text'], settings.general)}
      ${renderField(['address', 'Address', 'textarea'], settings.general)}
      ${renderField(['logoUrl', 'Logo URL', 'url'], settings.general)}
      ${renderField(['siteDescription', 'SEO Description', 'textarea'], settings.general)}
      <button class="btn-success" type="submit">Save Settings</button>
    </form>`;
  document.getElementById('settingsForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    await setDoc(doc(db, 'settings', 'general'), {
      schoolName: form.get('schoolName').trim(),
      email: form.get('email').trim(),
      phone: form.get('phone').trim(),
      address: form.get('address').trim(),
      logoUrl: form.get('logoUrl').trim(),
      siteDescription: form.get('siteDescription').trim(),
      updatedAt: new Date()
    }, { merge: true });
    showAlert('Settings saved');
  });
}

function initializeAdmin() {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => switchPanel(btn.dataset.panel)));
  document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth));
  Object.entries(COLLECTIONS).forEach(([name, config]) => {
    document.getElementById(config.add).addEventListener('click', () => renderForm(name));
  });
  loadDashboard();
}

window.addEventListener('DOMContentLoaded', () => {
  app = initializeApp(window.firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  onAuthStateChanged(auth, user => {
    currentUser = user;
    if (!user) {
      showLogin();
      return;
    }
    if (!ADMIN_EMAILS.includes(user.email)) {
      showUnauthorized(user);
      return;
    }
    initializeAdmin();
  });
});
