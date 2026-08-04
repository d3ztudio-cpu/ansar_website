import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import Layout from './Layout';
import { db } from './firebase-init';

const DEFAULT_ATL_SETTINGS = {
  aimLabel: 'Established under AIM · NITI Aayog',
  heroTitle: 'Where ideas become',
  heroHighlight: 'innovations.',
  heroDescription: 'The Atal Tinkering Lab at Ansar English School, Perumpilavu is a state-of-the-art STEM learning centre where young minds explore, experiment, and create technology-driven solutions for society.',
  heroImageUrl: '/atl/atl-cover.jpg',
  signatureProjectImageUrl: 'https://i.ibb.co/hFBT52b2/IMG-6340-JPG.jpg',
  outreachWorkshopImageUrl: '',
  stemDiscoveryImageUrl: '',
  inaugurationDate: 'January 2023',
  inauguratedBy: 'MLA Ramya Haridas',
  overviewTitle: 'A space built for curious minds',
  overviewText: 'Inaugurated in January 2023, the ATL marked a significant milestone in the school’s commitment to innovation and scientific learning. The lab gives students the tools, guidance, and freedom to move beyond textbooks—turning questions into experiments and ideas into working prototypes.'
};

const technologies = [
  { code: 'RB', title: 'Robotics', text: 'Designing, assembling, and programming machines that respond to the world.' },
  { code: 'ES', title: 'Embedded Systems', text: 'Bringing hardware and software together to build purposeful devices.' },
  { code: '3D', title: '3D Printing', text: 'Turning digital designs into physical models for rapid prototyping.' },
  { code: 'EL', title: 'Electronics', text: 'Exploring circuits, components, sensors, and practical applications.' },
  { code: 'AI', title: 'Artificial Intelligence', text: 'Discovering how intelligent systems can address meaningful challenges.' },
  { code: 'IoT', title: 'Internet of Things', text: 'Connecting devices to collect data, communicate, and automate tasks.' },
  { code: '</>', title: 'Programming', text: 'Using logic and code to transform ideas into working solutions.' }
];

const learningSteps = [
  { number: '01', title: 'Observe', text: 'Identify a real-world problem and understand the people it affects.' },
  { number: '02', title: 'Imagine', text: 'Explore possibilities through research, discussion, and design thinking.' },
  { number: '03', title: 'Build', text: 'Create a working prototype using tools, technology, and teamwork.' },
  { number: '04', title: 'Improve', text: 'Test, learn from feedback, and refine the solution for greater impact.' }
];

function InnovationPanel({ title, note, className = 'aspect-[4/3]', dark = false }) {
  return (
    <div
      role="img"
      aria-label={title}
      className={`relative flex ${className} min-h-56 w-full items-center justify-center overflow-hidden rounded-3xl border ${dark ? 'border-white/15 bg-white/[0.07]' : 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50'}`}
    >
      <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full ${dark ? 'bg-amber-400/10' : 'bg-amber-200/30'}`} />
      <div className={`absolute -bottom-14 -left-12 h-44 w-44 rounded-full ${dark ? 'bg-sky-300/10' : 'bg-emerald-200/30'}`} />
      <div className="relative z-10 max-w-xs px-6 text-center">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${dark ? 'bg-white/10 text-amber-300 ring-1 ring-white/15' : 'bg-white text-emerald-700 ring-1 ring-emerald-100'}`}>
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.7" />
            <circle cx="8.5" cy="9" r="1.5" strokeWidth="1.7" />
            <path d="m4.5 17 4.2-4.2 3.1 3.1 2.1-2.1 5.6 5.2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className={`mt-5 text-[11px] font-black uppercase tracking-[0.24em] ${dark ? 'text-amber-300' : 'text-amber-600'}`}>ATL innovation space</p>
        <p className={`mt-2 text-lg font-extrabold ${dark ? 'text-white' : 'text-emerald-950'}`}>{title}</p>
        {note && <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-white/65' : 'text-slate-500'}`}>{note}</p>}
      </div>
    </div>
  );
}

