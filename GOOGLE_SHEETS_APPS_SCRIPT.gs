const DEFAULT_SPREADSHEET_ID = '1ymcRw-HqJfbqcRWa4BXXFzID4prJ20LhrTNK24jpVVE';

const SHEET_COLUMNS = {
  updates: [
    'id',
    'title',
    'category',
    'description',
    'date',
    'thumbnailUrl',
    'coverImageUrl',
    'imageUrls',
    'imageUrls2',
    'imageUrls3',
    'imageUrls4',
    'eventImages',
    'eventImages2',
    'eventImages3',
    'eventImages4',
    'instagramUrl',
    'facebookUrl',
    'youtubeUrl',
    'published'
  ],
  achievements: [
    'id',
    'title',
    'description',
    'date',
    'category',
    'studentName',
    'imageUrl',
    'thumbnailUrl',
    'order',
    'published'
  ],
  sportsAchievements: [
    'id',
    'title',
    'description',
    'date',
    'studentName',
    'imageUrl',
    'thumbnailUrl',
    'imageUrls',
    'order',
    'published'
  ],
  learningFeatures: [
    'id',
    'slug',
    'title',
    'kicker',
    'description',
    'body',
    'points',
    'imageUrl',
    'galleryImages',
    'outdoorGymTitle',
    'outdoorGymDescription',
    'outdoorGymImageUrls',
    'icon',
    'order',
    'published'
  ],
  sproutsActivities: [
    'id',
    'title',
    'category',
    'date',
    'description',
    'imageUrls',
    'imageUrls2',
    'imageUrls3',
    'imageUrls4',
    'order',
    'published'
  ],
  contactSubmissions: [
    'id',
    'date',
    'submittedAt',
    'name',
    'phone',
    'email',
    'destination',
    'category',
    'message',
    'published'
  ],
  publicDisclosure: [
    'id',
    'title',
    'section',
    'documentUrl',
    'order',
    'published'
  ],
  ansarTimes: [
    'id',
    'year',
    'month',
    'monthIndex',
    'pdfUrl',
    'published'
  ],
  schoolMagazines: [
    'id',
    'year',
    'title',
    'kind',
    'description',
    'coverImageUrl',
    'pdfUrl',
    'order',
    'published'
  ],
  electionSettings: [
    'key',
    'value'
  ],
  electionCandidates: [
    'id',
    'section',
    'position',
    'name',
    'className',
    'photoUrl',
    'symbolName',
    'symbolUrl',
    'manifesto',
    'audience',
    'order',
    'active'
  ],
  electionVotes: [
    'id',
    'dateKey',
    'submittedAt',
    'candidateId',
    'candidateName',
    'section',
    'position',
    'audience',
    'deviceHash'
  ]
};

function setupWebsiteSheets() {
  const ss = getSpreadsheet_();
  Object.keys(SHEET_COLUMNS).forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    const headers = SHEET_COLUMNS[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  });
}

function testSaveNews() {
  const result = saveRecord_({
    collectionName: 'updates',
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    record: {
      title: 'Test News From Apps Script',
      category: 'News',
      description: 'If you can see this row, Apps Script can write to the Sheet.',
      date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      published: true
    }
  });
  Logger.log(JSON.stringify(result));
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(body.action || '').trim();

    // Campaign polling is intentionally public. It uses a server-side anonymous
    // device hash and a daily per-section lock instead of the admin token.
    if (action === 'electionVote') {
      return json_({ ok: true, vote: saveElectionVote_(body) });
    }

    if (action === 'electionAdminSetPolling') {
      validateElectionShareKey_(body.key);
      return json_({ ok: true, polling: setElectionPolling_(body.enabled) });
    }

    if (action === 'electionAdminResetVotes') {
      validateElectionShareKey_(body.key);
      return json_({ ok: true, reset: resetElectionVotes_() });
    }

    if (action === 'electionAdminSaveCandidate') {
      validateElectionShareKey_(body.key);
      return json_({ ok: true, candidate: saveRecord_({ collectionName: 'electionCandidates', record: body.candidate }) });
    }

    if (action === 'electionAdminDeleteCandidate') {
      validateElectionShareKey_(body.key);
      deleteRecord_({ collectionName: 'electionCandidates', id: body.id });
      return json_({ ok: true });
    }

    validateToken_(body.token);

    if (action === 'save') {
      return json_({ ok: true, item: saveRecord_(body) });
    }

    if (action === 'delete') {
      deleteRecord_(body);
      return json_({ ok: true });
    }

    throw new Error(action ? 'Unknown action: ' + action : 'Missing action.');
  } catch (error) {
    return json_({ ok: false, error: error.message || String(error) });
  }
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};

    if (params.action === 'electionData') {
      return jsonp_({ ok: true, election: getElectionPublicData_() }, params.callback);
    }

    if (params.action === 'electionAnalytics') {
      validateElectionShareKey_(params.key);
      return jsonp_({ ok: true, analytics: getElectionAnalytics_() }, params.callback);
    }

    if (params.test === '1') {
      const item = saveRecord_({
        collectionName: 'updates',
        spreadsheetId: DEFAULT_SPREADSHEET_ID,
        record: {
          title: 'Test News From Web App',
          category: 'News',
          description: 'If you can see this row, the deployed Web App can write to the Sheet.',
          date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
          published: true
        }
      });
      return json_({ ok: true, item });
    }

    return json_({
      ok: true,
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      message: 'Google Sheets write endpoint is running. Add ?test=1 to write a test row.'
    });
  } catch (error) {
    return json_({ ok: false, error: error.message || String(error) });
  }
}

