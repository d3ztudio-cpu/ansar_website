import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './tailwind.css'; // Switch to a clean Tailwind file to prevent old CSS conflicts

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, retry: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Application render failed:', error);
    // A mobile browser can briefly restore an old module while a newer
    // service worker is taking control. Retry the render once, but never
    // replace the page with an empty root while recovery is in progress.
    if (this.state.retry === 0) {
      window.setTimeout(() => this.setState({ hasError: false, retry: 1 }), 0);
      return;
    }
    reloadForStaleAsset();
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a', fontFamily: 'ui-sans-serif, system-ui, sans-serif', textAlign: 'center' }}>
          <section style={{ maxWidth: 360 }}>
            <p style={{ margin: 0, color: '#047857', fontWeight: 800, fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase' }}>Ansar English School</p>
            <h1 style={{ margin: '14px 0 0', fontSize: 24 }}>Updating the website</h1>
            <p style={{ margin: '12px 0 0', color: '#475569', lineHeight: 1.5 }}>The latest page is taking longer than expected to load. Please refresh once to continue.</p>
            <button type="button" onClick={() => window.location.reload()} style={{ marginTop: 22, border: 0, borderRadius: 12, padding: '12px 18px', background: '#047857', color: '#fff', fontWeight: 700, fontSize: 16 }}>Refresh website</button>
          </section>
        </main>
      );
    }
    return <React.Fragment key={this.state.retry}>{this.props.children}</React.Fragment>;
  }
}

const APP_BUILD_ID = __APP_BUILD_ID__;
let updateReloadStarted = false;
const UPDATE_RELOAD_KEY = 'ansar:lastUpdateReloadBuild';

function reloadForStaleAsset() {
  // Publishing a new version must not interrupt a logged-in administrator.
  // The updated app will be loaded on their next normal refresh or visit.
  if (window.location.pathname.startsWith('/admin')) return;
  if (updateReloadStarted) return;
  // A worker handover and version probe can arrive together on slower mobile
  // connections. Reload only once per build so the page cannot get stuck in a
  // reload loop before its chunks render.
  try {
    if (window.sessionStorage.getItem(UPDATE_RELOAD_KEY) === APP_BUILD_ID) return;
    window.sessionStorage.setItem(UPDATE_RELOAD_KEY, APP_BUILD_ID);
  } catch {}
  updateReloadStarted = true;
  window.location.replace(window.location.href);
}

async function checkForAppUpdate() {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return;
    const version = await response.json();
    // Downloaded updates are applied on the next normal navigation; do not
    // interrupt the visitor while they are using the website.
    return Boolean(version?.buildId && version.buildId !== APP_BUILD_ID);
  } catch {
    // A temporary network failure should not interrupt the current page.
  }
}

// Enforce rigid viewport metadata for absolute mobile responsiveness
let viewportMeta = document.querySelector('meta[name="viewport"]');
if (!viewportMeta) {
  viewportMeta = document.createElement('meta');
  viewportMeta.name = "viewport";
  document.head.appendChild(viewportMeta);
}
viewportMeta.content = "width=device-width, initial-scale=1.0";

// When a deploy renames hashed chunks, any open tab may request a lazy chunk
// that no longer exists. Vite dispatches this event on such failures; one
// reload picks up the fresh HTML and recovers automatically.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  reloadForStaleAsset();
});

// Module scripts can fail before React gets a chance to render (most often
// when a mobile browser still has an HTML shell that references a replaced
// hashed bundle). Recover once, rather than leaving an empty viewport.
function isStaleAssetFailure(reason) {
  const message = String(reason?.message || reason || '');
  return /failed to fetch dynamically imported module|importing a module script failed|loading module|chunkloaderror|failed to fetch/i.test(message);
}

window.addEventListener('error', (event) => {
  if (isStaleAssetFailure(event.error || event.message)) reloadForStaleAsset();
});

window.addEventListener('unhandledrejection', (event) => {
  if (isStaleAssetFailure(event.reason)) {
    event.preventDefault();
    reloadForStaleAsset();
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then(registration => registration.update())
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}

window.addEventListener('load', checkForAppUpdate);
window.setInterval(checkForAppUpdate, 5 * 60 * 1000);

// This mounts the React application into the <div id="root"></div> in your index.html
const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);

// The markup in index.html is deliberately kept until JavaScript has mounted.
// It gives slow or stale mobile sessions a clear recovery action instead of a
// white screen while the latest bundle is being obtained.
document.documentElement.dataset.appReady = 'true';
document.getElementById('boot-splash')?.classList.add('is-hidden');
