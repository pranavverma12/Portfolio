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