/**
 * Run this once from the Apps Script editor, then deploy a new Web App version.
 * It creates the election tabs, safe defaults, a hashing salt, and an analytics
 * share key. The returned shareKey is used in the admin analytics screen.
 */
function setupElectionSheets() {
  const ss = getSpreadsheet_();
  ['electionSettings', 'electionCandidates', 'electionVotes'].forEach(function(sheetName) {
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    const headers = SHEET_COLUMNS[sheetName];
    ensureHeaders_(sheet, headers);
    sheet.setFrozenRows(1);
  });

  const settingsSheet = ss.getSheetByName('electionSettings');
  const existing = readElectionSettings_(settingsSheet);
  const defaults = {
    electionTitle: 'Ansar School Council Election 2026',
    electionDate: '2026-07-23',
    pollClosesAt: '2026-07-23T00:00:00+05:30',
    pollOpen: 'TRUE',
    voteResetId: 'initial',
    audienceOptions: 'Student',
    announcement: 'Campaign popularity polling closes before the official offline election on 23 July 2026.'
  };

  Object.keys(defaults).forEach(function(key) {
    if (!(key in existing)) settingsSheet.appendRow([key, defaults[key]]);
  });

  if (ss.getSheetByName('electionCandidates').getLastRow() <= 1) seedElectionCandidates2026_();
  ensureElectionNotaCandidates2026_();
  ensureElectionCandidatePhotos2026_();
  migrateElectionPositionLabels2026_();

  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('ELECTION_HASH_SALT')) {
    properties.setProperty('ELECTION_HASH_SALT', Utilities.getUuid() + Utilities.getUuid());
  }
  if (!properties.getProperty('ELECTION_SHARE_KEY')) {
    properties.setProperty('ELECTION_SHARE_KEY', Utilities.getUuid().replace(/-/g, ''));
  }

  const result = {
    spreadsheetId: ss.getId(),
    shareKey: properties.getProperty('ELECTION_SHARE_KEY'),
    candidateTab: 'electionCandidates',
    voteTab: 'electionVotes'
  };
  Logger.log(JSON.stringify(result));
  return result;
}

