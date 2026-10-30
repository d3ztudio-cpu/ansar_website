import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Layout from "./Layout";
import { db } from "./firebase-init";
import { useLocation } from "react-router-dom";

const LIBRARY_HOURS =
  "Mon – Fri: 8:30 AM – 5:00 PM\nSaturday: 8:30 AM – 4:00 PM";
const DEFAULT_LIBRARY = {
  title: "Ansar English School Library",
  subtitle: "Discover stories, ideas and learning beyond the classroom.",
  intro:
    "A welcoming space for readers, researchers and curious minds. Explore books, learning resources, films and the many moments that bring our library to life.",
  heroImageUrl: "",
  openingHours: LIBRARY_HOURS,
  contactEmail: "",
};
const LIBRARY_PROFILE =
  "Every library is the heart of an institution. The library provides the right information at the right time to the right person through books, dictionaries, encyclopedias, journals, magazines, newspapers and other e-resources. Ansar English School has 35,486 printed documents, subscribes to 14 magazines and six newspapers in English, Malayalam and other languages. Students and staff can access e-resources, and the library is a member of the National Digital Library of India. Our library is automated with KOHA software for barcode technology, circulation, acquisition, serial control and report generation.";
const LIBRARY_RULES = [
  "All students and staff of the school are members of the library.",
  "A student can borrow one book at a time for a period of one week.",
  "A staff member can borrow a maximum of eight books at a time for a period of one month.",
  "Books are issued to students during intervals. No book will be issued or returned during teaching hours.",
  "Marking, underlining or writing on library books, periodicals and newspapers is strictly forbidden.",
  "Reference books and current periodicals are not issued; they may be consulted in the library only.",
  "Late returns will be viewed seriously and a fine will be charged according to library rules.",
  "The librarian may call for a book at any time, even before the normal loan period has expired.",
  "A lost library card attracts a fine of ₹25.",
  "Anyone who misuses, wrongly handles or loses a book must replace it or pay its current market price.",
  "After reading, please return books, periodicals and newspapers to their respective places.",
  "Members must take good care of library furnishings and equipment.",
  "Students may bring only paper and a pen; personal belongings are not allowed in the library.",
  "Members must not sub-lend library books.",
  "Library computers are for academic purposes only. Do not tamper with settings; follow internet-safety guidelines.",
  "Each student must obtain a No Dues Certificate from the librarian when transferring or withdrawing.",
  "Strict order and silence must be maintained. Speak softly when necessary.",
];
const PUBLIC_TABS = [
  ["overview", "Home"],
  ["one-fact", "One Fact a Day"],
  ["new-arrivals", "New Arrivals"],
  ["question-papers", "Question Papers"],
  ["e-books", "E-Books"],
  ["e-learning", "E-Learning"],
  ["short-films", "Short Films"],
  ["creative-corner", "Creative Corner"],
  ["quizzes", "Quizzes"],
  ["events", "Events & Activities"],
  ["winners", "Winners & Gallery"],
  ["newspaper", "Clippings"],
  ["vocabulary", "Vocabulary"],
  ["opac", "OPAC"],
];
const TAB_POST_TYPES = {
  "new-arrivals": ["New Arrival", "Publication"],
  "question-papers": ["Question Paper"],
  "e-books": ["E-Book"],
  "e-learning": ["E-Learning"],
  "short-films": ["Short Film"],
  "creative-corner": ["Creative Corner"],
  quizzes: ["Quiz"],
  events: ["Event", "Activity"],
  winners: ["Winner"],
  newspaper: ["Clipping"],
  vocabulary: ["Vocabulary"],
};
const COLLECTIONS = [
  [
    "new-arrivals",
    "New arrivals",
    "Fresh reads waiting for their next reader.",
    "✦",
    "from-amber-400 to-orange-500",
  ],
  [
    "e-books",
    "E-books",
    "Read, learn and explore anywhere.",
    "▣",
    "from-emerald-500 to-teal-600",
  ],
  [
    "e-learning",
    "E-learning",
    "Trusted online learning resources.",
    "⌁",
    "from-sky-500 to-blue-600",
  ],
  [
    "short-films",
    "Short films",
    "Stories that make learning memorable.",
    "▶",
    "from-violet-500 to-indigo-600",
  ],
  [
    "creative-corner",
    "Creative Corner",
    "Stories, art and ideas from our school family.",
    "✦",
    "from-fuchsia-500 to-violet-600",
  ],
  [
    "question-papers",
    "Question papers",
    "Prepare with past papers and resources.",
    "⌘",
    "from-rose-500 to-pink-600",
  ],
  [
    "events",
    "Library life",
    "Activities, events and celebrations.",
    "✳",
    "from-lime-500 to-green-600",
  ],
];
const YOUTUBE_ID =
  /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const VIMEO_ID = /vimeo\.com\/(?:video\/)?\d+/;
