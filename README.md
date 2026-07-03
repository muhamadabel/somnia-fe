# 🌙 Somnia — Penganalisis Jurnal Mimpi

Platform jurnal mimpi bertenaga AI untuk refleksi diri. **Seluruh antarmuka dan teks AI berbahasa Indonesia.** Catat mimpi, dapatkan analisis AI terstruktur (emosi, simbol, tema, refleksi), buat karya seni mimpi, pantau tren emosi, terima laporan kesejahteraan, mengobrol dengan teman AI yang mengenal riwayat mimpimu, dan bagikan mimpi secara anonim ke komunitas.

> **Catatan bahasa:** UI dan keluaran AI berbahasa Indonesia. Di dalam kode, nama emosi/simbol disimpan dalam bahasa Inggris sebagai *kunci* (untuk deteksi & relasi DB) lalu ditampilkan via peta label Indonesia (`emotionLabel()` di `lib/constants.ts`, `symbolLabel()` di `lib/ai/lexicon.ts`).

Built from the specification documents in [`/docs`](docs/) (product requirements, domain model, API contract, security, UI guidelines, and more).

> **Disclaimer** — Somnia is a self-reflection tool, not a medical device. All AI insights are reflective and educational; they never diagnose, predict, or replace professional mental-health care.

---

## 🚀 Quick Start

Requirements: **Node.js 18.18+** (tested on Node 24).

```bash
npm install        # install dependencies
npm run setup      # prisma generate + create SQLite DB + seed demo data
npm run dev        # start at http://localhost:3000
```

That's it — no external services, no API keys, no database server required.

### Demo accounts (seeded)

| Role  | Email             | Password    | What you'll see |
|-------|-------------------|-------------|-----------------|
| User  | `demo@somnia.app` | `dream1234` | 19 dreams across ~6 weeks, analyses, dream art, a report, an AI conversation, community activity |
| Admin | `admin@somnia.app`| `admin1234` | Everything above + `/admin` (moderation queue, users, audit log) |

Other scripts: `npm run build` / `npm start` (production), `npm run db:reset` (wipe + reseed).

---

## 🤖 AI Modes — free by default, no API key

The AI subsystem is **provider-agnostic** (docs/09). By default everything is **free and needs no API key**:

| Feature | Free default | How |
|---------|--------------|-----|
| **Teman AI (companion)** | Real LLM via **Pollinations.ai** (key-less, free) | The user's *entire* dream history is passed in the prompt, so it genuinely "remembers everything" — it cites specific dreams and cross-dream patterns. |
| **Dream visualization** | Real AI image via **Pollinations Flux** (key-less, free) | The dream's emotion + symbols build a prompt; a real diffusion-model image is generated and stored. No uploads. |
| **Analysis & reports** | Built-in local engine (instant, always-on) | Lexicon emotion/symbol detection + Indonesian reflection templates with full explainability. A live free LLM is too slow/inconsistent for strict JSON under demo load, so this stays reliable. |

Every free call **falls back gracefully**: if Pollinations is unreachable, the companion falls back to the local engine and images fall back to a built-in **procedural SVG art generator** (emotion → palette, symbols → scene). So the app never breaks — even fully offline (`AI_MODE=local`).

Add an `ANTHROPIC_API_KEY` to `.env` to route **everything** (analysis, companion, reports) through **Claude** for the highest quality.

The active mode is always visible in the sidebar (`AI: AI Gratis` / `AI: Claude AI` / `AI: Mode Demo`) and on every analysis card — transparent AI per the product principles.

---

## 🧱 Technology Choices & Trade-offs

The specs intentionally leave the stack open and ask the implementer to justify choices (docs/00, 15):

| Choice | Why | Trade-off considered |
|--------|-----|----------------------|
| **Next.js 15 (App Router) + TypeScript** | One codebase for UI + API, server components minimize client JS, first-class DX, huge community, easy deploy | Separate SPA+API gives more backend freedom but doubles setup/deploy for no benefit at this scale |
| **SQLite + Prisma ORM** | Zero-setup demo, portable file DB, type-safe queries; schema is 100 % relational and swaps to **PostgreSQL by changing one line** in `schema.prisma` | Postgres is better for concurrent production writes — deliberately deferred, schema is ready |
| **Session cookies (httpOnly) + bcrypt** | Self-contained auth, no third-party dependency, revocable server-side sessions, OAuth-ready (add a provider column) | Hosted auth (Clerk/Auth0) is faster to MFA but adds cost + external dependency for a competition build |
| **Tailwind CSS v4** | Consistent design tokens (`@theme`), dark mode, tiny output | Component libraries (MUI etc.) are faster to start but harder to make feel custom & calm |
| **Recharts** | Readable declarative charts for non-technical users (docs/12) | Hand-rolled SVG is lighter but slower to build well |
| **Local file storage behind an authenticated route** | Uploads live outside `public/`, served via `/api/files/*` with session checks + unguessable names (docs/10 secure file access) | Swap the `lib/services/storage.ts` seam for S3/GCS in production |

