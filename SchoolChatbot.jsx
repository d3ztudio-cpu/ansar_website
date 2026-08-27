import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getGenerativeModel } from 'firebase/ai';
import { Link } from 'react-router-dom';
import { ai } from './firebase-ai-init';
import { useSettings } from './SettingsContext';
import { useContentCollection } from './useContentCollection';
import { useFirestoreCollection } from './useFirestoreCollection';
import { LEARNING_LABS } from './learningLabsConfig';

const CHAT_MODEL = 'gemini-3.5-flash';

const NAVIGATION_GUIDE = [
  { label: 'Admissions', path: '/admission', keywords: ['admission', 'apply', 'fee', 'fees', 'payment', 'tc', 'prospectus'] },
  { label: 'Academics', path: '/academics', keywords: ['academic', 'class', 'cbse', 'curriculum', 'exam', 'learning'] },
  { label: 'News', path: '/news', keywords: ['news', 'update', 'announcement'] },
  { label: 'Events', path: '/events', keywords: ['event', 'program', 'celebration'] },
  { label: 'Achievements', path: '/achievements', keywords: ['achievement', 'award', 'winner'] },
  { label: 'Mandatory Disclosure', path: '/mandatory-public-disclosure', keywords: ['disclosure', 'document', 'public', 'mandatory'] },
  { label: 'Ansar Times', path: '/ansar-times', keywords: ['magazine', 'newsletter', 'ansar times'] },
  { label: 'Ansar Sprouts', path: '/ansar-sprouts', keywords: ['sprouts', 'preschool', 'pre-kg', 'prekg', 'kindergarten', 'fly high', 'curio'] },
  { label: 'Life at Ansar', path: '/life-at-ansar', keywords: ['spc', 'student police', 'nss', 'national service', 'club', 'life at ansar'] },
  { label: 'Learning Labs', path: '/learning/advanced-labs', keywords: ['lab', 'laboratory', 'atl', 'robotics', 'coding', 'chemistry', 'biology', 'physics', 'computer', 'maths', 'home science'] },
  { label: 'Field Trips', path: '/field-trips', keywords: ['field trip', 'fieldtrip', 'educational visit', 'excursion', 'learning beyond classroom'] },
  { label: 'Contact', path: '/contact', keywords: ['contact', 'phone', 'email', 'location', 'address', 'whatsapp'] }
];

const QUICK_QUESTIONS = [
  'Tell me about Ansar English School',
  'Explain the school leadership',
  'Guide me through this website',
  'Guide me for admission'
];

const SCHOOL_PROFILE_CONTEXT = [
  'History: Ansar English School was founded in 1980/1982 as the flagship educational institution of Ansari Charitable Trust in Perumpilavu. It grew from a humble initiative into a respected CBSE Senior Secondary school in Kerala.',
  'Milestones: Ansari Charitable Trust got registered in 1979. The school got registered in 1982, received CBSE affiliation in 1988, became Senior Secondary in 1990, sent its first Class XII batch in 1992, received NABET accreditation in 2024, and marked 2026 as the Year of Sustainability.',
  'Trust and service: The school is shaped by Ansari Charitable Trust, whose wider service ecosystem includes education, healthcare, social welfare, an orphanage, a special school, and women\'s education initiatives.',
  'Scale: The campus serves over 4,600 students with 270+ educators/staff members and has 40+ years of service in value-based education.',
  'Affiliation and accreditation: Ansar English School is affiliated with CBSE, New Delhi, and is NABET accredited. The site presents it as the first school in Thrissur accredited by NABET.',
  'Facilities: a safe and secure CCTV-supported campus, future-ready learning spaces with smart boards, a dedicated support team, joyful play zone, experiential learning labs, Champions Arena, safe school transport, healthy dining spaces, ATL tinkering/innovation spaces, science and computer labs, language enrichment, exam preparation support, and a library with more than 34,000 books and learning resources.',
  'Academic pathway: Ansar Sprouts for foundational early learning, Primary School for literacy/numeracy/environmental awareness, Middle School for concept clarity and analytical thinking, and Senior Secondary for subject depth, practical work, projects, and CBSE exam preparation.',
  'Campus life: The school supports sports, arts, innovation, entrepreneurship, environmental stewardship, community engagement, Student Police Cadet, NSS, clubs, NIOS, life skills, leadership, and co-curricular programmes.',
  'Value Integration: the curriculum integrates respect, empathy, responsibility, and perseverance into learning while promoting ethical behaviour, spiritual awareness, cultural appreciation, integrity, resilience, personal growth, and a purposeful contribution to society.',
  'Faculty: Ansar English School has dedicated, well-educated, professionally trained teachers who provide a nurturing learning environment and serve as academic and personal mentors. The school invests continuously in CBSE-certified courses, online and offline workshops, school empowerment programmes, and other professional development opportunities.',
  'Ansar Media and Production: An in-house media unit for photography, videography, drone videography, podcast production, graphic designing, editing, event documentation, social media creatives, reels, institutional presentations, and communication support for school activities.',
  'Virtual tour: A 360 degree virtual campus tour is linked from the About page at https://www.p4panorama.com/360-virtual-tour/ansar-school/.'
].join('\n');

