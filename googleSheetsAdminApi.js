import { GOOGLE_SHEETS_DATABASE } from './googleSheetsConfig';

function assertWriteEndpoint() {
  if (!GOOGLE_SHEETS_DATABASE.writeEndpoint) {
    throw new Error('Google Sheets write endpoint is not configured. Deploy the Apps Script Web App and paste its URL into googleSheetsConfig.js.');
  }
}

async function postToSheets(action, payload) {
  assertWriteEndpoint();

  const body = JSON.stringify({
    action,
    token: GOOGLE_SHEETS_DATABASE.writeToken || '',
    spreadsheetId: GOOGLE_SHEETS_DATABASE.spreadsheetId,
    ...payload
  });

  const response = await fetch(GOOGLE_SHEETS_DATABASE.writeEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body
  });

  if (response.type === 'opaque') {
    return { ok: true, opaque: true };
  }

  if (!response.ok) {
    throw new Error(`Google Sheets write failed (${response.status}).`);
  }

  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || 'Google Sheets write failed.');
  }

  return result;
}

export function saveSheetRecord(collectionName, record) {
  return postToSheets('save', { collectionName, record });
}

export async function confirmFormSaved(record) {
  const expected = {
    id: String(record.id || ''),
    title: String(record.title || '').trim(),
    driveUrl: String(record.driveUrl || '').trim(),
    published: record.published !== false
  };
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_DATABASE.spreadsheetId}/gviz/tq?${new URLSearchParams({
    tqx: 'out:json', sheet: 'forms', v: String(Date.now())
  })}`;

  // A no-cors Apps Script call is opaque, so wait until the published Sheet
  // confirms the row rather than showing a success state prematurely.
  for (const delay of [700, 1200, 2000, 3000]) {
    await new Promise(resolve => window.setTimeout(resolve, delay));
    const response = await fetch(sheetUrl.replace(/v=\d+/, `v=${Date.now()}`));
    if (!response.ok) continue;
    const text = await response.text();
    const match = text.match(/setResponse\(([\s\S]*)\);?$/);
    if (!match) continue;
    const payload = JSON.parse(match[1]);
    const headers = (payload.table?.cols || []).map(column => String(column.label || '').trim());
    const indexOf = name => headers.findIndex(header => header.replace(/[^a-z0-9]/gi, '').toLowerCase() === name.replace(/[^a-z0-9]/gi, '').toLowerCase());
    const value = (row, name) => String(row.c?.[indexOf(name)]?.v ?? '').trim();
    const saved = (payload.table?.rows || []).find(row => value(row, 'id') === expected.id);
    if (saved && value(saved, 'title') === expected.title && value(saved, 'driveUrl') === expected.driveUrl && (value(saved, 'published').toLowerCase() === 'true') === expected.published) return;
  }
  throw new Error('The form was not confirmed in Google Sheets. Please check that the Apps Script Web App is deployed with the current Forms tab, then try again.');
}

// Apps Script Web Apps need `no-cors` for this public browser-to-script POST.
// That makes the browser response opaque, so a failed script execution used to
// look exactly like a successful save. Verify transport edits through the
// same public Sheets read endpoint before telling an administrator they saved.
export async function confirmTransportStaffSaved(record) {
  const expected = {
    id: String(record.id || ''),
    busNumber: String(record.busNumber || '').trim(),
    driverName: String(record.driverName || '').trim(),
    driverPhone: String(record.driverPhone || '').replace(/\D/g, ''),
    conductorName: String(record.conductorName || '').trim(),
    conductorPhone: String(record.conductorPhone || '').replace(/\D/g, ''),
    published: record.published !== false
  };
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_DATABASE.spreadsheetId}/gviz/tq?${new URLSearchParams({
    tqx: 'out:json',
    sheet: 'transportStaff',
    v: String(Date.now())
  })}`;

  // Writes can take a moment to appear in the Sheets visualization endpoint.
  for (const delay of [700, 1200, 2000, 3000]) {
    await new Promise(resolve => window.setTimeout(resolve, delay));
    const response = await fetch(sheetUrl.replace(/v=\d+/, `v=${Date.now()}`));
    if (!response.ok) continue;
    const text = await response.text();
    const match = text.match(/setResponse\(([\s\S]*)\);?$/);
    if (!match) continue;
    const payload = JSON.parse(match[1]);
    const headers = (payload.table?.cols || []).map(column => String(column.label || '').trim());
    const row = (payload.table?.rows || []).find(({ c = [] }) => String(c[headers.indexOf('id')]?.v || '') === expected.id);
    if (!row) continue;
    const value = (name) => String(row.c?.[headers.indexOf(name)]?.v ?? '').trim();
    const same = value('busNumber') === expected.busNumber
      && value('driverName') === expected.driverName
      && value('driverPhone').replace(/\D/g, '') === expected.driverPhone
      && value('conductorName') === expected.conductorName
      && value('conductorPhone').replace(/\D/g, '') === expected.conductorPhone
      && (value('published').toLowerCase() === 'true') === expected.published;
    if (same) return;
  }

  throw new Error('The change was not confirmed in Google Sheets. Deploy the latest Apps Script Web App version, then try again.');
}

/**
 * Ask the Apps Script Web App to email a system-generated acknowledgement to a
 * visitor who just submitted the contact form. Runs with the same write token,
 * so no extra credentials are needed.
 */
export function sendContactAcknowledgement({ name, email, destination, category, applyingForClass }) {
  return postToSheets('sendContactAck', {
    name,
    email,
    destination,
    category,
    applyingForClass
  });
}

export function deleteSheetRecord(collectionName, id, record) {
  return postToSheets('delete', { collectionName, id, record });
}
