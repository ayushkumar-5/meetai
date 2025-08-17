# MeetAI - AI-Powered Video Meeting Platform

MeetAI is a **meet web application** that enables users to create **custom AI agents** (for education, business coaching, language tutoring, interview prep, sales assistance, etc.) and conduct **real-time video meetings** with them.
It includes **transcription, summarization, video recording, and post-meeting AI chat** for querying meeting insights.

<img width="1360" height="731" alt="MeetAI screenshot" src="https://github.com/user-attachments/assets/fb2997b4-73b3-4627-bba2-3ba9b737176a" />

> MeetAI integrates **OpenAI** for AI-driven features (requires \$5 billing setup on OpenAI) but also provides a **Demo Mode** powered by the **Gemini API** for basic interactions without billing.

---

## 🚀 Features

* **AI Agent Creation** — Create role-based agents (tutor, coach, interviewer, sales assistant).
* **Meeting Scheduling** — Schedule and manage meetings with agents.
* **Real-Time Video Calls** — Powered by **Stream Video SDK** with transcription & recording.
* **Post-Meeting Insights** — Transcripts (speaker-identified), AI summaries, recordings, and an AI chat to ask questions about the meeting.
* **Demo Mode** — Full UI/workflow simulation without OpenAI billing (Gemini-powered chatbot).
* **Authentication** — Better Auth with GitHub/Google OAuth support.
* **Responsive UI** — Tailwind + Shadcn/UI, dark/light themes.
* **Developer Friendly** — tRPC, Drizzle, Inngest hooks, modular components.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Video Overview](#video-overview)
3. [Prerequisites](#prerequisites)
4. [Clone the repository](#clone-the-repository)
5. [Getting Started / Local Dev](#getting-started--local-dev)
6. [I. Foundational Setup](#i-foundational-setup)
7. [II. Core Application Development](#ii-core-application-development)
8. [III. Advanced Features & Integrations](#iii-advanced-features--integrations)
9. [IV. Deployment & Maintenance](#iv-deployment--maintenance)
10. [Tech Stack](#tech-stack)
11. [Environment Variables Example](#environment-variables-example)
12. [Contributing](#contributing)
13. [License & Acknowledgements](#license--acknowledgements)

---

## Project Overview

MeetAI is a full-featured meet platform for building and interacting with AI agents inside realtime video meetings. Features include agent creation, meeting scheduling, live video + transcription, recordings, AI summaries, and contextual AI chat.

---

## 📹 Video Overview

Here’s a quick walkthrough of how MeetAI works:  
https://github.com/user-attachments/assets/bde5c74a-17d7-42ef-b472-f781af372515

Here’s a quick walkthrough of how MeetAI works:  

[![Watch the demo](https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg)](https://github.com/user-attachments/assets/bde5c74a-17d7-42ef-b472-f781af372515)  

---

## Prerequisites

* Node.js **v18.18+**
* npm (or pnpm/yarn)
* Git
* PostgreSQL (Neon, Supabase, or local Postgres)
* Recommended: VS Code + Tailwind CSS IntelliSense

---

## Clone the repository

```bash
git clone https://github.com/ayushkumar-5/meetai.git
cd meetai
```

---

## Getting Started / Local Dev

1. Install dependencies

```bash
npm install --legacy-peer-deps
```

2. Create `.env` from `.env.example` and fill in keys (see Environment Variables Example below).

3. Start dev servers (app & webhook):

```bash
# app
npm run dev

# Drizzle ORM
npm run db:studio
```

4. Run ngrok (or Hookdeck) to expose webhook endpoints during development:

```bash
npm run dev:webhook
# use the generated ngrok URL to configure Stream / Polar / webhook endpoints
```

---

# I. Foundational Setup

### Initial Project Setup

* Verify Node.js v18.18+.
* Create Next.js project:

```bash
npx create-next-app@latest meetai
cd meetai
```

* Install & configure Tailwind CSS and Shadcn UI:

```bash
npx shadcn init
# configure tailwind via official docs
```

* Initialize Git & push to GitHub:

```bash
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/ayushkumar-5/meetai.git
git push -u origin main
```

### Database & ORM

* Provision PostgreSQL (Neon/Supabase).
* Install Drizzle ORM:

```bash
npm install drizzle-orm @neondatabase/serverless drizzle-kit
```

* Create `schema.ts` (User, Agent, Meeting, etc.) and run migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

* Verify in Drizzle Studio / Neon Console.

### Authentication

* Integrate Better Auth (with Drizzle adapter).
* Configure `.env` values:

```env
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000/api/auth
```

* Enable email/password and OAuth (GitHub & Google).
* Protect authenticated routes server-side (redirect unauthenticated users).

---

# II. Core Application Development

### Dashboard UI

* Create `/dashboard` route group & layout.
* Sidebar (Meetings, Agents, Upgrade, Profile).
* Navbar (toggle, global search).
* Responsive drawer for mobile.
* `GeneratedAvatar` component for users/agents.

### tRPC Setup

* Add tRPC server + client provider.
* Create `protectedProcedure` for secure endpoints.
* Use server-side prefetching & `useSuspenseQuery` for optimization.

### Agent Management

* Example schema:

```ts
Agent { id, name, userId, instructions, createdAt, updatedAt }
```

* Implement tRPC CRUD: `agents.create`, `agents.list`, `agents.update`, `agents.remove`.
* Implement `AgentForm` (react-hook-form + Zod), data table with filters/pagination, `useConfirm` hook, and an agent detail page.

### Meeting Management

* Example schema:

```ts
Meeting {
  id,
  name,
  userId,
  agentId,
  status,         // upcoming | active | completed | processing | cancelled
  transcriptUrl?,
  recordingUrl?,
  summary?,
  createdAt,
  updatedAt
}
```

* Implement tRPC CRUD for meetings.
* `MeetingForm` (select agent via `CommandSelect`).
* Meetings table: filtering, pagination, and per-meeting detail page.

---

# III. Advanced Features & Integrations

### Real-Time Video Calls (Stream)

* Integrate **Stream Video SDK** for real-time calls.
* TRPC endpoints to create calls and generate Stream tokens.
* Build `/call/[meetingId]` with:

  * Pre-join lobby (camera/audio check)
  * In-call interface and controls
  * Post-call summary screen

### AI Agent Integration (OpenAI)

* Use OpenAI to power agent responses in calls.
* Implement webhook `/api/webhook` to listen for Stream events:

  * `call.session_started` → connect AI agent
  * `call.session_participant_left` → update meeting state
* Use ngrok / Hookdeck when developing locally.

### Background Jobs (Inngest)

* On `call.transcription_ready`:

  1. Fetch transcript from Stream
  2. Add speaker metadata
  3. Summarize with OpenAI
  4. Save summary back to DB
* UI: searchable transcript (speaker-tagged), AI summary, recording playback.

### AI Chat (Stream Chat)

* Integrate Stream Chat SDK for meeting chat.
* On `message.new` webhook:

  * Gather meeting context (transcript/summary/agent instructions)
  * Generate response via OpenAI and post as AI chat reply

### Subscriptions & Payments (Polar)

* Sync Better Auth users with Polar (create customer on signup).
* Enforce free-trial limits in tRPC for creating agents/meetings.
* Build Upgrade page with `PricingCard`s and Polar checkout integration.
* Provide a customer portal for subscription management.

---

# IV. Deployment & Maintenance

### Bug Fixing & Optimization

* Improve dashboard search, meeting/agent counts, and query performance.
* Add monitoring & alerting for background jobs.

### Build Testing

```bash
npm run build
```

### Deployment (Vercel)

1. Connect GitHub repository to Vercel.
2. Add environment variables (Stream, OpenAI, Better Auth, DB URL, Polar keys) in the Vercel dashboard.
3. Update OAuth redirect URLs in GitHub/Google dev consoles.
4. Configure webhooks to point at the production domain.
5. Deploy Inngest background jobs to production.
6. Optional Next.js redirect in `next.config.js`:

```js
module.exports = {
  async redirects() {
    return [{ source: '/', destination: '/meetings', permanent: false }];
  }
}
```

---

## Tech Stack

* **Framework:** Next.js 15 + React 19
* **Styling/UI:** Tailwind CSS + Shadcn/UI
* **Database:** Postgres (Neon / Supabase) + Drizzle ORM
* **Auth:** Better Auth (email + GitHub/Google OAuth)
* **APIs:** tRPC + TanStack Query
* **Realtime Video & Chat:** Stream Video SDK + Stream Chat SDK
* **AI:** OpenAI, Groq, Gemini (demo)
* **Background Jobs:** Inngest
* **Payments:** Polar
* **Dev Tools:** ngrok / Hookdeck, Vercel, Drizzle Studio, Code Rabbit

---

## Environment Variables Example

Create a `.env` from `.env.example` and fill in your values:

```env
# -----------------------------
# 🔑 Authentication Secrets
# -----------------------------
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000/api/auth

# -----------------------------
# 🌐 OAuth Providers
# -----------------------------
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# -----------------------------
# ⚡ Next.js App Config
# -----------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=your-auth-secret

# -----------------------------
# 📹 Stream Video API
# -----------------------------
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=your-stream-key
STREAM_VIDEO_SECRET_KEY=your-stream-secret

# -----------------------------
# 🤖 AI & LLM Integrations
# -----------------------------
GROQ_API_KEY=your-groq-key
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key

# -----------------------------
# 🔁 Payments (Polar)
# -----------------------------
POLAR_API_KEY=your-polar-api-key

# -----------------------------
# Database
# -----------------------------
DATABASE_URL=postgres://user:pass@host:port/db
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m "feat: ..."`
4. Push & open a pull request

---

## License & Acknowledgements

* **License:** MIT — see `LICENSE`
* **Acknowledgements:** Built with inspiration from open-source tutorials and tools including Drizzle, tRPC, Stream, Tailwind, Next.js, and community packages.

---
