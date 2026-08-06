import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { useContentCollection, useContentDocument } from './useContentCollection';

const iconPaths = {
  art: ['M12 22a10 10 0 1 1 10-10c0 2.2-1.8 4-4 4h-1.8a2.2 2.2 0 0 0-2.2 2.2c0 2.1-2 3.8-4 3.8Z', 'M7.5 10.5h.01M10 6.5h.01M15 7.5h.01M17 11.5h.01'],
  book: ['M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22Z', 'M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22Z'],
  music: ['M9 18V5l11-2v13', 'M9 9l11-2', 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  puzzle: ['M8.5 3H3v5.5a2.5 2.5 0 1 1 0 5V21h6.5a2.5 2.5 0 1 0 5 0H21v-6.5a2.5 2.5 0 1 1 0-5V3h-5.5a2.5 2.5 0 1 1-5 0Z'],
  leaf: ['M11 20A7 7 0 0 1 9 6c4.5-2 8.5-2 12-2-1 8-4 14-10 16Z', 'M2 21c3-5 7-8 13-11'],
  people: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'],
  hand: ['M18 11V6a2 2 0 0 0-4 0v4-5-6a2 2 0 0 0-3 2.6l7 10.6A6 6 0 0 0 17 21h1a4 4 0 0 0 4-4v-6a2 2 0 0 0-4 0Z'],
  heart: ['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z'],
  sparkle: ['m12 3-1.2 4.3L7 9l3.8 1.7L12 15l1.2-4.3L17 9l-3.8-1.7L12 3ZM5 16l-.7 2.3L2 19l2.3.7L5 22l.7-2.3L8 19l-2.3-.7L5 16ZM19 13l-.7 2.3-2.3.7 2.3.7L19 19l.7-2.3L22 16l-2.3-.7L19 13Z'],
  tv: ['M2 7h20v13H2z', 'm8 2 4 5 4-5M8 12h.01M12 12h4M8 16h8'],
  backpack: ['M6 8V6a6 6 0 0 1 12 0v2M5 8h14a2 2 0 0 1 2 2v11H3V10a2 2 0 0 1 2-2ZM8 8v13M16 8v13M8 14h8'],
  computer: ['M2 3h20v14H2zM8 21h8M12 17v4'],
  skate: ['M5 15h13l3 3H7a4 4 0 0 1-4-4V9h5l3 6M8 21h.01M18 21h.01'],
  bike: ['M5.5 19a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM18.5 19a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5.5 15.5 9 8h4l5.5 7.5M9 8l4 7.5M7 5h4'],
  family: ['M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM23 21v-2a4 4 0 0 0-4-4h-1'],
  home: ['M3 11 12 3l9 8v10h-6v-6H9v6H3Z'],
  apple: ['M12 7c-4-3-9 0-8 6 1 6 5 9 8 9s7-3 8-9c1-6-4-9-8-6ZM12 7c0-3 2-5 5-5'],
  bowl: ['M3 11h18a9 9 0 0 1-18 0ZM7 21h10M8 7c-2-2 2-3 0-5M13 7c-2-2 2-3 0-5'],
  globe: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20'],
  chat: ['M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z'],
  bulb: ['M9 18h6M10 22h4M8.5 14.5a7 7 0 1 1 7 0c-.9.8-1.5 2-1.5 3.5h-4c0-1.5-.6-2.7-1.5-3.5Z'],
  sun: ['M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z'],
  tree: ['M12 3 6 11h3l-4 6h14l-4-6h3ZM12 17v5'],
  bus: ['M4 17V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v11M4 12h16M7 17h10M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  letters: ['M4 19 9 5l5 14M6 14h6M16 8h4M18 6v12M15 18h6'],
  food: ['M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 3v18M17 3c4 3 4 8 0 10']
};

function SproutIcon({ name, className = 'h-10 w-10' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{(iconPaths[name] || iconPaths.sparkle).map((path, index) => <path key={index} d={path} />)}</svg>;
}

function SproutsActivityCard({ activity, index }) {
  const images = Array.isArray(activity.imageUrls) ? activity.imageUrls.filter(Boolean) : [];
  return <motion.article initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ delay: Math.min(index * 0.05, 0.25) }} className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
    <Link to={`/ansar-sprouts/activities/${encodeURIComponent(activity.id)}`} className="block h-full">
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
      {images.length ? <img src={images[0]} alt={activity.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /> : <div className="absolute inset-0 flex items-center justify-center bg-[#fbad18]/10 text-[#fbad18]"><SproutIcon name="art" className="h-20 w-20" /></div>}
      {images.length > 1 && <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-black text-white">{images.length} photos</span>}
    </div>
    <div className="p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest"><span className="text-[#fbad18]">{activity.category || 'Sprouts Activity'}</span>{activity.date && <><span className="text-slate-300">•</span><time className="text-slate-500">{new Date(`${activity.date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time></>}</div>
      <h3 className="mt-3 text-2xl font-black leading-tight text-[#4f1f71]">{activity.title}</h3>
      <p className="mt-4 line-clamp-3 font-semibold leading-7 text-slate-600">{activity.description}</p>
      <span className="mt-5 inline-flex items-center font-black text-[#fbad18]">Read article <span className="ml-2">→</span></span>
    </div>
    </Link>
  </motion.article>;
}

export const DEFAULT_SPROUTS_IMAGES = ['https://i.ibb.co/S4bj8W76/image.png'];
export const DEFAULT_RADIO_STATION_IMAGE = 'https://i.ibb.co/d0FyMJnz/b261c31c-4d52-4711-b4f5-5929b229681b.jpg';

const activities = [
  { icon: 'art', title: 'Little Artists', text: 'Colours, painting, clay, tearing, pasting, and happy hands at work.', color: 'bg-[#fbad18]/15 text-[#4f1f71]' },
  { icon: 'book', title: 'Story Time', text: 'Picture books, puppets, rhymes, and stories that make language come alive.', color: 'bg-[#fbad18]/20 text-[#4f1f71]' },
  { icon: 'music', title: 'Music & Movement', text: 'Songs, action rhymes, dance, and playful movement for growing bodies.', color: 'bg-[#4f1f71]/15 text-[#4f1f71]' },
  { icon: 'puzzle', title: 'Think & Play', text: 'Blocks, puzzles, sorting, matching, and simple challenges for curious minds.', color: 'bg-[#4f1f71]/15 text-[#4f1f71]' },
  { icon: 'leaf', title: 'Nature Friends', text: 'Leaves, flowers, sand, water, and small discoveries from the world around us.', color: 'bg-[#4f1f71]/15 text-[#4f1f71]' },
  { icon: 'people', title: 'Growing Together', text: 'Sharing, speaking, listening, taking turns, and making first friendships.', color: 'bg-[#fbad18]/20 text-[#4f1f71]' }
];

const dayMoments = [
  ['people', 'Warm welcome'],
  ['sparkle', 'Circle time'],
  ['puzzle', 'Learn through play'],
  ['apple', 'Snack & refresh'],
  ['skate', 'Move and explore'],
  ['heart', 'Happy goodbye']
];

const flyHighLevels = [
  { name: 'Fly 1', age: '3–4 years', icon: '1', color: 'from-[#fbad18] to-[#fbad18]', text: 'An age-appropriate beginning that develops early language, number awareness, observation, movement, expression, and classroom confidence.' },
  { name: 'Fly 2', age: '4–5 years', icon: '2', color: 'from-[#fbad18] to-[#fbad18]', text: 'A growing learning experience that strengthens communication, concept understanding, creativity, social skills, and independent participation.' },
  { name: 'Fly 3', age: '5–6 years', icon: '3', color: 'from-[#fbad18] to-[#fbad18]', text: 'A school-readiness journey that builds confident language, early academics, problem-solving, collaboration, and creative application.' }
];

const curioStages = [
  { name: 'Touch Curio', icon: 'hand', text: 'Explore through touch, observation, listening, movement, and sensory discovery.' },
  { name: 'Feel Curio', icon: 'heart', text: 'Connect learning with feelings, stories, conversations, relationships, and real experiences.' },
  { name: 'Create Curio', icon: 'sparkle', text: 'Express ideas through imagination, making, problem-solving, performance, and creative work.' }
];

const sproutsFacilities = [
  {
    title: 'Learning Resource Center',
    icon: 'book',
    color: 'from-[#fbad18]/35 to-[#fbad18]/30',
    accent: 'text-[#fbad18]',
    description: 'Our resource center is equipped with a wide range of books, puzzles, and educational toys. Children explore ideas, solve simple challenges, build language, and learn through play in a structured yet enjoyable setting.',
    highlights: ['Books and stories', 'Puzzles and thinking games', 'Educational toys']
  },
  {
    title: 'Smart Classrooms',
    icon: 'tv',
    color: 'from-[#4f1f71]/20 to-[#fbad18]/30',
    accent: 'text-[#4f1f71]',
    description: 'Our Sprouts classrooms are equipped with smart TVs to introduce children to the digital world from an early age. Carefully selected visual content supports stories, rhymes, concepts, movement, and interactive classroom learning.',
    highlights: ['Smart TV support', 'Visual learning', 'Guided digital exposure']
  },
  {
    title: 'Art and Craft Room',
    icon: 'art',
    color: 'from-[#fbad18]/30 to-[#4f1f71]/25',
    accent: 'text-[#4f1f71]',
    description: 'A dedicated creative space gives children freedom to discover their artistic talents through drawing, painting, cutting, and pasting. Every activity develops imagination, fine-motor coordination, patience, and self-expression.',
    highlights: ['Drawing and painting', 'Cutting and pasting', 'Creative expression']
  },
  {
    title: 'SPROUTS FM RADIO STATION',
    icon: 'music',
    color: 'from-[#4f1f71]/20 to-[#fbad18]/30',
    accent: 'text-[#4f1f71]',
    description: 'Our KG FM Radio Station is a joyful platform where little voices shine! Through fun-filled activities like storytelling, rhymes, and simple announcements, children build confidence, creativity and communication skills. It\'s a delightful space where our tiny broadcasters explore, express, and enjoy the magic of speaking and listening.',
    highlights: ['Storytelling and rhymes', 'Simple announcements', 'Confident communication'],
    imageField: 'radioStationImageUrl'
  }
];

const floatAnimation = {
  y: [0, -12, 0],
  rotate: [0, 4, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
};

export default function AnsarSprouts() {
  const { data } = useContentDocument('pages', 'ansar-sprouts');
  const { data: sproutsActivities, loading: activitiesLoading } = useContentCollection('sproutsActivities', 'date', 'desc', { sheetsOnly: true });
  const images = Array.isArray(data?.sproutsImages) && data.sproutsImages.length ? data.sproutsImages : DEFAULT_SPROUTS_IMAGES;
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => setImageIndex(0), [images.length]);
  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setDirection(1);
      setImageIndex(current => (current + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [images.length, imageIndex]);

  const moveImage = step => {
    setDirection(step);
    setImageIndex(current => (current + step + images.length) % images.length);
  };

  return (
    <Layout>
      <main className="overflow-hidden bg-[#fffaf2]">
        <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 lg:pb-24 lg:pt-16">
          <motion.div animate={floatAnimation} className="absolute left-[4%] top-16 hidden text-[#fbad18] sm:block"><SproutIcon name="sparkle" className="h-12 w-12" /></motion.div>
          <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1 } }} className="absolute right-[5%] top-8 hidden text-[#fbad18] sm:block"><SproutIcon name="sun" className="h-12 w-12" /></motion.div>
          <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 2 } }} className="absolute bottom-10 right-[2%] hidden text-[#fbad18] lg:block"><SproutIcon name="heart" className="h-12 w-12" /></motion.div>

          <div className="relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] border-4 border-white bg-gradient-to-br from-[#fbad18]/35 via-[#fbad18]/20 to-[#4f1f71]/20 p-6 shadow-[0_24px_70px_rgba(120,85,40,0.16)] sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:p-14">
            <div className="relative z-10">
              <span className="inline-flex -rotate-2 rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-wider text-[#fbad18] shadow-sm">Welcome to Ansar Sprouts Preschool</span>
              <h1 className="mt-6 font-black leading-[0.92] text-[#4f1f71]" style={{ fontSize: 'clamp(3.2rem, 8vw, 6.7rem)' }}>
                Ansar<br /><span className="text-[#fbad18]">Sprouts!</span>
              </h1>
              <p className="mt-7 max-w-xl text-base font-semibold leading-relaxed text-slate-700 sm:text-lg">Welcome to Ansar Sprouts Preschool, where little minds blossom through joyful learning, creativity, and exploration. In a safe, caring, and stimulating environment, we nurture every child's curiosity, confidence, values, and 21st-century skills. Together with parents, we build a strong foundation for lifelong learning and a bright future.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/admission" className="rounded-full bg-[#4f1f71] px-7 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#3d1758]">Join Ansar Sprouts</Link>
                <Link to="/contact" className="rounded-full bg-white px-7 py-3.5 font-black text-[#4f1f71] shadow-md transition hover:-translate-y-1">Talk to us</Link>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.9, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} transition={{ duration: 0.7 }} className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-white/70" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.2rem] border-8 border-white bg-white shadow-xl">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img key={`${images[imageIndex]}-${imageIndex}`} src={images[imageIndex]} alt={`Ansar Sprouts learning moment ${imageIndex + 1}`} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 70 : -70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction > 0 ? -70 : 70 }} transition={{ duration: 0.45, ease: 'easeInOut' }} className="absolute inset-0 h-full w-full object-cover" fetchPriority={imageIndex === 0 ? 'high' : 'auto'} />
                </AnimatePresence>
                {images.length > 1 && <>
                  <button type="button" onClick={() => moveImage(-1)} aria-label="Previous Ansar Sprouts image" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-2xl font-black text-[#4f1f71] shadow">‹</button>
                  <button type="button" onClick={() => moveImage(1)} aria-label="Next Ansar Sprouts image" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-2xl font-black text-[#4f1f71] shadow">›</button>
                  <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">{images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => { setDirection(index > imageIndex ? 1 : -1); setImageIndex(index); }} aria-label={`Show Ansar Sprouts image ${index + 1}`} className={`h-2.5 rounded-full shadow ${index === imageIndex ? 'w-7 bg-[#fbad18]' : 'w-2.5 bg-white/80'}`} />)}</div>
                </>}
              </div>
              <div className="absolute -bottom-5 -left-3 rotate-[-5deg] rounded-2xl bg-[#fbad18] px-5 py-3 font-black text-white shadow-lg">Play • Learn • Bloom</div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-r from-[#4f1f71]/15 via-[#4f1f71]/15 to-[#4f1f71]/15 p-7 shadow-lg sm:p-10">
              <SproutIcon name="book" className="absolute -right-5 -top-8 h-24 w-24 text-[#4f1f71] opacity-20" />
            <div className="relative">
              <span className="inline-flex rounded-full bg-[#4f1f71] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-sm">Background</span>
              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-[#4f1f71] sm:text-4xl">A strong foundation inspired by NEP 2020</h2>
              <p className="mt-5 max-w-5xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
                The National Education Policy (NEP 2020) envisages providing high-quality preschool education in an organized institutional setting for children above three years of age as one of its key priorities. The National Curriculum Framework for Foundational Stage 2022 (NCFFS) states that early education helps promote the nation’s long-term economic growth while supporting the development of the health, cognitive skills, and character necessary for each individual’s future success. At Ansar English School, Perumpilavu, we follow the new Fly High curriculum for the foundational stage of schooling, developed by Vidya Council for Education based on NEP 2020.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['NEP 2020 aligned', 'Foundational Stage', 'Fly High Curriculum', 'Whole-child development'].map(item => <span key={item} className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-[#4f1f71] shadow-sm ring-1 ring-white">{item}</span>)}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#fbad18]">Big joy for little learners</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">Every day brings a new little adventure</h2>
            <p className="mt-5 text-lg font-medium leading-relaxed text-slate-600">Our children learn naturally through stories, movement, imagination, sensory play, conversation, and caring classroom routines.</p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity, index) => (
              <motion.article key={activity.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -7, rotate: index % 2 ? 1 : -1 }} className={`rounded-[2rem] p-7 shadow-sm ring-4 ring-white ${activity.color}`}>
                <SproutIcon name={activity.icon} className="h-12 w-12" />
                <h3 className="mt-5 text-2xl font-black">{activity.title}</h3>
                <p className="mt-3 font-semibold leading-relaxed opacity-80">{activity.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="relative bg-gradient-to-b from-[#4f1f71]/10 to-[#4f1f71]/10 py-16 lg:py-24">
          <SproutIcon name="art" className="absolute left-[5%] top-12 h-12 w-12 text-[#fbad18] opacity-40" />
          <SproutIcon name="letters" className="absolute bottom-12 right-[5%] h-12 w-12 text-[#fbad18] opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex rounded-full bg-[#4f1f71] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-md">Our Curriculum</span>
              <h2 className="mt-5 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">FLY HIGH Curriculum</h2>
              <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">At Ansar Sprouts KG Section, children progress through the FLY HIGH textbooks—an age-appropriate journey that connects English, Mathematics, and Environmental Studies in one joyful learning experience.</p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {flyHighLevels.map((level, index) => (
                <motion.article key={level.name} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }} className="overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-lg">
                  <div className={`bg-gradient-to-r ${level.color} p-6 text-white`}>
                    <div className="flex items-center justify-between gap-4">
                      <div><p className="text-sm font-black uppercase tracking-widest text-white/80">Level {index + 1}</p><h3 className="mt-1 text-3xl font-black">{level.name}</h3></div>
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl font-black" aria-hidden="true">{level.icon}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">Ages {level.age}</span>
                    <p className="mt-5 font-semibold leading-7 text-slate-600">{level.text}</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-10 rounded-[2.2rem] border-4 border-white bg-gradient-to-r from-[#fbad18]/15 via-[#fbad18]/20 to-[#4f1f71]/15 p-7 shadow-lg sm:p-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#4f1f71]">Shared across Fly 1, Fly 2, and Fly 3</p>
                <h3 className="mt-3 text-3xl font-black text-[#4f1f71]">The Curio Learning Cycle</h3>
                <p className="mt-3 font-semibold leading-7 text-slate-600">Every age group experiences all three Curio stages throughout the year.</p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {curioStages.map((stage, index) => <div key={stage.name} className="relative rounded-3xl bg-white/85 p-6 text-center shadow-sm ring-1 ring-white">
                  <SproutIcon name={stage.icon} className="mx-auto h-10 w-10 text-[#4f1f71]" />
                  <h4 className="mt-3 text-xl font-black text-[#4f1f71]">{stage.name}</h4>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{stage.text}</p>
                  {index < curioStages.length - 1 && <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-2xl font-black text-[#fbad18] md:block" aria-hidden="true">→</span>}
                </div>)}
              </div>
            </div>

            <div className="mt-10 grid gap-6 rounded-[2.2rem] border-4 border-white bg-white p-7 shadow-lg sm:p-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#fbad18]">Learning connects naturally</p>
                <h3 className="mt-3 text-3xl font-black leading-tight text-[#4f1f71]">English, Math, and EVS—all woven together</h3>
                <p className="mt-4 font-semibold leading-8 text-slate-600">Rhymes, letter activities, early-number experiences, conversations, and general-knowledge themes help children understand ideas as connected parts of their everyday world.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ['music', 'Rhymes'], ['letters', 'Letters'], ['puzzle', 'Numbers'],
                  ['globe', 'EVS'], ['chat', 'English'], ['bulb', 'General Knowledge'],
                  ['book', 'Kaliveed (Malayalam)'], ['sparkle', 'Rawdthee (Arabic)'], ['people', 'Moral Science']
                ].map(([icon, label]) => <div key={label} className="rounded-2xl bg-gradient-to-br from-[#fbad18]/10 to-[#fbad18]/20 p-4 text-center ring-1 ring-[#fbad18]/20"><SproutIcon name={icon} className="mx-auto h-8 w-8 text-[#fbad18]" /><p className="mt-2 text-sm font-black text-slate-700">{label}</p></div>)}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ['Kaliveed', 'Malayalam', 'Playful mother-tongue experiences build listening, speaking, vocabulary, cultural connection, and an early love for Malayalam.'],
                ['Rawdthee', 'Arabic', 'Age-appropriate Arabic exposure develops sound recognition, simple vocabulary, confident expression, and familiarity through joyful activities.'],
                ['Moral Science', 'Values for life', 'Stories, conversations, and everyday classroom practice nurture kindness, respect, honesty, responsibility, empathy, and good habits.']
              ].map(([title, subtitle, text]) => <article key={title} className="rounded-3xl border-4 border-white bg-white p-6 shadow-md">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#fbad18]">{subtitle}</p>
                <h3 className="mt-2 text-2xl font-black text-[#4f1f71]">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{text}</p>
              </article>)}
            </div>

            <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] bg-[#4f1f71] p-7 text-center text-white shadow-xl sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#fbad18]">Skills for life</p>
              <h3 className="mt-3 text-3xl font-black">Children learn by exploring and doing</h3>
              <p className="mx-auto mt-4 max-w-4xl text-lg font-semibold leading-8 text-white/85">Our hands-on, play-centred approach builds creativity, curiosity, and confidence while developing strong academic, social, and emotional foundations for lifelong success.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#fff7e8] py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative flex min-h-80 items-center justify-center overflow-hidden bg-gradient-to-br from-[#fbad18]/70 via-[#fbad18]/35 to-[#fbad18]/20 p-10">
                <motion.div animate={{ y: [0, -10, 0], rotate: [-3, 2, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="text-center">
                  <SproutIcon name="backpack" className="mx-auto h-28 w-28 text-[#fbad18]" />
                  <div className="mt-5 inline-flex -rotate-2 rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-wider text-[#fbad18] shadow-md">Lighter bags, happier children</div>
                </motion.div>
                <span className="absolute left-7 top-7 text-4xl" aria-hidden="true">⭐</span>
                <SproutIcon name="apple" className="absolute bottom-7 right-8 h-10 w-10 text-[#4f1f71]" />
              </div>

              <div className="p-7 sm:p-10 lg:p-12">
                <span className="inline-flex rounded-full bg-[#fbad18] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">Health & Happiness</span>
                <h2 className="mt-5 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">Bag-Free Concept</h2>
                <p className="mt-5 text-lg font-semibold leading-8 text-slate-700">Prioritizing kindergarten health, Ansar Sprouts introduced a highly successful bag-free concept. The initiative reduces the weight children carry while ensuring that every learner receives nutritious food at school. The programme has earned the wholehearted acceptance of parents.</p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <article className="rounded-3xl bg-[#4f1f71]/10 p-6 ring-1 ring-[#4f1f71]/15">
                    <SproutIcon name="backpack" className="h-10 w-10 text-[#4f1f71]" />
                    <h3 className="mt-3 text-xl font-black text-[#4f1f71]">Less to carry</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">A lighter daily load supports comfort, posture, movement, and a happier beginning to the school day.</p>
                  </article>
                  <article className="rounded-3xl bg-[#4f1f71]/10 p-6 ring-1 ring-[#4f1f71]/15">
                    <SproutIcon name="bowl" className="h-10 w-10 text-[#4f1f71]" />
                    <h3 className="mt-3 text-xl font-black text-[#4f1f71]">Nutritious school food</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">School-provided meals ensure that every child receives the same nourishment in a caring shared environment.</p>
                  </article>
                </div>

                <div className="mt-6 rounded-3xl bg-[#4f1f71]/10 p-6 ring-1 ring-[#4f1f71]/15">
                  <div className="flex items-start gap-4">
                    <SproutIcon name="people" className="h-10 w-10 text-[#4f1f71]" />
                    <div><h3 className="text-xl font-black text-[#4f1f71]">Equality, unity, and belonging</h3><p className="mt-2 font-semibold leading-7 text-slate-600">Sharing the same nourishing food, together with a common uniform, promotes equality and helps children develop a natural sense of unity and integration.</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white lg:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute -inset-4 rotate-2 rounded-[2.5rem] bg-gradient-to-br from-[#fbad18]/30 to-[#fbad18]/30 blur-sm" />
                <div className="relative overflow-hidden rounded-[2.2rem] border-4 border-white/15 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl sm:p-9">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <span className="h-3 w-3 rounded-full bg-[#fbad18]" /><span className="h-3 w-3 rounded-full bg-[#fbad18]" /><span className="h-3 w-3 rounded-full bg-[#fbad18]" />
                    <span className="ml-3 text-xs font-black uppercase tracking-widest text-slate-400">Little Tech Explorer</span>
                  </div>
                  <div className="mt-7 grid grid-cols-[auto_1fr] items-center gap-5">
                    <motion.div animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><SproutIcon name="computer" className="h-20 w-20 text-[#fbad18]" /></motion.div>
                    <div className="space-y-3 font-mono text-sm font-bold sm:text-base">
                      <p className="text-[#fbad18]">when curiosity starts:</p>
                      <p className="pl-4 text-[#fbad18]">explore()</p>
                      <p className="pl-4 text-[#fbad18]/65">create()</p>
                      <p className="pl-4 text-[#fbad18]">grow_with_joy()</p>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {['Click', 'Type', 'Code'].map(item => <div key={item} className="rounded-2xl bg-white/5 p-3 text-center text-xs font-black text-slate-200 ring-1 ring-white/10 sm:text-sm">{item}</div>)}
                  </div>
                </div>
              </div>

              <div>
                <span className="inline-flex rounded-full bg-[#fbad18] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-950">Learning with Cyber Square</span>
                <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#fbad18]">Computer Lab</p>
                <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Little Tech Explorer</h2>
                <p className="mt-5 text-xl font-black text-[#fbad18]">Fun with technology for little learners!</p>
                <p className="mt-5 text-lg font-semibold leading-8 text-slate-300">In collaboration with the Cyber Square team, our computer lab introduces children to technology and early coding in an engaging, age-appropriate, and secure environment. Guided activities help little learners become comfortable with computers while developing essential digital skills, eye–hand coordination, logical thinking, and curiosity for learning.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {['Early coding', 'Computer basics', 'Eye–hand coordination', 'Logical thinking', 'Safe exploration'].map(item => <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#fbad18] ring-1 ring-white/20">{item}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white to-[#fbad18]/10 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-[#fbad18] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-md">Sprouts Facilities</span>
              <h2 className="mt-5 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">Spaces made for little learners</h2>
              <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">Every space is thoughtfully planned to help children read, think, create, explore, and become comfortable with the world around them.</p>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {sproutsFacilities.map((facility, index) => (
                <motion.article key={facility.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }} className="overflow-hidden rounded-[2.2rem] border-4 border-white bg-white shadow-xl">
                  <div className={`relative flex min-h-52 items-center justify-center overflow-hidden bg-gradient-to-br ${facility.color} p-8`}>
                    {facility.imageField ? <img src={data?.[facility.imageField] || DEFAULT_RADIO_STATION_IMAGE} alt={`${facility.title} facility`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /> : <motion.div animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}><SproutIcon name={facility.icon} className={`h-24 w-24 ${facility.accent}`} /></motion.div>}
                  </div>
                  <div className="p-7">
                    <p className={`text-xs font-black uppercase tracking-[0.18em] ${facility.accent}`}>Dedicated Facility</p>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-[#4f1f71]">{facility.title}</h3>
                    <p className="mt-4 font-semibold leading-7 text-slate-600">{facility.description}</p>
                    <ul className="mt-5 space-y-2">{facility.highlights.map(item => <li key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700"><span className="h-2 w-2 rounded-full bg-[#fbad18]" /><span>{item}</span></li>)}</ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#4f1f71] py-16 text-white lg:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4f1f71] via-[#4f1f71] to-[#4f1f71] p-7 shadow-2xl sm:p-10 lg:p-14">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#fbad18]/15 blur-2xl" />
              <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[#fbad18]/10 blur-2xl" />
              <div className="relative grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
                <div className="flex min-h-72 items-center justify-center rounded-[2rem] bg-white/10 p-8 ring-1 ring-white/15">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="flex h-48 w-48 items-center justify-center rounded-full bg-[#fbad18] text-[#4f1f71] shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
                    <SproutIcon name="family" className="h-28 w-28" />
                  </motion.div>
                </div>

                <div>
                  <span className="inline-flex rounded-full bg-[#fbad18] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#4f1f71]">A Sprouts Highlight</span>
                  <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#fbad18]">Parental Support</p>
                  <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">A partnership in your child&apos;s education</h2>
                  <p className="mt-6 text-lg font-semibold leading-8 text-white/85">With more than four decades of educational experience, Ansar English School strongly believes that parental involvement is essential to every child&apos;s success. At Ansar Sprouts, parents, teachers, and children work together in a caring, collaborative environment so that each learner can reach their full potential.</p>
                  <p className="mt-4 font-semibold leading-8 text-white/75">We encourage this partnership through regular parent-teacher conferences, open-door interactions, parent-child learning activities, teacher home visits, classroom volunteering, and school events. Initiatives such as <span className="font-black text-[#fbad18]">Moms in Classrooms</span> and opportunities for parents to participate as resource persons allow families to make a meaningful contribution to school life.</p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {[
                      ['people', 'Parent-teacher partnership'],
                      ['home', 'Open interaction and home visits'],
                      ['book', 'Parent-child learning activities'],
                      ['heart', 'Moms in Classrooms and volunteering']
                    ].map(([icon, label]) => <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><SproutIcon name={icon} className="h-6 w-6 shrink-0 text-[#fbad18]" /><span className="text-sm font-black text-white/90">{label}</span></div>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-b from-[#fbad18]/10 to-blue-100 py-16 lg:py-24">
          <motion.div animate={{ x: [0, 18, 0], rotate: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-[4%] top-16 hidden text-[#fbad18] opacity-40 md:block"><SproutIcon name="skate" className="h-16 w-16" /></motion.div>
          <motion.div animate={{ x: [0, -18, 0], rotate: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-16 right-[4%] hidden text-blue-600 opacity-40 md:block"><SproutIcon name="bike" className="h-16 w-16" /></motion.div>
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-600 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-md">Extra-Curricular Activities</span>
              <h2 className="mt-5 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">Move, play, and grow with confidence</h2>
              <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">Joyful physical activities help our young learners become active, balanced, resilient, and ready to try something new.</p>
            </div>

            <div className="mt-12 grid gap-7 lg:grid-cols-2">
              <motion.article initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} whileHover={{ y: -8, rotate: -0.5 }} className="overflow-hidden rounded-[2.3rem] border-4 border-white bg-white shadow-xl">
                <div className="flex min-h-56 items-center justify-center bg-gradient-to-br from-[#fbad18] via-[#4f1f71] to-[#fbad18] p-8">
                  <motion.div animate={{ x: [-8, 8, -8] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}><SproutIcon name="skate" className="h-28 w-28 text-white" /></motion.div>
                </div>
                <div className="p-7 sm:p-9">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4f1f71]">Skating</p>
                  <h3 className="mt-2 text-3xl font-black leading-tight text-[#4f1f71]">Glide into Confidence</h3>
                  <p className="mt-4 text-base font-semibold leading-8 text-slate-600">At Ansar Sprouts Pre-School, skating is more than a fun activity—it is a journey of balance, discipline, and joy. Children stay active, build confidence, and enjoy learning new skills while having fun on wheels.</p>
                  <div className="mt-6 flex flex-wrap gap-2">{['Balance', 'Discipline', 'Confidence', 'Active fun'].map(item => <span key={item} className="rounded-full bg-[#4f1f71]/10 px-4 py-2 text-sm font-black text-[#4f1f71]">{item}</span>)}</div>
                </div>
              </motion.article>

              <motion.article initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} whileHover={{ y: -8, rotate: 0.5 }} className="overflow-hidden rounded-[2.3rem] border-4 border-white bg-white shadow-xl">
                <div className="flex min-h-56 items-center justify-center bg-gradient-to-br from-[#fbad18] via-[#fbad18] to-[#fbad18] p-8">
                  <motion.div animate={{ x: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><SproutIcon name="bike" className="h-28 w-28 text-white" /></motion.div>
                </div>
                <div className="p-7 sm:p-9">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4f1f71]">Cycling</p>
                  <h3 className="mt-2 text-3xl font-black leading-tight text-[#4f1f71]">Pedal Towards Happiness</h3>
                  <p className="mt-4 text-base font-semibold leading-8 text-slate-600">Ride, learn, and grow! Cycling at Ansar Sprouts Pre-School keeps children energetic, strong, and joyful. With every ride, they develop balance, stamina, and confidence in a safe and encouraging atmosphere.</p>
                  <div className="mt-6 flex flex-wrap gap-2">{['Energy', 'Stamina', 'Balance', 'Safe learning'].map(item => <span key={item} className="rounded-full bg-[#4f1f71]/10 px-4 py-2 text-sm font-black text-[#4f1f71]">{item}</span>)}</div>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#4f1f71]/10 to-[#4f1f71]/15 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] border-4 border-white bg-white p-7 shadow-xl sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
              <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4f1f71]/30 via-[#4f1f71]/20 to-[#fbad18]/35">
                <motion.div animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="text-center">
                <SproutIcon name="skate" className="mx-auto h-28 w-28 text-[#4f1f71]" />
                  <p className="mt-5 rounded-full bg-white/90 px-5 py-2 text-sm font-black uppercase tracking-wider text-[#4f1f71] shadow">Play safely • Grow happily</p>
                </motion.div>
                <SproutIcon name="sun" className="absolute left-7 top-7 h-10 w-10 text-[#fbad18]" />
                <SproutIcon name="tree" className="absolute bottom-7 right-7 h-10 w-10 text-[#4f1f71]" />
              </div>

              <div>
                <span className="inline-flex rounded-full bg-[#4f1f71] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">KG Outdoor Play</span>
                <h2 className="mt-5 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">Safe Play Area</h2>
                <p className="mt-5 text-lg font-semibold leading-8 text-slate-700">Ansar Sprouts has a dedicated outdoor play area with safe, age-appropriate equipment such as swings, slides, and a merry-go-round. Active play helps our youngest learners develop balance, coordination, confidence, friendships, and joyful movement.</p>
                <div className="mt-6 rounded-2xl bg-[#fbad18]/10 p-5 ring-1 ring-[#fbad18]/20">
                  <p className="font-bold leading-7 text-[#4f1f71]">This Joyful Play Zone is specially designed for the KG section. Other sections of Ansar English School also have play areas suited to their age groups.</p>
                </div>
                <Link to="/learning/special-play-area" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4f1f71] px-7 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#3d1758]">Explore Joyful Play Zone <span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#4f1f71] py-16 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#fbad18]">A gentle daily rhythm</p>
                <h2 className="mt-3 text-4xl font-black sm:text-5xl">Small routines help children feel safe</h2>
                <p className="mt-5 text-lg font-medium leading-relaxed text-white/80">Familiar moments help our youngest learners settle in, become independent, and enjoy school with confidence.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {dayMoments.map(([icon, label], index) => (
                  <motion.div key={label} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="rounded-3xl bg-white/10 p-5 text-center ring-1 ring-white/15 backdrop-blur">
                    <SproutIcon name={icon} className="mx-auto h-10 w-10 text-[#fbad18]" />
                    <p className="mt-3 text-sm font-black text-white">{label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="grid items-center gap-8 overflow-hidden rounded-[2.5rem] border-4 border-white bg-gradient-to-br from-[#4f1f71]/15 via-[#4f1f71]/15 to-[#fbad18]/20 p-7 shadow-xl sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f1f71]">Learning Beyond the Classroom</p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">Every visit becomes a joyful discovery</h2>
              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-600">Our little explorers visit different places to connect with the community and experience the real world. See Ansar Sprouts trips and educational journeys from every school section on our dedicated Field Trips page.</p>
            </div>
              <div className="text-center"><motion.div animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity }}><SproutIcon name="bus" className="mx-auto h-24 w-24 text-[#4f1f71]" /></motion.div><Link to="/field-trips" className="mt-5 inline-flex rounded-full bg-[#4f1f71] px-7 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#3d1758]">Explore Field Trips</Link></div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#fbad18]/15 p-8 text-center shadow-sm sm:p-12">
              <SproutIcon name="heart" className="absolute left-7 top-6 h-10 w-10 text-[#fbad18]" />
              <SproutIcon name="sparkle" className="absolute bottom-6 right-8 h-10 w-10 text-[#fbad18]" />
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f1f71]">Parents are part of the journey</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight text-slate-900 sm:text-5xl">Little milestones deserve big smiles</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-relaxed text-slate-600">Our teachers keep families connected as children learn to speak clearly, share happily, finish small tasks, make friends, and become more independent.</p>
            <Link to="/contact" className="mt-8 inline-flex rounded-full bg-[#fbad18] px-7 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#4f1f71]">Come and meet us</Link>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 overflow-hidden rounded-[2.5rem] border border-[#4f1f71]/15 bg-gradient-to-br from-[#4f1f71] via-[#4f1f71] to-[#4f1f71] p-7 text-white shadow-2xl sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:p-12">
              <div className="flex min-h-72 items-center justify-center rounded-[2rem] bg-white/10 p-8 ring-1 ring-white/15">
                <div className="flex h-48 w-48 items-center justify-center rounded-full bg-[#fbad18] text-[#4f1f71] shadow-xl">
                  <SproutIcon name="people" className="h-28 w-28" />
                </div>
              </div>
              <div>
                <span className="inline-flex rounded-full bg-[#fbad18] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#4f1f71]">Faculty</span>
                <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">Teachers who nurture, mentor, and inspire</h2>
                <p className="mt-5 text-lg font-semibold leading-8 text-white/90">Ansar English School, Perumpilavu is committed to fostering a thriving educational environment. Our dedicated team of well-educated and trained teachers creates a nurturing and supportive atmosphere in which every child feels encouraged to learn and grow.</p>
                <p className="mt-4 font-semibold leading-8 text-white/75">Beyond traditional teaching roles, our educators serve as mentors who guide students academically and personally. We continually invest in professional development through CBSE-certified courses, online and offline workshops, and school empowerment initiatives, equipping teachers to inspire learners and help them reach their full potential.</p>
                <div className="mt-7 flex flex-wrap gap-3">{['Qualified educators', 'Caring mentors', 'CBSE-certified training', 'Continuous development'].map(item => <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#fbad18] ring-1 ring-white/20">{item}</span>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#4f1f71]/10 to-[#fbad18]/10 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f1f71]">Celebrating every learning moment</p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">Culture, confidence, and joyful expression</h2>
            </div>

            <div className="mt-12 grid gap-7 lg:grid-cols-2">
              <motion.article initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} className="overflow-hidden rounded-[2.3rem] border-4 border-white bg-white shadow-xl">
                <div className="flex min-h-52 items-center justify-center bg-gradient-to-br from-[#4f1f71]/30 via-[#fbad18]/30 to-[#4f1f71]/20 p-8 text-[#4f1f71]"><SproutIcon name="globe" className="h-28 w-28" /></div>
                <div className="p-7 sm:p-9">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4f1f71]">Day Observances & Celebrations</p>
                  <h3 className="mt-3 text-3xl font-black leading-tight text-[#4f1f71]">Special days become meaningful lessons</h3>
                  <p className="mt-5 font-semibold leading-8 text-slate-600">At Ansar Sprouts Preschool, every special day is a meaningful learning experience. Through engaging celebrations and day observances, little learners explore culture, values, traditions, nature, health, and national pride in a fun and interactive way.</p>
                  <p className="mt-4 font-semibold leading-8 text-slate-600">Themed activities, performances, creative crafts, games, and hands-on experiences develop awareness, confidence, creativity, and responsibility while creating joyful memories that last a lifetime.</p>
                  <a href="#sprouts-activity-gallery" className="mt-7 inline-flex rounded-full bg-[#4f1f71] px-6 py-3 font-black text-white shadow transition hover:-translate-y-1 hover:bg-[#4f1f71]">View Celebration Activities</a>
                </div>
              </motion.article>

              <motion.article initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} className="overflow-hidden rounded-[2.3rem] border-4 border-white bg-white shadow-xl">
                <div className="flex min-h-52 items-center justify-center bg-gradient-to-br from-[#fbad18]/65 via-[#fbad18]/30 to-[#fbad18]/35 p-8 text-[#4f1f71]"><SproutIcon name="sparkle" className="h-28 w-28" /></div>
                <div className="p-7 sm:p-9">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4f1f71]">Talent Days</p>
                  <h3 className="mt-3 text-3xl font-black leading-tight text-[#4f1f71]">Every little star gets a chance to shine</h3>
                  <p className="mt-5 font-semibold leading-8 text-slate-600">Each class hosts its own special Talent Day around a unique theme, giving children the opportunity to confidently showcase creativity, skills, and imagination through songs, dance, storytelling, role play, art, and much more.</p>
                  <p className="mt-4 font-semibold leading-8 text-slate-600">We believe every child has a unique talent waiting to bloom. The themed Talent Day builds confidence, encourages self-expression, and creates unforgettable moments filled with learning, applause, and happiness.</p>
                  <a href="#sprouts-activity-gallery" className="mt-7 inline-flex rounded-full bg-[#fbad18] px-6 py-3 font-black text-white shadow transition hover:-translate-y-1 hover:bg-[#4f1f71]">View Talent Day Activities</a>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="sprouts-activity-gallery" className="scroll-mt-24 border-t border-[#fbad18]/20 bg-gradient-to-b from-[#fbad18]/10 via-white to-[#4f1f71]/10 py-16 lg:py-24">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-[#fbad18] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-md">Sprouts Activity Gallery</span>
              <h2 className="mt-5 text-4xl font-black leading-tight text-[#4f1f71] sm:text-5xl">Little moments, joyful discoveries</h2>
              <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">Browse activities, celebrations, creative experiences, and everyday learning journeys. Select any story to read the complete article and view all its photographs.</p>
            </div>
            {activitiesLoading ? <div className="mt-12 rounded-3xl bg-white p-10 text-center font-bold text-slate-500 shadow-sm">Loading Sprouts activities...</div> : sproutsActivities.some(item => item.published !== false) ? <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{sproutsActivities.filter(item => item.published !== false).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || String(b.date || '').localeCompare(String(a.date || ''))).map((activity, index) => <SproutsActivityCard key={activity.id} activity={activity} index={index} />)}</div> : <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-[#fbad18]/20 bg-white p-9 text-center font-semibold text-slate-500 shadow-sm">Celebration and Talent Day activity articles will appear here when they are published from the Sprouts admin tab.</div>}
          </div>
        </section>
      </main>
    </Layout>
  );
}
