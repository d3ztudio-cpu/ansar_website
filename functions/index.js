const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onRequest } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const { GoogleAuth } = require('google-auth-library');
admin.initializeApp();
const db = admin.firestore();
const normalize = value => String(value || '').trim().toLowerCase();
const driveServiceAccount = defineSecret('GOOGLE_DRIVE_SERVICE_ACCOUNT');
const driveRootFolderId = defineSecret('GOOGLE_DRIVE_ROOT_FOLDER_ID');
const DEFAULT_DRIVE_ROOT_FOLDER_ID = '1emaD9t5jJouaD34ltMd4FuTnDZKw3HwO';
const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';
const MAX_PDF_BYTES = 25 * 1024 * 1024;
const allowedOrigins = new Set(['https://ansar-english-school.web.app', 'https://ansar-english-school.firebaseapp.com', 'https://ansarschool.in', 'https://www.ansarschool.in']);
const safeSegment = value => String(value || '').trim().replace(/[^a-zA-Z0-9 _.-]/g, '').slice(0, 80);

async function assertLibraryEditor(request) {
  const token = String(request.get('authorization') || '').match(/^Bearer (.+)$/i)?.[1];
  if (!token) throw new Error('Sign in is required.');
  const decoded = await admin.auth().verifyIdToken(token);
  const email = normalize(decoded.email);
  const adminDoc = email && await db.doc(`admins/${email}`).get();
  if (!email || (!adminDoc?.exists && !['aeslibrary@ansarschool.in', 'ansarmedia@ansarschool.in', 'aesmedia2025@gmail.com'].includes(email))) throw new Error('You are not allowed to upload Library PDFs.');
}

async function getOrCreateFolder(client, name, parentId) {
  const escaped = name.replace(/'/g, "\\'");
  const listed = await client.request({ url: 'https://www.googleapis.com/drive/v3/files', params: { q: `mimeType='${DRIVE_FOLDER_MIME}' and name='${escaped}' and '${parentId}' in parents and trashed=false`, fields: 'files(id)', pageSize: 1, spaces: 'drive' } });
  if (listed.data.files?.[0]?.id) return listed.data.files[0].id;
  const created = await client.request({ url: 'https://www.googleapis.com/drive/v3/files', method: 'POST', data: { name, mimeType: DRIVE_FOLDER_MIME, parents: [parentId] }, params: { fields: 'id' } });
  return created.data.id;
}

exports.uploadLibraryPdf = onRequest({ region: 'asia-south1', secrets: [driveServiceAccount, driveRootFolderId], cors: false }, async (request, response) => {
  const origin = request.get('origin');
  if (origin && allowedOrigins.has(origin)) response.set('Access-Control-Allow-Origin', origin);
  response.set('Vary', 'Origin'); response.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-File-Name, X-Library-Folders'); response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (request.method === 'OPTIONS') return response.status(204).end();
  if (request.method !== 'POST' || (origin && !allowedOrigins.has(origin))) return response.status(405).json({ error: 'Method or origin not allowed.' });
  try {
    await assertLibraryEditor(request);
    const bytes = request.rawBody;
    if (!bytes?.length || bytes.length > MAX_PDF_BYTES || bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('Upload a valid PDF no larger than 25 MB.');
    const folders = JSON.parse(request.get('x-library-folders') || '[]').map(safeSegment).filter(Boolean).slice(0, 8);
    const filename = (safeSegment(decodeURIComponent(request.get('x-file-name') || 'document.pdf')).replace(/\.pdf$/i, '') || 'document') + '.pdf';
    const auth = new GoogleAuth({ credentials: JSON.parse(driveServiceAccount.value()), scopes: ['https://www.googleapis.com/auth/drive'] });
    const client = await auth.getClient();
    let parentId = driveRootFolderId.value() || DEFAULT_DRIVE_ROOT_FOLDER_ID;
    for (const folder of ['library', ...folders]) parentId = await getOrCreateFolder(client, folder, parentId);
    const boundary = `ansar-${Date.now()}`;
    const body = Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name: filename, parents: [parentId], mimeType: 'application/pdf' })}\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`), bytes, Buffer.from(`\r\n--${boundary}--`)]);
    const uploaded = await client.request({ url: 'https://www.googleapis.com/upload/drive/v3/files', method: 'POST', params: { uploadType: 'multipart', fields: 'id' }, headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, data: body });
    await client.request({ url: `https://www.googleapis.com/drive/v3/files/${uploaded.data.id}/permissions`, method: 'POST', data: { type: 'anyone', role: 'reader' } });
    return response.status(201).json({ url: `https://drive.google.com/file/d/${uploaded.data.id}/view`, id: uploaded.data.id });
  } catch (error) { logger.error('Library PDF upload failed', error); return response.status(/not allowed|required/.test(error.message) ? 403 : 400).json({ error: error.message || 'PDF upload failed.' }); }
});

// Sends FCM directly from Firebase when new public content is published. This
// runs independently of whether a visitor currently has the site open.
exports.sendPublishedContentNotification = onDocumentCreated({ document: '{collectionId}/{documentId}', region: 'asia-south1' }, async event => {
  const collectionId = event.params.collectionId;
  const data = event.data?.data();
  const supported = new Set(['updates', 'achievements', 'schoolMagazines', 'ansarTimes', 'libraryPosts', 'libraryOneFact']);
  if (!data || !supported.has(collectionId) || data.published === false) return;
  const snapshot = await db.collection('pushSubscriptions').get();
  const tokens = snapshot.docs.map(item => item.data().token).filter(token => typeof token === 'string' && token.length > 20);
  if (!tokens.length) return;
  const title = data.title || (collectionId === 'ansarTimes' ? 'New Ansar Times edition' : 'New school update');
  const response = await admin.messaging().sendEachForMulticast({ tokens, notification: { title: 'Ansar English School', body: title }, webpush: { headers: { Urgency: 'high' }, fcmOptions: { link: 'https://ansarschool.in/' }, notification: { icon: 'https://ansarschool.in/icon-192.png', badge: 'https://ansarschool.in/icon-192.png', tag: `ansar-${collectionId}-${event.params.documentId}` } } });
  logger.info('Published-content push sent', { collectionId, sent: response.successCount, failed: response.failureCount });
});

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
