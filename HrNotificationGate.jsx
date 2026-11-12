import React, { useState } from 'react';
import { registerForHrPushNotifications } from './pushNotifications';

export default function HrNotificationGate({ user, children }) {
  const [permission, setPermission] = useState(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
  const [busy, setBusy] = useState(false);
  const enable = async () => { setBusy(true); try { const result = await Notification.requestPermission(); setPermission(result); if (result === 'granted') await registerForHrPushNotifications(user); } finally { setBusy(false); } };
  if (permission !== 'granted') return <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm"><p className="text-xs font-black uppercase tracking-[.2em] text-amber-700">Notifications required</p><h1 className="mt-3 text-2xl font-black text-slate-900">Enable HR application alerts</h1><p className="mt-3 leading-7 text-slate-600">Allow notifications on this device before using the Careers dashboard. You will be alerted when a new application is submitted.</p>{permission === 'denied' && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">Notifications are blocked. Allow them in browser settings, then reload this page.</p>}{permission === 'unsupported' && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">This browser does not support notifications.</p>}{permission === 'default' && <button onClick={enable} disabled={busy} className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 font-black text-white">{busy ? 'Requesting permission…' : 'Allow notifications'}</button>}</div>;
  return children;
}
