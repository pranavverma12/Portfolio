# My Portfolio

> :memo: **Note:** This repo belongs to my personal portfolio. You can visit [My portfolio](https://pranavverma12.github.io/Portfolio/) to know more about me.

A modern, minimalist single-page portfolio with a dark theme and spring-based
motion throughout — rebuilt with **React + Vite + Tailwind CSS + Framer Motion**.

## Tech stack

- **React 18** + **Vite 5** (fast dev server & build)
- **Tailwind CSS 3** (utility styling, fluid typography, custom theme)
- **Framer Motion 11** (staggered reveals, `whileInView` fades, spring hovers,
  magnetic CTA, tilt/glow cards, alternating timeline slide-ins)

The colour palette is preserved from the original site: `#0d1013` near-black
background with the `#ff014f` pink/red brand accent.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build locally
```

## Deploy to Cloudflare Pages

This project is prepared for direct deployment to Cloudflare Pages through GitHub Actions.

### Required GitHub secrets

Add these repository secrets in GitHub:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Cloudflare setup

In Cloudflare Pages:

1. Create a new Pages project.
2. Connect it to this GitHub repository.
3. Set the production branch to `main`.
4. Use the following build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

The deployed site will be available at:

- `https://pranavverma.pages.dev`

The workflow file is located at [.github/workflows/cloudflare-pages.yml](.github/workflows/cloudflare-pages.yml).

## Structure

```
index.html            # Vite entry
src/
  main.jsx            # React root
  App.jsx             # section composition + scroll progress bar
  index.css           # Tailwind layers, .neu-card, base styles
  data/
    content.js        # profile, about, skills, experience, education, hobbies
    projects.js       # Ouraniex products + enterprise work
    blog.js           # long-form posts (block-based bodies)
  lib/
    techIcons.jsx     # brand-icon + colour map for every technology
    hash.js           # seeded PRNG for the generated covers
    useSectionProgress.js # IO + rAF scroll progress for parallax
  components/
    Navbar.jsx             # glass header, shrinks on scroll, mobile menu
    Hero.jsx               # staggered reveal, rotating role, tech marquee, magnetic CTA
    UniverseBackground.jsx # canvas starfield + constellations + planets
    About.jsx              # overview + stat cards
    Expertise.jsx          # "What I Do" 3D tilt + cursor-glow cards
    Skills.jsx             # category selector + colour-coded tech chips
    Experience.jsx         # scroll-driven train travelling between stations
    TrainIcon.jsx          # the locomotive that rides the rail
    Products.jsx           # Ouraniex products + company work, opens Modal
    ProjectCover.jsx       # procedurally generated cover art (seeded)
    Blog.jsx               # notes section + in-page article reader
    Modal.jsx              # shared dialog (Esc, scroll-lock, backdrop)
    TechIcon.jsx           # brand glyph / tinted monogram + pill
    Research.jsx           # publications grid (image zoom, venue badge)
    Education.jsx          # boarding-pass style cards
    Certifications.jsx     # compact numbered badge rows
    Hobbies.jsx            # autoplaying slideshow w/ arrows + dots
    Contact.jsx            # floating-label form with animated success state
    Footer.jsx             # multi-column footer, watermark, back-to-top
    Icon.jsx               # inline feather-style icons
    anim.js                # shared Framer Motion variants + site-wide spring
    backgrounds/
      StarCanvas.jsx          # reusable parallax-depth starfield
      ConstellationField.jsx  # Skills — quiet drifting stars
      MachineCosmos.jsx       # Products — robots/laptops/neural nets as constellations
      AtelierPages.jsx        # Research/Education/Certificates — "an AI reading"
  lib/
    useChat.js             # browser-side chat client (FP + localStorage)
server/                  # Node/Express chat backend (Oracle ADB 23ai)
  src/
    index.js              # routes + middleware
    config.js             # env loader
    db.js                 # oracledb pool + vector/RAW helpers
    embed.js              # Ouraniex gateway embeddings + chat completions
    rag.js                # VECTOR_DISTANCE retrieval + refusal parser
    sessions.js           # JSON-Collection session store
    meta.js               # request → visitor metadata
    ingest.js             # one-shot RAG ingestion from src/data/*
  sql/
    schema.sql            # JSON Collection + chat_messages + rag_chunks + vector index
  .env.example            # all server env vars + safe defaults
public/               # images + CV (resume-pv.pdf)
legacy/               # the original static HTML site, kept for reference
```

## Section order & backgrounds

The page is one deliberate arc, and the backgrounds mark its chapters:

| # | Section | Background |
|---|---------|------------|
| 1 | Hero — "Welcome to my universe" | starfield, constellations, planets |
| 2 | About / Overview | — |
| 3 | What I Do | — |
| 4 | Skills & Stack | drifting constellation field |
| 5 | Experience Line | (train journey) |
| 6 | Products — Ouraniex, then company work | **MachineCosmos** |
| 7 | Research Papers | AI-reading atelier (full) |
| 8 | Writing / Notes | — |
| 9 | Education | atelier @ 70% |
| 10 | Certifications | atelier @ 50% |
| 11 | Hobbies | — |
| 12 | Contact | — |

`MachineCosmos` draws a robot, a laptop and a neural net **as constellations** —
same nodes-and-lines vocabulary as the stars — so the machine imagery belongs to
the universe metaphor rather than replacing it. Every background is parallaxed
in layers, vignetted so copy always wins, and honours `prefers-reduced-motion`.

## Design notes

- **No white borders.** Card depth comes from a neumorphic dual-shadow
  (`shadow-neu`), adapted from the original site's `--shadow-1`. Accent-tinted
  hairlines (`border-accent-soft`) are used where a border is needed.
- **Each section has its own card style** — Projects (large, metric chips),
  Experience (station boards + detail card), Education (boarding pass with
  notches), Certifications (compact numbered badges), Hobbies (slideshow).
- **The Experience railway** drives off the section's own scroll position via an
  IntersectionObserver + rAF loop rather than `useScroll`'s target tracking,
  which proved unreliable across re-mounts.

### Gotchas worth knowing

- Don't animate `filter: blur()` with a spring — springs overshoot below zero and
  Chrome rejects negative blur (floods the console with warnings).
- Don't combine Tailwind `-translate-x-*` with a Framer `animate` that sets
  `y`/`x`; Framer's transform overwrites the class. Put the offset in `animate`.
- `-webkit-background-clip: text` breaks (renders invisible) when combined with
  `text-shadow` on a Framer-animated element.

## Ask Pranav — floating chat

A neumorphic **chat assistant** sits just above the back-to-top button (bottom
right). Click it to open a dialog where a visitor can ask up to **five
questions** about Pranav. Answers are generated from the portfolio content via
RAG, and off-topic questions are refused (with a gentle hint to ask about the
portfolio instead). Off-topic refusals **still count** against the cap — this
keeps the abuse surface small while letting the visitor steer the conversation.

A counter pill on the button shows how many questions are left in the current
session; the dialog footer mirrors it. When the cap is reached the composer
disables and the visitor is offered a "Start a new session" button that mints a
fresh browser identity.

### Identity & visitor metadata

Every session is keyed by **(browser fingerprint, IP)** and persisted along with
the metadata we can collect without explicit consent:

- browser, OS, device (`ua-parser-js` server-side from `User-Agent`)
- preferred language & timezone (sent by the client at session start)
- screen size + viewport (same)
- IP address (from `X-Forwarded-For` / socket) — used as part of the soft cap
- best-effort country/city from an optional geo provider (`GEO_PROVIDER_URL`,
  off by default)

The fingerprint is a UUID minted on first visit and stored in `localStorage`
under `pv_chat_fp_v1`; clearing site data resets the cap.

### Backend (Node/Express + Oracle 23ai)

The chat is backed by a small Node service in `server/` that talks to **Oracle
Autonomous Database 23ai** using its two MongoDB-replacement primitives:

- **`chat_sessions`** is a **JSON Collection** (`CREATE TABLE chat_sessions JSON
  COLLECTION;`) — the NoSQL/document store. Sessions are full JSON documents;
  scalar fields we need to query on (fingerprint, IP, created_at) are mirrored
  into `chat_sessions_index` so they can be indexed without losing the document
  store semantics.
- **`rag_chunks`** uses the native 23ai `VECTOR(384, FLOAT32)` type with an
  `INMEMORY NEIGHBOR GRAPH` cosine index for similarity search.

| Endpoint | Purpose |
|---|---|
| `GET  /api/health` | liveness probe |
| `POST /api/session` | mint/resume a chat session keyed by `(fingerprint, ip)` |
| `GET  /api/session/:id/messages` | load full transcript |
| `POST /api/chat` | send one question, get one answer + new counter |

### Running the server locally

```bash
cd server
cp .env.example .env       # then fill in DB + gateway credentials
npm install
npm run db:init            # one-time: apply server/sql/schema.sql to your ADB
npm run ingest             # one-time: chunk src/data/*, embed, load rag_chunks
npm run dev                # listens on PORT (default 8788)
```

The frontend picks the backend up via `VITE_CHAT_API` (defaults to
`http://localhost:8788` in dev).

### LLM gateway

All LLM calls go through the **Ouraniex SDK gateway** with model aliases (per
the ecosystem rule — never direct provider SDKs in this repo). Configure:

- `OURANIEX_GATEWAY_URL` — gateway base URL
- `OURANIEX_API_KEY`    — bearer token
- `CHAT_MODEL_ALIAS`    — default `ouraniex-chat-small`
- `EMBED_MODEL_ALIAS`   — default `ouraniex-embed-384`

### Deploy the chat server to Render

The chat server is a **separate Node service** from the static Cloudflare Pages
build. Easiest path is [Render](https://render.com):

1. Create a new **Web Service** from this repo (root = `server/`).
2. Build command: `npm install`
3. Start command: `npm start`
4. Set the env vars from `server/.env.example` in the Render dashboard:
   `PORT`, `NODE_ENV=production`, `ALLOWED_ORIGIN=https://pranavverma.pages.dev`,
   `DB_USER`, `DB_PASSWORD`, `DB_WALLET_DIR`, `DB_WALLET_PASSWORD`,
   `DB_CONNECT_STRING`, `OURANIEX_GATEWAY_URL`, `OURANIEX_API_KEY`,
   `TRUST_PROXY=1`.
5. Mount the **ADB wallet** as a secret file / disk — `DB_WALLET_DIR` must
   point at the directory containing `tnsnames.ora`, `cwallet.sso`,
   `ewallet.p12`, etc., and must be readable by the service user.

After the service is live, set `VITE_CHAT_API` in the Cloudflare Pages
environment to the Render URL and rebuild.

## Notes

- Content (experience, projects, skills, education) is sourced from
  `resume-pv.pdf`; the CV download link points at `public/docs/resume-pv.pdf`.
- **The `stack` arrays on the six Ouraniex products are inferred**, not verified —
  see the header comment in `src/data/projects.js`. Everything on the enterprise
  entries comes from the résumé.
- Tech icons come from `react-icons/si`. Every icon in `lib/techIcons.jsx` was
  checked against the installed export list; brands simple-icons doesn't carry
  (AWS, Azure, Oracle, Tableau, Power BI, Salesforce, dbt, OpenAI) fall back to a
  tinted monogram instead of importing a name that doesn't exist.
- The contact form has no backend in this static build — on submit it opens the
  visitor's mail client (`mailto:`) pre-filled and shows the success animation.
  Swap `handleSubmit` in `Contact.jsx` for a real endpoint (Formspree/EmailJS)
  when you want server-side delivery.
- The previous static site (single `index.html` + `assets/`) is preserved under
  `legacy/` and the original `assets/` folder, so nothing was lost.

---

_Original template credit: [Rainbow-Themes](https://themeforest.net/user/rainbow-themes/portfolio)._
