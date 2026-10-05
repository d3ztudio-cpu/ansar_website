import React, { useMemo, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache } from './useContentCollection';
import { normalizeImageUrl } from './imageUrlUtils';
import { uploadImageToHostinger } from './hostingerUpload';
import ImgBbUrlImporter from './ImgBbUrlImporter';

const MAX_FACILITY_CARD_IMAGES = 12;
const MAX_FACILITY_CARDS = 4;

const EMPTY_CARD = {
  icon: '',
  title: '',
  label: '',
  description: '',
  highlights: [''],
  images: ['']
};

const ALL_ICONS = [
  'book', 'tv', 'art', 'music', 'puzzle', 'leaf', 'people', 'smile', 'shield', 'screen', 'users', 'sparkle', 'home', 'globe', 'hand', 'heart'
];

const DEFAULT_CARD_DATA = [
  {
    icon: 'book',
    title: 'Learning Resource Center',
    label: 'DEDICATED FACILITY',
    description: 'Our resource center is equipped with a wide range of books, puzzles, and educational toys. Children explore ideas, solve simple challenges, build language, and learn through play in a structured yet enjoyable setting.',
    highlights: ['Books and stories', 'Puzzles and thinking games', 'Educational toys'],
    images: []
  },
  {
    icon: 'tv',
    title: 'Smart Classrooms',
    label: 'DEDICATED FACILITY',
    description: 'Our Sprouts classrooms are equipped with smart TVs to introduce children to the digital world from an early age. Carefully selected visual content supports stories, rhymes, concepts, movement, and interactive classroom learning.',
    highlights: ['Smart TV support', 'Visual learning', 'Guided digital exposure'],
    images: []
  },
  {
    icon: 'art',
    title: 'Art and Craft Room',
    label: 'DEDICATED FACILITY',
    description: 'A dedicated creative space gives children freedom to discover their artistic talents through drawing, painting, cutting, and pasting. Every activity develops imagination, fine-motor coordination, patience, and self-expression.',
    highlights: ['Drawing and painting', 'Cutting and pasting', 'Creative expression'],
    images: []
  },
  {
    icon: 'music',
    title: 'SPROUTS FM RADIO STATION',
    label: 'DEDICATED FACILITY',
    description: "Our KG FM Radio Station is a joyful platform where little voices shine! Through fun-filled activities like storytelling, rhymes, and simple announcements, children build confidence, creativity and communication skills. It's a delightful space where our tiny broadcasters explore, express, and enjoy the magic of speaking and listening.",
    highlights: ['Storytelling and rhymes', 'Simple announcements', 'Confident communication'],
    images: []
  }
];

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [''];
  return String(value).split(/\r?\n/).map(item => item.trim()).filter(Boolean);
}

function toText(value) {
  return Array.isArray(value) ? value.join('\n') : String(value || '');
}

