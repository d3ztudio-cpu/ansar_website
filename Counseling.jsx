import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { applySeoMetadata } from "./seoUtils";

const services = [
  [
    "Individual Counseling & Mental Health Support",
    "A respectful, age-appropriate space where students can discuss wellbeing, emotions, relationships, and concerns.",
  ],
  [
    "Academic & Career Guidance",
    "Practical guidance to help students build effective learning habits, make informed subject choices, and plan their next steps.",
  ],
  [
    "Behaviour & Life Skills Development",
    "Support for self-awareness, resilience, communication, responsible decision-making, and positive behaviour.",
  ],
  [
    "Parent & Teacher Workshops",
    "Collaborative sessions that strengthen understanding, early support, and a consistent care network around every child.",
  ],
];

const team = [
  [
    "School Counseling Team",
    "Student wellbeing",
    "Qualified professionals provide a calm, supportive first point of contact for students and families.",
  ],
  [
    "Student Support Network",
    "Pastoral care",
    "Counselors, teachers, coordinators, and families work together to help each student feel seen and supported.",
  ],
];

export default function Counseling() {
  useEffect(() => {
    applySeoMetadata(
      {
        title: "Guidance & Counseling | Ansar English School",
        description:
          "Learn about confidential student wellbeing, counseling, academic guidance, and family support at Ansar English School in Perumpilavu, Thrissur.",
        keywords:
          "school counseling, student wellbeing, mental health support, academic guidance, Ansar English School",
      },
      "/counseling",
    );
  }, []);

  return (
    <Layout fullWidth>
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.35),transparent_32%),radial-gradient(circle_at_85%_65%,rgba(14,165,233,0.25),transparent_30%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
              Campus Life · Student Wellbeing
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Supporting Every Student’s Mind, Growth, and Wellbeing.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
              The Guidance &amp; Counseling Department offers thoughtful,
              confidential support that helps students thrive academically,
              socially, and emotionally.
            </p>
            <a
              href="mailto:ansarmedia@ansarschool.in?subject=Guidance%20and%20Counseling%20Appointment%20Request"
              className="mt-8 inline-flex items-center rounded-xl bg-emerald-400 px-6 py-3.5 font-bold text-slate-950 shadow-lg transition hover:bg-emerald-300"
            >
              Request a private appointment
            </a>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <svg
                className="h-9 w-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-8.5c.7 1.5 1.85 2.25 3.5 2.25s2.8-.75 3.5-2.25M9 9h.01M15 9h.01"
                />
              </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-200">
              A safe place to be heard
            </p>
            <p className="mt-3 text-xl font-bold leading-relaxed text-white">
              Care is guided by respect, privacy, and each student’s best
              interests.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              About the department
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Guidance for the whole student journey.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-slate-600">
            At Ansar English School, student wellbeing is central to meaningful
            learning. Our department supports students as they navigate academic
            demands, personal growth, friendships, family transitions, and
            future choices. We work alongside parents and educators to identify
            the right support at the right time.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
              Services provided
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Practical support, delivered with care.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {services.map(([title, text], index) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-800">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-xl font-black text-slate-900">
                  {title}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
          Meet the counselors
        </p>
        <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
          A connected team around every learner.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {team.map(([name, role, text]) => (
            <article
              key={name}
              className="rounded-3xl border border-slate-200 p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-emerald-300">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  />
                </svg>
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-emerald-700">
                {role}
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                {name}
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-emerald-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-white/20 bg-white/10 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-200">
              Confidential help
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Ready to begin a conversation?
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-emerald-50">
              Students and parents may request a private appointment through the
              school office. Please share only the details needed to arrange a
              suitable time. For an immediate emergency, contact local emergency
              services.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href="mailto:ansarmedia@ansarschool.in?subject=Guidance%20and%20Counseling%20Appointment%20Request"
              className="rounded-xl bg-white px-6 py-3.5 text-center font-bold text-emerald-900 transition hover:bg-emerald-50"
            >
              Email the school office
            </a>
            <Link
              to="/contact"
              className="rounded-xl border border-white/40 px-6 py-3.5 text-center font-bold transition hover:bg-white/10"
            >
              School contact details
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