const RECENT_PROGRAMME_CONTEXT = [
  'Ansar Sprouts: the preschool/foundational-stage section provides joyful, play-centred learning for young children in a safe, caring, stimulating environment. It develops curiosity, confidence, values, creativity, academic readiness, social-emotional foundations, and 21st-century skills in partnership with parents.',
  'Sprouts policy and curriculum: the programme is aligned with NEP 2020 and the National Curriculum Framework for Foundational Stage 2022. It follows the Fly High curriculum developed by Vidya Council for Education. Fly 1 is for ages 3–4, Fly 2 is for ages 4–5, and Fly 3 is for ages 5–6. Touch Curio, Feel Curio, and Create Curio are common learning stages followed across all three Fly levels and years. The curriculum includes English, Mathematics, EVS, General Knowledge, Kaliveed (Malayalam), Rawdthee (Arabic), and Moral Science through rhymes, letters, numbers, language, exploration, values, and hands-on play.',
  'Sprouts contact: +91 81298 51737. The Contact form lets visitors choose School or Ansar Sprouts and then opens the corresponding WhatsApp conversation. The general school number remains +91 81298 08051.',
  'Sprouts bag-free concept: Ansar Sprouts reduces the weight kindergarten children carry and provides nutritious food at school. The parent-supported programme prioritizes health and comfort. Providing the same nourishment to every child, together with a common uniform, promotes equality, unity, integration, and belonging.',
  'Sprouts extra-curricular activities include skating and cycling in a safe, encouraging atmosphere. Skating develops balance, discipline, confidence, activity, and joy. Cycling develops energy, strength, balance, stamina, confidence, and happiness.',
  'Sprouts Computer Lab – Little Tech Explorer: in collaboration with the Cyber Square team, young children practise technology and early coding in a secure, engaging, age-appropriate environment. Activities develop basic computer skills, eye–hand coordination, logical thinking, safe digital exploration, and curiosity.',
  'Sprouts Safe Play Area: the Joyful Play Zone is the dedicated KG-section outdoor park with safe, age-appropriate swings, slides, and a merry-go-round. It develops movement, balance, coordination, confidence, friendship, and joy. Other school sections have separate age-appropriate play areas. Images can be added later through the Joyful Play Zone carousel in the Student-Centric Learning admin module.',
  'Sprouts has three additional dedicated facilities. The Learning Resource Center contains books, puzzles, and educational toys for structured learning through play. Smart Classrooms use smart TVs for guided early digital exposure, visual lessons, stories, rhymes, and concepts. The Art and Craft Room supports drawing, painting, cutting, pasting, imagination, fine-motor coordination, and creative expression.',
  'Parental Support is a highlighted part of Ansar Sprouts. The preschool builds a close partnership among parents, teachers, and children through parent-teacher conferences, open-door interactions, parent-child learning activities, teacher home visits, classroom volunteering, school events, Moms in Classrooms, and parents serving as resource persons.',
  'The Ansar Sprouts page includes its own specialized Activity Gallery, separate from the main school gallery. Published activity articles can include a title, category, date, description, and an automatic multi-image carousel managed from the Sprouts admin tab and stored in Google Sheets.',
  'Ansar Sprouts observes special days through themed activities, performances, crafts, games, and hands-on experiences that build cultural, environmental, health, values, and national awareness. Class-wise themed Talent Days let every child showcase songs, dance, storytelling, role play, art, creativity, and imagination while building confidence and self-expression. Buttons in both sections lead to the Sprouts Activity Gallery.',
  'Field Trips – Learning Beyond the Classroom: educational visits connect students with communities, places, people, nature, and real-life experiences. The formal Field Trips page categorizes published trips as Ansar Sprouts, Primary, Middle, Secondary, Senior Secondary, or General and presents trip details, destination, date, and photographs.',
  'Student Police Cadet (SPC): a flagship programme at Ansar English School that builds discipline, leadership, confidence, teamwork, empathy, integrity, civic responsibility, physical fitness, emotional resilience, patriotism, and service. Activities include Joyful Kids, anti-drug awareness, road safety, social outreach, environmental conservation, disaster preparedness, and community welfare.',
  'National Service Scheme (NSS): Unit SFU/3 at Ansar English School follows the motto “Not Me But You.” It develops selfless service, leadership, social responsibility, national integration, and environmental consciousness through outreach, conservation, health and awareness campaigns, disaster preparedness, social service, and volunteer projects.',
  'Life at Ansar includes dedicated Clubs, NSS, and SPC sections with programme content and image carousels managed from the admin panel.'
].join('\n');

