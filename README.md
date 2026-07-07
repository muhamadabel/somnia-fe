# Somnia — Dream Journal Analyzer (Frontend)

Somnia is an AI-powered dream journal platform designed for self-reflection. Users can record dreams, receive AI-driven analysis (emotions, symbols, themes, reflections), generate AI artwork from dreams, track emotional trends, obtain well-being reports, chat with an AI companion that remembers their entire dream history, and share dreams anonymously with the community.

> **Disclaimer** — Somnia is a self-reflection tool, not a medical device. AI insights are reflective and educational, not diagnostic, and do not replace professional mental health support.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15 (App Router) + TypeScript** | Frontend framework, deployed as SPA |
| **Tailwind CSS v4** | Utility-first styling with dark mode support |
| **Recharts** | Data visualization and emotional trend charts |
| **lucide-react** | Icon library |
| **Bearer Token (localStorage)** | Authentication mechanism |

---

## Architecture

Somnia follows a two-repo architecture. This repository contains the frontend SPA, which communicates with a separate backend via HTTP:

```
Frontend (somnia-fe)  ─── HTTPS + Bearer Token ───▶  Backend (somnia-be)
Next.js SPA                                         Next.js API + Prisma
```

- The frontend has **no database or AI** — all data and intelligence are accessed through the backend API.
- Authentication uses **Bearer tokens** stored in `localStorage`.
- Images (dream art, uploads) are served from the backend (`/api/files/...`).
- The only required configuration is **`NEXT_PUBLIC_API_URL`** pointing to the backend.

**Repositories:**
- Frontend: https://github.com/muhamadabel/somnia-fe
- Backend: https://github.com/muhamadabel/somnia-be-

---

## Getting Started

### Prerequisites

- Node.js 18.18+
- A running instance of the backend (see `somnia-be-` repository)

### Local Development

```bash
npm install
cp .env.example .env.local      # set NEXT_PUBLIC_API_URL
npm run dev                     # opens http://localhost:3000
```

Configure `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"      # local backend
# NEXT_PUBLIC_API_URL="https://be-somnia.hallojanu.xyz"   # production backend
```

The frontend and backend run on different ports (e.g., FE on 3000, BE on 3001). The backend must allow the frontend origin via `FRONTEND_URL` (CORS configuration).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run linter |

---

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import `somnia-fe`.
3. Add environment variables:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://be-somnia.hallojanu.xyz` (backend URL, no trailing slash) |

4. Deploy. Vercel automatically detects Next.js and runs `next build`.
5. After obtaining the frontend domain, update the backend's `FRONTEND_URL` environment variable to match for CORS compliance.

> `NEXT_PUBLIC_API_URL` is baked in at build time. If the backend URL changes, update the environment variable in Vercel and redeploy.

Detailed step-by-step instructions are available in [`DEPLOY.md`](DEPLOY.md).

---

## Features

| Feature | Description |
|---------|-------------|
| 📝 Dream Journal | Full CRUD with drafts, archive, mood emoji, sleep duration, image attachments |
| 🧠 AI Analysis | Summary, emotions + reasoning, symbols + interpretation, themes, cross-dream patterns |
| 🎨 Dream Visualization | AI-generated artwork from dream emotions and symbols |
| 📈 Emotional Trends | Positivity graphs, emotion frequency, positive/negative balance |
| 📅 Calendar | Chronological dream history with emotional markers |
| ✨ Symbol Library | 40+ symbols with interpretations, related dreams, bookmarks |
| 📋 Well-being Reports | Weekly/monthly/yearly summaries with PDF export |
| 💬 AI Companion | Chat interface that references the user's full dream history |
| 🤝 Community | Anonymous sharing, comments, reactions, content reporting |
| 🔔 Notifications · ⚙️ Settings · 🛡️ Admin | Notification system, profile/privacy/theme settings, content moderation |

---

## Project Structure

```
app/
  (auth)/        Login, registration pages (setToken → localStorage)
  (app)/         Protected pages (dashboard, dreams, calendar, etc.)
  onboarding/    Onboarding flow
  layout.tsx     Root layout (theme), (app)/layout.tsx = session guard + sidebar
components/       UI kit and feature components (all client-side)
lib/
  client.ts      Fetch wrapper → backend API (Bearer token, fileUrl)
  session.ts     Token management (localStorage)
  use-api.ts     Data loading hook (data/loading/error/reload)
  api-types.ts   API response types
  constants, utils
  ai/lexicon.ts  Emotion and symbol labels (Indonesian)
docs/            Specification documents (00–16)
```

---

## Security Notes

- Tokens are stored in `localStorage` and sent as `Authorization: Bearer` headers.
- A `401` response automatically clears the token and redirects to `/login`.
- `.env.local` (containing `NEXT_PUBLIC_API_URL`) is excluded from Git.
- All ownership validation, rate limiting, password hashing, and file storage are handled by the **backend**.