function seedElectionCandidates2026_() {
  const candidates = [
    ['naeema-kathoon','Senior Secondary Section','Head Girl','Naeema Kathoon','12E','Puzzle Piece',1],
    ['aathikah-jinan','Senior Secondary Section','Head Girl','Aathikah Jinan','12A','Scales of Justice',2],
    ['miyaz-musthafa','Senior Secondary Section','Head Boy','Miyaz Musthafa','12F','Football',3],
    ['zaya-zakharia','Secondary Section','Section Leader','Zaya Zakharia','XH','Clock',1],
    ['rahmath-bari-pm','Secondary Section','Section Leader','Rahmath Bari P M','XF','Bridge',2],
    ['rayan-mohamed','Secondary Section','Section Leader','Rayan Mohamed','XG','Microphone',3,'https://i.ibb.co/ym0D1XsJ/1044a44d-bc96-4c4b-9941-3ee76f6fed66.jpg'],
    ['eshan-mohammed-ms','Secondary Section','Section Leader','Eshan Mohammed M S','XD','Key',4],
    ['sanvi-k-nair','Middle Section','Section Leader','Sanvi K Nair','8-C','Microphone',1],
    ['azza-aathif','Middle Section','Section Leader','Azza Aathif','8A','Light Bulb',2],
    ['diya-nishar','Middle Section','Section Leader','Diya Nishar','8 C','Phoenix',3],
    ['fateh-mohammed-azeen','Middle Section','Section Leader','Fateh Mohammed Azeen','8 F','Lion',4],
    ['muhammed-al-fazza-kf','Middle Section','Section Leader','Muhammed Al Fazza K.F','8 B','Football',5],
    ['mohammed-shayaan','Middle Section','Section Leader','Mohammed Shayaan','8 H','Spectacles',6],
    ['nota-middle-section-leader','Middle Section','Section Leader','NOTA (None of the Above)','','NOTA',99],
    ['nota-secondary-section-leader','Secondary Section','Section Leader','NOTA (None of the Above)','','NOTA',99],
    ['nota-senior-head-boy','Senior Secondary Section','Head Boy','NOTA (None of the Above)','','NOTA',99],
    ['nota-senior-head-girl','Senior Secondary Section','Head Girl','NOTA (None of the Above)','','NOTA',99]
  ];
  candidates.forEach(function(c) {
    saveRecord_({ collectionName:'electionCandidates', record:{ id:c[0], section:c[1], position:c[2], name:c[3], className:c[4], photoUrl:c[7] || '', symbolName:c[5], symbolUrl:'', manifesto:c[5] === 'NOTA' ? 'Choose this option if you do not support any listed candidate for this position.' : '', audience:'Student', order:c[6], active:true } });
  });
  return candidates.length;
}

function ensureElectionNotaCandidates2026_() {
  const notaCandidates = [
    ['nota-middle-section-leader','Middle Section','Section Leader'],
    ['nota-secondary-section-leader','Secondary Section','Section Leader'],
    ['nota-senior-head-boy','Senior Secondary Section','Head Boy'],
    ['nota-senior-head-girl','Senior Secondary Section','Head Girl']
  ];
  notaCandidates.forEach(function(c) {
    saveRecord_({ collectionName:'electionCandidates', record:{ id:c[0], section:c[1], position:c[2], name:'NOTA (None of the Above)', className:'', photoUrl:'', symbolName:'NOTA', symbolUrl:'', manifesto:'Choose this option if you do not support any listed candidate for this position.', audience:'Student', order:99, active:true } });
  });
}

function ensureElectionCandidatePhotos2026_() {
  const sheet = getSpreadsheet_().getSheetByName('electionCandidates');
  if (!sheet || sheet.getLastRow() < 2) return;
  const headers = readHeaders_(sheet);
  const idColumn = headers.indexOf('id') + 1;
  const photoColumn = headers.indexOf('photoUrl') + 1;
  if (!idColumn || !photoColumn) return;
  const rowNumber = findRowById_(sheet, headers, 'rayan-mohamed');
  if (rowNumber && !String(sheet.getRange(rowNumber, photoColumn).getValue() || '').trim()) {
    sheet.getRange(rowNumber, photoColumn).setValue('https://i.ibb.co/ym0D1XsJ/1044a44d-bc96-4c4b-9941-3ee76f6fed66.jpg');
  }
}

function migrateElectionPositionLabels2026_() {
  const sheet = getSpreadsheet_().getSheetByName('electionCandidates');
  if (!sheet || sheet.getLastRow() < 2) return 0;
  const headers = readHeaders_(sheet);
  const positionColumn = headers.indexOf('position') + 1;
  const idColumn = headers.indexOf('id') + 1;
  if (!positionColumn || !idColumn) return 0;
  const rowCount = sheet.getLastRow() - 1;
  const range = sheet.getRange(2, positionColumn, rowCount, 1);
  const values = range.getValues();
  const ids = sheet.getRange(2, idColumn, rowCount, 1).getValues();
  const suppliedPositions = { 'naeema-kathoon':'Head Girl', 'aathikah-jinan':'Head Girl', 'miyaz-musthafa':'Head Boy' };
  let changed = 0;
  values.forEach(function(row, index) {
    const suppliedPosition = suppliedPositions[String(ids[index][0] || '').trim()];
    if (suppliedPosition && row[0] !== suppliedPosition) {
      row[0] = suppliedPosition;
      changed += 1;
    }
  });
  if (changed) range.setValues(values);
  return changed;
}