const TRUSTEES_CONTEXT = [
  'Chairman: MAMMUNNI K K',
  'Acting Chairman: V T ABDULLAH KOYA THANGAL',
  'Vice Chairman: MOHAMMED K V',
  'Secretary: E A KUNJAHAMMU',
  'Assistant Secretary: SHAJU MOHAMEDUNNI',
  'Trust/Managing Committee members listed on the website include NAJEEB P, MOHAMMED AMEEN E M, MOOSA V, NOOR MOHAMMED KAMALUDHEEN, MUHAMMED SHEREEF E V, ABDUL HAMEED, K K SHANAVAS, MOHAMED KUTTY KAYINGIL, ISMAIL KASIM, SHOUKATH ALI KOROTH, T A MOIDEEN ALIAS MOIDUTTY, M I ABDUL AZEEZ, A USMAN, ANWAR ABDUL MAJEED, MUJEEB RAHMAN P, Dr. MOHAMED BADEEUZZAMAN, Dr. MOHAMMED ALI MAMPPILLY (KOOTTIL), and P I NOUSHAD.'
].join('\n');

function stripHtml(value = '') {
  return String(value)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function trimText(value = '', limit = 220) {
  const text = stripHtml(value);
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function formatItems(items, fields) {
  return items
    .filter(item => item && item.published !== false)
    .slice(0, 6)
    .map(item => fields.map(field => item[field]).filter(Boolean).join(' - '))
    .filter(Boolean)
    .join('\n');
}

function getContentDateTime(item) {
  const dateTime = Date.parse(item?.date);
  if (!Number.isNaN(dateTime)) return dateTime;
  if (item?.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item?.createdAt?.seconds) return item.createdAt.seconds * 1000;
  return Number.MIN_SAFE_INTEGER;
}

function summarizeCollection(items, label) {
  const summary = [...items]
    .filter(item => item && item.published !== false)
    .sort((a, b) => getContentDateTime(b) - getContentDateTime(a))
    .slice(0, 8)
    .map(item => {
      const heading = item.title || item.name || item.destination || item.category || item.slug;
      const details = trimText(item.description || item.content || item.bodyHtml || item.caption || item.summary, 260);
      return [item.date, heading, details].filter(Boolean).join(' - ');
    })
    .filter(Boolean)
    .join('\n');
  return `${label}:\n${summary || `No published ${label.toLowerCase()} currently loaded.`}`;
}

function buildSiteContext({ settings, updates, achievements, disclosures, ansarTimes, pages, leadership, learningLabs, sportsAchievements, fieldTrips, sproutsActivities, gallery, learningFeatures }) {
  const news = updates
    .filter(item => item.published !== false && (item.category === 'News' || !item.category))
    .sort((a, b) => getContentDateTime(b) - getContentDateTime(a));
  const events = updates
    .filter(item => item.published !== false && item.category === 'Events')
    .sort((a, b) => getContentDateTime(b) - getContentDateTime(a));
  const dateOrderedAchievements = [...achievements].sort((a, b) => getContentDateTime(b) - getContentDateTime(a));
  const pageSummaries = pages
    .filter(page => page?.published !== false)
    .slice(0, 8)
    .map(page => `${page.title || page.slug}: ${trimText(page.bodyHtml || page.content || page.description, 180)}`)
    .join('\n');
  const leadershipSummary = leadership
    .filter(person => person?.published !== false)
    .slice(0, 14)
    .map(person => [person.role || person.section, person.name, person.qualification || person.qualifications].filter(Boolean).join(' - '))
    .filter(Boolean)
    .join('\n');
  const juniorPrincipals = Array.isArray(settings?.juniorPrincipals)
    ? settings.juniorPrincipals
        .filter(person => person?.name || person?.section)
        .map(person => [person.section || 'Junior Principal', person.name, person.qualification || person.qualifications].filter(Boolean).join(' - '))
        .join('\n')
    : '';
  const labs = LEARNING_LABS.map(defaultLab => ({
    ...defaultLab,
    ...(learningLabs.find(item => item.id === defaultLab.slug || item.slug === defaultLab.slug) || {})
  }));
  const labsSummary = labs.map(lab => `${lab.title}: ${trimText(lab.description, 260)}`).join('\n');

  return [
    'School: Ansar English School, Perumpilavu, Thrissur, Kerala. CBSE-affiliated and NABET accredited.',
    SCHOOL_PROFILE_CONTEXT,
    RECENT_PROGRAMME_CONTEXT,
    TRUSTEES_CONTEXT,
    'Contact: School phone +91 81298 08051. Ansar Sprouts phone +91 81298 51737. Email hr@ansar.in. Address Ansar English School, Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519.',
    'Admission: Applications are open annually from Jan 01 to March 31. Above LKG requires a language proficiency and diagnostic assessment. Admission and payment portal: https://ansartrust.atcampussolutions.com/school/.',
    `Fee structure: ${settings?.feeStructureTitle || 'Fee Structure'} - ${settings?.feeStructurePdfUrl || 'available on the Admission page'}.`,
    `Vision: ${trimText(settings?.visionText, 240)}`,
    `Mission: ${trimText(settings?.missionText, 360)}`,
    `Director: ${settings?.directorName || 'Dr. Najeeb Mohamad'} ${settings?.directorQualifications || ''}.`,
    `Principal: ${settings?.principalName || 'Ms. Sajidha Razak'} ${settings?.principalQualifications || ''}.`,
    `Leadership and staff from admin/settings:\n${leadershipSummary || juniorPrincipals || 'Director, Principal, Junior Principals, teachers, and support staff are represented on the website/admin panel.'}`,
    `Junior Principals from settings:\n${juniorPrincipals || 'Junior principal details are available on the home page when configured.'}`,
    `News by date:\n${formatItems(news, ['date', 'title', 'description']) || 'No published news currently loaded.'}`,
    `Events by date:\n${formatItems(events, ['date', 'title', 'description']) || 'No published events currently loaded.'}`,
    `Achievements:\n${formatItems(dateOrderedAchievements, ['date', 'title', 'studentName', 'description']) || 'No published achievements currently loaded.'}`,
    summarizeCollection(sportsAchievements, 'Sports achievements'),
    summarizeCollection(fieldTrips, 'Field trips'),
    summarizeCollection(sproutsActivities, 'Ansar Sprouts activities'),
    summarizeCollection(gallery, 'Gallery updates'),
    summarizeCollection(learningFeatures, 'Student-centric learning features'),
    `Public disclosure documents:\n${formatItems(disclosures, ['section', 'title']) || 'No public disclosure documents currently loaded.'}`,
    `Ansar Times:\n${formatItems(ansarTimes, ['year', 'month']) || 'No magazine issues currently loaded.'}`,
    `Admin-managed pages:\n${pageSummaries || 'No extra admin pages currently loaded.'}`,
    `Experiential Learning Labs:\n${labsSummary}`,
    `Navigation map: ${NAVIGATION_GUIDE.map(item => `${item.label}=${item.path}`).join(', ')}, Ansar Media and Production=/ansar-media-production, Sports=/sports-page, ATL=/atl, Ansar Sprouts=/ansar-sprouts, Life at Ansar=/life-at-ansar.`
  ].join('\n\n');
}

function findNavigationMatches(question) {
  const normalized = question.toLowerCase();
  return NAVIGATION_GUIDE.filter(item => item.keywords.some(keyword => normalized.includes(keyword))).slice(0, 3);
}

function isDetailedSchoolQuestion(question) {
  const normalized = question.toLowerCase();
  return [
    'institution',
    'school',
    'ansar',
    'about',
    'history',
    'leader',
    'leadership',
    'principal',
    'director',
    'trust',
    'trustee',
    'website',
    'site',
    'navigate',
    'facilities',
    'campus',
    'sprouts',
    'preschool',
    'spc',
    'nss',
    'lab'
  ].some(keyword => normalized.includes(keyword));
}

function getFallbackAnswer(question, context) {
  const matches = findNavigationMatches(question);
  const lower = question.toLowerCase();

  if (lower.includes('sprouts') && (lower.includes('contact') || lower.includes('phone') || lower.includes('whatsapp') || lower.includes('number'))) {
    return 'You can contact Ansar Sprouts Preschool at +91 81298 51737. On the Contact page, choose “Ansar Sprouts” before submitting and the prepared enquiry will open in WhatsApp for that number.';
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('location')) {
    return 'You can contact Ansar English School at +91 81298 08051, Ansar Sprouts Preschool at +91 81298 51737, or email hr@ansar.in. The campus is at Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519. The Contact form lets you choose School or Ansar Sprouts before continuing to WhatsApp.';
  }

  if (lower.includes('bag-free') || lower.includes('bag free') || (lower.includes('sprouts') && (lower.includes('food') || lower.includes('meal') || lower.includes('bag')))) {
    return 'Ansar Sprouts follows a parent-supported bag-free concept that reduces the weight kindergarten children carry and provides nutritious food at school. Giving every child the same nourishment, together with a common uniform, supports health, comfort, equality, unity, integration, and a shared sense of belonging.';
  }

  if (lower.includes('skating') || lower.includes('cycling')) {
    return 'Ansar Sprouts offers skating and cycling as joyful extra-curricular activities in a safe and encouraging atmosphere. Skating helps children develop balance, discipline, confidence, and active coordination. Cycling builds energy, strength, stamina, balance, confidence, and happiness.';
  }

  if (lower.includes('cyber square') || (lower.includes('sprouts') && (lower.includes('computer') || lower.includes('coding') || lower.includes('technology')))) {
    return 'The Ansar Sprouts Computer Lab programme, Little Tech Explorer, is conducted with the Cyber Square team. Young children explore computers and early coding through secure, engaging, age-appropriate activities that develop basic digital skills, eye–hand coordination, logical thinking, safe technology habits, and curiosity.';
  }

  if (lower.includes('joyful play') || lower.includes('safe play') || (lower.includes('sprouts') && (lower.includes('park') || lower.includes('play area') || lower.includes('swing') || lower.includes('slide')))) {
    return 'The Joyful Play Zone is the dedicated Ansar Sprouts KG-section outdoor park. It has safe, age-appropriate equipment such as swings, slides, and a merry-go-round, supporting balance, coordination, confidence, friendship, and joyful movement. Other school sections have their own age-appropriate play areas. Open the Joyful Play Zone page for details and photographs.';
  }

  if (lower.includes('resource center') || lower.includes('resource centre') || lower.includes('art and craft') || lower.includes('art & craft') || (lower.includes('sprouts') && (lower.includes('smart classroom') || lower.includes('facilities')))) {
    return 'Ansar Sprouts has three dedicated learning facilities: a Learning Resource Center with books, puzzles, and educational toys for structured learning through play; Smart Classrooms equipped with smart TVs for age-appropriate digital learning; and an Art and Craft Room where children develop creativity through drawing, painting, cutting, and pasting.';
  }

  if (lower.includes('field trip') || lower.includes('fieldtrip') || lower.includes('educational visit') || lower.includes('excursion')) {
    return 'Ansar’s Field Trips page presents learning beyond the classroom through categorized educational visits for Ansar Sprouts, Primary, Middle, Secondary, Senior Secondary, and General groups. Each published trip can include its date, destination, description, and photo carousel. Open /field-trips to explore the journeys.';
  }

  if (lower.includes('parental support') || lower.includes('moms in classroom') || (lower.includes('sprouts') && lower.includes('parents'))) {
    return 'Ansar Sprouts treats parental involvement as an essential partnership in every child\'s education. Families participate through parent-teacher conferences, open-door interactions, parent-child learning activities, teacher home visits, classroom and event volunteering, Moms in Classrooms, and opportunities to serve as resource persons.';
  }

  if (lower.includes('sprouts') || lower.includes('preschool') || lower.includes('pre-kg') || lower.includes('prekg') || lower.includes('fly high') || lower.includes('curio')) {
    return 'Ansar Sprouts is the school’s joyful preschool and foundational-stage programme. It follows an NEP 2020-aligned Fly High curriculum developed by Vidya Council for Education: Fly 1 for ages 3–4, Fly 2 for ages 4–5, and Fly 3 for ages 5–6. Touch Curio, Feel Curio, and Create Curio are common learning stages across all three levels. Learning areas include English, Mathematics, EVS, General Knowledge, Kaliveed (Malayalam), Rawdthee (Arabic), and Moral Science through exploration, creativity, values, and play. Visit the Ansar Sprouts page for the complete programme and contact +91 81298 51737 for enquiries.';
  }

  if (lower.includes('spc') || lower.includes('student police')) {
    return 'The Student Police Cadet programme at Ansar English School develops discipline, leadership, teamwork, empathy, integrity, civic responsibility, fitness, resilience, and service. Cadets participate in Joyful Kids, anti-drug awareness, road safety, environmental work, disaster preparedness, outreach, and community-welfare activities. Photos and details are available on the Life at Ansar page.';
  }

  if (lower.includes('nss') || lower.includes('national service')) {
    return 'Ansar English School’s National Service Scheme is Unit SFU/3 and follows the motto “Not Me But You.” It builds selfless service, leadership, social responsibility, national integration, and environmental awareness through outreach, conservation, health campaigns, social service, disaster preparedness, and volunteer projects. Open Life at Ansar for the complete section.';
  }

  if (lower.includes('admission') || lower.includes('fee') || lower.includes('payment')) {
    return 'For admissions, visit the Admission page. Applications are open annually from Jan 01 to March 31, and fee details are available there. The online admission and payment portal is also linked from that page.';
  }

  if (lower.includes('history') || lower.includes('founded') || lower.includes('started') || lower.includes('trust')) {
    return 'Ansar English School is the flagship educational institution of Ansari Charitable Trust in Perumpilavu, Thrissur. The Trust was registered in 1979, the school was registered in 1982, received CBSE affiliation in 1988, became Senior Secondary in 1990, and received NABET accreditation in 2024. The institution presents itself as a value-based CBSE school with a strong focus on academics, discipline, student development, facilities, community service, and sustainable growth. You can open the About page for the full timeline, trustee details, and institutional profile.';
  }

  if (lower.includes('faculty') || lower.includes('teacher training') || lower.includes('professional development') || lower.includes('educators')) {
    return 'Ansar English School has a dedicated team of well-educated and professionally trained teachers who create a nurturing environment and serve as academic and personal mentors. The school continuously strengthens faculty expertise through CBSE-certified courses, online and offline workshops, school empowerment programmes, and other professional-development opportunities. More details are presented on the About page.';
  }

  if (lower.includes('value integration') || lower.includes('core values') || lower.includes('moral growth') || lower.includes('ethical behaviour')) {
    return 'Value Integration at Ansar connects academic learning with respect, empathy, responsibility, perseverance, ethical behaviour, spiritual awareness, and cultural appreciation. This whole-child approach helps students develop integrity, compassion, resilience, and purpose so they can navigate challenges and contribute positively to society. The complete highlight is available on the About page.';
  }

  if (lower.includes('leader') || lower.includes('principal') || lower.includes('director') || lower.includes('staff')) {
    return 'The school leadership shown on the website includes the Director, Principal, Junior Principals, trustees, teachers, and support staff. The website highlights Dr. Najeeb Mohamad as Director and Ms. Sajidha Razak as Principal when configured through settings, along with junior principal profiles and trustee information. Ansar has 270+ educators and staff members supporting over 4,600 students. For profile photos, qualifications, messages, and current leadership details, please open the Home and About pages.';
  }

  if (lower.includes('facility') || lower.includes('facilities') || lower.includes('lab') || lower.includes('library') || lower.includes('sports') || lower.includes('transport')) {
    return 'Ansar facilities include a safe CCTV-supported campus, smart learning spaces, a library with 34,000+ resources, Champions Arena, play zones, dining spaces, transport, and nine experiential-learning labs: ATL, Robotics, Chemistry, Biology, Home Science, Mathematics, Computer, Physics, and Coding. Each lab has a detailed section and admin-managed image carousel on the Experiential Learning Labs page.';
  }

  if (lower.includes('media') || lower.includes('production') || lower.includes('photography') || lower.includes('videography') || lower.includes('podcast')) {
    return 'Ansar Media and Production is the school\'s in-house media unit. It supports photography, videography, drone videography, podcasts, graphic designing, editing, event documentation, reels, social media creatives, and institutional presentations. You can find it under Explore > Ansar Media and Production.';
  }

  if (lower.includes('website') || lower.includes('site') || lower.includes('navigate') || lower.includes('page')) {
    return 'This website is organized to help visitors learn about Ansar English School and quickly reach important information. The main sections include About, Academics, Admission, News, Events, Gallery, Achievements, Ansar Times, Mandatory Public Disclosure, Contact, and special pages such as Sports, ATL, Ansar Sprouts, Life at Ansar, and Ansar Media and Production. Use the navigation menu for general pages, News and Events for updates by date, Achievements for student accomplishments, and Contact for phone, email, address, map, and inquiries.';
  }

  if (lower.includes('news') || lower.includes('event') || lower.includes('achievement')) {
    return 'The latest school updates are available in News, Events, and Achievements. I can guide you to the relevant page from the shortcuts below.';
  }

  return matches.length
    ? `I can guide you to ${matches.map(match => match.label).join(', ')}. Please choose one of the links below.`
    : 'Good day. I can help with detailed information about Ansar English School, the institution history, leadership, facilities, admissions, academics, website navigation, news, events, achievements, public disclosure documents, Ansar Times, and contact information. Please ask your question in a little more detail.';
}

export default function SchoolChatbot() {
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Good day. Welcome to Ansar English School. I can help with admissions, academics, Ansar Sprouts, experiential learning labs, SPC, NSS, campus life, news, events, achievements, public disclosures, and contact details. How may I assist you?'
    }
  ]);
  const conversationRef = useRef([]);

  // Firestore collections update instantly. This key also rechecks sheet-backed
  // content every five minutes and whenever a visitor returns to the tab.
  const [contentRefreshKey, setContentRefreshKey] = useState(0);
  useEffect(() => {
    const refresh = () => setContentRefreshKey(value => value + 1);
    const intervalId = window.setInterval(refresh, 5 * 60 * 1000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const { data: updates } = useContentCollection('updates', null, 'desc', { refreshKey: contentRefreshKey });
  const { data: achievements } = useContentCollection('achievements', null, 'desc', { refreshKey: contentRefreshKey });
  const { data: disclosures } = useContentCollection('publicDisclosure', 'order', 'asc', { limit: 20, refreshKey: contentRefreshKey });
  const { data: ansarTimes } = useContentCollection('ansarTimes', 'year', 'desc', { limit: 12, refreshKey: contentRefreshKey });
  const { data: leadership } = useContentCollection('leadership', 'order', 'asc', { firestoreOnly: true });
  const { data: learningLabs } = useContentCollection('learningLabs', 'order', 'asc', { firestoreOnly: true });
  const { data: pages } = useFirestoreCollection('pages', 'createdAt', 'desc');
  const { data: sportsAchievements } = useContentCollection('sportsAchievements', null, 'desc', { refreshKey: contentRefreshKey });
  const { data: fieldTrips } = useContentCollection('fieldTrips', null, 'desc', { firestoreOnly: true });
  const { data: sproutsActivities } = useContentCollection('sproutsActivities', 'date', 'desc', { sheetsOnly: true, refreshKey: contentRefreshKey });
  const { data: gallery } = useContentCollection('gallery', null, 'desc', { firestoreOnly: true });
  const { data: learningFeatures } = useContentCollection('learningFeatures', null, 'asc', { sheetsOnly: true, refreshKey: contentRefreshKey });

  const siteContext = useMemo(
    () => buildSiteContext({ settings, updates, achievements, disclosures, ansarTimes, pages, leadership, learningLabs, sportsAchievements, fieldTrips, sproutsActivities, gallery, learningFeatures }),
    [settings, updates, achievements, disclosures, ansarTimes, pages, leadership, learningLabs, sportsAchievements, fieldTrips, sproutsActivities, gallery, learningFeatures]
  );

  const suggestedLinks = useMemo(() => {
    const lastUserMessage = [...messages].reverse().find(message => message.role === 'user')?.text || '';
    const matches = findNavigationMatches(lastUserMessage);
    return matches.length ? matches : NAVIGATION_GUIDE.slice(0, 4);
  }, [messages]);

  const sendQuestion = async (questionText) => {
    const question = questionText.trim();
    if (!question || loading) return;

    const userMessage = { role: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const detailedMode = isDetailedSchoolQuestion(question);
      const model = getGenerativeModel(ai, {
        model: CHAT_MODEL,
        generationConfig: { maxOutputTokens: detailedMode ? 900 : 420 }
      });
      const conversation = [...conversationRef.current, userMessage].slice(-8);
      const prompt = [
        'You are the formal, helpful website assistant for Ansar English School.',
        'Answer only from the provided website/admin/sheet context. If information is missing, say so and guide the visitor to Contact.',
        detailedMode
          ? 'For questions about the institution, leadership, history, facilities, or website navigation, give a detailed, well-structured answer in 2 to 5 short paragraphs. Include relevant facts, names, milestones, page names, and helpful next steps from the context.'
          : 'Keep replies concise, polite, and navigation-oriented. Mention relevant page names and paths when useful.',
        'Do not answer in one line when the visitor asks to explain the institution, leaders, or website. Use clear headings or short paragraphs when that makes the answer easier to read.',
        'Do not invent dates, fees, phone numbers, or policies.',
        `Website context:\n${siteContext}`,
        `Conversation:\n${conversation.map(message => `${message.role}: ${message.text}`).join('\n')}`,
        `Visitor question: ${question}`
      ].join('\n\n');

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const assistantMessage = { role: 'assistant', text: text || getFallbackAnswer(question, siteContext) };
      conversationRef.current = [...conversation, assistantMessage].slice(-8);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.warn('AI assistant unavailable, using guided fallback.', error);
      const assistantMessage = { role: 'assistant', text: getFallbackAnswer(question, siteContext) };
      conversationRef.current = [...conversationRef.current, userMessage, assistantMessage].slice(-8);
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendQuestion(input);
  };

  return (
    <div className="fixed bottom-24 left-4 z-[9998] sm:bottom-5 sm:left-5">
      {isOpen && (
        <section className="mb-4 flex h-[min(76vh,38rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-emerald-950 px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-400 text-emerald-950">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 16v-2m6-6h2M4 12h2m9.9-5.9 1.4-1.4M6.7 17.3l1.4-1.4m9.2 1.4-1.4-1.4M6.7 6.7l1.4 1.4M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-extrabold">Ansar AI Assistant</h2>
                <p className="truncate text-xs text-emerald-100">Website guidance</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close assistant">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                Preparing a response
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestedLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {QUICK_QUESTIONS.slice(0, 4).map(question => (
                <button key={question} type="button" onClick={() => sendQuestion(question)} className="rounded-lg bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200">
                  {question}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about the school..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-400 focus:bg-white"
              />
              <button type="submit" disabled={loading || !input.trim()} className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-2xl ring-4 ring-white transition-all hover:-translate-y-1 hover:bg-emerald-800"
        aria-label={isOpen ? 'Close Ansar AI Assistant' : 'Open Ansar AI Assistant'}
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-3l-4 4v-4H9Z" />
        </svg>
      </button>
    </div>
  );
}
