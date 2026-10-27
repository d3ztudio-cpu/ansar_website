import React from "react";

export function displayDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function Arrow() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

export function EmptyState({ label }) {
  return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">✦</div><h3 className="mt-5 text-xl font-extrabold text-slate-900">Nothing here yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">New {label.toLowerCase()} will appear here as soon as the library publishes them.</p></div>;
}
