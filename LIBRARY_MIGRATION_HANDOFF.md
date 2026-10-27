# Library / Hosting Migration Handoff

## Current state

- The website is deployed on Firebase Hosting for project `ansar-english-school`.
- Firebase Firestore stores library metadata: titles, descriptions, dates, links, types, staff details, and settings.
- New library images and PDFs are intended to upload to Hostinger through:
  `https://upload.ansarschool.in/upload.php`
- Hostinger upload files are stored under `public_html/UPLOADS/`.
- Firestore stores the returned Hostinger URL, not the media binary.
- The library site is available at `/library`.
- The admin library manager is available under the admin area.

## Recent library fixes

- Library tabs and dynamic content loading.
- Events and Activities type normalization.
- Legacy event-like announcements routed into Events & Activities.
- Newspaper/clipping normalization, including legacy announcement records.
- Admin edit routing for legacy records.
- One Fact a Day archive loading.
- Library contact/staff section.
- Drive-link workflow for PDFs/documents.
- Hostinger-based media uploader for library images.

## Current blocker

Firebase Hosting deployments were rejected with a Hosting storage quota error. The Firebase project is on Blaze. Old Hosting releases were manually deleted from the Firebase Hosting release history. Storage reclamation may take up to 24 hours.

## Important distinction

- Firebase Hosting stores deployed website builds and retained releases.
- Firestore stores library records and URLs.
- Hostinger stores uploaded library media.
- Do not delete the current Firebase Hosting release or Firestore collections.

## Migration decision to make later

Evaluate whether to:

1. Keep the React app on Firebase Hosting and retain only a small number of releases.
2. Move the complete frontend build to Hostinger while keeping Firebase Auth/Firestore.
3. Move media only to Hostinger (already implemented for new library uploads).

Moving the complete website requires migrating the `dist` hosting output, SPA rewrites, custom-domain routing, cache headers, service worker, authentication callbacks, and deployment workflow. Do not switch DNS or delete Firebase Hosting until the Hostinger copy is tested and the admin panel, authentication, Firestore reads/writes, notifications, and all routes work.

## Resume prompt

“Resume the Ansar English School library hosting migration. First inspect this handoff file, verify Firebase Hosting usage and the Hostinger upload endpoint, then propose and implement the safest migration plan without deleting the current live release or Firestore data. Ensure library images/PDFs remain on Hostinger and test every public and admin route before changing DNS.”