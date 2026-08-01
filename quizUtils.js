export const QUIZ_STATUSES = ['draft', 'lobby', 'running', 'ended', 'completed'];

export function shuffle(items, seed = Math.random()) {
  const result = [...items];
  let value = typeof seed === 'number' ? seed : String(seed).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const random = () => {
    value = Math.sin(value || 1) * 10000;
    return value - Math.floor(value);
  };
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function normalizeAnswer(value) {
  return String(value ?? '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

export function parseQuizText(text) {
  const rows = String(text).replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim());
  if (!rows.length) return [];
  const delimiter = rows[0].includes('\t') ? '\t' : ',';
  const split = (line) => delimiter === '\t' ? line.split('\t') : (line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g) || []).map(v => v.replace(/^,/, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
  const headers = split(rows[0]).map(v => v.trim().toLowerCase().replace(/\s+/g, ''));
  const find = (...names) => names.map(name => headers.indexOf(name)).find(index => index >= 0) ?? -1;
  const qIndex = find('question', 'questions');
  const answerIndex = find('answer', 'correctanswer');
  if (qIndex < 0 || answerIndex < 0) throw new Error('The first row must contain Question and Answer columns.');
  const optionIndexes = ['optiona', 'optionb', 'optionc', 'optiond'].map(name => find(name));
  return rows.slice(1).map((line, index) => {
    const cells = split(line).map(v => v.trim());
    const question = cells[qIndex] || '';
    const answer = cells[answerIndex] || '';
    const options = optionIndexes.map(i => i >= 0 ? cells[i] : '').filter(Boolean);
    const optionMatch = answer.match(/^option\s*([a-d])$/i);
    const resolvedAnswer = optionMatch ? options[optionMatch[1].toUpperCase().charCodeAt(0) - 65] || answer : answer;
    return { id: `q${index + 1}`, question, answer: resolvedAnswer, options, type: options.length ? 'choice' : 'text', points: 1 };
  }).filter(item => item.question && item.answer);
}

export function googleExportUrl(input) {
  const url = new URL(input);
  const sheet = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
  if (sheet) {
    const gid = url.hash.match(/gid=(\d+)/)?.[1] || url.searchParams.get('gid') || '0';
    return `https://docs.google.com/spreadsheets/d/${sheet[1]}/gviz/tq?tqx=out:csv&gid=${gid}`;
  }
  const doc = url.pathname.match(/\/document\/d\/([^/]+)/);
  if (doc) return `https://docs.google.com/document/d/${doc[1]}/export?format=txt`;
  throw new Error('Enter a valid Google Sheets or Google Docs sharing link.');
}

export function loadGoogleSheetQuestions(input) {
  const url = new URL(input);
  const sheetId = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/)?.[1];
  if (!sheetId) return null;
  const gid = url.hash.match(/gid=(\d+)/)?.[1] || url.searchParams.get('gid') || '0';
  return new Promise((resolve, reject) => {
    const callback = `quizSheetCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const cleanup = () => { delete window[callback]; script.remove(); };
    const timer = window.setTimeout(() => { cleanup(); reject(new Error('Google Sheets took too long to respond.')); }, 15000);
    window[callback] = response => {
      window.clearTimeout(timer);
      try {
        if (response.status !== 'ok') throw new Error(response.errors?.[0]?.detailed_message || 'Google Sheets could not be read.');
        const labels = response.table.cols.map(col => col.label || col.id);
        const escape = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const lines = [labels.map(escape).join(','), ...response.table.rows.map(row => labels.map((_, i) => escape(row.c?.[i]?.v ?? '')).join(','))];
        resolve(parseQuizText(lines.join('\n')));
      } catch (error) { reject(error); } finally { cleanup(); }
    };
    script.onerror = () => { window.clearTimeout(timer); cleanup(); reject(new Error('Google blocked the sheet request. Confirm that link access is enabled.')); };
    script.src = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?gid=${gid}&tqx=${encodeURIComponent(`out:json;responseHandler:${callback}`)}`;
    document.head.appendChild(script);
  });
}

export function formatDuration(ms = 0) {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
