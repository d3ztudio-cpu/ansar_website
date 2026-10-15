# Google Sheets Content Database

The public website now reads content from this spreadsheet first:

`https://docs.google.com/spreadsheets/d/1ymcRw-HqJfbqcRWa4BXXFzID4prJ20LhrTNK24jpVVE/edit`

The website merges this Sheet with existing Firestore content, so older Firestore events/news can remain visible while new image-based content is added in Sheets.

## Admin panel writes to Sheets

The Student-Centric Learning transport directory, as well as News, Events, and Achievements, can be saved from the website admin panel into Google Sheets by using a Google Apps Script Web App.

### 1. Add the Apps Script

Open the spreadsheet, then go to:

`Extensions` -> `Apps Script`

Paste the contents of this project file into Apps Script:

`GOOGLE_SHEETS_APPS_SCRIPT.gs`

Save the Apps Script project.

### 2. Create the Sheet tabs

In Apps Script, select this function and run it once:

`setupWebsiteSheets`

Approve the permission request. This creates or updates these tabs:

- `updates`
- `achievements`
- `publicDisclosure`
- `transportStaff`

The admin panel stores News and Events together in the `updates` tab. Event rows use `category` = `Events`; news rows use `category` = `News`.

### 3. Optional write token

In Apps Script, open:

`Project Settings` -> `Script properties`

Add this property:

| Property | Value |
| --- | --- |
| `WRITE_TOKEN` | any long private text |

If you set a token here, put the same value in `googleSheetsConfig.js` as `writeToken`.

### 4. Deploy as Web App

In Apps Script:

`Deploy` -> `New deployment` -> choose `Web app`

Use these settings:

| Setting | Value |
| --- | --- |
| Execute as | `Me` |
| Who has access | `Anyone` |

Click `Deploy`, approve permissions, then copy the Web App URL.

### 5. Connect the website admin panel

Open `googleSheetsConfig.js` and paste the Web App URL:

```javascript
writeEndpoint: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
```

If you used `WRITE_TOKEN`, also set:

```javascript
writeToken: 'your-long-private-text',
```

After this, admin panel saves, edits, and deletes for News, Events, Achievements, and Transport Staff go to Google Sheets.

## Required sharing

Set the spreadsheet sharing to **Anyone with the link can view**. The website only reads the sheet; it does not need edit access.

## Tabs

Use these tab names for content:

- `publicDisclosure`
- `updates`
- `achievements`
- `transportStaff` — `id`, `busNumber`, `driverName`, `driverPhone`, `conductorName`, `conductorPhone`, `order`, `published`

For mandatory disclosure only, the site also checks the first spreadsheet tab, then `MandatoryDisclosure`, then `PublicDisclosure`.

## Common columns

Column headers are flexible with spaces/case, but these names are recommended:

- `id`
- `title`
- `description`
- `date`
- `category`
- `published`
- `order`
- `imageUrl`
- `thumbnailUrl`
- `coverImageUrl`
- `imageUrls`
- `eventImages`
- `documentUrl`
- `section`
- `slug`

Use Sheets for image/document-based content and the text connected to those images or files from now onward. Keep main website settings, homepage text, leadership profiles, and custom page content in Firestore through the admin panel.

Use `published` values like `TRUE` or `FALSE`. For faster loading, put a small compressed image in `thumbnailUrl` or `coverImageUrl` for cards, and put full-size images on new lines in `imageUrls` or `eventImages` for the detail page.

## Mandatory disclosure example

| id | title | section | documentUrl | order | published |
| --- | --- | --- | --- | --- | --- |
| affiliation-certificate | Affiliation Certificate | General Information | https://example.com/file.pdf | 1 | TRUE |

## Updates example

| id | title | category | description | date | thumbnailUrl | coverImageUrl | imageUrls | published |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| annual-day-2026 | Annual Day 2026 | Events | Celebration details here | 2026-06-27 | https://example.com/thumb.jpg | https://example.com/cover.jpg | https://example.com/1.jpg | TRUE |

Use category `News` for news cards and `Events` for event cards.
