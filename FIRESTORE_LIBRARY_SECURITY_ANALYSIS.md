# Library module Firestore analysis

Date: 2026-07-31

## Existing application patterns

- The React application uses Firebase Auth and Firestore's modular web SDK.
- Public content collections are read in real time. Admin writes are restricted by `isAdmin()` / `isVerifiedAdmin()` rules.
- Existing active collection paths found in the codebase include `pages`, `updates`, `events`, `news`, `gallery`, `notices`, `settings`, `navigation`, `learningLabs`, `fieldTrips`, `leadership`, `achievements`, `sportsAchievements`, `ansarTimes`, `publicDisclosure`, `carousel`, `users`, `admins`, and `adminTrash`.
- Queries use collection listeners, single-field `orderBy`, `where`, and `limit`. The library's public post query will constrain `published == true` and sort client-side, so no composite index is required.

## New library data model

### `librarySettings/main`

Public, non-sensitive page configuration only. Required fields: `title`, `subtitle`, `intro`, `heroImageUrl`, `resourceUrl`, `resourceLabel`, `openingHours`, `contactEmail`, `published`, `createdAt`, `updatedAt`.

### `libraryPosts/{autoId}`

Publicly readable only when `published == true`. Required fields: `type` (`Event`, `Activity`, `New Arrival`, `Resource`, `Publication`, or `Announcement`), `title`, `summary`, `body`, `date`, `imageUrl`, `linkUrl`, `published`, `createdAt`, `updatedAt`.

Only verified administrators may create, update, or delete either collection. The settings schema does not contain private credentials or personal data; a public read is safe for its defined fields. Library post drafts are excluded from public reads by the rules and the query.

## Security review assumptions

- `createdAt` is immutable after creation.
- `updatedAt` must use the server timestamp and equal `request.time`.
- URLs are limited to absolute HTTP(S) URLs or site-relative paths.
- All strings, booleans, and timestamps are validated on create and update.
- No role, owner, or user identity data is stored in the library documents.

## Devil's-advocate rules review

```json
{
  "score": 5,
  "summary": "The new library paths use strict schemas, verified-admin writes, immutable creation timestamps, and published-only public access for posts.",
  "findings": [
    {
      "check": "Public list exploit",
      "severity": "minor",
      "issue": "No issue found: the public listener queries published == true, which is the only query allowed for a non-admin library post list.",
      "recommendation": "Keep public post queries constrained to published == true."
    },
    {
      "check": "Update bypass and schema pollution",
      "severity": "minor",
      "issue": "No issue found: both create and update call the same validators, with strict allowed fields, type checks, and size limits.",
      "recommendation": "Retain the validator calls on every future library write path."
    },
    {
      "check": "Authority source and privilege escalation",
      "severity": "minor",
      "issue": "No issue found: write access depends on verified administrator identity, not a role supplied in a library document.",
      "recommendation": "Manage administrator access through the existing protected admin mechanism."
    },
    {
      "check": "Timestamp manipulation",
      "severity": "minor",
      "issue": "No issue found: creates require server timestamps and updates preserve createdAt while requiring updatedAt to equal request.time.",
      "recommendation": "Continue using serverTimestamp() in the admin editor."
    }
  ]
}
```

## ATL settings update (2026-07-31)

### New data model

The ATL editor uses one document only: `atlSettings/main`. It contains the public page's hero label, title, description, cover-image URL, inauguration details, overview copy, publishing state, and server-managed timestamps. The cover image may be a site-relative asset path (such as `/atl/atl-cover.jpg`) or an HTTPS image URL.

### Rule and access review

- Public visitors may read the ATL settings because the page content is intentionally public.
- Only verified administrators may create, update, or delete the fixed `main` settings document.
- Creates and updates permit only the documented fields, enforce required fields and length limits, validate the image path/URL, require a boolean publishing state, and use server-time timestamps.
- Updates preserve `createdAt` and require `updatedAt` to equal the Firestore request time.
- The former `electionAdminConfig` rule has been removed, so the school-election configuration is no longer exposed through the website's Firestore rules.

### Devil's-advocate audit

```json
{
  "collection": "atlSettings/main",
  "public_read_is_intentional": true,
  "anonymous_writes": "denied",
  "unverified_admin_writes": "denied",
  "document_scope": "fixed to main",
  "unexpected_fields": "denied",
  "invalid_or_oversized_text": "denied",
  "invalid_image_path_or_url": "denied",
  "client_controlled_timestamps": "denied",
  "update_createdAt_mutation": "denied",
  "pii_stored": "no"
}
```