function getElectionPublicData_() {
  const ss = getSpreadsheet_();
  const settings = readElectionSettings_(ss.getSheetByName('electionSettings'));
  const candidates = readSheetObjects_(ss.getSheetByName('electionCandidates'))
    .filter(function(item) { return normalizeBoolean_(item.active, true); })
    .map(function(item) {
      return {
        id: String(item.id || '').trim(),
        section: String(item.section || '').trim(),
        position: normalizeElectionPosition_(item.position),
        name: String(item.name || '').trim(),
        className: String(item.className || '').trim(),
        photoUrl: safePublicUrl_(item.photoUrl),
        symbolName: String(item.symbolName || '').trim(),
        symbolUrl: safePublicUrl_(item.symbolUrl),
        manifesto: String(item.manifesto || '').trim().substring(0, 1000),
        audience: String(item.audience || 'All').trim(),
        order: Number(item.order) || 0
      };
    })
    .filter(function(item) { return item.id && item.section && item.position && item.name; })
    .sort(function(a, b) {
      return a.section.localeCompare(b.section) || a.position.localeCompare(b.position) || a.order - b.order || a.name.localeCompare(b.name);
    });

  const closesAt = String(settings.pollClosesAt || '2026-07-23T00:00:00+05:30');
  const isOpen = normalizeBoolean_(settings.pollOpen, true) && Date.now() < new Date(closesAt).getTime();
  return {
    title: String(settings.electionTitle || 'Ansar School Council Election 2026'),
    electionDate: String(settings.electionDate || '2026-07-23'),
    closesAt: closesAt,
    isOpen: isOpen,
    announcement: String(settings.announcement || ''),
    audienceOptions: ['Student'],
    sections: ['Middle Section', 'Secondary Section', 'Senior Secondary Section'],
    candidates: candidates,
    voteResetId: String(settings.voteResetId || 'initial'),
    rule: 'Students may cast four votes per day: one Middle Section Leader, one Secondary Section Leader, one Senior Secondary Head Boy, and one Senior Secondary Head Girl.'
  };
}

function saveElectionVote_(body) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const publicData = getElectionPublicData_();
    if (!publicData.isOpen) throw new Error('Campaign polling is currently closed.');

    const candidateId = String(body.candidateId || '').trim();
    const deviceId = String(body.deviceId || '').trim();
    const audience = 'Student';
    if (!candidateId) throw new Error('Choose a candidate.');
    if (!/^[a-zA-Z0-9-]{20,100}$/.test(deviceId)) throw new Error('This browser could not be verified. Refresh and try again.');

    const candidate = publicData.candidates.filter(function(item) { return item.id === candidateId; })[0];
    if (!candidate) throw new Error('Candidate is unavailable.');

    const dateKey = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
    const deviceHash = hashElectionDevice_(deviceId);
    const votesSheet = getSpreadsheet_().getSheetByName('electionVotes') || getSpreadsheet_().insertSheet('electionVotes');
    const headers = ensureHeaders_(votesSheet, SHEET_COLUMNS.electionVotes);
    const existingVotes = readSheetObjects_(votesSheet);
    const duplicate = existingVotes.some(function(vote) {
      const sameSection = String(vote.section) === candidate.section;
      const sameVotingCategory = candidate.section === 'Senior Secondary Section'
        ? normalizeElectionPosition_(vote.position) === normalizeElectionPosition_(candidate.position)
        : sameSection;
      return String(vote.dateKey) === dateKey && String(vote.deviceHash) === deviceHash && sameSection && sameVotingCategory;
    });
    if (duplicate) throw new Error('This device has already voted in this category today. Other voting categories remain available.');

    const vote = {
      id: Utilities.getUuid(),
      dateKey: dateKey,
      submittedAt: Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss'),
      candidateId: candidate.id,
      candidateName: candidate.name,
      section: candidate.section,
      position: candidate.position,
      audience: audience,
      deviceHash: deviceHash
    };
    votesSheet.appendRow(headers.map(function(header) { return vote[header] == null ? '' : vote[header]; }));
    CacheService.getScriptCache().remove('electionAnalytics');
    return {
      id: vote.id,
      dateKey: dateKey,
      section: candidate.section,
      position: candidate.position,
      voteResetId: publicData.voteResetId
    };
  } finally {
    lock.releaseLock();
  }
}

