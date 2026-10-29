import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase-init";
import { useFirestoreCollection } from "./useFirestoreCollection";
import LibraryMediaUploader from "./LibraryMediaUploader";
import { normalizeImageUrl } from "./imageUrlUtils";
import {
  QUESTION_PAPER_CATEGORIES,
  QUESTION_PAPER_CLASSES,
  LIBRARY_FILE_TYPES,
  TOTAL_ARCHIVE_POSTERS,
  todayKey,
  addDaysKey,
  archivePosterUrl,
  prettyDate,
} from "./libraryUtils";

const DEFAULT_SETTINGS = {
  title: "Ansar English School Library",
  subtitle:
    "A home for readers, researchers, storytellers, and lifelong learners.",
  intro:
    "The school library brings together books, ideas, conversation, and discovery. Students are encouraged to read widely, explore thoughtfully, and share what inspires them.",
  heroImageUrl: "",
  resourceUrl: "",
  resourceLabel: "Browse library posts",
  openingHours: "Mon – Fri: 8:30 AM – 5:00 PM · Saturday: 8:30 AM – 4:00 PM",
  contactEmail: "",
  vision: "To nurture confident, curious, and compassionate lifelong readers.",
  mission:
    "To connect every learner with ideas, stories, and trusted information.",
  libraryRules: "",
  libraryDays: "Monday to Friday",
  libraryIndexUrl: "",
  quizUrl: "/ansar-media-production/add-ons/online-quiz",
  staffMembers: JSON.stringify([
    {
      name: "SHYNI PK",
      role: "Librarian",
      qualification: "MLIS",
      contact: "9400566641",
      imageUrl: "",
    },
    {
      name: "DARSANA K KRISHNAN",
      role: "Assistant librarian",
      qualification: "BSC, B.Lib.I.Sc, MLIS, NET.",
      contact: "9656548908",
      imageUrl: "",
    },
    {
      name: "SUHARA M",
      role: "Library Assistant",
      qualification: "BA",
      contact: "8907533513",
      imageUrl: "",
    },
  ]),
  published: true,
  contributorType: "Student",
};

const EMPTY_POST = {
  type: "Announcement",
  title: "",
  summary: "",
  body: "",
  date: "",
  imageUrl: "",
  imageUrls: [],
  linkUrl: "",
  fileUrl: "",
  fileType: "PDF",
  bookNumber: "",
  category: "",
  className: "",
  subject: "",
  year: "",
  author: "",
  bookStatus: "EXISTING",
  venue: "",
  published: true,
};

const LEGACY_LIBRARY_HOST =
  "sites.google.com/view/ansar-english-school-library";
const isLegacyLibraryUrl = (value) =>
  String(value || "")
    .toLowerCase()
    .includes(LEGACY_LIBRARY_HOST);

function displayDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "No date"
    : new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
}

// Keep admin section routing aligned with the public Library page. Some older
// records were stored as Announcement/AnnouncementPublished even though their
// content was an event or activity.
function normalizedLibraryType(item) {
  const canonical = String(item?.libraryCategory || "").trim().toLowerCase();
  const canonicalTypes = {
    new_arrival: "New Arrival", question_paper: "Question Paper", ebook: "E-Book",
    e_learning: "E-Learning", short_film: "Short Film", quiz: "Quiz",
    event: "Event", activity: "Activity", winner: "Winner", clipping: "Clipping",
    file: "File", vocabulary: "Vocabulary",
    creative_corner: "Creative Corner",
  };
  if (canonicalTypes[canonical]) return canonicalTypes[canonical];
  const type = String(item?.type || "").trim();
  const text = `${item?.title || ""} ${item?.summary || ""} ${item?.category || ""} ${item?.venue || ""}`;
  if (
    /event|activit/i.test(type) ||
    (/announcement/i.test(type) &&
      /book fair|event|activity|celebration|programme|program/i.test(text))
  ) return type === "Activity" ? "Activity" : "Event";
  if (/^AES-E\d+$/i.test(String(item?.bookNumber || "").trim())) return "E-Book";
  const status = String(item?.bookStatus ?? item?.publicationStatus ?? item?.status ?? "").trim().toUpperCase();
  if (
    (["NEW", "EXISTING"].includes(status) || type === "AnnouncementPublished") &&
    ["Announcement", "AnnouncementPublished", "Publication", "New Arrival"].includes(type)
  ) return "New Arrival";
  if (/clipping|newspaper/i.test(`${type} ${text}`)) return "Clipping";
  // Older short films were saved as Announcement/Video records. Keep the
  // admin list aligned with the public Library page so they remain editable.
  if (
    (type === "Announcement" || type === "AnnouncementPublished" || type === "Video") &&
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/|vimeo\.com\/)/i.test(String(item?.linkUrl || ""))
  ) return "Short Film";
  return type || "Announcement";
}

const TABS = [
  ["overview", "Overview"],
  ["profile", "Library Profile"],
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
  ["newspaper", "Newspaper Clippings"],
  ["files", "Files & Documents"],
  ["vocabulary-vault", "Vocabulary Vault"],
  ["published", "Published"],
];

