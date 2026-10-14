import React, { useEffect, useState } from 'react';

const INSTALL_PROMPT_DISMISSED_KEY = 'ansar-install-prompt-dismissed-at';
const INSTALL_PROMPT_DELAY_MS = 20000;
const INSTALL_PROMPT_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
}

function isStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function wasRecentlyDismissed() {
  try {
    const dismissedAt = Number(window.localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) || 0);
    return dismissedAt && Date.now() - dismissedAt < INSTALL_PROMPT_SNOOZE_MS;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showManualHelp, setShowManualHelp] = useState(false);

  useEffect(() => {
    if (!isMobileDevice() || isStandaloneMode() || wasRecentlyDismissed()) return undefined;

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const timer = window.setTimeout(() => {
      setShowPrompt(true);
    }, INSTALL_PROMPT_DELAY_MS);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.clearTimeout(timer);
    };
  }, []);

  const dismissPrompt = () => {
    try {
      window.localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, String(Date.now()));
    } catch {
      // Ignore storage failures; the prompt can still be dismissed for this session.
    }
    setShowPrompt(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowManualHelp(true);
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismissPrompt();
  };

  return (
    showPrompt && (
        <div
          className="fixed inset-x-4 bottom-4 z-[9998] mx-auto max-w-md overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl shadow-emerald-950/20 ring-1 ring-black/5 motion-safe:animate-[flow-rise_250ms_ease-out]"
          role="dialog"
          aria-label="Install Ansar English School website"
        >
          <div className="flex gap-4 p-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v10m0 0 4-4m-4 4-4-4M5 21h14a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold text-slate-900">Add Ansar School to your home screen</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Open news, events, notices, and school updates faster from your phone home screen.
              </p>
              {showManualHelp && (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold leading-relaxed text-amber-900">
                  Use your browser menu and choose Add to Home Screen or Install app.
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-slate-100">
            <button type="button" onClick={dismissPrompt} className="px-4 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800">
              Later
            </button>
            <button type="button" onClick={handleInstall} className="bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-emerald-700">
              Add Now
            </button>
          </div>
        </div>
      )
  );
}