function setElectionPolling_(enabled) {
  const isEnabled = enabled === true || String(enabled).toUpperCase() === 'TRUE';
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('electionSettings') || ss.insertSheet('electionSettings');
  const headers = ensureHeaders_(sheet, SHEET_COLUMNS.electionSettings);
  const keyColumn = headers.indexOf('key') + 1;
  const valueColumn = headers.indexOf('value') + 1;
  let targetRow = 0;
  if (sheet.getLastRow() >= 2) {
    const keys = sheet.getRange(2, keyColumn, sheet.getLastRow() - 1, 1).getValues();
    for (let index = keys.length - 1; index >= 0; index -= 1) {
      if (String(keys[index][0]).trim() === 'pollOpen') {
        targetRow = index + 2;
        break;
      }
    }
  }
  if (targetRow) sheet.getRange(targetRow, valueColumn).setValue(isEnabled ? 'TRUE' : 'FALSE');
  else sheet.appendRow(headers.map(function(header) {
    if (header === 'key') return 'pollOpen';
    if (header === 'value') return isEnabled ? 'TRUE' : 'FALSE';
    return '';
  }));
  CacheService.getScriptCache().remove('electionAnalytics');
  return { isOpen: isEnabled, updatedAt: new Date().toISOString() };
}

function resetElectionVotes_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName('electionVotes') || ss.insertSheet('electionVotes');
    const headers = ensureHeaders_(sheet, SHEET_COLUMNS.electionVotes);
    const clearedVotes = Math.max(0, sheet.getLastRow() - 1);
    if (clearedVotes > 0) {
      sheet.getRange(2, 1, clearedVotes, headers.length).clearContent();
    }
    // Changing this ID invalidates browser-side vote markers. This lets every
    // previous test voter participate again immediately after an admin reset.
    const settingsSheet = ss.getSheetByName('electionSettings') || ss.insertSheet('electionSettings');
    const settingsHeaders = ensureHeaders_(settingsSheet, SHEET_COLUMNS.electionSettings);
    const keyColumn = settingsHeaders.indexOf('key') + 1;
    const valueColumn = settingsHeaders.indexOf('value') + 1;
    const voteResetId = Utilities.getUuid();
    let resetIdRow = 0;
    if (settingsSheet.getLastRow() >= 2) {
      const keys = settingsSheet.getRange(2, keyColumn, settingsSheet.getLastRow() - 1, 1).getValues();
      for (let index = keys.length - 1; index >= 0; index -= 1) {
        if (String(keys[index][0]).trim() === 'voteResetId') {
          resetIdRow = index + 2;
          break;
        }
      }
    }
    if (resetIdRow) settingsSheet.getRange(resetIdRow, valueColumn).setValue(voteResetId);
    else settingsSheet.appendRow(settingsHeaders.map(function(header) {
      if (header === 'key') return 'voteResetId';
      if (header === 'value') return voteResetId;
      return '';
    }));
    CacheService.getScriptCache().remove('electionAnalytics');
    return { clearedVotes: clearedVotes, resetAt: new Date().toISOString(), voteResetId: voteResetId };
  } finally {
    lock.releaseLock();
  }
}

function getElectionAnalytics_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('electionAnalytics');
  if (cached) return JSON.parse(cached);

  const publicData = getElectionPublicData_();
  const votes = readSheetObjects_(getSpreadsheet_().getSheetByName('electionVotes'));
  const candidateMap = {};
  publicData.candidates.forEach(function(candidate) {
    candidateMap[candidate.id] = Object.assign({}, candidate, { votes: 0 });
  });

  const byDay = {};
  const byAudience = {};
  const uniqueDevices = {};
  votes.forEach(function(vote) {
    const id = String(vote.candidateId || '');
    if (candidateMap[id]) candidateMap[id].votes += 1;
    const day = String(vote.dateKey || 'Unknown');
    const audience = String(vote.audience || 'Unknown');
    byDay[day] = (byDay[day] || 0) + 1;
    byAudience[audience] = (byAudience[audience] || 0) + 1;
    if (vote.deviceHash) uniqueDevices[String(vote.deviceHash)] = true;
  });

  const analytics = {
    title: publicData.title,
    electionDate: publicData.electionDate,
    closesAt: publicData.closesAt,
    isOpen: publicData.isOpen,
    generatedAt: new Date().toISOString(),
    totalVotes: votes.length,
    uniqueDevices: Object.keys(uniqueDevices).length,
    candidates: Object.keys(candidateMap).map(function(id) { return candidateMap[id]; }),
    byDay: byDay,
    byAudience: byAudience
  };
  cache.put('electionAnalytics', JSON.stringify(analytics), 5);
  return analytics;
}