function videoPreview(url, imageUrl) {
  const id = String(url || "").match(YOUTUBE_ID)?.[1];
  return imageUrl || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "");
}
function youtubeEmbedUrl(url) {
  const id = String(url || "").match(YOUTUBE_ID)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : "";
}
function imageUrl(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.url || value.downloadURL || "";
}
// Earlier Library uploads sometimes reached Firestore as an Announcement even
// when their link was a video. Treat those legacy entries as Short Films too.
function libraryType(post) {
  const canonical = String(post?.libraryCategory || "").trim().toLowerCase();
  const canonicalTypes = {
    new_arrival: "New Arrival", question_paper: "Question Paper", ebook: "E-Book",
    e_learning: "E-Learning", short_film: "Short Film", quiz: "Quiz",
    event: "Event", activity: "Activity", winner: "Winner", clipping: "Clipping",
    file: "File", vocabulary: "Vocabulary",
    creative_corner: "Creative Corner",
  };
  if (canonicalTypes[canonical]) return canonicalTypes[canonical];
  const type = String(post.type || "").trim();
  const text = `${post.title || ""} ${post.summary || ""} ${post.category || ""} ${post.venue || ""}`;
  // Event/activity is the owning section. Check it before the legacy
  // new-arrival metadata so older event posts cannot leak into arrivals.
  if (
    /event|activit/i.test(type) ||
    (/announcement/i.test(type) &&
      /book fair|event|activity|celebration|programme|program/i.test(text))
  )
    return type === "Activity" ? "Activity" : "Event";
  if (/^AES-E\d+$/i.test(String(post.bookNumber || "").trim())) return "E-Book";
  if (
    (["NEW", "EXISTING"].includes(String(post.bookStatus || "").toUpperCase()) ||
      type === "AnnouncementPublished") &&
    ["Announcement", "AnnouncementPublished", "Publication", "New Arrival"].includes(type)
  )
    return "New Arrival";
  if (/clipping|newspaper|press cutting|വാർത്ത/i.test(`${type} ${text}`))
    return "Clipping";
  if (
    (type === "Announcement" || type === "Video") &&
    (YOUTUBE_ID.test(String(post.linkUrl || "")) ||
      VIMEO_ID.test(String(post.linkUrl || "")))
  )
    return "Short Film";
  return type;
}
function isLibraryEventOrActivity(post) {
  const type = String(post?.type || "").trim();
  const text = `${post?.title || ""} ${post?.summary || ""} ${post?.category || ""} ${post?.venue || ""}`;
  return (
    /event|activit/i.test(type) ||
    (/announcement/i.test(type) &&
      /book fair|event|activity|celebration|programme|program/i.test(text))
  );
}
function isNewArrival(post) {
  const status = String(post.bookStatus ?? post.publicationStatus ?? post.status ?? "").trim().toUpperCase();
  if (status === "EXISTING") return false;
  if (["NEW", "NEW ARRIVAL", "NEW ARRIVAL PUBLISHED", "TRUE"].includes(status)) return true;
  return ["New Arrival", "Publication", "AnnouncementPublished"].includes(String(post.type || "").trim());
}
function postTime(post) {
  const date = Date.parse(post.date || "");
  return Number.isNaN(date) ? post.createdAt?.toMillis?.() || 0 : date;
}
function displayDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
}
function drivePreviewUrl(value) {
  const url = String(value || "");
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}
function factDateSearchText(value) {
  const raw = String(value || "").trim();
  const date = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw);
  if (Number.isNaN(date.getTime())) return raw.toLowerCase();
  const day = String(date.getDate());
  const year = String(date.getFullYear());
  const monthLong = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date).toLowerCase();
  const monthShort = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date).toLowerCase();
  return [
    raw,
    `${monthLong} ${day} ${year}`,
    `${monthShort} ${day} ${year}`,
    `${day} ${monthLong} ${year}`,
    `${day} ${monthShort} ${year}`,
    `${monthLong} ${day}`,
    `${monthShort} ${day}`,
    `${day} ${monthLong}`,
    `${day} ${monthShort}`,
    day,
    monthLong,
    monthShort,
    year,
  ].join(" ").toLowerCase();
}
function Arrow() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-6-6 6 6-6 6"
      />
    </svg>
  );
}

