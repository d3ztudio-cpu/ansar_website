import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "./firebase-init";
import { db } from "./firebase-init";

const statuses = [
  "New Application",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];
const blank = {
  title: "",
  category: "Teaching",
  description: "",
  qualification: "",
  experience: "",
  employmentType: "Full-time",
  closingDate: "",
  enabled: true,
  published: false,
};
const candidatePhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.length === 10 ? `91${digits}` : digits;
};
const openWhatsAppStatusMessage = (application, status) => {
  const phone = candidatePhone(application.mobile);
  if (!phone) return;
  const message = `Dear ${application.fullName || "Candidate"}, your application for ${application.vacancyTitle || "the position"} at Ansar English School is now marked as: ${status}. Our HR team will contact you with the next steps. Application reference: ${application.applicationId || application.id}.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export default function AdminCareersFixed() {
  const [jobs, setJobs] = useState([]),
    [apps, setApps] = useState([]),
    [form, setForm] = useState(blank),
    [editing, setEditing] = useState(null),
    [tab, setTab] = useState("overview"),
    [search, setSearch] = useState(""),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  useEffect(() => {
    const unsubJobs = onSnapshot(
      collection(db, "careersVacancies"),
      (snap) =>
        setJobs(
          snap.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort((a, b) =>
              String(b.createdAt?.toMillis?.() || "").localeCompare(
                String(a.createdAt?.toMillis?.() || ""),
              ),
            ),
        ),
      (err) => setError(`Vacancies could not be loaded: ${err.message}`),
    );
    const unsubApps = onSnapshot(
      collection(db, "careersApplications"),
      (snap) =>
        setApps(
          snap.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort((a, b) =>
              String(b.createdAt?.toMillis?.() || "").localeCompare(
                String(a.createdAt?.toMillis?.() || ""),
              ),
            ),
        ),
      (err) => setError(`Applications could not be loaded: ${err.message}`),
    );
    return () => {
      unsubJobs();
      unsubApps();
    };
  }, []);
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, "careersVacancies", editing), data);
      else
        await addDoc(collection(db, "careersVacancies"), {
          ...data,
          createdAt: serverTimestamp(),
        });
      setForm(blank);
      setEditing(null);
      setTab("jobs");
    } catch (err) {
      setError(`Vacancy could not be saved: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };
  const removeVacancy = async (job) => {
    const applicationCount = apps.filter((item) => item.vacancyId === job.id).length;
    const message = applicationCount
      ? `Delete “${job.title}”? This will remove the vacancy from the admin panel and public careers page. Its ${applicationCount} application${applicationCount === 1 ? "" : "s"} will be kept. This cannot be undone.`
      : `Delete “${job.title}”? This will permanently remove the vacancy. This cannot be undone.`;
    if (!window.confirm(message)) return;

    setError("");
    try {
      await deleteDoc(doc(db, "careersVacancies", job.id));
      if (editing === job.id) {
        setEditing(null);
        setForm(blank);
      }
    } catch (err) {
      setError(`Vacancy could not be deleted: ${err.message}`);
    }
  };
  const filtered = useMemo(
    () =>
      apps.filter((item) =>
        `${item.fullName || ""} ${item.applicationId || ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [apps, search],
  );
  return (
    <div className="space-y-7">
      <div className="rounded-[1.75rem] bg-gradient-to-br from-[#073f42] via-[#0d5360] to-[#163d4b] p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[.25em] text-lime-300">
            Careers & Recruitment
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Hiring workspace
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-teal-100">Manage vacancies, review candidate applications and keep the recruitment process moving.</p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-2xl bg-white/10 p-1.5">
          <button
            onClick={() => setTab("overview")}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${tab === "overview" ? "bg-white text-[#073f42]" : "text-white hover:bg-white/15"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab("jobs")}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${tab === "jobs" ? "bg-amber-300 text-[#073f42]" : "text-white hover:bg-white/15"}`}
          >
            Vacancies
          </button>
          <button
            onClick={() => setTab("apps")}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${tab === "apps" ? "bg-amber-300 text-[#073f42]" : "text-white hover:bg-white/15"}`}
          >
            Applications
          </button>
        </div>
        </div>
      </div>
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </p>
      )}
      {tab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Published vacancies",
              jobs.filter((j) => j.published && j.enabled !== false).length,
            ],
            ["Total applications", apps.length],
            [
              "New applications",
              apps.filter((a) => a.status === "New Application").length,
            ],
            [
              "Shortlisted",
              apps.filter((a) => a.status === "Shortlisted").length,
            ],
          ].map((item) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              key={item[0]}
            >
              <p className="text-xs font-black uppercase text-slate-500">
                {item[0]}
              </p>
              <p className="mt-2 text-4xl font-black text-[#073f42]">
                {item[1]}
              </p>
            </div>
          ))}
        </div>
      )}
      {tab === "jobs" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <form
            onSubmit={save}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-2 border-b border-slate-100 pb-4"><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Vacancy setup</p><h2 className="mt-1 text-xl font-black">
              {editing ? "Edit vacancy" : "Add vacancy"}
            </h2></div>
            {[
              ["title", "Job title"],
              ["category", "Department / category"],
              ["description", "Short job description"],
              ["qualification", "Required qualification"],
              ["experience", "Required experience"],
              ["closingDate", "Closing date"],
            ].map(([name, label]) => (
              <label className="block text-sm font-bold" key={name}>
                {label}
                <input
                  required={name !== "closingDate"}
                  type={name === "closingDate" ? "date" : "text"}
                  value={form[name] || ""}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  className="mt-1 w-full rounded-lg border p-3"
                />
              </label>
            ))}
            <select
              value={form.employmentType}
              onChange={(e) =>
                setForm({ ...form, employmentType: e.target.value })
              }
              className="w-full rounded-lg border p-3"
            >
              <option>Full-time</option>
              <option>Temporary</option>
              <option>Contract</option>
            </select>
            <label className="flex gap-2 font-bold">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Publish vacancy
            </label>
            <label className="flex gap-2 font-bold">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) =>
                  setForm({ ...form, enabled: e.target.checked })
                }
              />
              Public ON
            </label>
            <button
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-5 py-3 font-black text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save vacancy"}
            </button>
          </form>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                key={job.id}
              >
                <div>
                  <div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${job.published && job.enabled !== false ? "bg-emerald-500" : "bg-slate-300"}`} /><p className="font-black">{job.title}</p></div>
                  <p className="text-sm text-slate-500">
                    {job.published && job.enabled !== false
                      ? "Published"
                      : "Draft / hidden"}{" "}
                    · {apps.filter((a) => a.vacancyId === job.id).length}{" "}
                    applications
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(job.id);
                      setForm({ ...blank, ...job });
                    }}
                    className="rounded-lg border px-3 py-2 text-sm font-bold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeVacancy(job)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "apps" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/80 p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Candidate pipeline</p><h2 className="mt-1 text-xl font-black text-slate-900">Applications <span className="text-emerald-700">({filtered.length})</span></h2></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">Live updates</span></div>
            <input
              placeholder="Search candidate or application ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#073f42] text-white">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr className="border-t border-slate-100 transition hover:bg-emerald-50/40" key={item.id}>
                    <td className="p-4 font-bold text-emerald-700">
                      {item.applicationId}
                    </td>
                    <td className="p-4">
                      <b>{item.fullName}</b>
                      <span className="block text-xs text-slate-500">
                        {item.email}
                      </span>
                    </td>
                    <td className="p-4">{item.vacancyTitle}</td>
                    <td className="p-4">
                      <select
                        value={item.status}
                        onChange={async (e) => {
                          const nextStatus = e.target.value;
                          try {
                            await updateDoc(doc(db, "careersApplications", item.id), {
                              status: nextStatus,
                              statusUpdatedAt: serverTimestamp(),
                            });
                            openWhatsAppStatusMessage(item, nextStatus);
                          } catch (err) {
                            setError(`Application status could not be updated: ${err.message}`);
                          }
                        }}
                        className="rounded-lg border p-2"
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <p className="p-10 text-center text-slate-500">
                No applications found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
