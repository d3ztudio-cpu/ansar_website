const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const normalize = value => String(value || '').trim().toLowerCase();

// The server alone can read the answer key, so immediate result scoring never exposes it to staff browsers.
exports.scoreSubmittedStaffExam = onDocumentUpdated({ document: 'staffExamSessions/{examId}/participants/{participantId}', region: 'asia-south1' }, async event => {
  const before = event.data.before.data(); const participant = event.data.after.data();
  if (before.status === 'submitted' || participant.status !== 'submitted') return;
  const { examId, participantId } = event.params;
  const examRef = db.doc(`staffExamSessions/${examId}`);
  const [examSnap, questionsSnap, answersSnap] = await Promise.all([examRef.get(), examRef.collection('questions').get(), examRef.collection('answers').get()]);
  if (!examSnap.exists) { logger.warn('Exam missing during scoring', { examId, participantId }); return; }
  const questions = Object.fromEntries(questionsSnap.docs.map(item => [item.id, item.data()]));
  const key = Object.fromEntries(answersSnap.docs.map(item => [item.id, item.data()]));
  const responses = participant.answers || {};
  const attended = Object.values(responses).filter(Boolean).length;
  const correct = Object.entries(responses).filter(([id, answer]) => normalize(answer) === normalize(key[id]?.normalizedAnswer || key[id]?.answer)).length;
  const score = Object.entries(responses).reduce((sum, [id, answer]) => sum + (normalize(answer) === normalize(key[id]?.normalizedAnswer || key[id]?.answer) ? Number(questions[id]?.points || 1) : 0), 0);
  const total = Object.keys(questions).reduce((sum, id) => sum + Number(questions[id]?.points || 1), 0);
  const review = Object.keys(questions).map(id => { const chosenAnswer = responses[id] || ''; const correctAnswer = key[id]?.answer || ''; return { question: questions[id].question, chosenAnswer, correctAnswer, correct: normalize(chosenAnswer) === normalize(correctAnswer), points: Number(questions[id]?.points || 1) }; });
  await event.data.after.ref.update({ score, total, attended, correct, failed: Math.max(0, attended - correct), review, status: 'scored', scoredAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
});