function fromText(text) {
  return String(text || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
}

function ImageCard({ image, index, onChange, onRemove, placeholder }) {
  const [isFocused, setIsFocused] = useState(false);
  const [file, setFile] = useState(null);

  const pickDeviceImage = async (event) => {
    const selected = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!selected) return;
    setFile(selected);
    try {
      const url = await uploadImageToHostinger(selected);
      onChange(url);
    } catch (error) {
      alert(error.message || 'Device upload failed. Please try again.');
    }
  };

  return (
    <div
      className={`group relative flex min-h-[7rem] items-center justify-center overflow-hidden rounded-2xl border bg-white p-3 shadow-sm transition ${
        isFocused ? 'border-orange-300 ring-2 ring-orange-200' : 'border-slate-200'
      }`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="relative h-full w-full">
        {image ? (
          <img
            src={image}
            alt={`Facility image ${index + 1}`}
            className="aspect-[4/3] h-full w-full object-cover"
            loading="lazy"
          />
        ) : file ? (
          <img
            src={URL.createObjectURL(file)}
            alt={`Facility image ${index + 1} (unsaved)`}
            className="aspect-[4/3] h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <span className="text-3xl">🖼</span>
            <span className="mt-2 block text-xs font-bold text-slate-400">{placeholder || 'Drop image here'}</span>
          </div>
        )}
        {image && (
          <button
            type="button"
            onClick={() => onChange([...toArray(image), ''])}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove image ${index + 1}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      {image ? (
        <input
          value={image}
          onChange={(event) => onChange(index === 0 ? toArray(event.target.value)[0] : event.target.value)}
          placeholder={image ? '' : placeholder || 'Paste image URL'}
          className="absolute inset-x-2 bottom-2 h-8 rounded-lg border border-slate-200 bg-white/90 px-3 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
        />
      ) : file ? (
        <input
          ref={(input) => {
            if (input) {
              input.addEventListener('change', pickDeviceImage);
              return () => input.removeEventListener('change', pickDeviceImage);
            }
          }}
          type="file"
          accept="image/*"
          className="hidden"
        />
      ) : null}
    </div>
  );
}

export default function AdminSproutsFacilities() {
  const [cards, setCards] = useState(DEFAULT_CARD_DATA);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);


  const controls = useMemo(() => {
    return cards.map((card, index) => ({
      ...card,
      images: toArray(card.images),
      highlights: toArray(card.highlights),
      index
    }));
  }, [cards]);

  const updateText = (field, value) => {
    const next = controls.map((card) => ({ ...card, [field]: value }));
    setCards(next);
  };

  const updateIcon = (index, value) => {
    const next = controls.map((card, i) => (i === index ? { ...card, icon: value } : card));
    setCards(next);
  };

  const updateImages = (index, value) => {
    const next = controls.map((card, i) => {
      if (i !== index) return card;
      const current = toArray(card.images);
      const nextImages = current.length ? current.map((item, imageIndex) => (imageIndex === 0 ? value : item)) : [value];
      return { ...card, images: nextImages };
    });
    setCards(next);
  };

  const updateHighlights = (index, value) => {
    const next = controls.map((card, i) => {
      if (i !== index) return card;
      const current = toArray(card.highlights);
      const nextHighlights = current.length ? current.map((item, highlightIndex) => (highlightIndex === 0 ? value : item)) : [value];
      return { ...card, highlights: nextHighlights };
    });
    setCards(next);
  };

  const addCard = () => {
    if (controls.length >= MAX_FACILITY_CARDS) return;
    setCards([...controls, { ...EMPTY_CARD, index: controls.length }]);
  };

  const removeCard = (index) => {
    if (controls.length <= 1) return;
    const next = controls.filter((_, imageIndex) => imageIndex !== index);
    setCards(next);
  };

  const moveCard = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= controls.length) return;
    const next = [...controls];
    [next[index], next[target]] = [next[target], next[index]];
    setCards(next.map((card, imageIndex) => ({ ...card, index: imageIndex })));
  };

  const addImage = (cardIndex) => {
    setCards(
      controls.map((card, imageIndex) =>
        imageIndex === cardIndex ? { ...card, images: [...card.images, ''] } : card
      )
    );
  };

  const removeImage = (cardIndex, imageIndex) => {
    setCards(
      controls.map((card, imageIndex) => {
        if (imageIndex !== cardIndex) return card;
        const nextImages = card.images.length <= 1 ? [''] : card.images.filter((_, i) => i !== imageIndex);
        return { ...card, images: nextImages };
      })
    );
  };

  const save = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const sproutsFacilities = controls.map((card) => ({
        icon: card.icon,
        title: card.title,
        label: card.label,
        description: card.description,
        highlights: card.highlights.filter(Boolean),
        images: card.images
          .map((image) => normalizeImageUrl(image))
          .filter(Boolean)
          .slice(0, MAX_FACILITY_CARD_IMAGES)
      }));

      await setDoc(doc(db, 'pages', 'ansar-sprouts'), {
        sproutsFacilities,
        updatedAt: serverTimestamp()
      }, { merge: true });

      clearGoogleSheetsCache();
      setRefreshKey((value) => value + 1);

      alert('Ansar Sprouts facility sections and images saved.');
    } catch (error) {
      setSaveError(error.message || 'Save failed. Please try again.');
      alert(`Save failed: ${saveError}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-orange-500">Ansar Sprouts</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Edit facility sections &amp; images</h2>
          <p className="mt-1 text-sm text-slate-500">Edit all four facility sections and add photos from your gallery or device. Each section keeps its own image list.</p>
        </div>
        <button
          type="button"
          onClick={addCard}
          disabled={controls.length >= MAX_FACILITY_CARDS}
          className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add section
        </button>
      </div>

      <form onSubmit={save} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {controls.map((card, index) => (
            <div key={`${card.title || index}-${card.icon}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveCard(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ←
                  </button>
                  <span className="text-sm font-black text-slate-400">Section {index + 1} of {MAX_FACILITY_CARDS}</span>
                  <button
                    type="button"
                    onClick={() => moveCard(index, 1)}
                    disabled={index === controls.length - 1}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  disabled={controls.length <= 1}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[3.5rem_1fr_1.2fr_2.2fr_1.2fr_auto] md:items-end">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Icon</label>
                  <select
                    value={card.icon}
                    onChange={(event) => updateIcon(index, event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {ALL_ICONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Title</label>
                  <input
                    value={card.title}
                    onChange={(event) => updateText('title', event.target.value)}
                    placeholder="Learning Resource Center"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Small label</label>
                  <input
                    value={card.label}
                    onChange={(event) => updateText('label', event.target.value)}
                    placeholder="DEDICATED FACILITY"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Description</label>
                  <textarea
                    value={card.description}
                    onChange={(event) => updateText('description', event.target.value)}
                    placeholder="A dedicated space..."
                    className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>


                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Bullet list (one per line)</label>
                  <textarea
                    value={card.highlights.join('\n')}
                    onChange={(event) => updateHighlights(index, event.target.value)}
                    placeholder={`Bullet 1\nBullet 2\nBullet 3`}
                    className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Images ({card.images.length}/{MAX_FACILITY_CARD_IMAGES})</span>
                  <div className="flex flex-1 flex-wrap gap-3">
                    {card.images.map((image, imageIndex) => (
                      <ImageCard
                        key={`${card.title || index}-img-${imageIndex}`}
                        index={imageIndex}
                        image={image}
                        placeholder="Drop image or paste URL"
                        onChange={(value) => updateImages(index, value)}
                        onRemove={() => removeImage(index, imageIndex)}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => addImage(index)}
                      disabled={card.images.length >= MAX_FACILITY_CARD_IMAGES}
                      className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      + Add image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <ImgBbUrlImporter multiple label="Extract multiple image URLs" onExtracted={(urls) => {
              setCards(controls.map((card, index) => {
                if (index >= urls.length) return card;
                return { ...card, images: [...card.images, urls[index]] };
              }));
            }} />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-orange-500 px-7 py-3 font-black text-white shadow transition hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save facility sections &amp; images'}
            </button>
          </div>
        </div>
        {saveError && <p className="mt-3 text-sm font-bold text-red-600">{saveError}</p>}
        <p className="mt-2 text-xs text-slate-400">Images are stored as direct URLs (Hostinger upload or pasted image host URL). The page previews them live once saved.</p>
      </form>
    </div>
  );
}
