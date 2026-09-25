import React, { useState } from 'react';

const DEVELOPER_SITE_URL = 'https://d3ztudio-main.web.app/';
const DEVELOPER_PHONE = '9188081324';
const DEVELOPER_WHATSAPP = '9188081324';
const DEVELOPER_EMAIL = 'd3ztudio@gmail.com';
const DEVELOPER_INSTAGRAM = 'https://instagram.com/d3ztudio';

const SUPPORT_LINKS = [
  {
    key: 'call',
    label: 'Contact',
    subtitle: DEVELOPER_PHONE,
    href: `tel:+91${DEVELOPER_PHONE}`,
    external: false,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    subtitle: 'Chat with D3ZTUDIO support',
    href: `https://wa.me/91${DEVELOPER_WHATSAPP}`,
    external: true,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    )
  },
  {
    key: 'website',
    label: 'Website',
    subtitle: 'd3ztudio-main.web.app',
    href: DEVELOPER_SITE_URL,
    external: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
      </svg>
    )
  },
  {
    key: 'instagram',
    label: 'Follow on Instagram',
    subtitle: '@d3ztudio',
    href: DEVELOPER_INSTAGRAM,
    external: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" strokeWidth="2" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    key: 'mail',
    label: 'Mail us at',
    subtitle: DEVELOPER_EMAIL,
    href: `mailto:${DEVELOPER_EMAIL}`,
    external: false,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      </svg>
    )
  }
];

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="support-widget fixed bottom-24 right-4 z-[9990] flex flex-col items-end gap-3 md:bottom-6">
      {isOpen && (
        <div className="w-[min(20rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
          <div className="relative bg-slate-950 px-6 pb-5 pt-7 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.35),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.3),transparent_55%)]" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </span>
              <h3 className="mt-3 text-lg font-extrabold">Developer Details</h3>
              <p className="mt-1 text-sm font-semibold text-slate-200">Dolus K Shyju</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">D3ZTUDIO.io</p>
            </div>
          </div>
          <div className="space-y-2 p-3">
            {SUPPORT_LINKS.map(link => (
              <a
                key={link.key}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-emerald-50"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  {link.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-slate-900">{link.label}</span>
                  <span className="block truncate text-xs font-semibold text-slate-500">{link.subtitle}</span>
                </span>
                {link.external && (
                  <svg className="h-4 w-4 flex-none text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17 17 7M8 7h9v9" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        aria-label={isOpen ? 'Close developer support options' : 'Open developer support options'}
        aria-expanded={isOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_30px_-10px_rgba(5,150,105,0.8)] ring-4 ring-white transition-all hover:scale-105 hover:bg-emerald-700 active:scale-95"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        )}
      </button>
    </div>
  );
}
