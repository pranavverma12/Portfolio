# Changelog

All notable changes to this portfolio are documented here. Dates are ISO-8601
(YYYY-MM-DD). The format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- **Ask Pranav — floating chat assistant.**
  - Floating neumorphic chat button placed just above the back-to-top button
    (`fixed bottom-[88px] right-6`) with an animated counter pill that shows
    remaining questions, and a hover-after-delay **"Discuss About Pranav"**
    neumorphic tooltip.
  - Tidio-style **anchored chat panel** (`src/components/ChatDialog.jsx`) —
    bottom-right on `sm+` (380 px), bottom sheet on mobile; in-place
    suggested-question chips, typing dots, auto-resizing composer, Enter-to-
    send / Shift+Enter newline, error toast.
  - Visitor-facing UX: 5-question cap, off-topic refusal with a hint to ask
    about the portfolio, suggested starter questions on first open,
    outside-click-to-close, Esc-to-close, body scroll-lock.
- **Browser-side chat client (`src/lib/useChat.js`)** — React hook around
  `fetch`, with optimistic message insert, fingerprint UUID in
  `localStorage`, and abortable requests.
- **Node/Express chat backend (`server/`)** — separate deployable service that
  owns the persistence, retrieval, and LLM calls:
  - `GET /api/health`, `POST /api/session`,
    `GET /api/session/:id/messages`, `POST /api/chat`
  - Helmet, CORS, compression, morgan, express-rate-limit (60 req / 5 min).
- **Oracle ADB 23ai integration** — JSON Collection for sessions, native
  `VECTOR(384, FLOAT32)` with an `INMEMORY NEIGHBOR GRAPH` cosine index for
  retrieval. See `server/sql/schema.sql`.
- **RAG ingestion (`npm run ingest`)** — chunks `src/data/content.js` +
  `src/data/projects.js`, embeds via the Ouraniex gateway (model alias
  `ouraniex-embed-384`), loads `rag_chunks` in one `executeMany`.
- **Visitor metadata capture** — browser, OS, device, language, timezone,
  screen/viewport, IP, and optional geo (off by default).

### Changed
- **Chat panel is no longer a centred modal** — replaced the shared `Modal`
  wrapper with a custom bottom-right anchored panel + a hidden `sm+` backdrop
  for outside-click dismissal; mobile becomes a bottom sheet.
- **Suggestion chips are now buttons** that *replace* the textarea contents
  and focus the composer (no auto-send); the visitor still has to press send.
- `src/App.jsx` now also passes `open={chat.open}` to `ChatButton` so the
  tooltip doesn't fight the open panel.
- `Readme.md` adds an "Ask Pranav" section + Render deploy notes for the
  server.

### Notes
- All LLM calls go through the Ouraniex SDK gateway with model aliases — no
  direct provider SDK calls in this repo, per ecosystem rule.
- Off-topic questions **still consume** a question from the cap to keep the
  abuse surface small.

## [2.0.0] — prior

- React 18 + Vite 5 + Tailwind 3 + Framer Motion 11 rebuild of the legacy
  static site.
- Sections: Hero, About, Expertise, Skills, Experience (scroll-driven
  railway), Products, Research, Blog, Education, Certifications, Hobbies,
  Contact, Footer.
- Neumorphic dark theme — `#0d1013` ink, `#ff014f` accent.
- Deploy target: Cloudflare Pages via GitHub Actions.