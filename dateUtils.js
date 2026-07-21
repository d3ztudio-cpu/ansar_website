export function parseFlexibleDate(value) {
  if (!value) return null;
  if (value?.toMillis) return new Date(value.toMillis());
  if (value?.seconds) return new Date(value.seconds * 1000);

  const text = String(value).trim();
  const ddmmyyyy = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDateTime(value, fallback = 0) {
  const parsed = parseFlexibleDate(value);
  return parsed ? parsed.getTime() : fallback;
}

function getRecordTimestamp(item) {
  const timestamps = [item?.updatedAt, item?.createdAt]
    .map(value => getDateTime(value, null))
    .filter(value => value != null);
  return timestamps.length ? Math.max(...timestamps) : Number.MIN_SAFE_INTEGER;
}

export function compareContentNewestFirst(a, b) {
  const aDate = getDateTime(a?.date, null);
  const bDate = getDateTime(b?.date, null);

  if (aDate != null || bDate != null) {
    if (aDate == null) return 1;
    if (bDate == null) return -1;
    if (aDate !== bDate) return bDate - aDate;
  }

  const recordDifference = getRecordTimestamp(b) - getRecordTimestamp(a);
  if (recordDifference) return recordDifference;
  return String(b?.id || '').localeCompare(String(a?.id || ''));
}

export function getDisplayYear(value, fallback = 'Undated') {
  const parsed = parseFlexibleDate(value);
  return parsed ? parsed.getFullYear() : fallback;
}

export function formatDisplayDate(value) {
  const parsed = parseFlexibleDate(value);
  if (!parsed) return String(value || '').trim();

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function isYearOnly(value) {
  return /^\d{4}$/.test(String(value || '').trim());
}
