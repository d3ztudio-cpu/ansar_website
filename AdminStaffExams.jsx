import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase-init";
import * as XLSX from "xlsx";
import {
  googleExportUrl,
  loadGoogleSheetQuestions,
  normalizeAnswer,
  parseQuizText,
} from "./quizUtils";

export default function AdminStaffExams() {
  const [staff, setStaff] = useState({
      staffCode: "",
      name: "",
      phoneNumber: "",
    }),
    [controller, setController] = useState(""),
    [search, setSearch] = useState("");
  const [exam, setExam] = useState({
      title: "",
      durationMinutes: 30,
      timingMode: "exam",
      questionSeconds: 20,
      instructions: "Answer every question. Your time begins when you start.",
    }),
    [text, setText] = useState(""),
    [sheetUrl, setSheetUrl] = useState(""),
    [preview, setPreview] = useState([]),
    [sessions, setSessions] = useState([]),
    [activeId, setActiveId] = useState(""),
    [participants, setParticipants] = useState([]),
    [message, setMessage] = useState("");
  const [directory, setDirectory] = useState([]),
    [staffImportPreview, setStaffImportPreview] = useState([]),
    [staffImportMessage, setStaffImportMessage] = useState(""),
    [liveAnswers, setLiveAnswers] = useState({}),
    [livePoints, setLivePoints] = useState({}),
    [deletingStaffCode, setDeletingStaffCode] = useState(""),
    [deletingExam, setDeletingExam] = useState(false);
  useEffect(
    () =>
      onSnapshot(collection(db, "staffDirectory"), (snap) =>
        setDirectory(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      ),
    [],
  );
  useEffect(
    () =>
      onSnapshot(collection(db, "staffExamSessions"), (snap) =>
        setSessions(
          snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
            ),
        ),
      ),
    [],
  );
  useEffect(() => {
    if (!activeId) return;
    return onSnapshot(
      collection(db, "staffExamSessions", activeId, "participants"),
      (snap) =>
        setParticipants(
          snap.docs.map((d) => {
            const data = { id: d.id, ...d.data() };
            return {
              ...data,
              status: `${data.status} · Live ${liveScore(data)} pts`,
            };
          }),
        ),
    );
  }, [activeId, liveAnswers, livePoints]);
  useEffect(() => {
    if (!activeId) return;
    return onSnapshot(
      collection(db, "staffExamSessions", activeId, "answers"),
      (snap) =>
        setLiveAnswers(
          Object.fromEntries(
            snap.docs.map((item) => [
              item.id,
              item.data().normalizedAnswer || item.data().answer,
            ]),
          ),
        ),
    );
  }, [activeId]);
  useEffect(() => {
    if (!activeId) return;
    return onSnapshot(
      collection(db, "staffExamSessions", activeId, "questions"),
      (snap) =>
        setLivePoints(
          Object.fromEntries(
            snap.docs.map((item) => [item.id, Number(item.data().points || 1)]),
          ),
        ),
    );
  }, [activeId]);
  const active = sessions.find((x) => x.id === activeId);
  const visible = useMemo(
    () =>
      directory.filter((x) =>
        `${x.staffCode} ${x.name} ${x.phoneNumber}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [directory, search],
  );
  const liveScore = (participant) =>
    Object.entries(participant.answers || {}).reduce(
      (sum, [questionId, answer]) =>
        sum +
        (normalizeAnswer(answer) ===
        normalizeAnswer(liveAnswers[questionId] || "")
          ? livePoints[questionId] || 1
          : 0),
      0,
    );
  const portalLink = active
    ? `${window.location.origin}/ansar-media-production/add-ons/online-quiz/staff?exam=${encodeURIComponent(active.id)}`
    : "";
  const copyPortalLink = async () => {
    try {
      await navigator.clipboard.writeText(portalLink);
      setMessage("Exam portal link copied. Share it after opening the lobby.");
    } catch {
      setMessage("Copy the exam portal link shown below.");
    }
  };
  const saveStaff = async (e) => {
    e.preventDefault();
    const code = staff.staffCode.trim().toUpperCase();
    try {
      await setDoc(
        doc(db, "staffDirectory", code),
        {
          staffCode: code,
          name: staff.name.trim(),
          phoneNumber: staff.phoneNumber.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      setStaff({ staffCode: "", name: "", phoneNumber: "" });
      setStaffImportMessage(`Staff record ${code} saved.`);
    } catch (error) {
      setStaffImportMessage(
        error.message || "Could not save the staff record.",
      );
    }
  };
  const removeStaff = async (record) => {
    if (
      !window.confirm(
        `Remove ${record.name} (${record.staffCode}) from the private staff directory? They will not be able to create a new exam profile using this code.`,
      )
    )
      return;
    setDeletingStaffCode(record.staffCode);
    try {
      await deleteDoc(doc(db, "staffDirectory", record.staffCode));
      setStaffImportMessage(
        `${record.staffCode} was removed from the staff directory.`,
      );
    } catch (error) {
      setStaffImportMessage(
        error.message || "Could not remove that staff record.",
      );
    } finally {
      setDeletingStaffCode("");
    }
  };
  const importStaffFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const rows = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        { defval: "" },
      );
      const normalized = rows
        .map((row) => {
          const values = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key.toLowerCase().replace(/[^a-z0-9]/g, ""),
              String(value).trim(),
            ]),
          );
          return {
            staffCode: (values.staffcode || values.code || "").toUpperCase(),
            name: values.name || values.fullname || values.staffname || "",
            phoneNumber:
              values.phonenumber ||
              values.phone ||
              values.mobile ||
              values.mobilenumber ||
              "",
          };
        })
        .filter((row) => row.staffCode || row.name || row.phoneNumber);
      const invalid = normalized.filter(
        (row) => !row.staffCode || !row.name || !row.phoneNumber,
      );
      const unique = [
        ...new Map(
          normalized
            .filter((row) => row.staffCode && row.name && row.phoneNumber)
            .map((row) => [row.staffCode, row]),
        ).values(),
      ];
      if (!unique.length)
        throw new Error(
          "No valid staff records found. Add Staff Code, Name, and Phone Number columns.",
        );
      setStaffImportPreview(unique);
      setStaffImportMessage(
        `${unique.length} staff records ready to import${invalid.length ? `; ${invalid.length} incomplete row(s) skipped` : ""}.`,
      );
    } catch (error) {
      setStaffImportPreview([]);
      setStaffImportMessage(
        error.message ||
          "Could not read that file. Upload a CSV, XLS, or XLSX file.",
      );
    } finally {
      event.target.value = "";
    }
  };
  const saveStaffImport = async () => {
    if (!staffImportPreview.length) return;
    try {
      for (let start = 0; start < staffImportPreview.length; start += 450) {
        const batch = writeBatch(db);
        staffImportPreview.slice(start, start + 450).forEach((record) =>
          batch.set(
            doc(db, "staffDirectory", record.staffCode),
            {
              ...record,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          ),
        );
        await batch.commit();
      }
      setStaffImportMessage(
        `${staffImportPreview.length} staff records imported successfully.`,
      );
      setStaffImportPreview([]);
    } catch (error) {
      setStaffImportMessage(
        error.message || "Staff import could not be saved.",
      );
    }
  };
  const addController = async (e) => {
    e.preventDefault();
    const email = controller.trim().toLowerCase();
    await setDoc(doc(db, "staffExamControllers", email), {
      email,
      role: "coordinator",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setController("");
  };
  const loadPreview = (value) => {
    try {
      const questions = parseQuizText(value);
      if (!questions.length) throw new Error("No valid questions found.");
      setText(value);
      setPreview(questions);
      setMessage(`${questions.length} questions are ready to import.`);
    } catch (error) {
      setPreview([]);
      setMessage(error.message);
    }
  };
  const importFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const csv = XLSX.utils.sheet_to_csv(
        workbook.Sheets[workbook.SheetNames[0]],
      );
      loadPreview(csv);
    } catch {
      setMessage(
        "Could not read that file. Upload a CSV, XLS, or XLSX file using the question template.",
      );
    } finally {
      event.target.value = "";
    }
  };
  const importGoogle = async () => {
    try {
      setMessage("Importing Google Sheet…");
      let questions = await loadGoogleSheetQuestions(sheetUrl);
      if (!questions) {
        const response = await fetch(googleExportUrl(sheetUrl));
        if (!response.ok)
          throw new Error(
            "Google could not open this file. Set the link to Anyone with the link can view.",
          );
        questions = parseQuizText(await response.text());
      }
      if (!questions.length) throw new Error("No valid questions found.");
      setPreview(questions);
      setText("");
      setMessage(`${questions.length} questions imported from Google Sheets.`);
    } catch (error) {
      setPreview([]);
      setMessage(error.message);
    }
  };
  const create = async (e) => {
    e.preventDefault();
    const questions = preview.length
      ? preview
      : (() => {
          try {
            return parseQuizText(text);
          } catch {
            return [];
          }
        })();
    if (!questions.length)
      return setMessage(
        "Import a CSV/Excel file, Google Sheet, or paste questions first.",
      );
    const ref = await addDoc(collection(db, "staffExamSessions"), {
      title: exam.title.trim(),
      durationMinutes: Number(exam.durationMinutes),
      timingMode: exam.timingMode,
      questionSeconds:
        exam.timingMode === "per-question"
          ? Math.min(300, Math.max(5, Number(exam.questionSeconds) || 20))
          : null,
      instructions: exam.instructions.trim(),
      status: "draft",
      questionCount: questions.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const batch = writeBatch(db);
    questions.forEach((q, i) => {
      batch.set(doc(db, "staffExamSessions", ref.id, "questions", q.id), {
        question: q.question,
        options: q.options,
        type: q.type,
        points: Number(q.points) || 1,
        order: i,
      });
      batch.set(doc(db, "staffExamSessions", ref.id, "answers", q.id), {
        answer: q.answer,
        normalizedAnswer: normalizeAnswer(q.answer),
        points: Number(q.points) || 1,
      });
    });
    await batch.commit();
    setActiveId(ref.id);
    setPreview([]);
    setMessage(
      "Staff exam draft created. Select it below to copy its participant portal link.",
    );
  };
  const setStatus = (status) =>
    status === "ended"
      ? publishResults()
      : updateDoc(doc(db, "staffExamSessions", activeId), {
          status,
          [`${status}At`]: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
  const publishResults = async () => {
    if (!activeId) return;
    try {
      setMessage("Calculating and publishing results…");
      const [answerSnap, questionSnap, participantSnap] = await Promise.all([
        getDocs(collection(db, "staffExamSessions", activeId, "answers")),
        getDocs(collection(db, "staffExamSessions", activeId, "questions")),
        getDocs(collection(db, "staffExamSessions", activeId, "participants")),
      ]);
      const pointsByQuestion = Object.fromEntries(
        questionSnap.docs.map((item) => [
          item.id,
          Number(item.data().points || 1),
        ]),
      );
      const questionsById = Object.fromEntries(
        questionSnap.docs.map((item) => [item.id, item.data()]),
      );
      const answerMap = Object.fromEntries(
        answerSnap.docs.map((item) => [
          item.id,
          { ...item.data(), points: pointsByQuestion[item.id] || 1 },
        ]),
      );
      const batch = writeBatch(db);
      participantSnap.docs.forEach((item) => {
        const participant = item.data();
        const attended = Object.values(participant.answers || {}).filter(
          Boolean,
        ).length;
        const correct = Object.entries(participant.answers || {}).filter(
          ([questionId, answer]) =>
            String(answer).trim().toLowerCase() ===
            String(
              answerMap[questionId]?.normalizedAnswer ||
                answerMap[questionId]?.answer ||
                "",
            )
              .trim()
              .toLowerCase(),
        ).length;
        const score = Object.entries(participant.answers || {}).reduce(
          (sum, [questionId, answer]) =>
            sum +
            (String(answer).trim().toLowerCase() ===
            String(
              answerMap[questionId]?.normalizedAnswer ||
                answerMap[questionId]?.answer ||
                "",
            )
              .trim()
              .toLowerCase()
              ? Number(answerMap[questionId]?.points || 1)
              : 0),
          0,
        );
        const total = Object.values(answerMap).reduce(
          (sum, answer) => sum + Number(answer.points || 1),
          0,
        );
        const review = questionSnap.docs.map((item) => {
          const question = questionsById[item.id];
          const chosenAnswer = participant.answers?.[item.id] || "";
          const correctAnswer = answerMap[item.id]?.answer || "";
          return {
            question: question.question,
            chosenAnswer,
            correctAnswer,
            correct:
              normalizeAnswer(chosenAnswer) === normalizeAnswer(correctAnswer),
            points: Number(question.points || 1),
          };
        });
        batch.update(item.ref, {
          score,
          total,
          attended,
          correct,
          failed: attended - correct,
          review,
          status: "scored",
          scoredAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      batch.update(doc(db, "staffExamSessions", activeId), {
        status: "ended",
        endedAt: serverTimestamp(),
        resultsPublishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
      setMessage(
        "Results published. Staff can view and download their report cards.",
      );
    } catch (error) {
      setMessage(error.message || "Could not publish results.");
    }
  };
  const deleteExam = async () => {
    if (!activeId || !active || active.status === "running") return;
    if (
      !window.confirm(
        `Permanently delete “${active.title}” and all of its questions, answer key, and participant records? This cannot be undone.`,
      )
    )
      return;
    setDeletingExam(true);
    try {
      for (const child of ["questions", "answers", "participants"]) {
        const snapshot = await getDocs(
          collection(db, "staffExamSessions", activeId, child),
        );
        for (let start = 0; start < snapshot.docs.length; start += 450) {
          const batch = writeBatch(db);
          snapshot.docs
            .slice(start, start + 450)
            .forEach((item) => batch.delete(item.ref));
          await batch.commit();
        }
      }
      await deleteDoc(doc(db, "staffExamSessions", activeId));
      setActiveId("");
      setParticipants([]);
      setMessage("Exam and its associated private records were deleted.");
    } catch (error) {
      setMessage(
        error.message ||
          "Could not delete this exam. No further records were removed.",
      );
    } finally {
      setDeletingExam(false);
    }
  };
  const downloadParticipantReport = async () => {
    if (!active) return;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("l", "mm", "a4");
    const date = (value) =>
      value?.toDate ? value.toDate().toLocaleString("en-IN") : "—";
    pdf.setFillColor(49, 46, 129);
    pdf.rect(0, 0, 297, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(19);
    pdf.text("ANSAR ENGLISH SCHOOL", 15, 13);
    pdf.setFontSize(10);
    pdf.text("STAFF ONLINE EXAM · PARTICIPANT RESULT REPORT", 15, 21);
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(15);
    pdf.text(active.title || "Staff Online Exam", 15, 42);
    pdf.setFontSize(9);
    pdf.text(
      `${active.questionCount || 0} questions · ${active.durationMinutes || 0} minutes · Generated ${new Date().toLocaleString("en-IN")}`,
      15,
      49,
    );
    const cols = [
      { t: "No.", x: 15 },
      { t: "Staff member", x: 29 },
      { t: "Code", x: 87 },
      { t: "Started at", x: 113 },
      { t: "Correct", x: 171 },
      { t: "Wrong", x: 191 },
      { t: "Score", x: 211 },
      { t: "Status", x: 235 },
    ];
    let y = 60;
    const header = () => {
      pdf.setFillColor(226, 232, 240);
      pdf.rect(12, y - 5, 262, 8, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(31, 41, 55);
      cols.forEach((col) => pdf.text(col.t, col.x, y));
      y += 7;
    };
    header();
    participants.forEach((item, index) => {
      if (y > 190) {
        pdf.addPage();
        y = 18;
        header();
      }
      const values = [
        index + 1,
        item.name || "—",
        item.staffCode || "—",
        date(item.startedAt),
        item.correct ?? 0,
        item.failed ?? 0,
        `${item.score ?? 0}/${item.total ?? 0}`,
        item.status || "—",
      ];
      pdf.setFillColor(
        index % 2 ? 248 : 255,
        index % 2 ? 250 : 255,
        index % 2 ? 252 : 255,
      );
      pdf.rect(12, y - 5, 262, 8, "F");
      pdf.setFontSize(8);
      values.forEach((value, i) =>
        pdf.text(
          String(value).slice(0, i === 1 || i === 3 ? 30 : 18),
          cols[i].x,
          y,
        ),
      );
      y += 8;
    });
    if (!participants.length) {
      pdf.setFontSize(10);
      pdf.text("No participants have joined this exam.", 15, y + 8);
    }
    pdf.save(
      `Ansar-${(active.title || "staff-exam").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-results.pdf`,
    );
  };
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-indigo-700">
          Media Add-ons
        </p>
        <h2 className="mt-2 text-3xl font-black">Staff Online Exam control</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Manage verified staff, publish controlled exam sessions, and monitor
          participation from one private workspace.
        </p>
      </section>
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={saveStaff}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <h3 className="text-xl font-black">Add or update staff record</h3>
          <div className="mt-4 grid gap-3">
            <input
              required
              placeholder="Staff code"
              value={staff.staffCode}
              onChange={(e) =>
                setStaff({ ...staff, staffCode: e.target.value })
              }
              className="rounded-xl border p-3"
            />
            <input
              required
              placeholder="Full name"
              value={staff.name}
              onChange={(e) => setStaff({ ...staff, name: e.target.value })}
              className="rounded-xl border p-3"
            />
            <input
              required
              placeholder="Registered phone number"
              value={staff.phoneNumber}
              onChange={(e) =>
                setStaff({ ...staff, phoneNumber: e.target.value })
              }
              className="rounded-xl border p-3"
            />
          </div>
          <button className="mt-4 rounded-xl bg-emerald-700 px-5 py-3 font-black text-white">
            Save staff record
          </button>
        </form>
        <form
          onSubmit={addController}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <h3 className="text-xl font-black">Assign exam coordinator</h3>
          <p className="mt-2 text-sm text-slate-600">
            The assigned Google email can control staff exams and see live
            participant progress.
          </p>
          <input
            required
            type="email"
            placeholder="coordinator@ansar.in"
            value={controller}
            onChange={(e) => setController(e.target.value)}
            className="mt-4 w-full rounded-xl border p-3"
          />
          <button className="mt-4 rounded-xl bg-indigo-700 px-5 py-3 font-black text-white">
            Assign coordinator
          </button>
        </form>
      </div>
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">Staff directory</h3>
            <p className="mt-1 text-sm text-slate-600">
              Import a complete list, add one record at a time, or remove an
              obsolete record.
            </p>
          </div>
          <label className="cursor-pointer rounded-xl bg-indigo-700 px-4 py-3 font-black text-white">
            Import staff CSV / Excel
            <input
              type="file"
              accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={importStaffFile}
              className="hidden"
            />
          </label>
        </div>
        {staffImportPreview.length > 0 && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <b>{staffImportPreview.length} staff records ready</b>
                <p className="text-sm text-emerald-800">
                  Review the first records below, then save them to the private
                  staff directory.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStaffImportPreview([])}
                  className="rounded-lg border border-emerald-400 px-3 py-2 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveStaffImport}
                  className="rounded-lg bg-emerald-700 px-3 py-2 font-black text-white"
                >
                  Save imported staff
                </button>
              </div>
            </div>
            <div className="mt-3 max-h-40 overflow-auto rounded-lg bg-white p-3 text-sm">
              {staffImportPreview.slice(0, 20).map((row) => (
                <div key={row.staffCode}>
                  {row.staffCode} · {row.name} · {row.phoneNumber}
                </div>
              ))}
              {staffImportPreview.length > 20 && (
                <div className="mt-1 font-bold">
                  …and {staffImportPreview.length - 20} more
                </div>
              )}
            </div>
          </div>
        )}
        {staffImportMessage && (
          <p role="status" className="mt-3 font-bold text-indigo-700">
            {staffImportMessage}
          </p>
        )}
        <p className="mt-3 text-sm text-slate-500">
          File columns: <b>Staff Code</b>, <b>Name</b>, and <b>Phone Number</b>.
          CSV, XLS, and XLSX files are supported. Existing matching staff codes
          are updated.
        </p>
        <input
          aria-label="Search staff directory"
          placeholder="Search code, name, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full rounded-xl border p-3"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {visible.map((x) => (
            <div
              key={x.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
            >
              <div className="min-w-0">
                <b className="block truncate">{x.name}</b>
                <span className="text-sm">
                  {x.staffCode} · {x.phoneNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeStaff(x)}
                disabled={deletingStaffCode === x.staffCode}
                className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {deletingStaffCode === x.staffCode ? "Removing…" : "Remove"}
              </button>
            </div>
          ))}
          {!visible.length && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No staff records match this search.
            </p>
          )}
        </div>
      </section>
      <form onSubmit={create} className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black">Create staff exam</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder="Exam title"
            value={exam.title}
            onChange={(e) => setExam({ ...exam, title: e.target.value })}
            className="rounded-xl border p-3"
          />
          <label className="text-sm font-bold text-slate-700">
            Total exam duration (minutes)
            <input
              required
              type="number"
              min="1"
              max="360"
              value={exam.durationMinutes}
              onChange={(e) =>
                setExam({ ...exam, durationMinutes: e.target.value })
              }
              disabled={exam.timingMode === "per-question"}
              className="mt-1 w-full rounded-xl border p-3 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            />
          </label>
          <label className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
            Timer mode
            <select
              value={exam.timingMode}
              onChange={(e) => setExam({ ...exam, timingMode: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-base font-medium text-slate-900"
            >
              <option value="exam">One timer for the entire exam</option>
              <option value="per-question">Split time evenly per question</option>
            </select>
          </label>
        </div>
        {exam.timingMode === "per-question" && (
          <label className="mt-4 block max-w-sm text-sm font-bold text-slate-700">
            Seconds allowed for each question
            <input
              required
              type="number"
              min="5"
              max="300"
              value={exam.questionSeconds}
              onChange={(e) => setExam({ ...exam, questionSeconds: e.target.value })}
              className="mt-1 w-full rounded-xl border p-3"
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">Use a short limit such as 10 or 20 seconds.</span>
          </label>
        )}
        <p className="mt-3 text-sm text-slate-600">
          {exam.timingMode === "per-question"
            ? `Each question gets ${Math.min(300, Math.max(5, Number(exam.questionSeconds) || 20))} seconds. The overall session time is calculated from this limit; when time ends, the participant moves forward automatically.`
            : "Participants may use the total exam duration across questions in any order."}
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <label className="rounded-2xl border-2 border-dashed border-indigo-200 p-5 text-center font-bold text-indigo-800">
            Upload CSV / Excel
            <input
              type="file"
              accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={importFile}
              className="mt-3 block w-full text-sm"
            />
          </label>
          <div className="rounded-2xl border border-slate-200 p-5 lg:col-span-2">
            <label className="font-bold">
              Google Sheets sharing link
              <input
                type="url"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>
            <button
              type="button"
              onClick={importGoogle}
              disabled={!sheetUrl}
              className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-black text-white disabled:opacity-40"
            >
              Import Google Sheet
            </button>
          </div>
        </div>
        <details className="mt-5 rounded-xl bg-slate-50 p-4">
          <summary className="cursor-pointer font-black">
            Or paste / manually type CSV questions
          </summary>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setPreview([]);
            }}
            placeholder="Question,Option A,Option B,Option C,Option D,Answer&#10;What is 2+2?,3,4,5,6,4"
            className="mt-3 h-44 w-full rounded-xl border p-3 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => loadPreview(text)}
            className="mt-3 rounded-xl border border-indigo-300 px-4 py-2 font-bold text-indigo-700"
          >
            Preview pasted questions
          </button>
        </details>
        {preview.length > 0 && (
          <div className="mt-5 rounded-xl bg-emerald-50 p-4">
            <b>{preview.length} questions ready</b>
            <ol className="mt-2 max-h-36 list-decimal overflow-auto pl-5 text-sm">
              {preview.map((q) => (
                <li key={q.id}>{q.question}</li>
              ))}
            </ol>
          </div>
        )}
        <p className="mt-3 text-sm text-slate-500">
          Required columns: Question, Option A, Option B, Option C, Option D,
          Answer. Use the answer text or “Option A” through “Option D”.
        </p>
        <button className="mt-4 rounded-xl bg-indigo-700 px-5 py-3 font-black text-white">
          Save exam draft
        </button>
        {message && <p className="mt-3 font-bold text-indigo-700">{message}</p>}
      </form>
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">Exam session manager</h3>
            <p className="mt-1 text-sm text-slate-600">
              Open, run, complete, or securely remove past sessions.
            </p>
          </div>
          <select
            aria-label="Select staff exam"
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
            className="w-full rounded-xl border p-3 sm:w-auto"
          >
            <option value="">Select staff exam…</option>
            {sessions.map((x) => (
              <option key={x.id} value={x.id}>
                {x.title} · {x.status}
              </option>
            ))}
          </select>
        </div>
        {active && (
          <div className="mt-5">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-700">
                    {active.status}
                  </p>
                  <h4 className="mt-1 text-lg font-black">{active.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    {active.questionCount} questions · {active.durationMinutes}{" "}
                    minutes · {participants.length} joined
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("lobby")}
                    className="rounded-lg bg-amber-400 px-4 py-2 font-bold"
                  >
                    Open lobby
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("running")}
                    className="rounded-lg bg-emerald-700 px-4 py-2 font-bold text-white"
                  >
                    Start exam
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("ended")}
                    className="rounded-lg bg-slate-800 px-4 py-2 font-bold text-white"
                  >
                    End & publish
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-indigo-50 p-4">
              <p className="font-black text-indigo-950">
                Participant exam portal link
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Open the lobby, then share this link with registered staff. It
                takes them directly to this exam.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <input
                  readOnly
                  value={portalLink}
                  className="min-w-0 flex-1 rounded-lg border bg-white p-2 text-sm"
                />
                <button
                  type="button"
                  onClick={copyPortalLink}
                  className="rounded-lg bg-indigo-700 px-4 py-2 font-black text-white"
                >
                  Copy link
                </button>
              </div>
            </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-black">Joined participants ({participants.length})</h3>
            <button type="button" onClick={downloadParticipantReport} className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-black text-indigo-700 hover:bg-indigo-50">Download participant report (PDF)</button>
          </div>
            <div className="mt-3 divide-y">
              {participants.map((p) => (
                <div key={p.id} className="flex justify-between py-3">
                  <span>
                    <b>{p.name}</b> · {p.staffCode}
                  </span>
                  <span>
                    {p.progress || 0}/{active.questionCount} · {p.status}
                  </span>
                </div>
              ))}
              {!participants.length && (
                <p className="py-3 text-sm text-slate-500">
                  No staff members have joined yet.
                </p>
              )}
            </div>
            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-sm text-slate-500">
                Finished and draft sessions can be permanently removed. Running
                exams are protected from deletion.
              </p>
              <button
                type="button"
                onClick={deleteExam}
                disabled={deletingExam || active.status === "running"}
                className="mt-3 rounded-lg border border-red-200 px-4 py-2 font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingExam
                  ? "Deleting exam…"
                  : active.status === "running"
                    ? "Stop exam before deleting"
                    : "Delete this exam permanently"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
