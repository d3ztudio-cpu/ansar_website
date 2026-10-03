import { getGenerativeModel } from 'firebase/ai';
import { ai } from './firebase-ai-init';

const MAX_PDF_BYTES = 14 * 1024 * 1024;
const EXPECTED_MONTHS = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2];

const calendarSchema = {
  type: 'object',
  properties: {
    months: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: { type: 'integer' },
          year: { type: 'integer' },
          workingDays: { type: 'integer' },
          events: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                day: { type: 'integer' },
                text: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
};

function toInlinePdf(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The selected PDF could not be read.'));
    reader.onload = () => resolve({ inlineData: { data: String(reader.result).split(',')[1], mimeType: 'application/pdf' } });
    reader.readAsDataURL(file);
  });
}

function validateMonth(month, index) {
  const expectedMonth = EXPECTED_MONTHS[index];
  const expectedYear = expectedMonth >= 5 ? 2026 : 2027;
  if (!month || Number(month.month) !== expectedMonth || Number(month.year) !== expectedYear) throw new Error('The PDF did not produce the required June 2026 to March 2027 month sequence.');
  const daysInMonth = new Date(expectedYear, expectedMonth + 1, 0).getDate();
  const events = {};
  for (const event of Array.isArray(month.events) ? month.events : []) {
    const day = Number(event?.day);
    const text = String(event?.text || '').trim();
    if (Number.isInteger(day) && day >= 1 && day <= daysInMonth && text) events[day] = [...(events[day] || []), text];
  }
  return { month: expectedMonth, year: expectedYear, workingDays: Math.max(0, Math.min(daysInMonth, Number(month.workingDays) || 0)), events };
}

export async function importAcademicCalendarPdf(file, audience) {
  if (!(file instanceof File) || file.type !== 'application/pdf') throw new Error('Choose a PDF calendar file.');
  if (file.size > MAX_PDF_BYTES) throw new Error('Choose a PDF smaller than 14 MB.');

  const model = getGenerativeModel(ai, {
    model: 'gemini-3.5-flash',
    generationConfig: { responseMimeType: 'application/json', responseSchema: calendarSchema, maxOutputTokens: 16000 }
  });
  const prompt = `Read this ${audience === 'sprouts' ? 'Ansar Sprouts' : 'Ansar English School'} academic calendar PDF. Extract only what is visibly written in the PDF; never guess or add events. Return the academic year June 2026 through March 2027 as exactly ten month objects. Use JavaScript month numbers (June is 5 and March is 2). Set workingDays to the printed total for each month. For each dated event, holiday, assessment, reopening, closing, or note, return one event item with its calendar day and the exact concise event text. Put multi-day items on every stated date only. If a date or working-day total is unclear, use an empty event list or 0 rather than inventing it.`;
  const result = await model.generateContent([prompt, await toInlinePdf(file)]);
  let parsed;
  try { parsed = JSON.parse(result.response.text()); } catch { throw new Error('The calendar scan returned an unreadable result. Please try the PDF again.'); }
  if (!Array.isArray(parsed?.months) || parsed.months.length !== 10) throw new Error('The scan did not find all ten calendar months. Please use the complete June 2026–March 2027 PDF.');
  return parsed.months.map(validateMonth);
}