---

## ✨ Feature Map (spec → implementation)

| Spec (docs/01) | Where |
|---|---|
| F1 Dream Recording (CRUD, drafts, archive, image, mood, sleep) | `/dreams`, `/dreams/new`, `/dreams/[id]`, `/dreams/[id]/edit` |
| F2 AI Dream Analysis (summary, emotions+why, symbols+why, themes, reflection, recommendations, questions, pattern note, confidence, versioned regenerate) | Dream detail → AI Analysis panel |
| F3 Dream Visualization (generate, regenerate, history, download) | Dream detail + `/gallery` |
| F4 Emotional Trends (daily/weekly/monthly/yearly, frequency, balance, AI observation) | `/trends` |
| F5 Dream Calendar (month/week/day preview, emotion dots, filters) | `/calendar` |
| F6 Symbol Library (40 seeded symbols, interpretations, related dreams, bookmarks) | `/symbols`, `/symbols/[slug]` |
| F7 Wellness Reports (weekly/monthly/yearly, observations, highlights, PDF export via print) | `/reports`, `/reports/[id]` |
| F8 AI Companion (history-aware chat, suggested questions, conversations, typing/streaming feel) | `/companion` |
| F9 Community (anonymous share snapshot, feed, comments, 4 reaction types, content reporting) | `/community`, `/community/[id]` |
| Onboarding, dashboard w/ streak & empty states, notifications, settings (profile/appearance/notifications/privacy/security/danger zone), admin moderation | `/onboarding`, `/dashboard`, `/notifications`, `/settings`, `/admin` |

---

## 🏗 Architecture

```
app/                    # Next.js App Router
  (auth)/               #   login, register (public)
  (app)/                #   protected pages (sidebar shell validates session)
  api/                  #   REST-style route handlers (docs/07 envelope)
components/             # UI kit (button/input/card/modal/toast/skeleton/empty-state)
                        # + feature components (dream, charts, companion, community…)
lib/
  ai/                   # AI subsystem — provider-agnostic (docs/09)
    index.ts            #   provider selection + history context builder
    anthropic.ts        #   Claude provider (safety rules, JSON output, fallback)
    local.ts            #   demo engine (lexicon detection, reflections, companion)
    lexicon.ts          #   bilingual emotion/symbol/theme dictionaries
    art.ts              #   procedural SVG dream-art generator
  services/             # business services: analysis, reports, trends, storage
  auth.ts               # sessions, pseudonyms, audit logging
  api.ts                # response envelope, error handling, rate limiting, pagination
  validation.ts         # zod schemas for every mutation
prisma/
  schema.prisma         # 19 models per docs/08 (soft delete, versioned analyses…)
  seed.ts               # demo users + living journal + community
storage/uploads/        # user files (gitignored) — served via authenticated /api/files
docs/                   # original specification documents (00–16)
```

**API contract** (docs/07): every endpoint returns
`{ success, message, data, meta }` on success or
`{ success:false, message, errors[], requestId, timestamp }` on failure.
Validation → zod (422 with field errors), auth → 401/403, rate limits → 429.

---

## 🔒 Security & Privacy (docs/10)

- Passwords hashed with **bcrypt (cost 12)**; sessions are 32-byte random tokens in **httpOnly, SameSite=Lax** cookies, revocable server-side, 30-day expiry.
- **Ownership validated on every resource access** — users can only ever read/modify their own dreams, analyses, reports, conversations, files.
- **Rate limiting** on auth, AI generation, uploads, community actions.
- **Soft delete** for dreams/posts/comments (recoverable, history preserved).
- Community is **pseudonymous by design** — real names/emails never leave the account; shared posts are explicit snapshots, so editing/deleting a private dream never changes what was consciously published.
- Users control whether AI may use their history (Settings → Privacy), can change passwords, and can delete their account + all data.
- **Audit log** records security events (login, deletions, moderation) — never dream content; logs never contain journals (docs/13).
- Uploads validated (type allowlist, 5 MB cap), stored outside the web root, served only to authenticated sessions with `nosniff`.

Production notes: run behind HTTPS, set a strong `SESSION_SECRET`, switch to Postgres + object storage, move rate limiting to Redis when horizontally scaling.

---

## 🩺 Operations

- `GET /api/health` — app/database/AI status for monitors (docs/11).
- Errors return safe messages + `requestId`; details only in server logs.
- The app **degrades gracefully**: if AI fails, dreams stay saved and journaling continues (docs/03 error flow) — the Claude provider even falls back to the local engine automatically.

## 🗺 Not in this build (documented for roadmap)

Email verification/password-reset mail delivery (needs an SMTP provider), scheduled push reminders (preference stored; needs a job runner), offline sync, voice recording, i18n UI (language preference stored) — all listed as future work in the specs and none block the core experience.
