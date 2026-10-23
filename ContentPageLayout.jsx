import React from 'react';

export default function ContentPageLayout({ page, eyebrow = 'Ansar English School', children, actions, sidebar }) {
  return (
    <LayoutWrapper>
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-white shadow-2xl sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(218,154,44,.18),transparent_42%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-emerald-950/70" />
        <div className="relative z-10 max-w-4xl">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-amber-300">{eyebrow}</p>
          <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl">{page.title}</h1>
          {page.subtitle && <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-100/85 lg:text-xl">{page.subtitle}</p>}
        </div>
      </div>

      {page.heroImageUrl && (
        <div className="-mt-10 px-4 sm:px-8">
          <img src={page.heroImageUrl} alt={page.title} className="relative z-10 h-72 w-full rounded-2xl border-4 border-white object-cover shadow-xl sm:h-96" />
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
          {children || (
            <div
              className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-emerald-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
            />
          )}
          {actions && <div className="mt-10 border-t border-slate-100 pt-8">{actions}</div>}
        </article>

        <aside className="space-y-4">
          {sidebar || (
            <>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Page Guide</p>
                <h2 className="mt-3 text-xl font-extrabold text-slate-900">{page.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">This section is structured for quick reading and can be expanded from the admin panel.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Need help?</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Contact the school office for more details about this page.</p>
              </div>
            </>
          )}
        </aside>
      </div>
    </LayoutWrapper>
  );
}

function LayoutWrapper({ children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
      {children}
    </div>
  );
}
