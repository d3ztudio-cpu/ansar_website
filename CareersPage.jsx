import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase-init";
import Footer from "./Footer";

const empty = {
  fullName: "",
  dob: "",
  gender: "",
  mobile: "",
  email: "",
  address: "",
  qualification: "",
  additionalQualifications: "",
  institution: "",
  completionYear: "",
  experience: "",
  previousEmployment: "",
  skills: "",
  message: "",
};
const active = (j) =>
  j.published === true &&
  j.enabled !== false &&
  (!j.closingDate || j.closingDate >= new Date().toISOString().slice(0, 10));
const withTimeout = (promise, label, ms = 45000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `${label} timed out after 45 seconds. Please check your connection and try again.`,
            ),
          ),
        ms,
      ),
    ),
  ]);
const uploadFile = (fileRef, file, label) =>
  withTimeout(
    uploadBytes(fileRef, file).catch((error) => {
      throw new Error(`${label} failed: ${error.code || error.message}`);
    }),
    label,
  );
function Field({
  label,
  name,
  form,
  setForm,
  type = "text",
  required = false,
}) {
  const isDob = name === "dob";
  const change = (e) => {
    let value = e.target.value;
    if (isDob) {
      const digits = value.replace(/\\D/g, "").slice(0, 8);
      value =
        digits.length > 4
          ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
          : digits.length > 2
            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
            : digits;
    }
    setForm({ ...form, [name]: value });
  };
  const pickDate = (e) => {
    const value = e.target.value;
    if (value) {
      const [y, m, d] = value.split("-");
      setForm({ ...form, dob: `${d}/${m}/${y}` });
    }
  };
  const openCalendar = () => {
    const picker = document.getElementById("dob-calendar-picker");
    if (picker?.showPicker) picker.showPicker();
    else picker?.click();
  };
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
      <span className="relative mt-2 block">
        <input
          onClick={isDob ? openCalendar : undefined}
          required={required}
          type={isDob ? "text" : type}
          inputMode={isDob ? "numeric" : undefined}
          placeholder={isDob ? "DD/MM/YYYY" : undefined}
          maxLength={isDob ? 10 : undefined}
          pattern={isDob ? "\\d{2}/\\d{2}/\\d{4}" : undefined}
          value={form[name] || ""}
          onChange={change}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 outline-none focus:border-emerald-600"
        />
        {isDob && (
          <>
            <button
              type="button"
              aria-label="Open calendar"
              onClick={openCalendar}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 9h18" />
              </svg>
            </button>
            <input
              id="dob-calendar-picker"
              aria-label="Date calendar"
              type="date"
              onChange={pickDate}
              className="pointer-events-none absolute h-0 w-0 opacity-0"
            />
          </>
        )}
      </span>
    </label>
  );
}
export default function Careers() {
  const [jobs, setJobs] = useState([]),
    [selected, setSelected] = useState(null),
    [form, setForm] = useState(empty),
    [files, setFiles] = useState({}),
    [sent, setSent] = useState(null),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false),
    [copiedVacancy, setCopiedVacancy] = useState("");
  useEffect(() => {
    if (!sent) return undefined;
    const timer = window.setTimeout(() => {
      window.location.assign("https://ansarschool.in");
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [sent]);
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "careersVacancies"),
          where("published", "==", true),
          where("enabled", "==", true),
        ),
        (s) =>
          setJobs(
            s.docs.map((d) => ({ id: d.id, ...d.data() })).filter(active),
          ),
        () => setJobs([]),
      ),
    [],
  );
  useEffect(() => {
    const vacancyId = new URLSearchParams(window.location.search).get("vacancy");
    const sharedVacancy = jobs.find((job) => job.id === vacancyId);
    if (!sharedVacancy) return;
    setSelected(sharedVacancy);
    window.setTimeout(() => document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [jobs]);
  const vacancyLink = (job) => `${window.location.origin}/hiring?vacancy=${encodeURIComponent(job.id)}`;
  const copyVacancyLink = async (job) => {
    const link = vacancyLink(job);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedVacancy(job.id);
      window.setTimeout(() => setCopiedVacancy(""), 2000);
    } catch {
      window.prompt("Copy this vacancy link:", link);
    }
  };
  const shareVacancy = async (job) => {
    const link = vacancyLink(job);
    if (navigator.share) {
      try {
        await navigator.share({ title: `${job.title} | Ansar English School`, text: `View this vacancy at Ansar English School: ${job.title}`, url: link });
        return;
      } catch (shareError) {
        if (shareError?.name === "AbortError") return;
      }
    }
    await copyVacancyLink(job);
  };
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!files.resume || !files.photo)
      return setError(
        "Please attach both a PDF resume and a recent JPG/PNG photograph.",
      );
    if (files.resume.type !== "application/pdf")
      return setError(
        `Resume file type is ${files.resume.type || "unknown"}. Please choose a PDF file.`,
      );
    if (files.resume.size > 5 * 1024 * 1024)
      return setError(
        `Resume is ${(files.resume.size / 1024 / 1024).toFixed(2)} MB. The maximum allowed is 5 MB.`,
      );
    if (!/^image\/(jpeg|png)$/.test(files.photo.type))
      return setError(
        `Photograph file type is ${files.photo.type || "unknown"}. Please choose a JPG or PNG image.`,
      );
    if (files.photo.size > 2 * 1024 * 1024)
      return setError(
        `Photograph is ${(files.photo.size / 1024 / 1024).toFixed(2)} MB. The maximum allowed is 2 MB.`,
      );
    setSaving(true);
    try {
      const id = `AES-HR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const base = `careersApplications/${id}`;
      let resumeSnap, photoSnap;
      try {
        [resumeSnap, photoSnap] = await Promise.all([
          uploadFile(ref(storage, `${base}/resume.pdf`), files.resume, "Resume upload"),
          uploadFile(ref(storage, `${base}/photo`), files.photo, "Photograph upload"),
        ]);
      } catch (err) {
        throw new Error(`${err.message || "Required document upload failed."} Please check your connection and try again.`);
      }
      try {
        await withTimeout(
          setDoc(doc(db, "careersApplications", id), {
            ...form,
            vacancyId: selected.id,
            vacancyTitle: selected.title,
            applicationId: id,
            status: "New Application",
            resumePath: resumeSnap.ref.fullPath,
            photoPath: photoSnap.ref.fullPath,
            createdAt: serverTimestamp(),
          }),
          "Application save",
        );
      } catch (err) {
        throw new Error(
          `Application record could not be saved: ${err.code || err.message}. Please try again.`,
        );
      }
      setSent({ id, title: selected.title, submittedAt: new Date() });
    } catch (err) {
      setError(
        err.message ||
          "We could not submit your application. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };
  if (sent)
    return (
      <main className="min-h-screen bg-[#edf7f3] p-6 grid place-items-center">
        <section className="w-full max-w-xl rounded-[2rem] border border-emerald-100 bg-white p-8 text-center shadow-2xl sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
            <svg className="h-9 w-9 motion-safe:animate-[pulse_1.2s_ease-out_1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 2.5 2.5L16.5 9" />
            </svg>
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-[.25em] text-emerald-700">
            Ansar English School
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Your Application Has Been Submitted!
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Your application is successfully received and is currently under review. Our team will contact you shortly.
          </p>
          <div className="mt-7 rounded-2xl bg-[#073f42] p-5 text-left text-white shadow-lg">
            <p className="text-xs font-black uppercase tracking-[.2em] text-lime-300">Application reference</p>
            <p className="mt-2 break-all text-xl font-black tracking-wide">{sent.id}</p>
            <div className="mt-4 grid gap-2 border-t border-white/15 pt-4 text-sm text-teal-100">
              <p><span className="font-bold text-white">Position:</span> {sent.title}</p>
              <p><span className="font-bold text-white">Status:</span> Under Review</p>
              <p><span className="font-bold text-white">Submitted:</span> {sent.submittedAt.toLocaleDateString("en-GB")}</p>
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold text-slate-500">You will be redirected to the Ansar English School homepage in 5 seconds.</p>
          <button
            onClick={() => {
              setSent(null);
              setSelected(null);
            }}
            className="mt-6 rounded-xl bg-[#073f42] px-6 py-3 font-bold text-white"
          >
            Back to vacancies
          </button>
        </section>
      </main>
    );
  return (
    <main className="min-h-screen bg-[#f3f8f6] text-slate-900">
      <header className="relative overflow-hidden bg-[#073f42] px-6 py-20 text-white sm:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[.3em] text-lime-300">
            Ansar English School Â· Careers
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight sm:text-7xl">
            Build your future with Ansar.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-teal-100">
            Join our team of passionate educators and professionals. Be part of
            an institution committed to excellence in education.
          </p>
          <a
            href="#vacancies"
            className="mt-8 inline-block rounded-xl bg-lime-300 px-6 py-3 font-black text-slate-900"
          >
            Explore opportunities
          </a>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">
            Working at Ansar
          </p>
          <h2 className="mt-3 text-3xl font-black">
            Meaningful work, a supportive school community.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            At Ansar, every role contributes to a safe, curious and ambitious
            learning environment. We value collaboration, professional growth
            and the everyday impact of education.
          </p>
        </div>
        <div id="vacancies" className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">
                Open roles
              </p>
              <h2 className="mt-2 text-3xl font-black">Current vacancies</h2>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm">
              {jobs.length} positions
            </span>
          </div>
          {jobs.length ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {jobs.map((j) => (
                <article
                  key={j.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                        {j.category || "School operations"}
                      </p>
                      <h3 className="mt-2 text-2xl font-black">{j.title}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      {j.employmentType || "Full-time"}
                    </span>
                  </div>
                  <p className="mt-4 leading-7 text-slate-600">
                    {j.description}
                  </p>
                  <dl className="mt-5 grid gap-2 text-sm text-slate-600">
                    <div>
                      <dt className="inline font-black">Qualification: </dt>
                      <dd className="inline">{j.qualification}</dd>
                    </div>
                    <div>
                      <dt className="inline font-black">Experience: </dt>
                      <dd className="inline">{j.experience}</dd>
                    </div>
                    {j.closingDate && (
                      <div>
                        <dt className="inline font-black">Apply by: </dt>
                        <dd className="inline">{j.closingDate}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-7 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setSelected(j);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="col-span-3 rounded-xl bg-[#073f42] px-5 py-3 font-black text-white"
                    >
                      Apply now
                    </button>
                    <button
                      type="button"
                      onClick={() => copyVacancyLink(j)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                    >
                      {copiedVacancy === j.id ? "Copied!" : "Copy link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => shareVacancy(j)}
                      className="col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                    >
                      Share vacancy
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl bg-white p-10 text-center text-slate-500">
              There are no active vacancies at the moment. Please check back
              soon.
            </div>
          )}
        </div>
      </section>
      {selected && (
        <section id="application-form" className="border-t border-slate-200 bg-white px-6 py-16">
          <form onSubmit={submit} className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">
                  Application form
                </p>
                <h2 className="mt-2 text-3xl font-black">{selected.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-sm font-bold text-slate-500"
              >
                Close
              </button>
            </div>
            {error && (
              <p className="mt-6 rounded-xl bg-red-50 p-4 font-bold text-red-700">
                {error}
              </p>
            )}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                ["Full name", "fullName", "text", true],
                ["Date of birth", "dob", "date"],
                ["Mobile number", "mobile", "tel", true],
                ["Email address", "email", "email", true],
                ["Residential address", "address"],
                ["Highest qualification", "qualification", "text", true],
                ["Additional qualifications", "additionalQualifications"],
                ["Institution / university", "institution"],
                ["Year of completion", "completionYear"],
                ["Total work experience", "experience"],
                ["Previous employment", "previousEmployment"],
                ["Relevant skills", "skills"],
              ].map(([l, n, t, r]) => (
                <Field
                  key={n}
                  label={l}
                  name={n}
                  type={t}
                  required={r}
                  form={form}
                  setForm={setForm}
                />
              ))}
              <label className="text-sm font-bold text-slate-700">
                Resume / CV <span className="text-red-500">*</span>
                <input
                  required
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFiles({ ...files, resume: e.target.files[0] })
                  }
                  className="mt-2 block w-full rounded-xl border border-slate-200 p-3"
                />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Recent photograph <span className="text-red-500">*</span>
                <input
                  required
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) =>
                    setFiles({ ...files, photo: e.target.files[0] })
                  }
                  className="mt-2 block w-full rounded-xl border border-slate-200 p-3"
                />
              </label>
              <label className="sm:col-span-2 text-sm font-bold text-slate-700">
                Additional information
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows="4"
                  className="mt-2 w-full rounded-xl border border-slate-200 p-4"
                />
              </label>
            </div>
            <button
              disabled={saving}
              className="mt-8 rounded-xl bg-emerald-700 px-7 py-3 font-black text-white disabled:opacity-50"
            >
              {saving ? "Submitting Application..." : "Submit application"}
            </button>
          </form>
        </section>
      )}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
              Why Ansar
            </p>
            <h2 className="mt-3 text-xl font-black">
              A place to grow with purpose.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Work alongside committed educators and support a diverse school
              community where learning, care and professional excellence are
              part of every day.
            </p>
          </article>
          <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
              Our workplace
            </p>
            <h2 className="mt-3 text-xl font-black">
              Collaborative and learner-centred.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              From classrooms and laboratories to administration and campus
              services, every team member contributes to a safe, inclusive and
              future-ready learning environment.
            </p>
          </article>
          <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
              How it works
            </p>
            <h2 className="mt-3 text-xl font-black">
              A clear recruitment journey.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Submit your details and documents for an active role. Our HR team
              reviews applications, shortlists suitable candidates and contacts
              selected applicants for the next stage.
            </p>
          </article>
        </div>
        <div className="mt-10 rounded-[1.75rem] bg-emerald-50 p-7 sm:p-10">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Application process
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-4">
            {[
              ["01", "Explore", "Review the role and requirements."],
              [
                "02",
                "Apply",
                "Submit your details, photograph and PDF resume.",
              ],
              [
                "03",
                "Review",
                "HR evaluates applications and updates the status.",
              ],
              [
                "04",
                "Connect",
                "Shortlisted candidates are contacted for interview.",
              ],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span className="text-2xl font-black text-emerald-700">
                  {n}
                </span>
                <h3 className="mt-2 font-black">{t}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