function AtlPhoto({ src, alt, className = '', priority = false }) {
  return (
    <figure className={`overflow-hidden rounded-3xl bg-emerald-900 shadow-2xl ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className="h-full w-full object-cover"
      />
    </figure>
  );
}

function SectionHeading({ eyebrow, title, text, centered = false }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-extrabold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{text}</p>}
    </div>
  );
}

export default function AtlPage() {
  const [settings, setSettings] = useState(DEFAULT_ATL_SETTINGS);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'atlSettings', 'main'), (snapshot) => {
      if (snapshot.exists()) setSettings({ ...DEFAULT_ATL_SETTINGS, ...snapshot.data() });
    }, () => setSettings(DEFAULT_ATL_SETTINGS));
    return unsubscribe;
  }, []);

  return (
    <Layout fullWidth>
      <div className="bg-slate-50">
        <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_88%_72%,rgba(56,189,248,0.13),transparent_30%)]" />
          <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="mx-auto grid min-h-[42rem] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-amber-300 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                {settings.aimLabel}
              </div>
              <h1 className="mt-7 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-7xl">
                {settings.heroTitle} <span className="text-amber-300">{settings.heroHighlight}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 lg:text-xl">
                {settings.heroDescription}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#explore-atl" className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-emerald-950 shadow-lg transition hover:bg-amber-300">
                  Explore the ATL
                  <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="m7 4 6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <Link to="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/15">Contact the school</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-7 text-sm text-slate-300">
                <p><strong className="block text-xl text-white">{settings.inaugurationDate}</strong>Inaugurated</p>
                <p><strong className="block text-xl text-white">STEM + Design</strong>Learning by doing</p>
                <p><strong className="block text-xl text-white">Social Impact</strong>Innovation with purpose</p>
              </div>
            </div>
            <div className="relative">
              <AtlPhoto
                src={settings.heroImageUrl}
                alt="Students collaborating in the Atal Tinkering Lab at Ansar English School"
                className="aspect-[4/3] lg:aspect-[5/6]"
                priority
              />
              <div className="absolute -bottom-5 left-4 rounded-2xl bg-white px-5 py-4 text-emerald-950 shadow-2xl sm:left-8">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600">Inaugurated by</p>
                <p className="mt-1 font-extrabold">{settings.inauguratedBy}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="explore-atl" className="scroll-mt-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8 lg:py-28">
            <AtlPhoto
              src="/atl/atl-learning-space.jpg"
              alt="Students learning together in the Ansar Atal Tinkering Lab"
              className="aspect-[4/3]"
            />
            <div>
              <SectionHeading
                eyebrow="A milestone for Ansar"
                title={settings.overviewTitle}
                text={settings.overviewText}
              />
              <div className="mt-8 rounded-2xl border-l-4 border-amber-400 bg-white p-6 shadow-sm">
                <p className="text-lg font-extrabold leading-8 text-emerald-950">“Think with curiosity. Build with confidence. Innovate with purpose.”</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['Creativity', 'Critical thinking', 'Collaboration', 'Communication'].map(skill => (
                  <div key={skill} className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-100">{skill}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Tools for tomorrow"
              title="Technology becomes a creative language"
              text="Students learn to combine physical materials, electronics, code, and design—choosing the right tools to develop practical solutions."
              centered
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {technologies.map((item, index) => (
                <article key={item.title} className={`group rounded-2xl border border-slate-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl ${index === technologies.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                  <div className="flex h-12 min-w-12 w-fit items-center justify-center rounded-xl bg-emerald-50 px-3 text-sm font-black text-emerald-700 ring-1 ring-emerald-100 transition group-hover:bg-emerald-700 group-hover:text-white">{item.code}</div>
                  <h3 className="mt-5 text-xl font-extrabold text-emerald-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="Learning by doing"
                  title="From a real problem to a working prototype"
                  text="ATL follows an active learning approach. Students investigate challenges, share ideas, build together, and treat every test—including the unsuccessful ones—as a valuable part of discovery."
                />
                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  {learningSteps.map(step => (
                    <div key={step.number} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-xs font-black tracking-[0.2em] text-amber-600">{step.number}</p>
                      <h3 className="mt-2 text-xl font-extrabold text-emerald-950">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <AtlPhoto
                src="/atl/atl-prototyping.jpg"
                alt="Students testing electronics and programming ideas in the Atal Tinkering Lab"
                className="aspect-[4/3]"
              />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {['Innovation challenges', 'Hackathons', 'Robotics competitions', 'Design thinking', 'STEM activities', 'Entrepreneurship'].map(activity => (
                <span key={activity} className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">{activity}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-emerald-950 py-20 text-white lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            {settings.signatureProjectImageUrl ? (
              <AtlPhoto
                src={settings.signatureProjectImageUrl}
                alt="Students presenting their electronic voting machine as a signature ATL initiative"
                className="aspect-[4/3] bg-white/5"
              />
            ) : (
              <InnovationPanel
                title="Student-built Electronic Voting Machine"
                note="A signature project that connects technical learning with responsible citizenship."
                className="aspect-[4/3]"
                dark
              />
            )}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Signature ATL initiative</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">Building democracy, one circuit at a time</h2>
              <p className="mt-6 text-lg leading-8 text-slate-200">
                Every year, ahead of election season, ATL students design and build Electronic Voting Machines that closely resemble those used in Indian elections. The project brings together electronics, programming, product design, testing, and civic awareness in one meaningful learning experience.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {['Design', 'Electronics', 'Civic learning'].map(item => (
                  <div key={item} className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-5 text-center text-sm font-extrabold text-amber-200">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="Beyond our campus"
                  title="Sharing innovation with neighbouring schools"
                  text="ATL learning extends beyond Ansar through robotics workshops for nearby schools. Students and mentors introduce young learners to robotics, electronics, programming, and innovation—helping more children discover the joy of creating with technology."
                />
                <ul className="mt-8 space-y-4">
                  {['Student-led technology demonstrations', 'Hands-on robotics and electronics sessions', 'Mentoring that inspires future STEM learners'].map(item => (
                    <li key={item} className="flex items-start gap-3 text-base font-bold text-slate-700">
                      <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="m5 10 3 3 7-7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {settings.outreachWorkshopImageUrl ? (
                  <AtlPhoto src={settings.outreachWorkshopImageUrl} alt="ATL robotics outreach workshop with young learners" className="aspect-[4/5]" />
                ) : (
                  <InnovationPanel title="Robotics outreach workshop" note="ATL mentors sharing the excitement of making with young learners." className="aspect-[4/5]" />
                )}
                {settings.stemDiscoveryImageUrl ? (
                  <AtlPhoto src={settings.stemDiscoveryImageUrl} alt="Students taking part in hands-on STEM discovery" className="aspect-[4/5] sm:mt-10" />
                ) : (
                  <InnovationPanel title="Hands-on STEM discovery" note="A welcoming first step into electronics, programming, and innovation." className="aspect-[4/5] sm:mt-10" />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="A growing culture of innovation"
              title="Recognition that begins with curiosity"
              text="Since its inception, the ATL has grown into a hub of creativity and scientific thinking. Students have earned recognition through innovation challenges, hackathons, robotics competitions, and entrepreneurship programmes."
              centered
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { level: 'District', text: 'Ideas tested and presented within the wider learning community.' },
                { level: 'State', text: 'Student solutions recognised for creativity, teamwork, and application.' },
                { level: 'National', text: 'Young innovators representing Ansar on larger platforms.' }
              ].map((item, index) => (
                <article key={item.level} className="relative overflow-hidden rounded-3xl bg-white p-7 text-center shadow-sm ring-1 ring-slate-100">
                  <span className="absolute left-5 top-4 text-6xl font-black text-emerald-50">{String(index + 1).padStart(2, '0')}</span>
                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" strokeWidth="1.8" /><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4m-3 3h6" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </div>
                  <h3 className="mt-5 text-2xl font-extrabold text-emerald-950">{item.level} Level</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 px-6 py-12 text-emerald-950 shadow-xl sm:px-10 lg:px-16 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-4xl">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-800">Nurturing tomorrow’s changemakers</p>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">Curious minds. Confident makers. Responsible citizens.</h2>
                <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-emerald-900/80">With dedicated mentors, enthusiastic students, and unwavering support from the school management, ATL empowers young innovators with the skills and confidence to create meaningful solutions for society.</p>
              </div>
              <Link to="/contact" className="inline-flex w-fit items-center justify-center rounded-xl bg-emerald-950 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-900">Connect with Ansar ATL</Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
