<div align="center">

# Yekta Akhavan — Portfolio

**A bilingual (English + Persian), accessible, self-hosted portfolio with a real admin panel.**
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL

[فارسی](README.fa.md) · [Features](#features) · [Quick start](#quick-start) · [Deploy](#deployment) · [Troubleshooting](#troubleshooting)

</div>

---

## Contents

1. [What is this?](#what-is-this)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Quick start](#quick-start)
5. [Environment variables](#environment-variables)
6. [Scripts](#scripts)
7. [Project structure](#project-structure)
8. [How things work](#how-things-work)
   - [Languages (English / Persian)](#languages-english--persian)
   - [Managing content (admin panel)](#managing-content-admin-panel)
   - [The blog](#the-blog)
   - [Visitor messages and moderation](#visitor-messages-and-moderation)
   - [Images and uploads](#images-and-uploads)
   - [Theme and colors](#theme-and-colors)
   - [Rendering and caching](#rendering-and-caching)
9. [API reference](#api-reference)
10. [Security](#security)
11. [Accessibility](#accessibility)
12. [Deployment](#deployment)
13. [Maintenance](#maintenance)
14. [Troubleshooting](#troubleshooting)
15. [Known limitations](#known-limitations)
16. [License and credits](#license-and-credits)

---

## What is this?

A personal portfolio website that you fully own and can edit without touching code:

- a **public site** (home, about, skills, projects, blog, contact, public messages, resume) in **English and Persian**,
- an **admin panel** to edit everything, reorder items by drag & drop, upload images, write articles and approve visitor messages,
- a small **Node.js backend** (Next.js route handlers + PostgreSQL) that stores the data. No third-party CMS, analytics or font service is involved.

## Features

### Public site

- **Pages:** Home, About, Skills, Projects (+ a page per project), Blog (+ a page per article), Contact, Messages, Resume (printable / save as PDF), Privacy, Cookies, Terms, Accessibility statement.
- **Two languages** with real URLs (`/about`, `/fa/about`), correct `lang`/`dir`, full right-to-left layout, a self-hosted Persian font, Persian digits and dates, and `hreflang` + sitemap entries for both. [The default language is changed in one line.](#languages-english--persian)
- **Dark and light theme** with no flash on load; follows the system until the visitor chooses.
- **Projects:** fixed-height cards, taller cover image, at most 3 tags on the image, filters and search, image viewer, and an optional long "Behind the project" write-up (Markdown) per project.
- **Blog:** tag filter and search, written date and reading time on every article, newer/older links and related articles, a compact slider of the latest 4 articles on the home page.
- **Forms:** a private contact form and a public message form. Public messages are **hidden until you approve them**.
- **Resume page** generated from your profile data.

### Admin panel (`/admin`)

- Overview, **Moderation** queue for public messages, private **Inbox**, **Projects**, **Articles**, **Skills**, **Profile**.
- **Drag & drop** reordering of projects and skills (works with a keyboard too).
- **Drag & drop image upload** with automatic WebP optimisation and required alt text.
- **Markdown editor** (toolbar, preview, ready-made templates) *inside* the Edit dialog, with an English and a Persian tab.
- Every text field has an optional **Persian version**; anything left empty falls back to English, so you can translate gradually.
- Drafts for articles, "featured" projects, public/draft switch.

### Quality

- **Fast:** pages are server-rendered and cached (ISR), images are re-encoded to small WebP files with `srcset`, fonts are self-hosted.
- **Accessible:** targets WCAG 2.2 AA — see [Accessibility](#accessibility).
- **Private:** no analytics, no ads, no tracking, no third-party fonts or CDNs. Visitor IPs are never stored in clear text.
- **Secure by default:** see [Security](#security).

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 with CSS-variable design tokens |
| Database | PostgreSQL + Drizzle ORM 0.45 (`pg` driver) |
| Images | `sharp` (WebP re-encoding, EXIF stripping) |
| Drag & drop | `@dnd-kit` (pointer, touch and keyboard sensors) |
| Markdown | `react-markdown` + `remark-gfm` (raw HTML disabled) |
| Fonts | Manrope, Fraunces, Vazirmatn via `@fontsource` — all self-hosted |
| Tooling | ESLint 9, `tsx`, `drizzle-kit` |

## Quick start

### Prerequisites

- **Node.js 20.9 or newer** (developed and tested on Node 22)
- **PostgreSQL** (tested with 16) — a running server and an empty database
- npm

### 1. Install

```bash
git clone <your-repository-url> portfolio
cd portfolio
npm install
```

### 2. Create the database

```bash
# example for a local PostgreSQL
psql -U postgres -c "CREATE DATABASE portfolio;"
```

### 3. Configure

```bash
cp .env.example .env        # Windows: copy .env.example .env
```

Open `.env` and set at least `DATABASE_URL`, `IP_HASH_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`
(see [Environment variables](#environment-variables)). Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create the tables and the first data

```bash
npm run db:push           # creates all tables
npm run db:seed           # admin account + sample profile, projects, skills (empty database only)
npm run db:seed:articles  # 6 sample articles (English + Persian) with cover images
```

`db:seed` refuses to run on a database that already contains data (pass `-- --force` to wipe it).
If you left `ADMIN_PASSWORD` empty, a random password is printed **once** in the terminal.

### 5. Run

```bash
npm run dev               # development:  http://localhost:3000
```

For real speed measurements, always test a production build:

```bash
npm run build && npm start
```

> `npm run build` needs the database to be reachable, because public pages are pre-rendered from it.

### 6. Sign in and make it yours

Open **http://localhost:3000/login** and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then:

1. **Profile** — your name, headline, bio, links, photo (drag & drop), experience, education, and the Persian version.
2. **Projects / Skills / Articles** — replace the samples with your own.
3. Delete or edit the sample articles — they are only examples.
4. Read the legal pages (`/privacy`, `/cookies`, `/terms`) and adapt them to your situation. They are templates, not legal advice.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | **yes** | PostgreSQL connection string, e.g. `postgresql://user:pass@127.0.0.1:5432/portfolio`. URL-encode special characters in the password. |
| `SITE_URL` | recommended | Public address of the site (no trailing slash). Used for the sitemap, canonical and hreflang links. |
| `IP_HASH_SECRET` | recommended | Secret for hashing visitor IPs (spam protection). If empty, a value derived from `DATABASE_URL` is used. Set your own in production. |
| `ADMIN_EMAIL` | first setup | Email of the admin account created by `npm run db:seed`. |
| `ADMIN_PASSWORD` | first setup | Password for that account. If empty, a random one is generated and printed once. |
| `UPLOAD_DIR` | optional | Folder for uploaded images. Default: `./uploads`. **Back it up.** |

The `.env` file is git-ignored. Never commit it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload. |
| `npm run build` | Production build (needs the database). |
| `npm start` | Runs the production build. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`). |
| `npm run db:push` | Creates / updates database tables from `src/db/schema.ts`. |
| `npm run db:seed` | First-time data. **Wipes everything** if you add `-- --force`; refuses on a non-empty database otherwise. |
| `npm run db:seed:articles` | Adds the sample articles. Safe to repeat: existing articles are never overwritten. |
| `npm run admin:password -- <email> "<new password>"` | Resets the admin password and ends all existing sign-ins. |
| `node scripts/make-covers.mjs` | Re-generates the sample blog cover images in `public/images/blog/`. |

## Project structure

```text
.
├── src/
│   ├── proxy.ts                  # language routing (/about → default language, /fa/... → Persian)
│   ├── app/
│   │   ├── (site)/[locale]/      # the public site — every page exists per language
│   │   │   ├── page.tsx          #   home
│   │   │   ├── about/ skills/ projects/ blog/ contact/ messages/ resume/
│   │   │   └── privacy/ cookies/ terms/ accessibility/
│   │   ├── (app)/                # admin area and sign-in (always English)
│   │   │   ├── admin/            #   overview, moderation, messages, projects, articles, skills, profile
│   │   │   └── login/
│   │   ├── api/                  # route handlers (public, auth, admin)
│   │   ├── uploads/[...path]/    # serves uploaded images
│   │   ├── sitemap.ts, robots.ts
│   │   └── globals.css           # design tokens, palettes, dark/light, RTL rules
│   ├── components/               # UI: cards, forms, editor, slider, dialogs, theme toggle…
│   ├── db/                       # Drizzle schema, DB client, seed scripts
│   ├── i18n/                     # config (default language), dictionaries en/fa, helpers
│   ├── content/
│   │   ├── blog/                 # sample articles (Markdown, en + fa) and metadata
│   │   └── legal/                # privacy / cookies / terms / accessibility text, en + fa
│   └── lib/                      # auth, validation, data access, localisation, rate limiting
├── public/images/blog/           # generated cover images
├── scripts/make-covers.mjs       # cover image generator
├── docs/CHANGELOG.fa.md          # change history (Persian)
├── drizzle.config.ts · next.config.ts · tsconfig.json
└── uploads/                      # created at runtime (git-ignored): uploaded images
```

## How things work

### Languages (English / Persian)

Everything about languages is configured in **one file: [`src/i18n/config.ts`](src/i18n/config.ts)**.

#### Change the default language

```ts
export const DEFAULT_LOCALE: Locale = "en"; // change to "fa" to make Persian the default
```

Change it, then run `npm run build` again (or restart `npm run dev`). Nothing else is needed.

| URL | default `en` | default `fa` |
|---|---|---|
| `/`, `/about` | English | **Persian** |
| `/fa/...` | Persian | redirects to the URL without the prefix |
| `/en/...` | redirects to the URL without the prefix | English |

- The default language has **no prefix**; the other one does.
- If you already shared English links and switch the default to Persian, those links will show Persian. English then lives at `/en/...`.
- The site does **not** guess the language from the browser; the default is always shown, and the header button switches.
- The admin panel and the sign-in page are always English.

#### Interface texts

Buttons, headings and messages live in `src/i18n/messages/en.ts` and `fa.ts`. They must have identical keys — TypeScript reports a missing one. Placeholders such as `{name}` or `{n}` are filled in by the code.

The legal pages are in `src/content/legal/*.en.tsx` and `*.fa.tsx`. **Have the Persian text reviewed by a person with legal/editorial knowledge.**

#### Your own content

Bio, project texts, article texts and skill names are stored in English in the normal columns and in Persian inside a `translations` column. In the admin panel look for **"Persian version (فارسی)"**. **A field left empty falls back to the English text**, so a half-translated site never shows empty gaps. Photo, email, phone and links are shared by both languages.

#### Add a third language

1. Add the code to `LOCALES` and `LOCALE_META` in `src/i18n/config.ts`.
2. Copy `src/i18n/messages/en.ts`, translate it and register it in `src/i18n/index.ts`.
3. Write the legal pages for it. Note: content translations in the database currently exist for Persian only (`translations.fa`).

### Managing content (admin panel)

| Section | What you can do |
|---|---|
| **Overview** | Counts, recent messages, quick links. |
| **Moderation** | Approve, reject, unpublish or delete messages visitors posted on the public Messages page. |
| **Inbox** | Private messages sent through the contact form (mark read, reply by email, delete). |
| **Projects** | Create / edit / delete, mark as featured, drag to reorder, upload screenshots with alt text, Persian version, and a Markdown write-up in the Edit dialog. |
| **Articles** | Write articles with a date, tags, cover image, summary, Persian version and Markdown body. Save as a draft or publish. |
| **Skills** | Create / edit / delete and drag to reorder. |
| **Profile** | Everything shown on Home, About, Contact and Resume, including the photo and the Persian version. |

Changes go live immediately: every save refreshes the cached public pages of **both** languages.

**Keyboard reordering:** focus the grip handle of an item, press `Space` to pick it up, move it with the arrow keys, press `Space` to drop it (`Esc` cancels).

### The blog

- Articles are stored in the database and written in Markdown (headings, lists, links, quotes, code blocks, tables).
- Raw HTML, images inside the text and `javascript:` links are not rendered. The cover image is a separate field.
- Each article shows the **date you set**, the reading time, clickable tags (`/blog?tag=CSS` filters the list), newer/older links and related articles.
- The home page shows a small slider with the latest 4 published articles (no auto-play).
- Six sample articles are provided in `src/content/blog/` (and their covers in `public/images/blog/`). They are examples — edit or delete them.

### Visitor messages and moderation

| Form | Where it goes | Visible to the public? |
|---|---|---|
| Contact (`/contact`) | Admin → **Inbox** | **Never** |
| Public message (`/messages`) | Admin → **Moderation**, status *pending* | Only after you press **Approve** |

Both forms are protected by a hidden honeypot field, a minimum fill time, a per-IP limit stored as a salted hash (3 per hour, 10 per day), a link limit and a same-origin check. A consent checkbox is required, and server errors come back in the visitor's language.

### Images and uploads

- Drag & drop (or choose) an image in the admin panel. Allowed: JPG, PNG, WebP, GIF, AVIF, up to **12 MB**.
- The server re-encodes every file to **WebP** in two sizes (1600 px and 640 px), strips metadata (EXIF/GPS) and rejects anything that is not really an image. A typical 2–3 MB photo becomes roughly 100 KB.
- Files are stored in `UPLOAD_DIR` (default `./uploads`) and served from `/uploads/...` with long-lived caching. **Back this folder up** together with the database.
- Alt text is requested for every image and is shown to screen readers.

### Theme and colors

All colors are semantic tokens (`canvas`, `surface`, `fg`, `muted`, `accent-*`, `brand-*`) defined in [`src/app/globals.css`](src/app/globals.css), with one value per theme. The file contains several complete palettes (dark + light); keep one palette block active and comment out the others to switch the whole site. Text contrast of the palettes was calculated against WCAG 2.2 AA. If more than one palette block is uncommented, the last one wins.

The theme toggle stores the visitor's choice in `localStorage` (key `theme`); a tiny inline script applies it before the first paint.

### Rendering and caching

- Public pages are generated at build time and cached (`revalidate = 3600`, ISR). Admin saves refresh them immediately with `revalidatePath("/(site)/[locale]", "layout")`.
- **The path must contain the route-group folder `(site)`.** A path such as `"/[locale]"` silently does nothing. Also do **not** set `dynamicParams = false` on the `[locale]` segment — refreshed pages would answer 404.
- Admin pages and the resume page are dynamic.
- The admin area reads its data on the server, so it opens without loading spinners.

## API reference

Public endpoints:

| Method & path | Purpose |
|---|---|
| `POST /api/public/contact` | Private contact message |
| `POST /api/public/messages` | Public message (stored as *pending*) |
| `GET /api/health` | `{ ok: true }` when the database answers — handy for monitoring |
| `GET /uploads/<file>` | Uploaded images |
| `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/session` | Admin session |

Admin endpoints (require the session cookie; every write also checks that the request comes from the same origin):

| Path | Methods |
|---|---|
| `/api/admin/overview` | `GET` |
| `/api/admin/profile` | `GET`, `PUT` |
| `/api/admin/projects` · `/api/admin/projects/:id` | `GET`, `POST` · `PUT`, `PATCH`, `DELETE` |
| `/api/admin/projects/reorder` | `PUT` `{ ids: number[] }` |
| `/api/admin/skills` · `/api/admin/skills/:id` | `GET`, `POST` · `PUT`, `DELETE` |
| `/api/admin/skills/reorder` | `PUT` `{ ids: number[] }` |
| `/api/admin/articles` · `/api/admin/articles/:id` | `GET`, `POST` · `PUT`, `DELETE` |
| `/api/admin/messages` · `/api/admin/messages/:id` | `GET` · `PUT`, `DELETE` |
| `/api/admin/public-messages` · `/api/admin/public-messages/:id` | `GET` · `PATCH`, `DELETE` |
| `/api/admin/uploads` | `POST` (multipart, field `file`) |

## Security

- **Passwords** are hashed with scrypt and compared in constant time; the sign-in form does not reveal whether an email exists.
- **Sessions:** a random token in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` in production), valid for 7 days; only a **SHA-256 hash** of the token is stored in the database.
- **Sign-in throttling:** 6 failed attempts per email and 10 per IP per 15 minutes (in memory).
- **CSRF:** `SameSite` cookies plus an `Origin` check on every write endpoint.
- **Input handling:** all text is normalised and length-limited; URLs are restricted to `http(s)` and the site's own `/uploads` and `/images` paths; ids sent for reordering must be unique integers.
- **Uploads:** size limit, real image decoding, re-encoding, metadata removal, random file names, and a strict file-name pattern when serving (no path traversal).
- **Markdown:** raw HTML is not rendered, `javascript:` links are stripped, and no remote images are loaded.
- **Visitor data:** IP addresses are only stored as salted hashes; no analytics or tracking.
- **HTTP headers:** `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`; `X-Powered-By` is removed. Admin and API paths are excluded from crawling in `robots.txt`.
- **Seed safety:** `db:seed` refuses to touch a database that already has data, and no default password exists.

## Accessibility

The site targets **WCAG 2.2 level AA**:

- skip link, landmarks, one `h1` per page and a valid heading outline, translated `lang` and `dir`;
- every control reachable and usable with a keyboard, visible focus, dialogs that trap focus, close with `Esc` and return focus;
- labelled form fields with errors linked via `aria-describedby`, live announcements, focus moved to the first invalid field;
- descriptive button and link names (for example "Delete project Coffee Listing"), alt text for images, decorative graphics hidden;
- tested text contrast in light and dark themes, `prefers-reduced-motion` respected, responsive layout, no autoplay.

What was verified: automated **axe-core** checks on the public pages in both languages and on the admin pages (0 violations; the only exception is the initial HTML of the 404 page, which has no `lang` until JavaScript runs), and a manual keyboard review of the code. **What was not**: testing with a real screen reader (NVDA / VoiceOver) and visual checks in every browser — please do those before you rely on it. Alt text for your own images is up to you.

## Deployment

The app is a normal Node.js server plus a PostgreSQL database; any VPS works.

### 1. Server setup

```bash
# Node.js 20.9+ and PostgreSQL installed; then:
git clone <your-repository-url> portfolio && cd portfolio
npm ci
cp .env.example .env          # set DATABASE_URL, SITE_URL=https://your-domain, IP_HASH_SECRET, ADMIN_*
npm run db:push
npm run db:seed               # first time only
npm run build
```

### 2. Run it with a process manager

```bash
# example with pm2
npm i -g pm2
pm2 start npm --name portfolio -- start
pm2 save && pm2 startup
```

A `systemd` unit running `npm start` in the project folder with `NODE_ENV=production` works equally well. The app listens on port `3000` (`PORT=4000 npm start` to change).

### 3. HTTPS and a reverse proxy

Put nginx / Caddy in front and use **HTTPS** — in production the sign-in cookie is `Secure`, so the admin panel will not work over plain `http://` (except on `localhost`). Pass the visitor's address on, because it is used (hashed) for the spam limits:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 15m;   # image uploads are up to 12 MB
}
```

### 4. Updating

```bash
git pull
npm ci
npm run db:push        # applies new columns/tables, if any
npm run build
pm2 restart portfolio
```

`db:push` reads `src/db/schema.ts` and may ask about removing columns or tables — read the prompt before confirming.

### Monitoring

`GET /api/health` returns `{ "ok": true }` while the database is reachable.

## Maintenance

**Back up** the database and the uploads folder together:

```bash
pg_dump "$DATABASE_URL" > backup-$(date +%F).sql
tar czf uploads-$(date +%F).tgz uploads/        # or your UPLOAD_DIR
```

**Reset the admin password** (forgotten or compromised):

```bash
npm run admin:password -- you@example.com "a-new-long-password"
```

It needs at least 10 characters and ends every existing sign-in.

**Delete old private messages and rejected public messages** from the admin panel regularly. The privacy policy tells visitors that data is not kept longer than needed.

> The `drizzle/` folder contains an old migration snapshot from before several tables were added. The supported way to update the database is `npm run db:push`; do not run `drizzle-kit migrate` from that folder.

## Troubleshooting

| Problem | Cause and fix |
|---|---|
| `ECONNREFUSED` during `db:push`, `db:seed` or `build` | PostgreSQL is not running, or `DATABASE_URL` is wrong. The build also needs the database. |
| Password with `@`, `#` or `/` does not work in `DATABASE_URL` | URL-encode it (`@` → `%40`, `#` → `%23`, `/` → `%2F`). |
| Cannot sign in in production, but works locally | The cookie is `Secure`; open the site over **HTTPS**. Plain `http://<ip>` will not keep the session. |
| `Too many sign-in attempts` | Wait 15 minutes, or restart the server (the limiter is in memory). |
| I saved something but the public page still shows the old text | Make sure you are on a build that includes `revalidatePath("/(site)/[locale]", "layout")` in `src/lib/guard.ts` (the `(site)` part is essential). Then hard-refresh. |
| The Persian page shows English text | That field has no Persian version yet — it falls back to English by design. |
| A message I sent through the public form does not appear | It is *pending*. Approve it under Admin → Moderation. Also, forms ignore submissions sent less than ~3 seconds after the page loaded (anti-bot). |
| Image upload fails | Check the type and size (≤ 12 MB), and that `UPLOAD_DIR` is writable. Behind nginx set `client_max_body_size`. |
| `sharp` fails to install | Re-run `npm install` with Node 20.9+; on minimal Linux images install the build tools. |
| `EADDRINUSE: address already in use :::3000` | Another process uses the port. Stop it or run `PORT=3100 npm start`. |
| Images from `src/assets` are not shown | The site does not use that folder. Upload images through the admin panel instead. |

## Known limitations

Being honest about what is not there:

- **No automated test suite.** Checks so far were type-checking, linting, production builds, scripted requests and axe-core runs.
- The **sign-in limiter is in memory**, so it resets on restart and is per server instance. Use Redis if you run several instances.
- **One admin account** is expected; there is no password-change screen (use `npm run admin:password`).
- There are **no email notifications** for new messages — check the Inbox and the Moderation queue.
- Content translations in the database exist for **Persian only**.
- The **legal pages are templates**; they are not legal advice and the Persian text should be reviewed.
- The initial HTML of the **404 page has no `lang` attribute** until JavaScript runs (a side effect of having two root layouts).
- Drag & drop is verified through its API, its accessibility structure and a code review; test it in your own browser too.

## License and credits

No license file is included yet. Until you add one (for example `LICENSE` with the MIT or another license of your choice), all rights are reserved by default.