function ResourceCard({ post, film = false, onOpenArticle, bookMode = false, arrivalMode = false, fallbackBookNumber = "", forceArticle = false, featureMode = false }) {
  const image = film
    ? videoPreview(post.linkUrl, imageUrl(post.imageUrl) || imageUrl(post.imageUrls?.[0]))
    : imageUrl(post.imageUrl) || imageUrl(post.imageUrls?.[0]) || imageUrl(post.galleryImageUrl);
  const destination = post.linkUrl || post.fileUrl;
  const isClipping = libraryType(post) === "Clipping";
  const isCreative = libraryType(post) === "Creative Corner";
  const isBook = bookMode || libraryType(post) === "E-Book";
  const shouldOpenArticle = forceArticle || isClipping || isBook || isCreative;
  const Card = destination && !shouldOpenArticle ? "a" : "article";
  const props =
    destination && !shouldOpenArticle
      ? { href: destination, target: "_blank", rel: "noreferrer" }
      : {};
  return (
    <Card
      {...props}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div
        className={`relative ${film ? "aspect-video" : arrivalMode ? "" : featureMode ? "aspect-[4/5]" : "aspect-[4/5]"} overflow-hidden bg-slate-100`}
      >
        {image ? (
          <img
            src={image}
            alt=""
            className={`${arrivalMode ? "h-auto w-full" : "h-full w-full object-contain"} transition duration-500 group-hover:scale-[1.02]`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-950 to-slate-900 px-5 text-center text-xl font-extrabold leading-tight text-white">
            {film ? "▶" : post.title}
          </div>
        )}
        {film && (
          <span className="absolute inset-0 flex items-center justify-center bg-slate-950/10 text-3xl text-white transition group-hover:bg-slate-950/35">
            ▶
          </span>
        )}
        {arrivalMode && isNewArrival(post) && (
          <span className="absolute left-2 top-2 z-10 flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-full border-2 border-red-700 bg-red-600 text-[10px] font-black uppercase tracking-tight text-white shadow-lg ring-2 ring-white/90">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-white">NEW</span>
          </span>
        )}
        <span className={`absolute ${arrivalMode ? "right-3" : "left-3"} top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-800 shadow-sm`}>
          {film ? "Short Film" : libraryType(post)}
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${arrivalMode ? "p-3" : "p-5"}`}>
        {post.date && (
          <p className="text-xs font-bold text-slate-400">
            {displayDate(post.date)}
          </p>
        )}
        {post.author && (
          <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500">
            {post.author}
          </p>
        )}
        {isBook && <p className="mt-2 text-xs font-black uppercase tracking-widest text-emerald-700">Book no. {post.bookNumber || fallbackBookNumber || "Not assigned"}</p>}
        <h3 className={`mt-2 line-clamp-2 font-extrabold leading-snug text-slate-900 transition group-hover:text-emerald-700 ${arrivalMode ? "text-sm" : "text-lg"}`}>
          {post.title}
        </h3>
        {post.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {post.summary}
          </p>
        )}
        {(destination || isBook || isClipping || isCreative || forceArticle) &&
          (shouldOpenArticle ? (
            <button
              type="button"
              onClick={() => onOpenArticle?.(post)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-700"
            >
              {isBook ? "Open Book" : "Read more"} <Arrow />
            </button>
          ) : (
            <span className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-extrabold text-white transition group-hover:bg-emerald-700">
              {post.type === "E-Learning"
                ? "Open Portal"
                : film
                  ? "Watch now"
                  : "View"}{" "}
              <Arrow />
            </span>
          ))}
      </div>
    </Card>
  );
}
function EmptyState({ label }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
        ✦
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-slate-900">
        Nothing here yet
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        New {label.toLowerCase()} will appear here as soon as the library
        publishes them.
      </p>
    </div>
  );
}

export default function LibraryPage() {
  const location = useLocation();
  const [settings, setSettings] = useState(DEFAULT_LIBRARY);
  const [posts, setPosts] = useState([]);
  const [facts, setFacts] = useState([]);
  const [activeTab, setActiveTab] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get("tab");
    return requested === "one-fact" ||
      PUBLIC_TABS.some(([key]) => key === requested)
      ? requested
      : "overview";
  });
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [questionFilters, setQuestionFilters] = useState({ className: "", year: "", category: "", subject: "" });
  const [factLimit, setFactLimit] = useState(100000);
  const arrivalsScroller = useRef(null);
  const [arrivalsPaused, setArrivalsPaused] = useState(false);
  useEffect(() => {
    const requestedTab = new URLSearchParams(location.search).get("tab");
    if (
      requestedTab &&
      (requestedTab === "one-fact" ||
        PUBLIC_TABS.some(([key]) => key === requestedTab))
    )
      setActiveTab(requestedTab);
  }, [location.search]);
  useEffect(
    () =>
      onSnapshot(
        doc(db, "librarySettings", "main"),
        (shot) =>
          setSettings(
            shot.exists()
              ? {
                  ...DEFAULT_LIBRARY,
                  ...shot.data(),
                  openingHours: shot.data().openingHours || LIBRARY_HOURS,
                }
              : DEFAULT_LIBRARY,
          ),
        () => setSettings(DEFAULT_LIBRARY),
      ),
    [],
  );
  useEffect(
    () =>
      onSnapshot(
        // Public Firestore rules require this constraint for collection reads.
        query(collection(db, "libraryPosts"), where("published", "==", true)),
        (shot) =>
          setPosts(
            shot.docs
              .map((item) => ({ id: item.id, ...item.data() }))
              .sort((a, b) => postTime(b) - postTime(a)),
          ),
        () => setPosts([]),
      ),
    [],
  );
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "libraryOneFact"), where("published", "==", true)),
        (shot) =>
          setFacts(
            shot.docs
              .map((item) => ({ id: item.id, ...item.data() }))
              .sort((a, b) =>
                String(b.date || "").localeCompare(String(a.date || "")),
              ),
          ),
        () => setFacts([]),
      ),
    [],
  );
  const chooseTab = (tab) => {
    setActiveTab(tab);
    setSearch("");
    if (tab === "one-fact") setFactLimit(8);
    const params = new URLSearchParams(window.location.search);
    if (tab === "overview") params.delete("tab");
    else params.set("tab", tab);
    const nextQuery = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const term = search.trim().toLowerCase();
  const matches = (item) =>
    !term ||
    [
      item.title,
      item.summary,
      item.body,
      item.author,
      item.subject,
      item.bookNumber,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(term),
    );
  const tabPosts = useMemo(
    () =>
      (TAB_POST_TYPES[activeTab] || []).length
        ? posts.filter(
            (post) =>
              TAB_POST_TYPES[activeTab].includes(libraryType(post)) &&
              matches(post),
          )
        : [],
    [activeTab, posts, term],
  );
  const questionPapers = useMemo(() => {
    const source = posts.filter((post) => libraryType(post) === "Question Paper");
    const values = (key) => [...new Set(source.map((post) => String(post[key] || "").trim()).filter(Boolean))].sort();
    return { source, classes: values("className"), years: values("year"), categories: values("category"), subjects: values("subject") };
  }, [posts]);
  const filteredQuestionPapers = useMemo(() => questionPapers.source.filter((post) => {
    const matchesSearch = matches(post);
    return matchesSearch &&
      (!questionFilters.className || post.className === questionFilters.className) &&
      (!questionFilters.year || post.year === questionFilters.year) &&
      (!questionFilters.category || post.category === questionFilters.category) &&
      (!questionFilters.subject || post.subject === questionFilters.subject);
  }), [questionPapers.source, questionFilters, term]);
  const latest = useMemo(
    () => (term ? posts.filter(matches).slice(0, 12) : posts.filter((post) => libraryType(post) === "Vocabulary").slice(0, 1)),
    [posts, term],
  );
  const filteredFacts = useMemo(
    () => facts.filter((fact) =>
      !term || [factDateSearchText(fact.date), fact.title, fact.description]
        .some((value) => String(value || "").toLowerCase().includes(term)),
    ),
    [facts, term],
  );
  const films = posts.filter((post) => libraryType(post) === "Short Film");
  const newArrivals = posts.filter(
    (post) =>
      !isLibraryEventOrActivity(post) &&
      ["New Arrival", "Publication"].includes(libraryType(post)) &&
      !/event|activit|celebration|programme|program|book fair/i.test(
        `${post.title || ""} ${post.summary || ""} ${post.category || ""} ${post.venue || ""}`,
      ),
  );
  const libraryEvents = posts.filter((post) => libraryType(post) === "Event").slice(0, 3);
  const libraryActivities = posts.filter((post) => libraryType(post) === "Activity").slice(0, 3);
  const latestLibraryLife = posts
    .filter((post) => ["Event", "Activity"].includes(libraryType(post)))
    .sort((a, b) => postTime(b) - postTime(a))[0] || null;
  useEffect(() => {
    const scroller = arrivalsScroller.current;
    if (!scroller || newArrivals.length < 5 || arrivalsPaused) return undefined;
    let frame;
    const tick = () => {
      const loopWidth = scroller.scrollWidth / 2;
      scroller.scrollLeft += 0.75;
      if (loopWidth > 0 && scroller.scrollLeft >= loopWidth) {
        scroller.scrollLeft -= loopWidth;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [arrivalsPaused, newArrivals.length]);
  const activeLabel =
    PUBLIC_TABS.find(([key]) => key === activeTab)?.[1] || "Library";
  const creativeEntries = useMemo(() => posts.filter((post) => libraryType(post) === "Creative Corner" && post.published !== false), [posts]);
  const creativeStudents = creativeEntries.filter((post) => String(post.contributorType || post.category || "Student").toLowerCase() === "student");
  const creativeStaff = creativeEntries.filter((post) => String(post.contributorType || post.category || "Staff").toLowerCase() === "staff");
  return (
    <Layout fullWidth>
      <main className="min-h-screen bg-[#f7faf8] text-slate-900">
        <nav
          aria-label="Library navigation"
          className="border-b border-slate-200 bg-white shadow-sm"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:px-8 xl:grid-cols-7">
            {PUBLIC_TABS.map(([key, label]) =>
              key === "opac" ? (
                <a
                  key={key}
                  href="http://192.168.0.100/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 rounded-xl border border-amber-500 bg-amber-100 px-3 py-3 text-center text-sm font-extrabold leading-tight text-amber-900 shadow-sm transition hover:border-amber-600 hover:bg-amber-200 hover:text-amber-950"
                  title="Open the library management portal"
                >
                  {label}
                </a>
              ) : (
                <button
                  key={key}
                  type="button"
                  onClick={() => chooseTab(key)}
                  style={key === "creative-corner" ? (activeTab === key ? { background: "linear-gradient(90deg, #c026d3, #7c3aed)", borderColor: "#a21caf", color: "#ffffff" } : { background: "linear-gradient(90deg, #fdf4ff, #f5f3ff)", borderColor: "#d946ef", color: "#86198f" }) : undefined}
                  className={`min-w-0 rounded-xl border px-3 py-3 text-center text-sm font-extrabold leading-tight transition ${key === "creative-corner" ? (activeTab === key ? "border-fuchsia-700 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-900/25" : "border-fuchsia-300 bg-gradient-to-r from-fuchsia-50 to-violet-50 text-fuchsia-800 hover:border-fuchsia-500 hover:from-fuchsia-100 hover:to-violet-100") : activeTab === key ? "border-emerald-800 bg-emerald-800 text-white shadow-md shadow-emerald-900/15" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"}`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </nav>
        {activeTab === "overview" ? (
          <>
            <section className="relative overflow-hidden bg-emerald-950">
              {settings.heroImageUrl && (
                <img
                  src={settings.heroImageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-20"
                />
              )}
              <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
              <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
              <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-24">
                <div>
                  <p className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.16em] text-amber-300">
                    Knowledge · curiosity · imagination
                  </p>
                  <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                    {settings.title}
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/85">
                    {settings.subtitle}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        document
                          .getElementById("library-collections")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-emerald-950 shadow-lg transition hover:bg-amber-300"
                    >
                      Explore collections <Arrow />
                    </button>
                    <button
                      onClick={() => chooseTab("new-arrivals")}
                      className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                    >
                      See new arrivals
                    </button>
                  </div>
                </div>
                <div className="self-end rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:p-7">
                  <p className="text-xs font-black uppercase tracking-[.16em] text-amber-300">
                    Library today
                  </p>
                  <p className="mt-3 text-2xl font-extrabold leading-snug text-white">
                    “A book is a dream you hold in your hands.”
                  </p>
                  <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
                    <div>
                      <p className="text-2xl font-black text-amber-300">
                        {posts.length}+
                      </p>
                      <p className="mt-1 text-xs font-bold text-emerald-50/70">
                        Library resources
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-amber-300">
                        {films.length}+
                      </p>
                      <p className="mt-1 text-xs font-bold text-emerald-50/70">
                        Short films
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="relative z-10 mx-auto -mt-7 grid max-w-6xl gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
              <div className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-900/10">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                  Library hours
                </p>
                <p className="mt-2 font-bold text-slate-800">
                  {settings.openingHours}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-900/10">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                  Our focus
                </p>
                <p className="mt-2 font-bold text-slate-800">
                  Read · Learn · Create
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-900/10">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                  Need help?
                </p>
                <p className="mt-2 truncate font-bold text-slate-800">
                  {settings.contactEmail || "Visit the library desk"}
                </p>
              </div>
            </section>
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
                    Welcome to your library
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold leading-tight text-emerald-950 sm:text-4xl">
                    Every learner deserves a place to discover.
                  </h2>
                </div>
                <p className="max-w-3xl text-lg leading-8 text-slate-600">
                  {settings.intro}
                </p>
              </div>
              <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-xl text-emerald-700">⌕</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search books, resources, films and question papers"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </label>
              </div>
            </section>
            {term && <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"><h2 className="text-2xl font-extrabold text-emerald-950">Search results</h2>{latest.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{latest.map(post => <ResourceCard key={post.id} post={post} bookMode={libraryType(post) === "E-Book"} />)}</div> : <div className="mt-6"><EmptyState label="items match your search" /></div>}</section>}
            <section className="bg-emerald-950 py-16 text-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-amber-300">
                      Library information
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                      Library rules &amp; timings
                    </h2>
                    <p className="mt-5 max-w-md leading-7 text-emerald-50/80">
                      {LIBRARY_PROFILE}
                    </p>
                    <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-5">
                      <p className="text-xs font-black uppercase tracking-widest text-amber-300">
                        Library timings
                      </p>
                      <p className="mt-2 text-xl font-extrabold">
                        Monday to Friday
                      </p>
                      <p className="mt-1 text-emerald-50/80">
                        8:30 AM to 5:00 PM
                      </p>
                      <p className="mt-4 text-xl font-extrabold">Saturday</p>
                      <p className="mt-1 text-emerald-50/80">
                        8:30 AM to 4:00 PM
                      </p>
                    </div>
                    {latestLibraryLife && (
                      <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4">
                        <p className="text-xs font-black uppercase tracking-widest text-amber-300">Latest events &amp; activities</p>
                        <article className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/10">
                          {latestLibraryLife.imageUrl && <img src={latestLibraryLife.imageUrl} alt="" className="h-52 w-full bg-emerald-950 object-contain object-center sm:h-64" />}
                          <div className="p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-200">{libraryType(latestLibraryLife)}</p>
                            <h3 className="mt-1 font-extrabold text-white">{latestLibraryLife.title}</h3>
                            {latestLibraryLife.date && <p className="mt-1 text-xs text-emerald-50/75">{displayDate(latestLibraryLife.date)}</p>}
                          </div>
                        </article>
                      </div>
                    )}
                  </div>
                  <ol className="grid gap-3 sm:grid-cols-2">
                    {LIBRARY_RULES.map((rule, index) => (
                      <li
                        key={rule}
                        className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-emerald-50/90"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-black text-emerald-950">
                          {index + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
            {newArrivals.length > 0 && (
              <section className="overflow-hidden bg-amber-50 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-amber-700">Fresh on the shelves</p>
                      <h2 className="mt-2 text-3xl font-extrabold text-emerald-950 sm:text-4xl">New arrivals</h2>
                    </div>
                    <button type="button" onClick={() => chooseTab("new-arrivals")} className="inline-flex max-w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-emerald-800 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700">
                      View all new arrivals <Arrow />
                    </button>
                  </div>
                  <div className="library-arrivals-controls relative">
                    <div ref={arrivalsScroller} onMouseEnter={() => setArrivalsPaused(true)} onMouseLeave={() => setArrivalsPaused(false)} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} className="library-arrivals-scrollbar min-w-0 overflow-x-auto pb-3" aria-label="New arrivals carousel">
                    <div className="flex w-max cursor-grab gap-3 active:cursor-grabbing">
                      {[...newArrivals, ...newArrivals].map((post, index) => (
                        <div key={`${post.id}-${index}`} className="w-44 shrink-0 sm:w-56">
                          <ResourceCard post={post} arrivalMode />
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            <section id="library-collections" className="bg-white py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
                      Discover
                    </p>
                    <h2 className="mt-2 text-3xl font-extrabold text-emerald-950 sm:text-4xl">
                      Browse the library
                    </h2>
                  </div>
                  <p className="max-w-md text-sm leading-6 text-slate-500">
                    Resources are updated directly by the Library team.
                  </p>
                </div>
                <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {COLLECTIONS.map(
                    ([key, title, description, icon, colour]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => chooseTab(key)}
                        className="group flex rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                      >
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colour} text-xl font-bold text-white shadow-lg`}
                        >
                          {icon}
                        </span>
                        <span className="ml-4">
                          <span className="flex items-center gap-2 text-lg font-extrabold text-slate-900 group-hover:text-emerald-700">
                            {title} <Arrow />
                          </span>
                          <span className="mt-1 block text-sm leading-5 text-slate-500">
                            {description}
                          </span>
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </section>
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid gap-8 md:grid-cols-2">
              <div><p className="text-sm font-black uppercase tracking-widest text-emerald-700">Daily discovery</p><h2 className="mt-2 text-3xl font-extrabold text-emerald-950">Latest One Fact a Day</h2>{facts[0] ? <article className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="aspect-[4/5] w-full bg-slate-100"><img src={facts[0].imageUrl} alt="" className="h-full w-full object-contain" /></div><div className="p-4"><p className="text-xs font-black uppercase tracking-widest text-emerald-700">{displayDate(facts[0].date)}</p><h3 className="mt-2 font-extrabold uppercase text-slate-900">{facts[0].title || "One Fact a Day"}</h3></div></article> : <EmptyState label="facts" />}</div>
                <div><p className="text-sm font-black uppercase tracking-widest text-emerald-700">Word power</p><h2 className="mt-2 text-3xl font-extrabold text-emerald-950">Latest vocabulary</h2>{latest[0] ? <div className="mt-5"><ResourceCard post={latest[0]} featureMode /></div> : <EmptyState label="vocabulary" />}</div>
              </div>
            </section>
          </>
        ) : (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-950 to-emerald-800 px-6 py-10 text-white sm:px-10">
              <p className="text-sm font-black uppercase tracking-widest text-amber-300">
                Library collection
              </p>
              <h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">
                {activeLabel}
              </h1>
              <p className="mt-3 max-w-2xl text-emerald-50/80">
                Explore resources curated for the Ansar English School
                community.
              </p>
              <label className="mt-7 flex max-w-xl items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20">
                <span className="text-xl text-amber-300">⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${activeLabel.toLowerCase()}`}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-emerald-100/60"
                />
              </label>
            </div>
            {activeTab === "one-fact" ? (
              filteredFacts.length ? (
                <>
                  <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredFacts.slice(0, factLimit).map((fact) => (
                      <article
                        key={fact.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        {fact.imageUrl && (
                          <a
                            href={fact.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative block overflow-hidden"
                          >
                            <img
                              src={fact.imageUrl}
                              alt={`Open ${fact.title || "One Fact a Day"} poster`}
                              className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 text-sm font-extrabold text-white opacity-0 transition group-hover:bg-slate-950/40 group-hover:opacity-100">
                              Click to view
                            </span>
                          </a>
                        )}
                        <div className="p-4">
                          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
                            {displayDate(fact.date)}
                          </p>
                          <h3 className="mt-2 font-extrabold text-slate-900">
                            {fact.title}
                          </h3>
                          {fact.description && (
                            <p className="mt-1 text-sm text-slate-500">
                              {fact.description}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                  {filteredFacts.length > factLimit && (
                    <div className="mt-10 text-center">
                      <button
                        type="button"
                        onClick={() => setFactLimit((current) => current + 12)}
                        className="rounded-full bg-emerald-800 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-700"
                      >
                        Load previous facts ({filteredFacts.length - factLimit}{" "}
                        remaining)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-10">
                  <EmptyState label="facts" />
                </div>
              )
            ) : activeTab === "creative-corner" ? (
              <div className="mt-10 space-y-14">
                <div className="rounded-3xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 via-white to-violet-50 p-6 sm:p-9">
                  <p className="text-sm font-black uppercase tracking-widest text-fuchsia-700">Our school family creates</p>
                  <p className="mt-3 max-w-4xl text-base leading-8 text-slate-600">Creative Corner is our school library’s shared space for students, staff, and parents to express themselves and celebrate a love for reading. Here, you will find honest book reviews, original writing, artwork, and creative projects contributed by our entire school family. Explore popular reads, discover local talent, and share your own creative work with us!</p>
                </div>
                {[['Student voices', creativeStudents], ['Staff voices', creativeStaff]].map(([heading, entries]) => (
                  <section key={heading}>
                    <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-black uppercase tracking-widest text-fuchsia-700">Creative Corner</p><h2 className="mt-2 text-3xl font-extrabold text-emerald-950">{heading}</h2></div><span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-black text-fuchsia-700">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span></div>
                    {entries.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{entries.map((entry) => <ResourceCard key={entry.id} post={{...entry, type: 'Creative Corner'}} onOpenArticle={setSelectedArticle} />)}</div> : <div className="mt-6"><EmptyState label={heading.toLowerCase()} /></div>}
                  </section>
                ))}
              </div>
            ) : activeTab === "question-papers" ? (
              <div className="mt-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[['className', 'Class / Grade', questionPapers.classes], ['year', 'Academic Year', questionPapers.years], ['category', 'Exam Type', questionPapers.categories], ['subject', 'Subject', questionPapers.subjects]].map(([key, label, options]) => (
                      <label key={key} className="text-xs font-black uppercase tracking-wider text-slate-500">
                        {label}
                        <select value={questionFilters[key]} onChange={(event) => setQuestionFilters((current) => ({ ...current, [key]: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-800 outline-none focus:border-emerald-500">
                          <option value="">All {label}</option>
                          {options.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                  <button type="button" onClick={() => { setSearch(""); setQuestionFilters({ className: "", year: "", category: "", subject: "" }); }} className="mt-4 text-sm font-extrabold text-emerald-700 hover:text-emerald-900">Reset search and filters</button>
                </div>
                {filteredQuestionPapers.length ? (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredQuestionPapers.map((post) => <article key={post.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-800">Question Paper</span><span className="text-xs font-bold text-slate-400">{post.fileType || "PDF"}</span></div>
                      <h2 className="mt-5 text-xl font-extrabold text-slate-900">{post.subject || post.title}</h2>
                      <p className="mt-1 text-sm font-bold text-emerald-700">{post.title}</p>
                      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl bg-slate-50 p-3"><dt className="font-bold text-slate-400">Class</dt><dd className="mt-1 font-extrabold text-slate-700">{post.className || "—"}</dd></div><div className="rounded-xl bg-slate-50 p-3"><dt className="font-bold text-slate-400">Exam</dt><dd className="mt-1 font-extrabold text-slate-700">{post.category || "—"}</dd></div></dl>
                      <p className="mt-4 text-xs font-bold text-slate-400">{post.date ? displayDate(post.date) : post.year || "Academic resource"} · {post.fileType || "PDF"}</p>
                      <div className="mt-5 flex gap-2">{post.linkUrl ? <a href={post.linkUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-xl bg-emerald-800 px-3 py-3 text-center text-sm font-extrabold text-white hover:bg-emerald-700">View</a> : <button type="button" onClick={() => setSelectedArticle(post)} className="flex-1 rounded-xl bg-emerald-800 px-3 py-3 text-sm font-extrabold text-white hover:bg-emerald-700">View</button>}{post.linkUrl && <a href={post.linkUrl} target="_blank" rel="noreferrer" download className="flex-1 rounded-xl border border-emerald-200 px-3 py-3 text-center text-sm font-extrabold text-emerald-800 hover:bg-emerald-50">Download</a>}</div>
                    </article>)}
                  </div>
                ) : <div className="mt-6"><EmptyState label="question papers matching these filters" /></div>}
              </div>
            ) : tabPosts.length ? (
              <div
                className={`mt-10 grid gap-4 ${activeTab === "short-films" || activeTab === "new-arrivals" || activeTab === "winners" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-3"}`}
              >
                {tabPosts.map((post, index) => (
                  <ResourceCard
                    key={post.id}
                    post={post}
                    film={activeTab === "short-films"}
                    onOpenArticle={setSelectedArticle}
                    bookMode={activeTab === "e-books"}
                    forceArticle={activeTab === "winners"}
                    arrivalMode={activeTab === "new-arrivals"}
                    fallbackBookNumber={activeTab === "e-books" ? `AES-E${String(index + 1).padStart(2, "0")}` : ""}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <EmptyState label={activeLabel} />
              </div>
            )}
          </section>
        )}
        {selectedArticle && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-label="Article preview"><article className="mx-auto mt-6 max-w-5xl rounded-3xl bg-white p-4 shadow-2xl sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-fuchsia-700">{libraryType(selectedArticle)}</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">{selectedArticle.title}</h2></div><button type="button" onClick={() => setSelectedArticle(null)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">Close</button></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">{imageUrl(selectedArticle.imageUrl) || imageUrl(selectedArticle.imageUrls?.[0]) || imageUrl(selectedArticle.galleryImageUrl) ? <img src={imageUrl(selectedArticle.imageUrl) || imageUrl(selectedArticle.imageUrls?.[0]) || imageUrl(selectedArticle.galleryImageUrl)} alt={selectedArticle.title || "Article image"} className="max-h-[60vh] w-full rounded-2xl bg-slate-100 object-contain" /> : null}{youtubeEmbedUrl(selectedArticle.linkUrl) && <iframe title={`Watch ${selectedArticle.title}`} src={youtubeEmbedUrl(selectedArticle.linkUrl)} className="aspect-video w-full rounded-2xl" allowFullScreen />}</div><div className="mt-5"><p className="text-sm font-bold text-fuchsia-700">{selectedArticle.author}{selectedArticle.contributorType ? ` · ${selectedArticle.contributorType}` : ""}</p>{selectedArticle.date && <p className="mt-1 text-xs font-bold text-slate-400">{displayDate(selectedArticle.date)}{selectedArticle.className ? ` · ${selectedArticle.className}` : ""}</p>} {selectedArticle.body || selectedArticle.summary ? <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-slate-700">{selectedArticle.body || selectedArticle.summary}</p> : null}</div></article></div>}
        {selectedArticle && libraryType(selectedArticle) === "Question Paper" && selectedArticle.linkUrl && <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-label="Question paper preview"><article className="mx-auto mt-6 max-w-5xl rounded-3xl bg-white p-4 shadow-2xl sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Question Paper</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">{selectedArticle.title}</h2></div><button type="button" onClick={() => setSelectedArticle(null)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">Close</button></div><iframe title={`Preview ${selectedArticle.title}`} src={selectedArticle.linkUrl} className="mt-5 h-[75vh] w-full rounded-2xl border border-slate-200 bg-slate-100" /><p className="mt-2 text-center text-xs text-slate-500">If the PDF does not appear, <a href={selectedArticle.linkUrl} target="_blank" rel="noreferrer" className="font-bold text-emerald-700 underline">open it in a new tab</a>.</p></article></div>}
      </main>
    </Layout>
  );
}