function validateElectionShareKey_(key) {
  const expected = PropertiesService.getScriptProperties().getProperty('ELECTION_SHARE_KEY');
  if (!expected || String(key || '') !== expected) throw new Error('Invalid analytics link.');
}

function readElectionSettings_(sheet) {
  const settings = {};
  readSheetObjects_(sheet).forEach(function(row) {
    const key = String(row.key || '').trim();
    if (key) settings[key] = row.value;
  });
  return settings;
}

function readSheetObjects_(sheet) {
  if (!sheet || sheet.getLastRow() < 2 || sheet.getLastColumn() < 1) return [];
  const headers = readHeaders_(sheet);
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues().map(function(row) {
    const item = {};
    headers.forEach(function(header, index) { item[header] = row[index]; });
    return item;
  });
}

function normalizeBoolean_(value, fallback) {
  if (value === true || String(value).toUpperCase() === 'TRUE') return true;
  if (value === false || String(value).toUpperCase() === 'FALSE') return false;
  return fallback;
}

function safePublicUrl_(value) {
  const url = String(value || '').trim();
  return /^https:\/\//i.test(url) ? url : '';
}

function normalizeElectionPosition_(value) {
  const position = String(value || '').trim();
  return position.toLowerCase() === 'school leader' ? 'Head Boy / Head Girl' : position;
}

function hashElectionDevice_(deviceId) {
  const salt = PropertiesService.getScriptProperties().getProperty('ELECTION_HASH_SALT');
  if (!salt) throw new Error('Election security is not initialized. Run setupElectionSheets().');
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, deviceId + '|' + salt)
    .map(function(byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); })
    .join('');
}

function saveRecord_(body) {
  const collectionName = normalizeCollectionName_(body.collectionName);
  const sheetName = getSheetName_(collectionName);
  const ss = getSpreadsheet_(body.spreadsheetId);
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  const headers = ensureHeaders_(sheet, SHEET_COLUMNS[sheetName]);
  const record = normalizeRecord_(collectionName, body.record || {});

  const rowNumber = findRowById_(sheet, headers, record.id);
  const values = headers.map((header) => encodeCellValue_(record[header]));

  if (rowNumber) {
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }

  return record;
}

function deleteRecord_(body) {
  const collectionName = normalizeCollectionName_(body.collectionName);
  const sheetName = getSheetName_(collectionName);
  const ss = getSpreadsheet_(body.spreadsheetId);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;

  const headers = readHeaders_(sheet);
  let rowNumber = findRowById_(sheet, headers, body.id);
  if (!rowNumber && collectionName === 'ansarTimes') {
    rowNumber = findAnsarTimesRow_(sheet, headers, body.record || {});
  }
  if (rowNumber) sheet.deleteRow(rowNumber);
}

function normalizeCollectionName_(collectionName) {
  const value = String(collectionName || '').trim();
  if (!value) throw new Error('Missing collection name.');
  return value;
}

function getSheetName_(collectionName) {
  if (collectionName === 'events') return 'updates';
  if (!SHEET_COLUMNS[collectionName]) throw new Error('Unsupported collection: ' + collectionName);
  return collectionName;
}

function normalizeRecord_(collectionName, record) {
  const item = Object.assign({}, record);
  item.id = item.id || createId_(item.title || collectionName);
  item.published = item.published !== false;

  if (collectionName === 'events') {
    item.category = 'Events';
    item.eventImages = item.eventImages || item.imageUrls || [];
    item.imageUrls = item.imageUrls || item.eventImages || [];
  }

  if (collectionName === 'updates') {
    item.category = item.category || 'News';
  }

  if (collectionName === 'events' || collectionName === 'updates') {
    splitLargeImageList_(item, 'eventImages');
    splitLargeImageList_(item, 'imageUrls');
  }

  if (collectionName === 'sportsAchievements') {
    item.imageUrl = item.imageUrl || firstImage_(item.imageUrls);
  }

  if (collectionName === 'learningFeatures') {
    item.slug = String(item.slug || item.id || item.title || '').trim();
    item.id = item.slug || item.id || createId_(item.title || collectionName);
    item.imageUrl = item.imageUrl || firstImage_(item.galleryImages);
  }

  if (collectionName === 'sproutsActivities') {
    item.category = item.category || 'Sprouts Activity';
    splitLargeImageList_(item, 'imageUrls');
  }

  if (collectionName === 'contactSubmissions') {
    item.date = item.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    item.submittedAt = item.submittedAt || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy hh:mm:ss a');
  }

  return item;
}

