---
name: Social image validation
description: Verify actual image responses, not just successful status codes, for social metadata.
---
Validate social image URLs using Content-Type and actual image bytes, not HTTP status alone.

**Why:** The site's SPA returned HTTP 200 with HTML for the previously configured `/og-image.jpg`; that did not make it a valid social image.

**How to apply:** Before selecting or diagnosing an Open Graph image, confirm it returns an image MIME type and decodes as an image. Do not assume referenced filenames exist.
