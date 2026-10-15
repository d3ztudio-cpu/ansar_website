import React from 'react';
import Layout from './Layout';
import { useContentCollection } from './useContentCollection';

export default function Forms() {
  const { data: forms, loading } = useContentCollection('forms', 'order', 'asc', { sheetsOnly: true });
  const published = forms.filter(form => form.published !== false && form.driveUrl);
  return <Layout><main className="mx-auto max-w-6xl px-4 py-12 lg:py-20">
    <section className="rounded-3xl bg-emerald-950 px-6 py-14 text-white shadow-xl sm:px-10"><p className="text-sm font-black uppercase tracking-widest text-amber-300">Parent & Student Services</p><h1 className="mt-3 text-4xl font-extrabold lg:text-5xl">School Forms</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-emerald-50">Download, view, and print the forms you need before visiting the school office. Complete them at home and bring the filled form with you.</p></section>
    <section className="mt-12 grid gap-5 md:grid-cols-2">{loading ? <p className="font-bold text-slate-500">Loading forms…</p> : published.length ? published.map(form => <article key={form.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-emerald-600">Printable form</p><h2 className="mt-3 text-2xl font-extrabold text-slate-900">{form.title}</h2>{form.description && <p className="mt-3 leading-relaxed text-slate-600">{form.description}</p>}<div className="mt-6 flex flex-wrap gap-3"><a href={form.driveUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800">View / Download</a><a href={form.driveUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50">Print form</a></div></article>) : <p className="rounded-2xl border border-slate-100 bg-white p-8 text-center font-bold text-slate-500 md:col-span-2">Forms will be available here shortly.</p>}</section>
  </main></Layout>;
}
