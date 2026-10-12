import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './tailwind.css'; // Switch to a clean Tailwind file to prevent old CSS conflicts

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Application render failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center"><section className="max-w-sm rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100"><p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Ansar English School</p><h1 className="mt-3 text-2xl font-extrabold text-slate-900">Let’s refresh the page</h1><p className="mt-3 text-sm leading-relaxed text-slate-600">A recent update is loading. Refresh once to continue.</p><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">Refresh website</button></section></main>;
    }
    return this.props.children;
  }
}

const APP_BUILD_ID = __APP_BUILD_ID__;
let updateReloadStarted = false;

function reloadForAppUpdate() {
  if (updateReloadStarted) return;
  updateReloadStarted = true;
  window.location.reload();
}

async function checkForAppUpdate() {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return;
    const version = await response.json();
    if (version?.buildId && version.buildId !== APP_BUILD_ID) reloadForAppUpdate();
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
  reloadForAppUpdate();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const hadActiveController = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadActiveController) reloadForAppUpdate();
    });

    navigator.serviceWorker
      .register(`/sw.js?v=${encodeURIComponent(APP_BUILD_ID)}`, { updateViaCache: 'none' })
      .then(registration => registration.update())
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}

window.addEventListener('load', checkForAppUpdate);
window.addEventListener('focus', checkForAppUpdate);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkForAppUpdate();
});
window.setInterval(checkForAppUpdate, 5 * 60 * 1000);

// This mounts the React application into the <div id="root"></div> in your index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
