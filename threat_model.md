# Threat Model

## Project Overview

DOMREALCE is a public-facing React + Express + TypeScript web application with a PostgreSQL database. It serves as a business website, portfolio, and e-commerce storefront for a Portuguese printing and visual communication company. Production traffic reaches the Express API directly, with Replit OAuth used for admin authentication, PostgreSQL storing business data, IfthenPay and PayPal handling payments, and Replit Object Storage serving uploaded media.

Production scope for this scan assumes `NODE_ENV=production`, TLS is handled by the platform, and the deployed site is publicly reachable from the internet.

## Assets

- **Admin access and sessions** — Replit-authenticated admin sessions and any fallback admin token. Compromise would let an attacker manage orders, content, and media.
- **Customer contact data** — names, email addresses, phone numbers, company names, messages, and uploaded files from contact submissions. This is personal and business-sensitive data.
- **Order and payment records** — customer identity and shipping details, NIF, cart contents, totals, payment references, and payment metadata. Exposure or tampering can cause privacy harm and financial loss.
- **Public site content and media** — service pages, hero content, galleries, slider assets, and any files served from object storage. Unauthorized changes affect site integrity and brand trust.
- **Application secrets and integrations** — database credentials, session secret, payment gateway credentials, and anti-phishing keys. These protect backend trust with external services.

## Trust Boundaries

- **Browser → Express API** — every request from the public website is untrusted. The server must authenticate, authorize, and validate all sensitive reads and writes.
- **Public user → Admin boundary** — `/api/admin/*` and any content-management capability must be enforced server-side. UI-only hiding is not a security control.
- **Express API → PostgreSQL** — the backend has direct access to contacts, orders, sessions, and site content. Broken access control or unsafe writes here affect the whole business.
- **Express API → Object Storage** — uploaded files cross from untrusted users into publicly served storage. File type, write access, and hosting behavior matter because files are served back to browsers.
- **Express API → External services** — the backend trusts Replit OIDC and payment providers. Callback and notification handlers must verify authenticity before changing business state.

## Scan Anchors

- **Production entry points:** `server/index.ts`, `server/routes.ts`
- **Highest-risk code areas:** `server/routes.ts`, `server/middleware.ts`, `server/replitAuth.ts`, `server/ifthenpay.ts`, `server/objectStorage.ts`, `server/visual-editor.ts`, `server/storage.ts`, `shared/schema.ts`
- **Public surfaces:** storefront routes, `/api/contact`, `/api/orders`, `/api/payments/*`, `/api/news/*`, `/api/testimonials/*`, `/public-objects/*`, public object/media helpers, service hero/gallery reads
- **Admin/authenticated surfaces:** `/api/admin/*`, Replit login/callback/session handling
- **Usually low-priority or dev-only unless proven reachable:** `client/src/pages/visual-editor-demo.tsx`, `client/src/pages/exportar-site.tsx`, `client/src/App1.tsx`, DEBUG-gated `/api/debug/test-email`

## Threat Categories

### Spoofing

Admin-only operations rely on Replit-authenticated sessions or a shared admin token. All privileged routes and privileged non-`/api/admin` helpers MUST require server-side authentication. Payment callbacks and notifications MUST verify provider authenticity before they are trusted to confirm payment or change order state.

### Tampering

Customers can submit orders, uploads, and payment requests from an untrusted browser. The server MUST calculate authoritative prices, totals, payment state, and fulfillment state itself rather than trusting client-supplied values. Public media and content-management endpoints MUST not allow anonymous users to write, overwrite, publish, or delete site assets.

### Information Disclosure

The application stores contact submissions, file attachments, and order records containing personal and payment-adjacent information. Any route that returns contacts, orders, attachments, or internal media metadata MUST enforce authorization and least-privilege responses. Sensitive identifiers in URLs or client state MUST not become the only control protecting another user's data.

### Denial of Service

Public forms, uploads, and payment helpers can be triggered by any internet user. Public endpoints MUST enforce practical limits on request size, upload size, and abusive request volume so attackers cannot exhaust storage, database, or third-party payment resources.

### Elevation of Privilege

Any public route that can modify content, generate trusted uploads, or host attacker-controlled files on the production origin can become a path to admin-impacting behavior. The system MUST prevent public users from gaining admin-equivalent capabilities through missing authorization, same-origin file hosting, or broken function-level access control.