function firstImage_(value) {
  if (Array.isArray(value)) return value[0] || '';
  return String(value || '').split(/\r?\n|,\s*/).map(function(url) {
    return String(url || '').trim();
  }).filter(Boolean)[0] || '';
}

function splitLargeImageList_(item, key) {
  const urls = normalizeList_(item[key]);
  if (!urls.length) return;

  const chunks = chunkListForSheetCell_(urls, 45000, 4);
  item[key] = chunks[0] || [];
  for (let index = 1; index < 4; index += 1) {
    item[key + (index + 1)] = chunks[index] || [];
  }
}

function normalizeList_(value) {
  if (Array.isArray(value)) return value.map(function(item) {
    return String(item || '').trim();
  }).filter(Boolean);
  return String(value || '').split(/\r?\n|,\s*/).map(function(item) {
    return String(item || '').trim();
  }).filter(Boolean);
}

function chunkListForSheetCell_(items, maxChars, maxChunks) {
  const chunks = [[]];
  items.forEach(function(item) {
    const current = chunks[chunks.length - 1];
    const currentSize = current.join('\n').length;
    const nextSize = currentSize + (current.length ? 1 : 0) + item.length;
    if (nextSize > maxChars && chunks.length < maxChunks) {
      chunks.push([item]);
    } else {
      current.push(item);
    }
  });
  return chunks;
}

function ensureHeaders_(sheet, requiredHeaders) {
  const currentHeaders = readHeaders_(sheet);
  const headers = currentHeaders.length ? currentHeaders.slice() : requiredHeaders.slice();

  requiredHeaders.forEach((header) => {
    if (headers.indexOf(header) === -1) headers.push(header);
  });

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  return headers;
}

function readHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (!lastColumn) return [];
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0]
    .map((header) => String(header || '').trim())
    .filter(Boolean);
}

function findRowById_(sheet, headers, id) {
  const idColumn = headers.indexOf('id') + 1;
  if (!idColumn || !id) return null;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, idColumn, lastRow - 1, 1).getValues();
  const target = String(id);
  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0]) === target) return index + 2;
  }
  return null;
}

function findAnsarTimesRow_(sheet, headers, record) {
  const yearColumn = headers.indexOf('year') + 1;
  const monthColumn = headers.indexOf('month') + 1;
  if (!yearColumn || !monthColumn || !record.year || !record.month) return null;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const targetYear = String(record.year).trim();
  const targetMonth = String(record.month).trim().toLowerCase();

  for (let index = 0; index < values.length; index += 1) {
    const row = values[index];
    const rowYear = String(row[yearColumn - 1]).trim();
    const rowMonth = String(row[monthColumn - 1]).trim().toLowerCase();
    if (rowYear === targetYear && rowMonth === targetMonth) return index + 2;
  }

  return null;
}

function encodeCellValue_(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join('\n');
  if (value === true) return 'TRUE';
  if (value === false) return 'FALSE';
  return value == null ? '' : value;
}

function createId_(title) {
  const slug = String(title || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60) || 'item';
  return slug + '-' + Date.now();
}

function validateToken_(token) {
  const expected = PropertiesService.getScriptProperties().getProperty('WRITE_TOKEN');
  if (expected && token !== expected) throw new Error('Invalid write token.');
}

function getSpreadsheet_(spreadsheetId) {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  return SpreadsheetApp.openById(spreadsheetId || DEFAULT_SPREADSHEET_ID);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(payload, callback) {
  const callbackName = String(callback || '').trim();
  if (!callbackName) return json_(payload);
  if (!/^[a-zA-Z_$][0-9a-zA-Z_$\.]*$/.test(callbackName)) throw new Error('Invalid callback.');
  return ContentService
    .createTextOutput(callbackName + '(' + JSON.stringify(payload) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
