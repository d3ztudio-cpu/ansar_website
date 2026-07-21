import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './tailwind.css'; // Switch to a clean Tailwind file to prevent old CSS conflicts

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