// Which post types belong to which admin tab. The feed tab shows everything.
const SECTION_TYPES = {
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
  files: ["File"],
  vocabulary: ["Vocabulary"],
};
const TAB_LIBRARY_CATEGORIES = {
  "new-arrivals": "new_arrival", "question-papers": "question_paper", "e-books": "ebook",
  "e-learning": "e_learning", "short-films": "short_film", quizzes: "quiz",
  events: "event", winners: "winner", newspaper: "clipping", files: "file",
  "vocabulary-vault": "vocabulary",
  "creative-corner": "creative_corner",
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-500";
const cardClass =
  "rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8";

export default function AdminLibrary() {
  const { data: settingsItems, loading: settingsLoading } =
    useFirestoreCollection("librarySettings", "title", "asc");
  // Dates are optional for library entries, so sort by the always-present creation time.
  const { data: posts, loading: postsLoading } = useFirestoreCollection(
    "libraryPosts",
    "createdAt",
    "desc",
  );
  const [tab, setTab] = useState("overview");
  const [post, setPost] = useState(EMPTY_POST);
  const [editingId, setEditingId] = useState(null);
  const [librarySearch, setLibrarySearch] = useState("");

  const existingSettings = useMemo(
    () => settingsItems.find((item) => item.id === "main") || null,
    [settingsItems],
  );
  const existingSettingsDoc = existingSettings;

  const postsByType = useMemo(() => {
    const grouped = {};
    for (const item of posts) {
      const key = normalizedLibraryType(item);
      (grouped[key] = grouped[key] || []).push(item);
    }
    return grouped;
  }, [posts]);

  const draftCount = posts.filter((item) => item.published === false).length;
  const subjectOptions = useMemo(
    () => [...new Set(posts
      .filter((item) => item.type === "Question Paper" && item.subject)
      .map((item) => String(item.subject).trim())
      .filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [posts],
  );

  const startEdit = (item) => {
    setEditingId(item.id);
    const normalizedOwnerType = normalizedLibraryType(item);
    setPost({
      type: normalizedOwnerType || "Announcement",
      title: item.title || "",
      summary: item.summary || "",
      body: item.body || "",
      date: item.date || "",
      imageUrl: item.imageUrl || "",
      imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : [],
      linkUrl: isLegacyLibraryUrl(item.linkUrl) ? "" : item.linkUrl || "",
      fileUrl: item.fileUrl || "",
      fileType: item.fileType || "PDF",
      bookNumber: item.bookNumber || "",
      category: item.category || "",
      className: item.className || "",
      subject: item.subject || "",
      year: item.year || "",
      author: item.author || "",
      bookStatus:
        item.bookStatus ||
        item.publicationStatus ||
        item.status ||
        (["New Arrival", "Publication", "AnnouncementPublished"].includes(item.type)
          ? "NEW"
          : "EXISTING"),
      venue: item.venue || "",
      contributorType: item.contributorType || "Student",
      published: item.published !== false,
    });
    const ownerTab =
      Object.entries(SECTION_TYPES).find(([, types]) =>
        types.includes(normalizedOwnerType),
      )?.[0] || "published";
    setTab(ownerTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const newPost = (type) => {
    setEditingId(null);
    setPost({ ...EMPTY_POST, type, date: "" });
  };

  const nextEbookNumber = () => {
    const used = posts
      .map((item) => String(item.bookNumber || "").match(/^AES-E(\d+)$/i)?.[1])
      .filter(Boolean)
      .map(Number);
    return `AES-E${String((used.length ? Math.max(...used) : 0) + 1).padStart(2, "0")}`;
  };

  const removePost = async (item) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`))
      return;
    try {
      await deleteDoc(doc(db, "libraryPosts", item.id));
    } catch (error) {
      alert(`Could not delete this post: ${error.message}`);
    }
  };

  const moveToClippings = async (item) => {
    if (
      !window.confirm(
        `Move “${item.title || "this item"}” to Newspaper Clippings?`,
      )
    )
      return;
    try {
      await updateDoc(doc(db, "libraryPosts", item.id), {
        type: "Clipping",
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      alert(`Could not move this item: ${error.message}`);
    }
  };

  const moveToEvents = async (item) => {
    if (!window.confirm(`Move “${item.title || "this item"}” to Events & Activities?`)) return;
    try {
      await updateDoc(doc(db, "libraryPosts", item.id), {
        type: "Event",
        bookStatus: "EXISTING",
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      alert(`Could not move this item to Events & Activities: ${error.message}`);
    }
  };

  // ------------------------------------------------------------------
  // Shared library post form (used by every post section tab)
  // ------------------------------------------------------------------
  const savePost = async (event) => {
    event.preventDefault();
    if (isLegacyLibraryUrl(post.linkUrl) || isLegacyLibraryUrl(post.fileUrl)) {
      alert(
        "The previous Google Sites library has been retired. Upload or publish this content in the Library Manager instead.",
      );
      return;
    }
    const needsFile = post.type === "Question Paper" || post.type === "File";
    if (needsFile && !post.linkUrl.trim()) {
      alert("Paste the Google Drive link before saving this document.");
      return;
    }
    if (
      ["E-Book", "E-Learning", "Short Film", "Quiz"].includes(post.type) &&
      !post.linkUrl.trim()
    ) {
      alert(
        "Add the required public link before saving this digital resource.",
      );
      return;
    }
    try {
      const normalizedType =
        tab === "new-arrivals"
          ? "New Arrival"
          : tab === "newspaper" ||
        /clipping|newspaper|press cutting/i.test(
          `${post.type} ${post.title} ${post.category} ${post.venue}`,
        )
          ? "Clipping"
          : tab === "e-books"
            ? "E-Book"
            : tab === "e-learning"
              ? "E-Learning"
              : /event|activit/i.test(post.type)
                ? /activit/i.test(post.type)
                  ? "Activity"
                  : "Event"
                : post.type;
      const libraryCategory =
        normalizedType === "Activity" ? "activity" :
        normalizedType === "Event" ? "event" :
        TAB_LIBRARY_CATEGORIES[tab] || "announcement";
      const payload = {
        type: normalizedType,
        libraryCategory,
        title: post.title.trim(),
        summary: post.summary.trim(),
        body: post.body.trim(),
        date: post.date,
        imageUrl: normalizeImageUrl(post.imageUrl),
        imageUrls: (post.imageUrls || [])
          .map((entry) => normalizeImageUrl(typeof entry === "string" ? entry : entry?.url))
          .filter(Boolean),
        linkUrl: post.linkUrl.trim(),
        fileUrl: post.fileUrl.trim(),
        fileType: post.fileType || "",
        bookNumber:
          post.type === "E-Book" && !editingId
            ? post.bookNumber.trim() || nextEbookNumber()
            : post.bookNumber.trim(),
        category: post.category.trim(),
        className: post.className.trim(),
        subject: post.subject.trim(),
        year: post.year.trim(),
        author: post.author.trim(),
        // Book status belongs to arrivals only. Keeping event/activity posts
        // as EXISTING prevents their legacy metadata from changing sections.
        bookStatus:
          normalizedType === "New Arrival" || normalizedType === "Publication"
            ? post.bookStatus === "NEW" ? "NEW" : "EXISTING"
            : "EXISTING",
        venue: post.venue.trim(),
        published: !!post.published,
        updatedAt: serverTimestamp(),
      };
      if (tab === "creative-corner") {
        payload.contributorType = post.contributorType || "Student";
      }
      if (editingId) {
        const currentItem = posts.find((item) => item.id === editingId);
        await updateDoc(doc(db, "libraryPosts", editingId), {
          ...payload,
          createdAt: currentItem?.createdAt || serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "libraryPosts"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      setPost(EMPTY_POST);
      setEditingId(null);
      alert(editingId ? "Library item updated." : "Library item published.");
    } catch (error) {
      console.error(error);
      alert(`Could not save the library item: ${error.message}`);
    }
  };

  const postForm = (
    typeOptions,
    {
      showLink = false,
      showFile = false,
      showGallery = false,
      showAcademicFields = false,
      showBookNumber = false,
      formTitle = "",
      formHint = "",
      linkLabel = "",
      linkHint = "",
      linkPlaceholder = "https://…",
      hideExtraFields = false,
      showDate = true,
      showDescription = true,
      showImage = true,
      showBookStatus = false,
      showAuthor = false,
      eventToggle = false,
      creativeCorner = false,
    } = {},
  ) => (
    <form onSubmit={savePost} className={cardClass}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {editingId
              ? `Edit ${formTitle || "library item"}`
              : `Add ${formTitle || "new item"}`}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {formHint || "Drafts stay private until they are published."}
          </p>
        </div>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setPost(EMPTY_POST);
            }}
            className="text-sm font-bold text-slate-600 hover:text-slate-900"
          >
            Cancel editing
          </button>
        )}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {eventToggle ? (
          <div className="md:col-span-2">
            <p className="text-sm font-bold text-slate-700">Content type</p>
            <div className="mt-1 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              {["Event", "Activity"].map((kind) => (
                <button key={kind} type="button" onClick={() => setPost((value) => ({ ...value, type: kind }))} className={`rounded-lg px-5 py-2 text-sm font-extrabold transition ${post.type === kind ? "bg-emerald-800 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}>
                  {kind}
                </button>
              ))}
            </div>
          </div>
        ) : typeOptions && (
          <label className="text-sm font-bold text-slate-700">
            Item type
            <select
              value={post.type}
              onChange={(e) =>
                setPost((value) => ({ ...value, type: e.target.value }))
              }
              className={fieldClass}
            >
              {typeOptions.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
        )}
        {showDate && (
          <label className="text-sm font-bold text-slate-700">
            Date
            <input
              type="date"
              required={eventToggle}
              value={post.date}
              onChange={(e) =>
                setPost((value) => ({ ...value, date: e.target.value }))
              }
              className={fieldClass}
            />
          </label>
        )}
        {creativeCorner && (
          <>
            <label className="text-sm font-bold text-slate-700">
              Contributor type
              <select value={post.contributorType} onChange={(e) => setPost((value) => ({ ...value, contributorType: e.target.value }))} className={fieldClass}>
                <option>Student</option><option>Staff</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Name
              <input required value={post.author} onChange={(e) => setPost((value) => ({ ...value, author: e.target.value }))} className={fieldClass} />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Section
              <input required value={post.category} onChange={(e) => setPost((value) => ({ ...value, category: e.target.value }))} placeholder="English, Art, Reading…" className={fieldClass} />
            </label>
            {post.contributorType === "Student" && <label className="text-sm font-bold text-slate-700">Class &amp; division<input required value={post.className} onChange={(e) => setPost((value) => ({ ...value, className: e.target.value }))} placeholder="VII A" className={fieldClass} /></label>}
          </>
        )}
        <label className="text-sm font-bold text-slate-700 md:col-span-2">
          {showAuthor ? "Title of the book" : "Title"}
          <input
            required
            value={post.title}
            onChange={(e) =>
              setPost((value) => ({ ...value, title: e.target.value }))
            }
            className={fieldClass}
          />
        </label>
        {showDescription && !eventToggle && !creativeCorner && (
          <label className="text-sm font-bold text-slate-700 md:col-span-2">
            Description (optional)
            <textarea
              value={post.summary}
              onChange={(e) =>
                setPost((value) => ({ ...value, summary: e.target.value }))
              }
              className={`${fieldClass} h-20`}
            />
          </label>
        )}
        {showBookNumber && (
          <label className="text-sm font-bold text-slate-700">
            Book number / accession number
            <input
              value={post.bookNumber}
              onChange={(e) =>
                setPost((value) => ({ ...value, bookNumber: e.target.value }))
              }
              placeholder="Generated on save (AES-E01)"
              className={fieldClass}
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">
              Leave blank to automatically generate the next AES-E number.
              Students can search by this number.
            </span>
          </label>
        )}

        {showBookStatus && (
          <label className="text-sm font-bold text-slate-700">
            Book status
            <select
              value={post.bookStatus}
              onChange={(e) =>
                setPost((value) => ({ ...value, bookStatus: e.target.value }))
              }
              className={fieldClass}
            >
              <option value="NEW">NEW</option>
              <option value="EXISTING">EXISTING</option>
            </select>
            <span className="mt-1 block text-xs font-medium text-slate-500">
              NEW books receive a red stamp on their cover in the public library.
            </span>
          </label>
        )}

        {showAcademicFields && (
          <>
            <label className="text-sm font-bold text-slate-700">
              Class
              <select
                value={post.className}
                onChange={(e) =>
                  setPost((value) => ({ ...value, className: e.target.value }))
                }
                className={fieldClass}
              >
                <option value="">Select class</option>
                {QUESTION_PAPER_CLASSES.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Subject
              <input
                list="library-question-paper-subjects"
                value={post.subject}
                onChange={(e) =>
                  setPost((value) => ({ ...value, subject: e.target.value }))
                }
                placeholder="Mathematics, Science…"
                className={fieldClass}
              />
              <datalist id="library-question-paper-subjects">
                {subjectOptions.map((subject) => <option key={subject} value={subject} />)}
              </datalist>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Exam category
              <select
                value={post.category}
                onChange={(e) =>
                  setPost((value) => ({ ...value, category: e.target.value }))
                }
                className={fieldClass}
              >
                <option value="">Select category</option>
                {QUESTION_PAPER_CATEGORIES.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Year
              <input
                value={post.year}
                onChange={(e) =>
                  setPost((value) => ({ ...value, year: e.target.value }))
                }
                placeholder="2026"
                className={fieldClass}
              />
            </label>
          </>
        )}
        {showAcademicFields && (
          <div className="md:col-span-2">
            <p className="text-sm font-bold text-slate-700">
              Question paper Google Drive link
            </p>
            <label className="mt-2 block text-sm font-bold text-slate-700">
              <input
                required
                type="url"
                value={post.linkUrl}
                onChange={(e) =>
                  setPost((value) => ({ ...value, linkUrl: e.target.value }))
                }
                placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
                className={fieldClass}
              />
              <span className="mt-1 block text-xs font-medium text-slate-500">
                Set the Drive file access to “Anyone with the link can view”.
              </span>
            </label>
          </div>
        )}

        {showFile && (
          <>
            <label className="text-sm font-bold text-slate-700">
              File type
              <select
                value={post.fileType}
                onChange={(e) =>
                  setPost((value) => ({ ...value, fileType: e.target.value }))
                }
                className={fieldClass}
              >
                {LIBRARY_FILE_TYPES.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">
              Category / collection
              <input
                value={post.category}
                onChange={(e) =>
                  setPost((value) => ({ ...value, category: e.target.value }))
                }
                className={fieldClass}
              />
            </label>
            <div className="md:col-span-2">
              <div className="mb-3">
                <LibraryMediaUploader
                  mode="pdf"
                  value={post.linkUrl}
                  onChange={(url) =>
                    setPost((value) => ({ ...value, linkUrl: url || "" }))
                  }
                  folder={["files", post.category].filter(Boolean)}
                  label="Upload PDF to Google Drive"
                />
              </div>
              <p className="text-sm font-bold text-slate-700">
                Google Drive sharing link
              </p>
              <label className="mt-2 block text-sm font-bold text-slate-700">
                <input
                  required
                  type="url"
                  value={post.linkUrl}
                  onChange={(e) =>
                    setPost((value) => ({ ...value, linkUrl: e.target.value }))
                  }
                  placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
                  className={fieldClass}
                />
                <span className="mt-1 block text-xs font-medium text-slate-500">
                  Set the Drive file access to “Anyone with the link can view”.
                </span>
              </label>
            </div>
          </>
        )}

        {showLink && (
          <label className="text-sm font-bold text-slate-700 md:col-span-2">
            {post.type === "Short Film" || post.type === "Creative Corner"
              ? "Video URL (YouTube, Vimeo or another video platform)"
              : "Resource link (website, e-book viewer…)"}
            <input
              type="url"
              value={post.linkUrl}
              onChange={(e) =>
                setPost((value) => ({ ...value, linkUrl: e.target.value }))
              }
              placeholder={
                post.type === "Short Film" || post.type === "Creative Corner"
                  ? "https://www.youtube.com/watch?v=…"
                  : "https://…"
              }
              className={fieldClass}
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">
              {post.type === "Short Film" || post.type === "Creative Corner"
                ? "YouTube and Vimeo are embedded directly. For other links, paste the video URL or add a video cover image. The public page opens other links in a new tab."
                : "This opens the selected resource in a new tab."}
            </span>
          </label>
        )}

        {showGallery && (
          <div className="md:col-span-2">
            <p className="text-sm font-bold text-slate-700">
              Photo gallery (bulk upload)
            </p>
            <div className="mt-2">
              <LibraryMediaUploader
                mode="image"
                multiple
                value={post.imageUrls}
                onChange={(urls) =>
                  setPost((value) => ({ ...value, imageUrls: urls }))
                }
                folder="gallery"
              />
            </div>
          </div>
        )}

        {showImage && (
          <div className="md:col-span-2">
            <p className="text-sm font-bold text-slate-700">
              {showFile ? "Cover thumbnail (optional)" : "Image (optional)"}
            </p>
            <div className="mt-2">
              <LibraryMediaUploader
                mode="image"
                value={post.imageUrl}
                onChange={(url) =>
                  setPost((value) => ({ ...value, imageUrl: url || "" }))
                }
                folder="images"
              />
            </div>
          </div>
        )}

        {showAuthor && (
          <label className="text-sm font-bold text-slate-700">
            Author
            <input
              required
              value={post.author}
              onChange={(e) =>
                setPost((value) => ({ ...value, author: e.target.value }))
              }
              className={fieldClass}
            />
          </label>
        )}

        {!eventToggle && !showAcademicFields &&
          !showFile &&
          !showGallery &&
          !hideExtraFields && !creativeCorner && (
            <>
              <label className="text-sm font-bold text-slate-700">
                Category / programme
                <input
                  value={post.category}
                  onChange={(e) =>
                    setPost((value) => ({ ...value, category: e.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Author, winner or newspaper
                <input
                  value={post.author}
                  onChange={(e) =>
                    setPost((value) => ({ ...value, author: e.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-bold text-slate-700 md:col-span-2">
                Venue or source
                <input
                  value={post.venue}
                  onChange={(e) =>
                    setPost((value) => ({ ...value, venue: e.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
            </>
          )}
        {eventToggle && (
          <label className="text-sm font-bold text-slate-700 md:col-span-2">
            Venue
            <input
              value={post.venue}
              onChange={(e) =>
                setPost((value) => ({ ...value, venue: e.target.value }))
              }
              className={fieldClass}
            />
          </label>
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
        {!eventToggle && <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            checked={post.published}
            onChange={(e) =>
              setPost((value) => ({ ...value, published: e.target.checked }))
            }
            className="h-4 w-4"
          />
          Publish on the Library page
        </label>}
        <button
          disabled={postsLoading}
          className="rounded-lg bg-[#15324a] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#0d2639] disabled:opacity-50"
        >
          {editingId ? "Update item" : "Save item"}
        </button>
      </div>
    </form>
  );

  const postList = (types) => {
    const items = posts.filter((item) => {
      if (types?.includes("E-Book") && librarySearch.trim()) {
        const query = librarySearch.trim().toLowerCase();
        if (![item.title, item.bookNumber].some((value) => String(value || "").toLowerCase().includes(query))) return false;
      }
      const normalized = normalizedLibraryType(item);
      return types ? types.includes(normalized) : true;
    });
    if (!items.length) {
      return (
        <p className="py-8 text-center text-slate-500">
          No items yet. Add the first one with the form above.
        </p>
      );
    }
    return (
      <>
      {types?.includes("E-Book") && <input value={librarySearch} onChange={(event) => setLibrarySearch(event.target.value)} placeholder="Search E-Books by title or book number" className={`${fieldClass} mb-4`} />}
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.13em] text-emerald-700">
                <span>{normalizedLibraryType(item)}</span>
                <span
                  className={
                    item.published !== false
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }
                >
                  {item.published !== false ? "Published" : "Draft"}
                </span>
                {item.className && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                    {item.className}
                  </span>
                )}
                {item.year && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                    {item.year}
                  </span>
                )}
              </div>
              <h4 className="mt-1 font-bold text-slate-900">{item.title}</h4>
              <p className="mt-1 text-sm text-slate-500">
                {displayDate(item.date)}
                {item.subject ? ` · ${item.subject}` : ""}
              </p>
              {Array.isArray(item.imageUrls) && item.imageUrls.length > 0 && (
                <p className="mt-1 text-xs text-slate-400">
                  {item.imageUrls.length} photo
                  {item.imageUrls.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {types?.includes("New Arrival") && (
                <button
                  type="button"
                  onClick={() => moveToEvents(item)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
                >
                  Move to Events & Activities
                </button>
              )}
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removePost(item)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div></>
    );
  };

  const tabsByKey = {
    overview: (
      <OverviewTab
        postsByType={postsByType}
        postCount={posts.length}
        draftCount={draftCount}
        postsLoading={postsLoading}
      />
    ),
    profile: (
      <ProfileTab
        settingsItems={settingsItems}
        existingSettings={existingSettingsDoc}
        settingsLoading={settingsLoading}
      />
    ),
    oneFact: null, // rendered separately below (needs its own hooks)
    "vocabulary-vault": null, // rendered separately under One Fact a Day (needs its own hooks)
    "new-arrivals": (
      <PostSectionTab
        intro="Recently added books and library publications, shown in the arrivals section of the public page."
        types={SECTION_TYPES["new-arrivals"]}
        typeOptions={SECTION_TYPES["new-arrivals"]}
        form={postForm(SECTION_TYPES["new-arrivals"], {
          formTitle: "new arrival",
          formHint: "Add the book title, author, date, status and cover photo.",
          showDescription: false,
          showBookStatus: true,
          showAuthor: true,
          hideExtraFields: true,
        })}
        list={postList(SECTION_TYPES["new-arrivals"])}
        onAdd={() => newPost("New Arrival")}
      />
    ),
    "question-papers": (
      <PostSectionTab
        intro="Previous question papers with class, subject, category, year and document. The public page offers filters for class, subject, category and year."
        types={SECTION_TYPES["question-papers"]}
        typeOptions={SECTION_TYPES["question-papers"]}
        form={postForm(["Question Paper"], { showAcademicFields: true, showImage: false, showDescription: false })}
        list={postList(SECTION_TYPES["question-papers"])}
        onAdd={() => newPost("Question Paper")}
      />
    ),
    "e-books": (
      <PostSectionTab
      intro="Upload one e-book at a time. Required: title and a reader/viewer link. Book numbers are generated automatically."
        types={SECTION_TYPES["e-books"]}
        typeOptions={SECTION_TYPES["e-books"]}
        form={postForm(null, {
        showLink: true,
        showBookNumber: false,
          hideExtraFields: true,
          formTitle: "an e-book",
          formHint:
            "Required: title and a direct e-book reader or Google Drive view link. Optional: description, accession number, date and cover image.",
        })}
        list={postList(SECTION_TYPES["e-books"])}
        onAdd={() => newPost("E-Book")}
      />
    ),
    "e-learning": (
      <PostSectionTab
        intro="Add trusted online learning platforms, courses or reading pathways. Required: title and the learning resource URL."
        types={SECTION_TYPES["e-learning"]}
        typeOptions={SECTION_TYPES["e-learning"]}
        form={postForm(null, {
          showLink: true,
          hideExtraFields: true,
          showDate: false,
          showImage: false,
          formTitle: "an e-learning platform",
          formHint: "Add the platform title, URL and a short description.",
        })}
        list={postList(SECTION_TYPES["e-learning"])}
        onAdd={() => newPost("E-Learning")}
      />
    ),
    "short-films": (
      <PostSectionTab
        intro="Publish student-friendly videos from YouTube, Vimeo or another approved platform. Required: title and video URL. YouTube thumbnails are shown automatically."
        types={SECTION_TYPES["short-films"]}
        typeOptions={SECTION_TYPES["short-films"]}
        form={postForm(null, {
          showLink: true,
          hideExtraFields: true,
          showDate: false,
          showDescription: false,
          showImage: false,
          formTitle: "a short film",
          formHint:
            "Required: title and video URL. YouTube and Vimeo are embedded directly. Other links open in a new tab.",
        })}
        list={postList(SECTION_TYPES["short-films"])}
        onAdd={() => newPost("Short Film")}
      />
    ),
    "creative-corner": (
      <PostSectionTab
        intro="Publish student and staff book reviews, writing, artwork and creative projects. Add an optional image and YouTube URL for the article preview."
        types={SECTION_TYPES["creative-corner"]}
        typeOptions={SECTION_TYPES["creative-corner"]}
        form={postForm(null, { creativeCorner: true, showLink: true, hideExtraFields: true, showDescription: false, formTitle: "a Creative Corner entry", formHint: "Required: title, name, date, section and class & division for students. Image and YouTube URL are optional." })}
        list={postList(SECTION_TYPES["creative-corner"])}
        onAdd={() => newPost("Creative Corner")}
      />
    ),
    quizzes: (
      <PostSectionTab
        intro="Publish quizzes and learning activities. Required: title and the quiz URL. Use the website’s quiz portal link or an approved external quiz link."
        types={SECTION_TYPES.quizzes}
        typeOptions={SECTION_TYPES.quizzes}
        form={postForm(null, {
          showLink: true,
          hideExtraFields: true,
          formTitle: "a quiz",
          formHint:
            "Required: title and quiz URL. Optional: instructions, date and cover image.",
        })}
        list={postList(SECTION_TYPES.quizzes)}
        onAdd={() => newPost("Quiz")}
      />
    ),
    events: (
      <PostSectionTab
        intro="Library events, author interactions, reading celebrations and student activities."
        types={SECTION_TYPES.events}
        typeOptions={SECTION_TYPES.events}
        form={postForm(null, { eventToggle: true, formTitle: "an event or activity", formHint: "Choose Event or Activity, then add its name, description, date, venue and image." })}
        list={postList(SECTION_TYPES.events)}
        onAdd={() => newPost("Event")}
      />
    ),
    winners: (
      <PostSectionTab
        intro="Competition winners and photo galleries. Upload several photos at once — they are shown as a collage when published."
        types={SECTION_TYPES.winners}
        typeOptions={SECTION_TYPES.winners}
        form={postForm(SECTION_TYPES.winners, { showGallery: true, showImage: false })}
        list={postList(SECTION_TYPES.winners)}
        onAdd={() => newPost("Winner")}
      />
    ),
    newspaper: (
      <PostSectionTab
        intro="Newspaper clippings and press coverage featuring the library and its readers."
        types={SECTION_TYPES.newspaper}
        typeOptions={SECTION_TYPES.newspaper}
        form={postForm(SECTION_TYPES.newspaper)}
        list={postList(SECTION_TYPES.newspaper)}
        onAdd={() => newPost("Clipping")}
      />
    ),
    files: (
      <PostSectionTab
        intro="Documents, circulars, books and reference PDFs. Upload a PDF or paste a Google Drive link — public cards get View and Download buttons."
        types={SECTION_TYPES.files}
        typeOptions={SECTION_TYPES.files}
        form={postForm(["File"], { showFile: true })}
        list={postList(SECTION_TYPES.files)}
        onAdd={() => newPost("File")}
      />
    ),
    vocabulary: (
      <PostSectionTab
        intro="The Vocabulary Vault on the public page — one poster per day. Choose the date, use the word as the title, add its meaning in the description, upload the poster image to Hostinger server storage, then publish. Leave category, author and venue blank."
        types={SECTION_TYPES.vocabulary}
        typeOptions={SECTION_TYPES.vocabulary}
        form={postForm(SECTION_TYPES.vocabulary, { showDescription: false })}
        list={postList(SECTION_TYPES.vocabulary)}
        onAdd={() => newPost("Vocabulary")}
      />
    ),
    published: (
      <section className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Published content & drafts
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Every library item across all sections. Drafts stay private until
              published.
            </p>
          </div>
          {postsLoading && (
            <span className="text-sm font-bold text-slate-400">Loading…</span>
          )}
        </div>
        <div className="mt-6">{postList(null)}</div>
      </section>
    ),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
          Library content manager
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
          Manage the Library page
        </h2>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600">
          Everything on the public Library page is managed from these tabs:
          profile, daily posters, arrivals, question papers, digital resources,
          events, galleries, clippings and documents. Published entries appear
          immediately on the public Library page.
        </p>
      </div>

      <nav aria-label="Library admin sections">
        <ul className="flex flex-wrap gap-2">
          {TABS.map(([key, label]) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => setTab(key)}
                aria-current={tab === key ? "true" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === key ? "bg-emerald-600 text-white shadow" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-emerald-50"}`}
              >
                {label}
                {key === "published" && draftCount > 0 && (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-700">
                    {draftCount} draft{draftCount > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {tab === "one-fact" ? (
        <OneFactTab />
      ) : tab === "vocabulary-vault" ? (
        <VocabularyTab />
      ) : tab === "new-arrivals" ? (
        tabsByKey["new-arrivals"]
      ) : tab === "question-papers" ? (
        tabsByKey["question-papers"]
      ) : tab === "e-books" ? (
        tabsByKey["e-books"]
      ) : tab === "e-learning" ? (
        tabsByKey["e-learning"]
      ) : tab === "short-films" ? (
        tabsByKey["short-films"]
      ) : tab === "creative-corner" ? (
        tabsByKey["creative-corner"]
      ) : tab === "quizzes" ? (
        tabsByKey.quizzes
      ) : tab === "events" ? (
        tabsByKey.events
      ) : tab === "winners" ? (
        tabsByKey.winners
      ) : tab === "newspaper" ? (
        tabsByKey.newspaper
      ) : tab === "files" ? (
        tabsByKey.files
      ) : tab === "published" ? (
        tabsByKey.published
      ) : (
        tabsByKey[tab] || tabsByKey.overview
      )}
    </div>
  );
}

// --------------------------------------------------------------------
// Overview
// --------------------------------------------------------------------
function OverviewTab({ postsByType, postCount, draftCount, postsLoading }) {
  const typeRows = Object.entries(postsByType).sort(
    (a, b) => b[1].length - a[1].length,
  );
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className={cardClass}>
        <h3 className="text-lg font-extrabold text-slate-900">At a glance</h3>
        {postsLoading && (
          <p className="mt-4 text-sm text-slate-500">Counting…</p>
        )}
        {!postsLoading && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-3xl font-black text-emerald-700">
                  {postCount}
                </p>
                <p className="text-sm font-bold text-slate-600">
                  Library items
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-3xl font-black text-amber-700">
                  {draftCount}
                </p>
                <p className="text-sm font-bold text-slate-600">Drafts</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-3xl font-black text-slate-700">
                  {(postsByType["Question Paper"] || []).length}
                </p>
                <p className="text-sm font-bold text-slate-600">
                  Question papers
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-3xl font-black text-slate-700">
                  {(postsByType["File"] || []).length}
                </p>
                <p className="text-sm font-bold text-slate-600">Documents</p>
              </div>
            </div>
            <a
              href="/library"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-lg bg-[#15324a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0d2639]"
            >
              Open public Library page ↗
            </a>
          </>
        )}
      </section>
      <section className={cardClass}>
        <h3 className="text-lg font-extrabold text-slate-900">
          Items per section
        </h3>
        {typeRows.length === 0 && !postsLoading && (
          <p className="mt-4 text-sm text-slate-500">
            Nothing published yet. Start with the One Fact a Day poster or a
            question paper.
          </p>
        )}
        <ul className="mt-4 space-y-2 text-sm">
          {typeRows.map(([type, items]) => (
            <li
              key={type}
              className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2"
            >
              <span className="font-bold text-slate-700">{type}</span>
              <span className="rounded-full bg-slate-100 px-3 py-0.5 font-black text-slate-600">
                {items.length}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// --------------------------------------------------------------------
// Library profile (title, intro, vision, mission, rules, timings)
// --------------------------------------------------------------------
function ProfileTab({ settingsItems, existingSettings, settingsLoading }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingSettings)
      setSettings({
        ...DEFAULT_SETTINGS,
        ...existingSettings,
        resourceUrl: "",
        libraryIndexUrl: "",
      });
  }, [existingSettings]);

  // Keep silent when the whole profile doc has not loaded yet.
  useEffect(() => {
    if (!settingsItems?.length) setSettings(DEFAULT_SETTINGS);
  }, [settingsItems]);

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await setDoc(
        doc(db, "librarySettings", "main"),
        {
          title: settings.title.trim(),
          subtitle: settings.subtitle.trim(),
          intro: settings.intro.trim(),
          heroImageUrl: normalizeImageUrl(settings.heroImageUrl),
          // The former Google Site is retired. Library content is now managed
          // as posts in this website, so do not retain a site-wide external link.
          resourceUrl: "",
          resourceLabel: "Browse library posts",
          openingHours: settings.openingHours.trim(),
          contactEmail: settings.contactEmail.trim(),
          vision: settings.vision.trim(),
          mission: settings.mission.trim(),
          libraryRules: settings.libraryRules.trim(),
          libraryDays: settings.libraryDays.trim(),
          libraryIndexUrl: "",
          quizUrl: settings.quizUrl.trim(),
          staffMembers: settings.staffMembers.trim(),
          published: !!settings.published,
          createdAt: existingSettings?.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      alert("Library profile saved.");
    } catch (error) {
      console.error(error);
      alert(`Could not save the library profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={saveSettings} className={cardClass}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Library profile, vision, mission, rules & timings
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            The public page heading, introduction, vision, mission, rules and
            opening hours.
          </p>
        </div>
        {settingsLoading && (
          <span className="text-sm font-bold text-slate-400">Loading…</span>
        )}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">
          Page title
          <input
            required
            value={settings.title}
            onChange={(e) =>
              setSettings((value) => ({ ...value, title: e.target.value }))
            }
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Subtitle
          <input
            required
            value={settings.subtitle}
            onChange={(e) =>
              setSettings((value) => ({ ...value, subtitle: e.target.value }))
            }
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-bold text-slate-700 md:col-span-2">
          Introduction
          <textarea
            required
            value={settings.intro}
            onChange={(e) =>
              setSettings((value) => ({ ...value, intro: e.target.value }))
            }
            className={`${fieldClass} h-28`}
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Hero image URL (optional)
          <input
            type="url"
            value={settings.heroImageUrl}
            onChange={(e) =>
              setSettings((value) => ({
                ...value,
                heroImageUrl: e.target.value,
              }))
            }
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Library hours
          <input
            value={settings.openingHours}
            onChange={(e) =>
              setSettings((value) => ({
                ...value,
                openingHours: e.target.value,
              }))
            }
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Library contact email
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) =>
              setSettings((value) => ({
                ...value,
                contactEmail: e.target.value,
              }))
            }
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Library days
          <input
            value={settings.libraryDays}
            onChange={(e) =>
              setSettings((value) => ({
                ...value,
                libraryDays: e.target.value,
              }))
            }
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Digital quiz URL
          <input
            value={settings.quizUrl}
            onChange={(e) =>
              setSettings((value) => ({ ...value, quizUrl: e.target.value }))
            }
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-bold text-slate-700 md:col-span-2">
          Vision
          <textarea
            value={settings.vision}
            onChange={(e) =>
              setSettings((value) => ({ ...value, vision: e.target.value }))
            }
            className={`${fieldClass} h-20`}
          />
        </label>
        <label className="text-sm font-bold text-slate-700 md:col-span-2">
          Mission
          <textarea
            value={settings.mission}
            onChange={(e) =>
              setSettings((value) => ({ ...value, mission: e.target.value }))
            }
            className={`${fieldClass} h-20`}
          />
        </label>
        <label className="text-sm font-bold text-slate-700 md:col-span-2">
          Library rules (one rule per line)
          <textarea
            value={settings.libraryRules}
            onChange={(e) =>
              setSettings((value) => ({
                ...value,
                libraryRules: e.target.value,
              }))
            }
            className={`${fieldClass} h-32`}
          />
        </label>
        <label className="text-sm font-bold text-slate-700 md:col-span-2">
          Library staff directory (JSON)
          <textarea
            value={settings.staffMembers}
            onChange={(e) =>
              setSettings((value) => ({
                ...value,
                staffMembers: e.target.value,
              }))
            }
            className={`${fieldClass} h-32 font-mono text-xs`}
          />
          <span className="mt-1 block text-xs font-medium text-slate-500">
            Add members with name, role, qualification, contact and optional
            imageUrl.
          </span>
        </label>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save library profile"}
        </button>
      </div>
    </form>
  );
}

// --------------------------------------------------------------------
// Vocabulary Vault
// --------------------------------------------------------------------
// Shown under One Fact a Day in the admin panel. Uses the public
// LibraryPage vocabulary section (type: 'Vocabulary' in libraryPosts).
// Form shows only the image + date + title + save.
function VocabularyTab() {
  const { data: posts, loading: postsLoading } = useFirestoreCollection(
    "libraryPosts",
    "createdAt",
    "desc",
  );
  const [entry, setEntry] = useState({
    date: todayKey(),
    title: "",
    imageUrl: "",
    published: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const entriesByDate = useMemo(
    () => new Set(posts.map((item) => String(item.date || ""))),
    [posts],
  );
  const isVocabulary = (item) => String(item.type || "") === "Vocabulary";
  const vocabularyPosts = posts.filter(isVocabulary);
  const currentEntry =
    vocabularyPosts.find(
      (item) => String(item.date || "") === String(entry.date || ""),
    ) || null;

  const findDoc = (id) => posts.find((item) => String(item.id) === String(id));
  const existing = editingId ? findDoc(editingId) : null;

  const saveEntry = async (event) => {
    event.preventDefault();
    if (!entry.date) {
      alert("Choose the poster date.");
      return;
    }
    setSaving(true);
    try {
      const now = serverTimestamp();
      if (editingId) {
        await updateDoc(doc(db, "libraryPosts", editingId), {
          type: "Vocabulary",
          libraryCategory: "vocabulary",
          date: entry.date,
          title: entry.title.trim(),
          summary: "",
          body: "",
          imageUrl: entry.imageUrl.trim(),
          linkUrl: "",
          bookNumber: "",
          category: "",
          author: "",
          venue: "",
          fileUrl: "",
          fileType: "",
          className: "",
          subject: "",
          year: "",
          imageUrls: [],
          published: true,
          createdAt: existing?.createdAt || now,
          updatedAt: now,
        });
        alert("Vocabulary Vault entry saved.");
      } else {
        if (entriesByDate.has(entry.date) && !editingId) {
          alert("An entry already exists for this date. Edit it instead.");
          return;
        }
        await setDoc(doc(db, "libraryPosts", editingId || entry.date), {
          date: entry.date,
          type: "Vocabulary",
          libraryCategory: "vocabulary",
          title: entry.title.trim(),
          summary: "",
          body: "",
          imageUrl: entry.imageUrl.trim(),
          linkUrl: "",
          bookNumber: "",
          category: "",
          author: "",
          venue: "",
          fileUrl: "",
          fileType: "",
          className: "",
          subject: "",
          year: "",
          imageUrls: [],
          published: true,
          createdAt: now,
          updatedAt: now,
        });
        alert("Vocabulary Vault entry saved.");
      }
      setEntry({ date: todayKey(), title: "", imageUrl: "", published: true });
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert(`Could not save the entry: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeEntry = async (item) => {
    if (
      !window.confirm(
        `Delete the Vocabulary Vault entry for ${prettyDate(item.date)}? This cannot be undone.`,
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "libraryPosts", item.id));
      alert("Entry deleted.");
    } catch (error) {
      alert(`Could not delete: ${error.message}`);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEntry({
      date: item.date || todayKey(),
      title: item.title || "",
      imageUrl: item.imageUrl || "",
      published: item.published !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <section className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {editingId
                ? "Edit vocabulary poster"
                : "Add / update a vocabulary poster"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              The public Library page shows this daily vocabulary poster under
              the One Fact a Day section. Choose the date, add the title, and
              upload the image.
            </p>
          </div>
          {!postsLoading && (
            <p
              className={`rounded-full px-3 py-1 text-xs font-black ${currentEntry ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {currentEntry && currentEntry.published !== false
                ? "Published ✓"
                : currentEntry
                  ? "Draft — publish it"
                  : "No entry yet"}
            </p>
          )}
        </div>
        <form onSubmit={saveEntry} className={cardClass}>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">
              Poster date
              <input
                type="date"
                required
                value={entry.date}
                onChange={(e) =>
                  setEntry((value) => ({ ...value, date: e.target.value }))
                }
                className={fieldClass}
              />
            </label>
            <div className="text-sm font-bold text-slate-700">
              Publication status
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={entry.published}
              onChange={(e) =>
                setEntry((value) => ({ ...value, published: e.target.checked }))
              }
              className="h-4 w-4"
            />
            Publish this poster on the Library page
          </label>
          <div className="mt-4">
            <p className="text-sm font-bold text-slate-700">
              Title (optional)
              <input
                value={entry.title}
                onChange={(e) =>
                  setEntry((value) => ({ ...value, title: e.target.value }))
                }
                className={fieldClass}
              />
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm font-bold text-slate-700">Poster image</p>
            <div className="mt-2">
              <LibraryMediaUploader
                mode="image"
                value={entry.imageUrl}
                onChange={(url) =>
                  setEntry((value) => ({ ...value, imageUrl: url || "" }))
                }
                folder="vocabulary"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Update entry" : "Save entry"}
            </button>
          </div>
        </form>
      </section>

      <section className={cardClass}>
        <h3 className="text-xl font-extrabold text-slate-900">
          Saved vocabulary posters
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {vocabularyPosts.length} entry
          {vocabularyPosts.length === 1 ? "" : "s"}.
        </p>
        {postsLoading && (
          <p className="py-6 text-center text-slate-500">Loading…</p>
        )}
        {!postsLoading && vocabularyPosts.length === 0 && (
          <p className="py-8 text-center text-slate-500">
            No vocabulary posters yet. Add one above.
          </p>
        )}
        {!postsLoading && vocabularyPosts.length > 0 && (
          <div className="mt-4 divide-y divide-slate-100">
            {vocabularyPosts.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Vocabulary"}
                      className="h-14 w-20 rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">
                      {item.title || prettyDate(item.date)}
                    </p>
                    <p
                      className={`text-xs font-black uppercase ${item.published !== false ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {item.published !== false ? "Published" : "Draft"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEntry(item)}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// --------------------------------------------------------------------
// One Fact a Day
// --------------------------------------------------------------------
function OneFactTab() {
  const { data: entries, loading } = useFirestoreCollection(
    "libraryOneFact",
    "date",
    "desc",
  );
  const [entry, setEntry] = useState({
    date: todayKey(),
    title: "",
    description: "",
    imageUrl: "",
    published: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [bulkUrls, setBulkUrls] = useState([]);
  const [bulkStartDate, setBulkStartDate] = useState(todayKey());
  const [importBaseDate, setImportBaseDate] = useState("2026-10-22");
  const [working, setWorking] = useState("");

  const entriesByDate = useMemo(
    () => new Set(entries.map((item) => item.date)),
    [entries],
  );

  const saveEntry = async (event) => {
    event.preventDefault();
    if (!entry.date) {
      alert("Choose the poster date.");
      return;
    }
    if (entriesByDate.has(entry.date) && !editingId) {
      alert("An entry already exists for this date. Edit it instead.");
      return;
    }
    setSaving(true);
    try {
      const existing = editingId
        ? entries.find((item) => item.id === editingId)
        : null;
      await setDoc(doc(db, "libraryOneFact", entry.date), {
        date: entry.date,
        title: entry.title.trim(),
        description: entry.description.trim(),
        imageUrl: entry.imageUrl.trim(),
        published: !!entry.published,
        createdAt: existing?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setEntry({
        date: todayKey(),
        title: "",
        description: "",
        imageUrl: "",
        published: true,
      });
      setEditingId(null);
      alert("One Fact a Day entry saved.");
    } catch (error) {
      console.error(error);
      alert(`Could not save the entry: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  /** Reference the 143 locally imported posters (public/library/one-fact/N.jpg). */
  const importLocalArchive = async () => {
    if (
      !window.confirm(
        `Create daily entries for all ${TOTAL_ARCHIVE_POSTERS} imported posters (1.jpg–${TOTAL_ARCHIVE_POSTERS}.jpg), dated backwards from ${prettyDate(importBaseDate)}? Dates that already have an entry are skipped.`,
      )
    )
      return;
    setWorking("Importing archive…");
    try {
      const batch = writeBatch(db);
      let created = 0;
      for (let n = TOTAL_ARCHIVE_POSTERS; n >= 1; n -= 1) {
        const date = addDaysKey(importBaseDate, n - TOTAL_ARCHIVE_POSTERS);
        if (!date || entriesByDate.has(date)) continue;
        batch.set(doc(db, "libraryOneFact", date), {
          date,
          posterNumber: n,
          title: "",
          description: "",
          imageUrl: archivePosterUrl(n),
          published: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        created += 1;
      }
      await batch.commit();
      alert(
        created
          ? `Imported ${created} archive entries.`
          : "All archive dates already have entries — nothing to import.",
      );
    } catch (error) {
      console.error(error);
      alert(`Archive import failed: ${error.message}`);
    } finally {
      setWorking("");
    }
  };

  /** Turn freshly uploaded bulk posters into dated daily entries. */
  const createBulkEntries = async () => {
    if (!bulkUrls.length) {
      alert("Upload the poster images first.");
      return;
    }
    setWorking("Creating entries…");
    try {
      const naturalSort = (a, b) =>
        String(a.name || a.url).localeCompare(String(b.name || b.url), "en", {
          numeric: true,
        });
      const sorted = [...bulkUrls].sort(naturalSort);
      const batch = writeBatch(db);
      let cursor = bulkStartDate;
      let created = 0;
      const newEntries = [];
      const used = new Set(entriesByDate);
      for (const item of sorted) {
        while (used.has(cursor)) cursor = addDaysKey(cursor, 1);
        if (!cursor) break;
        batch.set(doc(db, "libraryOneFact", cursor), {
          date: cursor,
          title: "",
          description: "",
          imageUrl: item.url,
          published: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        used.add(cursor);
        newEntries.push({ url: item.url, date: cursor });
        created += 1;
        cursor = addDaysKey(cursor, 1);
      }
      await batch.commit();
      setBulkUrls([]);
      alert(
        `Created ${created} daily entries${created ? ` — first: ${prettyDate(newEntries[0].date)}` : ""}.`,
      );
    } catch (error) {
      console.error(error);
      alert(`Bulk entry creation failed: ${error.message}`);
    } finally {
      setWorking("");
    }
  };

  const removeEntry = async (item) => {
    if (
      !window.confirm(
        `Delete the entry for ${prettyDate(item.date)}? This cannot be undone.`,
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "libraryOneFact", item.id));
    } catch (error) {
      alert(`Could not delete this entry: ${error.message}`);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEntry({
      date: item.date,
      title: item.title || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      published: item.published !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentEntry = entries.find((item) => item.date === todayKey());

  return (
    <div className="space-y-8">
      <section className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Today’s poster
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              The public page shows the published entry matching the visitor’s
              selected date, falling back to the most recent published poster.
            </p>
          </div>
          {loading && (
            <span className="text-sm font-bold text-slate-400">Loading…</span>
          )}
          {!loading && (
            <p
              className={`rounded-full px-3 py-1 text-xs font-black ${currentEntry ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {currentEntry && currentEntry.published !== false
                ? "Today: published ✓"
                : currentEntry
                  ? "Today: draft — publish it"
                  : "No entry for today yet"}
            </p>
          )}
        </div>
      </section>

      <form onSubmit={saveEntry} className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold text-slate-900">
            {editingId ? "Edit daily poster" : "Add / update a daily poster"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setEntry({
                  date: todayKey(),
                  title: "",
                  description: "",
                  imageUrl: "",
                  published: true,
                });
              }}
              className="text-sm font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel editing
            </button>
          )}
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">
            Poster date
            <input
              type="date"
              required
              value={entry.date}
              onChange={(e) =>
                setEntry((value) => ({ ...value, date: e.target.value }))
              }
              className={fieldClass}
            />
          </label>
          <div className="text-sm font-bold text-slate-700">
            Publication status
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            checked={entry.published}
            onChange={(e) =>
              setEntry((value) => ({ ...value, published: e.target.checked }))
            }
            className="h-4 w-4"
          />
          Publish this poster on the Library page
        </label>
        <div className="mt-4 grid gap-5">
          <label className="text-sm font-bold text-slate-700">
            Title (optional)
            <input
              value={entry.title}
              onChange={(e) =>
                setEntry((value) => ({ ...value, title: e.target.value }))
              }
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Description (optional)
            <textarea
              value={entry.description}
              onChange={(e) =>
                setEntry((value) => ({ ...value, description: e.target.value }))
              }
              className={`${fieldClass} h-20`}
            />
          </label>
          <div>
            <p className="text-sm font-bold text-slate-700">Poster image</p>
            <div className="mt-2">
              <LibraryMediaUploader
                mode="image"
                value={entry.imageUrl}
                onChange={(url) =>
                  setEntry((value) => ({ ...value, imageUrl: url || "" }))
                }
                folder="one-fact"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            disabled={saving || loading}
            className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update entry" : "Save entry"}
          </button>
        </div>
      </form>

      <section className={cardClass}>
        <h3 className="text-xl font-extrabold text-slate-900">
          Migrate the existing 143 posters
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          The 143 daily posters (1.jpg–143.jpg) were imported into{" "}
          <code className="rounded bg-slate-100 px-1">
            public/library/one-fact/
          </code>
          . Run this once to create dated archive entries for them. Poster 143
          corresponds to 22 October 2026.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-sm font-bold text-slate-700">
            Date for poster {TOTAL_ARCHIVE_POSTERS}
            <input
              type="date"
              value={importBaseDate}
              onChange={(e) => setImportBaseDate(e.target.value)}
              className={fieldClass}
            />
          </label>
          <button
            type="button"
            onClick={importLocalArchive}
            disabled={!!working || loading}
            className="rounded-lg bg-[#15324a] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#0d2639] disabled:opacity-50"
          >
            Import {TOTAL_ARCHIVE_POSTERS} posters
          </button>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className="text-xl font-extrabold text-slate-900">
          Bulk upload new posters
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Upload many poster images at once to Hostinger server storage, then
          create dated entries from a chosen start date. Files are ordered by
          filename, existing dates are skipped.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">
              Poster images
            </p>
            <LibraryMediaUploader
              mode="image"
              multiple
              value={bulkUrls}
              onChange={setBulkUrls}
              folder="one-fact"
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700">
              Start date for the first uploaded poster
              <input
                type="date"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
                className={fieldClass}
              />
            </label>
            <button
              type="button"
              onClick={createBulkEntries}
              disabled={!!working || loading || !bulkUrls.length}
              className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Create entries for {bulkUrls.length || 0} poster
              {bulkUrls.length === 1 ? "" : "s"}
            </button>
            {working && (
              <p className="text-sm font-bold text-emerald-700">{working}</p>
            )}
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className="text-xl font-extrabold text-slate-900">
          Poster archive
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {entries.length} entries. Dates are unique — one poster per day.
        </p>
        {loading && <p className="py-6 text-center text-slate-500">Loading…</p>}
        {!loading && (
          <div className="mt-4 divide-y divide-slate-100">
            {entries.slice(0, 60).map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-12 w-16 rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">
                      {prettyDate(item.date)}
                      {item.posterNumber
                        ? ` · poster ${item.posterNumber}`
                        : ""}
                    </p>
                    <p
                      className={`text-xs font-black uppercase ${item.published !== false ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {item.published !== false ? "Published" : "Draft"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEntry(item)}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {entries.length > 60 && (
              <p className="py-3 text-center text-xs text-slate-400">
                Showing the 60 most recent — edit any date from the form above.
              </p>
            )}
            {!entries.length && (
              <p className="py-8 text-center text-slate-500">
                No entries yet. Import the archive or add today’s poster.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// --------------------------------------------------------------------
// Generic post-section tab shell
// --------------------------------------------------------------------
function PostSectionTab({ types, form, list }) {
  return (
    <div className="space-y-8">
      {/* Section-specific add controls are part of the form below. */}
      {/* The former repeated section header card was intentionally removed. */}
      {false && <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {labels.join(" · ")}
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              {intro}
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-emerald-700"
          >
            + New {labels[0]}
          </button>
        </div>
      </div>}
      {form}
      <section className={cardClass}>
        <h3 className="text-xl font-extrabold text-slate-900">
          Saved {types.join(", ")} items
        </h3>
        <div className="mt-4">{list}</div>
      </section>
    </div>
  );
}
