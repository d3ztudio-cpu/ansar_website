export const DEFAULT_SPORTS_PAGE = {
  title: 'Sports',
  description: 'A growing sports programme that builds fitness, teamwork, discipline, confidence, and healthy competition across the campus.',
  items: [
    {
      title: 'Football',
      description: 'Team training, match practice, stamina building, and tactical play for students who love the game.',
      imageUrl: '/sports/football-kerala-school.webp'
    },
    {
      title: 'Basketball',
      description: 'Court-based skill development with focus on agility, coordination, passing, shooting, and teamwork.',
      imageUrl: '/sports/basketball-kerala-school.webp'
    },
    {
      title: 'Volleyball',
      description: 'Structured practice for serving, setting, defending, and building quick team communication.',
      imageUrl: '/sports/volleyball-kerala-school.webp'
    },
    {
      title: 'Horse Riding',
      description: 'Confidence-building riding exposure that supports balance, posture, focus, and responsible care.',
      imageUrl: '/sports/horse-riding-kerala-school.webp'
    },
    {
      title: 'Kabaddi',
      description: 'Strength, agility, teamwork, and quick decision-making through structured kabaddi practice.',
      imageUrl: '/sports/kabaddi-kerala-school.webp'
    },
    {
      title: 'Taekwondo',
      description: 'Martial arts training that develops discipline, flexibility, self-control, confidence, and physical fitness.',
      imageUrl: '/sports/taekwondo-kerala-school.webp'
    },
    {
      title: 'Skating',
      description: 'Balance, coordination, endurance, and confidence building through guided skating sessions.',
      imageUrl: '/sports/skating-kerala-school.webp'
    }
  ]
};

export const DEFAULT_ACADEMICS_PAGE = {
  eyebrow: 'Academics',
  title: 'Where Every Mind Finds Its Potential',
  introduction: 'At Ansar English School, education is a journey of discovery, excellence, and character. Guided by the CBSE curriculum, we inspire curiosity, foster confidence, and empower every learner through meaningful learning, innovation, technology, and values.',
  heroImageUrl: '',
  overviewTitle: 'Rooted in Excellence, Guided by Values',
  overviewBody: 'At Ansar English School, excellence and values shape every learning experience. Guided by the CBSE curriculum, we provide a vibrant environment where curiosity is nurtured, confidence grows, and every learner is inspired to realise his or her full potential. Learning is enriched through smart classrooms, well-equipped science and computer laboratories, the Atal Tinkering Lab (ATL), a well-stocked library, digital learning resources, language enrichment programmes, a dedicated Sports Academy, and a wide range of co-curricular opportunities. Supported by passionate educators and a culture of care, students develop the knowledge, skills, character, and resilience to thrive in a rapidly changing world.',
  beyondTitle: 'Beyond the Classroom',
  beyondIntroduction: 'Learning at Ansar English School extends beyond academics, providing enriching experiences that prepare students to excel in every sphere of life.',
  beyondItems: [
    { title: 'Innovate & Create', description: 'Explore, experiment, and invent through the Atal Tinkering Lab, Robotics Lab, Coding Lab, AI-integrated learning, STEM projects, and technology-enabled classrooms.' },
    { title: 'Communicate with Confidence', description: 'Build strong communication and language skills through reading programmes, literary activities, debates, public speaking, presentations, theatre, and creative expression.' },
    { title: 'Lead with Purpose', description: 'Develop leadership, responsibility, and teamwork through the Student Council, Student Police Cadet (SPC), National Service Scheme (NSS), clubs, sports, and community outreach initiatives.' },
    { title: 'Prepare for the Future', description: 'Gain future-ready skills through the Skill Hub, Career Guidance Cell, entrepreneurship programmes, industry interactions, and competitive examination coaching.' },
    { title: 'Discover Every Talent', description: 'Pursue excellence in sports, arts, innovation, academics, and co-curricular activities, supported by expert mentoring and opportunities to showcase individual strengths.' },
    { title: 'Grow with Values', description: 'Foster integrity, empathy, resilience, and social responsibility through a culture where quality and values are never compromised, empowering students to become confident, compassionate, and responsible global citizens.' }
  ],
  sectionsTitle: 'A Pathway for Every Stage of Learning',
  sectionsIntroduction: 'Every stage of education at Ansar English School is thoughtfully designed to meet the developmental needs of learners. From joyful exploration in the early years to academic excellence and career readiness in senior secondary, each section nurtures curiosity, confidence, competence, and character while preparing students for the opportunities and challenges of tomorrow.'
};

export const DEFAULT_ACADEMIC_SECTIONS = [
  {
    title: 'Sprouts (Pre-KG–UKG)',
    tagline: 'Where Learning Begins with Joy',
    description: 'The Sprouts section provides a warm, caring, and stimulating environment where young learners explore the world through play, storytelling, music, movement, creative activities, and hands-on experiences. Emphasis is placed on language development, early literacy, numeracy, social interaction, emotional well-being, and independence, laying a strong foundation for lifelong learning.',
    imageUrl: ''
  },
  {
    title: 'Lower Primary (Grades I–II)',
    tagline: 'Building Strong Foundations',
    description: 'The Lower Primary years focus on strengthening literacy, numeracy, communication, and essential life skills through activity-based and experiential learning. Interactive classrooms, guided exploration, and joyful learning experiences nurture curiosity, confidence, creativity, and a genuine love for learning.',
    imageUrl: ''
  },
  {
    title: 'Primary Section (Grades III–V)',
    tagline: 'Learning with Curiosity and Confidence',
    description: 'Students deepen their understanding through inquiry-based learning, collaborative projects, reading programmes, environmental awareness, and digital integration. Alongside academic excellence, emphasis is placed on communication, creativity, leadership, and responsible citizenship to develop confident and independent learners.',
    imageUrl: ''
  },
  {
    title: 'Middle Section (Grades VI–VIII)',
    tagline: 'Exploring Ideas. Developing Skills.',
    description: 'The Middle Section encourages analytical thinking, innovation, and independent learning through interdisciplinary projects, laboratory experiences, coding, robotics, Skill Hub programmes, and collaborative learning. Students strengthen conceptual understanding while developing critical thinking, creativity, communication, and problem-solving skills essential for the future.',
    imageUrl: ''
  },
  {
    title: 'Secondary Section (Grades IX–X)',
    tagline: 'Excellence Through Preparation',
    description: 'The Secondary Section combines rigorous academic learning with structured mentoring, competency-based education, practical applications, and continuous assessment. Special focus is given to board examination readiness, life skills, leadership, and career awareness, enabling students to perform with confidence and integrity.',
    imageUrl: ''
  },
  {
    title: 'Senior Secondary Section (Grades XI–XII)',
    tagline: 'Preparing Future Leaders',
    description: 'The Senior Secondary programme empowers students to pursue academic excellence while preparing for higher education and professional careers. Expert faculty, advanced laboratories, research-based learning, competitive examination coaching, career guidance, and personalised mentoring help learners become confident, ethical, and future-ready individuals capable of making meaningful contributions to society.',
    imageUrl: ''
  }
];

export function mergeListWithDefaults(savedItems, defaultItems) {
  const saved = Array.isArray(savedItems) ? savedItems : [];
  return defaultItems.map((item, index) => ({
    ...item,
    ...(saved[index] || {})
  }));
}
