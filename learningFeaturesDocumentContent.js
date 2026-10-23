export const SMART_CLASSROOM_KERALA_IMAGE = '/learning/smart-classroom-kerala.jpg';
const LEGACY_FOREIGN_CLASSROOM_IMAGE = '';
export function resolveLearningFeatureImage(slug, imageUrl, fallback = '') {
  if (slug === 'smart-classrooms' && (!imageUrl || String(imageUrl).startsWith(LEGACY_FOREIGN_CLASSROOM_IMAGE))) return SMART_CLASSROOM_KERALA_IMAGE;
  return imageUrl || fallback;
}

const paragraphs = (first, second, third) => [first, second, third];
export const LEARNING_FEATURES_DOCUMENT_CONTENT = {
  'cctv-enabled-safety': {
    kicker: 'A Sanctuary of Safety, Care, and Well-Being',
    description: 'A child feels ready to learn when the campus feels safe, calm, and caring. Our safety practices combine attentive people, thoughtful systems, and clear routines throughout the school day.',
    body: paragraphs('Safety at Ansar English School begins with a culture of care. From arrival at the gate to dispersal, students are supported by staff who value watchfulness, kindness, and timely guidance. CCTV-supported monitoring across key areas helps maintain a secure learning environment while allowing children to move through their day with confidence.', 'Clear entry, visitor, classroom, corridor, playground, and transport routines help the campus remain organised without making it feel restrictive. Teachers, support staff, and school leaders work together to notice concerns early, guide children patiently, and provide age-appropriate supervision where it matters most.', 'Preparedness is an equally important part of care. Safety awareness, emergency procedures, first-aid readiness, fire-safety measures, and child-protection practices are built into everyday operations, giving parents reassurance and students the freedom to focus on friendship, discovery, and learning.'),
    points: ['CCTV-supported monitoring in key campus areas', 'Controlled visitor and entry routines', 'Attentive supervision by trained staff', 'Emergency preparedness and first-aid awareness', 'Child-centred safeguarding practices', 'A calm, respectful learning environment']
  },
  'smart-classrooms': {
    kicker: 'Transforming Classrooms into Hubs of Innovation', image: SMART_CLASSROOM_KERALA_IMAGE, imageUrl: SMART_CLASSROOM_KERALA_IMAGE,
    description: 'Thoughtfully designed classrooms make learning easier to understand, more enjoyable to explore, and more meaningful to remember.',
    body: paragraphs('Every learning space is planned to help students settle in, concentrate, and participate with confidence. Comfortable seating, good lighting, ventilation, and clear sightlines create a welcoming setting in which every child can see, hear, ask, and contribute.', 'Smart boards, visual resources, demonstrations, and digital content help teachers explain ideas in ways that are vivid and easy to follow. Technology is used with purpose: to illustrate a concept, encourage discussion, support practice, and make abstract topics more accessible.', 'Students are encouraged to question, collaborate, explain their thinking, and connect lessons with the world around them. This learner-centred approach respects different learning paces while building communication, creativity, critical thinking, responsible digital habits, and independence.'),
    points: ['Interactive digital learning tools', 'Comfortable, well-lit learning spaces', 'Visual explanations and practical activities', 'Collaborative discussion and peer learning', 'Support for different learning paces', 'Responsible digital learning habits']
  },
  'qualified-support-staff': {
    kicker: 'Empowering Every Child Through Compassionate Guidance',
    description: 'A successful school day depends on a team that sees, listens to, and supports every child. Our educators, mentors, office team, health and support staff create a dependable circle of care.',
    body: paragraphs('Behind every confident learner is a community of adults who make school feel welcoming and well organised. Teachers guide learning, mentors encourage progress, and support staff help daily routines run smoothly throughout the campus.', 'The team supports students through practical assistance, patient guidance, and thoughtful communication with families. Whether a child is settling into a new routine, finding the right place, or simply needs to be heard, a caring adult is nearby to respond responsibly.', 'This collaborative approach helps children develop confidence, independence, and belonging. Academic guidance, well-being support, administration, health awareness, and campus care work together so every student can grow at a comfortable pace.'),
    points: ['Caring educators and mentors', 'Student well-being support', 'Responsive family communication', 'Practical health awareness', 'Reliable daily campus routines', 'An inclusive sense of belonging']
  },
  'special-play-area': {
    kicker: 'Where Every Playful Moment Becomes a Learning Experience',
    description: 'Play gives children space to move, imagine, cooperate, and discover what they can do. Our play environments make active learning joyful, safe, and age-appropriate.',
    body: paragraphs('For young learners especially, play is a powerful form of learning. Climbing, balancing, swinging, sliding, running, and creating games help children strengthen coordination, confidence, and physical awareness. The Joyful Play Zone brings movement and imagination together.', 'Shared play builds important social skills. Children learn to wait for turns, negotiate rules, include friends, communicate ideas, and recover from small disappointments with encouragement. These everyday moments nurture patience, resilience, empathy, and teamwork.', 'Equipment and activity areas are selected with age, supervision, and safe use in mind. Teachers and support staff guide children as needed, helping them explore freely while learning to care for one another and respect shared spaces.'),
    points: ['Age-appropriate active play equipment', 'Guided, safe play routines', 'Balance, coordination, and confidence', 'Cooperation and communication skills', 'Outdoor joy and emotional well-being', 'Clean, welcoming activity spaces']
  },
  'advanced-labs': {
    kicker: 'Inspiring Discovery Through Hands-On Exploration',
    description: 'Practical learning helps students turn questions into understanding. Our learning labs invite them to observe, test, create, and reflect through meaningful hands-on experience.',
    body: paragraphs('In a laboratory, students do more than read about an idea: they investigate it. Science activities encourage careful observation, measurement, experimentation, and evidence-based thinking, supported by appropriate guidance and safe practice.', 'Technology, mathematics, language, innovation, and STEM experiences offer further opportunities for exploration. Models, demonstrations, digital tools, design challenges, and collaborative tasks make learning active, memorable, useful, and connected to real life.', 'The aim is not simply to produce answers, but to build habits of curiosity and problem-solving. By planning, trying, reviewing, and improving their work, students develop patience, precision, teamwork, and confidence with unfamiliar challenges.'),
    points: ['Guided hands-on investigation', 'Observation, testing, and measurement', 'Technology-supported exploration', 'Innovation and design challenges', 'Real-life connections to learning', 'Curiosity and problem-solving habits']
  },
  'multi-sports-play-area': {
    kicker: 'Cultivating Excellence Beyond Academics',
    description: 'Sport gives students a healthy way to challenge themselves, work with others, and enjoy movement. Our activity spaces encourage participation, fitness, discipline, and sportsmanship.',
    body: paragraphs('Physical activity is an important part of a balanced school experience. Games, fitness routines, practice sessions, and recreation help students build stamina, coordination, strength, and confidence, then return to the classroom refreshed and focused.', 'Team sports provide valuable lessons beyond the field or court. Students learn to communicate clearly, respect rules, accept responsibility, encourage teammates, and respond constructively to both success and disappointment.', 'The school encourages participation at different levels, from joyful recreation to focused skill development. Guidance, practice, and positive encouragement help students discover their strengths, form healthy habits, and value steady improvement.'),
    points: ['Fitness, games, and recreation', 'Individual and team skill-building', 'Leadership and sportsmanship', 'Healthy physical routines', 'Positive encouragement for all abilities', 'Participation, practice, and achievement']
  },
  'safe-school-transport': {
    kicker: 'Every Journey Protected with Care and Responsibility',
    description: 'A safe school journey begins with reliable routines and caring people. Our transport service helps students travel between home and school with comfort, punctuality, and attentive support.',
    body: paragraphs('For many families, the school bus is the first and last part of the school day. Clear routes, planned boarding points, and regular schedules help students arrive ready for learning and return home with confidence.', 'Each vehicle has dedicated staff members who help students board, settle in, and travel responsibly. Drivers and attendants maintain a calm atmosphere, assist younger children, and support safe movement at pick-up and drop-off points.', 'The transport team coordinates routines carefully so families can rely on a consistent experience. Responsible driving, attentive supervision, route planning, and clear communication extend the school’s commitment to student care beyond the campus gate.'),
    points: ['Planned routes and regular timings', 'Dedicated drivers and attendants', 'Safe boarding and dispersal guidance', 'Careful pick-up and drop-off coordination', 'A calm journey for every age group', 'Dependable daily travel support']
  },
  'healthy-dining-spaces': {
    kicker: 'Nourishing Healthy Minds Through Wholesome Nutrition',
    description: 'Mealtimes are an important part of a child’s school day. Our dining spaces are clean, comfortable, and well organised, supporting healthy routines and positive social habits.',
    body: paragraphs('A pleasant dining environment helps students take a meaningful break, enjoy their meals, and return to learning with renewed energy. Orderly, hygienic spaces help children eat comfortably and understand the value of balanced daily routines.', 'Mealtimes offer valuable lessons in independence and consideration. Students practise washing hands, waiting their turn, managing belongings, speaking respectfully, and keeping shared spaces clean. These simple habits build confidence and responsibility.', 'Staff supervision and regular attention to cleanliness keep dining areas welcoming throughout the day. By creating a calm place for refreshment, conversation, and healthy habits, the school supports physical comfort and positive social development.'),
    points: ['Clean, student-friendly dining spaces', 'Healthy hygiene and hydration habits', 'Independence and responsibility', 'Comfortable shared refreshment areas', 'Staff attention to daily cleanliness', 'Positive routines for well-being']
  }
};
