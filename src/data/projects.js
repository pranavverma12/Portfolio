// Products: Ouraniex (self-initiated) + enterprise work shipped at companies.
//
// NOTE ON `stack` FOR OURANIEX PRODUCTS:
// The naming/etymology copy is Pranav's own. The `stack` arrays on the six
// Ouraniex entries are INFERRED from each product's description plus the
// solo-dev/$0-budget constraints (SQLite-family, Ollama, free-tier APIs) —
// they are a starting point to be corrected, not verified fact.
// Enterprise `stack` values come straight from the résumé.

export const ouraniex = [
  {
    id: 'ouraniex',
    name: 'Ouraniex',
    title: 'A Naming System, Not a Logo',
    category: 'Brand system',
    period: 'Ongoing',
    status: 'live',
    cover: 'orbit',
    summary:
      'Most product portfolios accumulate names. Ouraniex was designed with a constitution: Greek or Latin roots only, globally pronounceable, eight characters maximum, zero collisions with existing tech companies.',
    detail:
      "Named after Ourania, the Muse of Astronomy and daughter of Mnemosyne. Every product in the portfolio is coined from Greek or Latin roots whose actual meaning matches what the product does — no invented syllables, no SaaS-suffix filler. If a name references a deity, that figure's actual domain must match the product's actual function.",
    etymology:
      'Ourania — Muse of Astronomy, daughter of Mnemosyne (memory). That genealogy is why Mnemoc sits under this brand.',
    tags: ['Brand system', 'Etymological naming', '6 products'],
    stack: [],
    learned: [
      'Designing a naming constitution that scales to a whole portfolio',
      'Trademark and collision research across existing tech companies',
      'Holding a brand rule even when a shorter name would have been easier',
    ],
    featured: true,
  },
  {
    id: 'tyche',
    name: 'Tyche',
    title: 'Personal Finance Tracker',
    category: 'Personal finance',
    period: '2024',
    status: 'live',
    cover: 'radial',
    summary:
      'A personal finance tracker. Named for the Greek goddess of fortune and chance — the one product allowed to carry a bare deity name, grandfathered in because it shipped first.',
    detail:
      'Tracks spend, savings and goals without the SaaS-dashboard bloat. The first product in the portfolio, and the one that set the local-first, zero-subscription pattern the rest follow.',
    etymology: 'Greek Týchē — fortune, chance, the luck that governs outcomes.',
    tags: ['Personal finance', 'Tracking'],
    stack: ['Python', 'FastAPI', 'SQL', 'Pandas'],
    learned: [
      'Modelling recurring transactions and categorisation rules',
      'Charting spend over time without a heavyweight BI dependency',
      'Shipping something small end-to-end instead of over-scoping it',
    ],
  },
  {
    id: 'scripta',
    name: 'Scripta',
    title: 'Offline AI Notebook',
    category: 'AI notebook',
    period: '2025',
    status: 'beta',
    cover: 'flow',
    summary:
      'An offline AI notebook. Local-first by design: the model runs on your machine, so the notes never leave it. The plainest name in the portfolio, deliberately so.',
    detail:
      'Runs local inference (Ollama-class models) against your own notes, with retrieval over a local index. Built to prove that a genuinely useful AI tool does not require shipping your data to anyone.',
    etymology: 'Latin scripta — "written things," the neuter plural of scriptum.',
    tags: ['Offline AI', 'Local-first', 'Notes'],
    stack: ['Ollama', 'RAG', 'FAISS', 'Python', 'Local-first'],
    learned: [
      'Running quantised local models at usable latency on consumer hardware',
      'Chunking and embedding strategy for personal, messy note corpora',
      'Designing retrieval that degrades gracefully when the index is tiny',
    ],
    featured: true,
  },
  {
    id: 'tymora',
    name: 'Tymora',
    title: 'Gamified Project Management',
    category: 'Project management',
    period: '2025',
    status: 'poc',
    cover: 'network',
    summary:
      "Gamified project management — the theory being that the reason most PM tools fail isn't features, it's that nothing about them makes you want to open them.",
    detail:
      'A blended coinage in the Tyche family — luck and favour, applied to whether the sprint lands. Explores progression and reward loops as a retention mechanic for tools people are supposed to use daily.',
    etymology: 'A blended coinage in the Tyche family — luck and favour, applied to whether the sprint lands.',
    tags: ['Gamification', 'Project management'],
    stack: ['Python', 'FastAPI', 'SQL', 'Web App'],
    learned: [
      'Designing progression loops that survive contact with real deadlines',
      'Modelling task state without rebuilding JIRA',
      'Knowing when a concept is worth keeping at PoC',
    ],
  },
  {
    id: 'stroviax',
    name: 'Stroviax',
    title: 'Career Intelligence',
    category: 'Career intelligence',
    period: '2025',
    status: 'poc',
    cover: 'scatter',
    summary:
      'Career intelligence — built around the moment a career turns rather than the CV that describes it afterward. The reference model for how every Ouraniex name is constructed.',
    detail:
      "Greek strophē (a turn, a turning point) + Latin via (path) + X for the tech register. Reverse-engineerable once you're told — which is the point of the whole naming system.",
    etymology: 'strophē (a turn) + via (path) + X for the tech register.',
    tags: ['Career intelligence', 'Multi-root coinage'],
    stack: ['Python', 'NLP', 'RAG', 'LLM'],
    learned: [
      'Extracting structured signal from unstructured career history',
      'Framing a product around an event rather than a document',
      'Multi-root coinage as a repeatable naming method',
    ],
  },
  {
    id: 'mnemoc',
    name: 'Mnemoc',
    title: 'AI Content Aggregation',
    category: 'Content aggregation',
    period: '2025',
    status: 'poc',
    cover: 'orbit',
    summary:
      "AI content aggregation — a memory layer for everything you read and meant to come back to. The one name that ties directly to the parent brand's genealogy.",
    detail:
      'From Mnemosyne, Titaness of memory and mother of the Muses — including Ourania, who gives Ouraniex its name. Aggregates and re-surfaces what you have already read, rather than adding another feed.',
    etymology: 'From Mnemosyne, Titaness of memory and mother of the Muses.',
    tags: ['Aggregation', 'AI memory'],
    stack: ['RAG', 'Vector DBs', 'Python', 'Web Scraping', 'LLM'],
    learned: [
      'De-duplicating and re-ranking content across heterogeneous sources',
      'Designing a memory layer that resurfaces rather than re-notifies',
      'Keeping ingestion cheap enough to run on a free tier',
    ],
  },
];

export const enterprise = [
  {
    id: 'hivemind',
    name: 'Hivemind',
    title: 'Centralized LLM Knowledge Portal',
    org: 'Infineon',
    period: '2025 — Present',
    category: 'Enterprise knowledge',
    status: 'live',
    cover: 'network',
    summary:
      'A centralized LLM platform where 25+ teams document, version and standardize every process in one place. Production infrastructure with GitLab CI/CD, Redis caching, SSO auth and Confluence/JIRA plugins.',
    detail:
      "Query optimization delivered 15% faster response times. Went from zero to 1,500+ users and 100+ DAU within four months of launch, becoming one of Infineon's most widely adopted internal AI tools, and cutting documentation time by 35%.",
    metric: "1,500+ users · 100+ DAU · one of Infineon's most widely adopted internal AI tools",
    tags: ['LLM', 'OpenShift', 'Redis', 'SSO', 'CI/CD'],
    stack: ['LLM', 'RAG', 'OpenShift', 'GitLab CI/CD', 'Redis', 'SSO', 'JIRA'],
    featured: true,
  },
  {
    id: 'primo',
    name: 'PRIMO',
    title: 'Internal Developer Platform',
    org: 'Infineon',
    period: '2025 — Present',
    category: 'Developer platform',
    status: 'beta',
    cover: 'flow',
    summary:
      'Self-initiated after diagnosing org-wide code duplication: a web app centralizing reusable Infineon code modules, with n8n webhook-powered chat Q&A and six structured documentation guides.',
    detail:
      'Roadmapping a LangGraph agentic layer to recommend approved stacks and auto-generate scaffolds. PoC → beta with active team adoption, projected to cut redundant development effort 20–30%.',
    metric: 'PoC → beta with active team adoption · projected 20–30% less redundant development effort',
    tags: ['n8n', 'LangGraph', 'Agentic AI', 'Web App'],
    stack: ['n8n', 'LangGraph', 'Agentic AI', 'Web App', 'Python'],
  },
  {
    id: 'vizard',
    name: 'VIZARD',
    title: 'Dashboard Discovery Recommender',
    org: 'Infineon',
    period: '2025',
    category: 'Analytics discovery',
    status: 'live',
    cover: 'scatter',
    summary:
      'A hybrid NLP + RAG recommender for dashboard discovery across 2,000+ Tableau assets — automated server extraction, cleaning, LLM summaries and ML auto-tagging into a searchable database.',
    detail:
      'Built by a 4-engineer team founded and led in a single-day hackathon, reaching 63.73% tagging accuracy fully automated.',
    metric: '63.73% tagging accuracy, fully automated · built in a single-day hackathon',
    tags: ['NLP', 'RAG', 'Tableau', 'ML Auto-tagging'],
    stack: ['NLP', 'RAG', 'Tableau', 'ML Auto-tagging', 'Python'],
  },
  {
    id: 'finra-rag',
    name: 'FINRA RAG Chatbots',
    title: 'RAG Chatbots for FINRA Compliance',
    org: 'Emorphis',
    period: '2023 — 2025',
    category: 'RAG / Compliance',
    status: 'live',
    cover: 'flow',
    summary:
      'RAG + LLM chatbots on Gemma and DeepSeek for US financial advisors, grounding responses in FINRA-regulated document sets so compliance review stays fast without leaving the perimeter of approved data.',
    detail:
      'Small open-weight models were chosen specifically because the data could not leave the compliance boundary — trading frontier-model quality for a defensible data-residency story.',
    metric: '15% faster FINRA processing · 30% lower customer response latency',
    tags: ['RAG', 'Gemma', 'DeepSeek', 'Compliance'],
    stack: ['RAG', 'Gemma', 'DeepSeek', 'FINRA', 'Compliance'],
    featured: true,
  },
  {
    id: 'vision-ocr',
    name: 'Vision-LLM OCR',
    title: 'Vision-LLM OCR for Financial Documents',
    org: 'Emorphis',
    period: '2023 — 2025',
    category: 'Vision LLM',
    status: 'live',
    cover: 'scatter',
    summary:
      'A Vision-LLM OCR pipeline for complex, multi-format financial documents — statements, disclosures, scanned forms — feeding directly into advisor onboarding.',
    detail:
      'Paired with an M365 Copilot onboarding agent shipped the same cycle; together they cut advisor onboarding time by 20%.',
    metric: '20% faster advisor onboarding',
    tags: ['Vision LLM', 'OCR', 'M365 Copilot'],
    stack: ['Vision LLM', 'OCR', 'M365 Copilot', 'Onboarding'],
  },
  {
    id: 'acquisition-integration',
    name: 'Acquisition Data Integration',
    title: 'Data-Warehouse Integration for Acquisitions',
    org: 'Emorphis',
    period: '2023 — 2025',
    category: 'Data migration',
    status: 'live',
    cover: 'network',
    summary:
      'Strategic data-warehouse integration for acquired entities — consolidating disparate Salesforce, Oracle and SQL sources under rigorous QA, orchestrating vendors and stakeholder requirements across multiple acquisitions.',
    detail: '30M+ rows consolidated with no critical data loss, cutting migration downtime from 6 hours to under 2.',
    metric: '30M+ rows consolidated · downtime cut from 6h to under 2h · no critical data loss',
    tags: ['Salesforce', 'Oracle DB', 'DWH', 'ETL'],
    stack: ['Salesforce', 'Oracle DB', 'DWH', 'ETL', 'SQL'],
  },
  {
    id: 'reddoorz-recommender',
    name: 'Property Recommender',
    title: 'Real-time Property Recommendation Engine',
    org: 'RedDoorz',
    period: '2021 — 2023',
    category: 'Recommendation systems',
    status: 'live',
    cover: 'radial',
    summary:
      'A real-time property recommendation model processing 10–20k daily transactions, matching travellers to listings at 85% accuracy.',
    detail:
      'The lift showed up directly in occupancy — a 12% increase attributable to the recommender once it was fully rolled out.',
    metric: '85% accuracy · 12% occupancy increase · 10–20k daily transactions in real time',
    tags: ['Recommenders', 'Real-time ML'],
    stack: ['Recommenders', 'Real-time ML', 'Python', 'SQL'],
  },
  {
    id: 'reddoorz-churn',
    name: 'Churn Prediction',
    title: 'Customer Churn Prediction Model',
    org: 'RedDoorz',
    period: '2021 — 2023',
    category: 'Predictive modelling',
    status: 'live',
    cover: 'scatter',
    summary:
      'A churn model forecasting customer retention with 90%+ accuracy, giving the growth team a ranked list of accounts worth an intervention before they left.',
    detail:
      'Deployed alongside the recommendation engine, sharing the same feature pipeline to keep inference cost down.',
    metric: '90%+ retention forecasting accuracy',
    tags: ['Churn Prediction', 'Predictive Modelling'],
    stack: ['Churn Prediction', 'Predictive Modelling', 'Python'],
  },
  {
    id: 'reddoorz-pipelines',
    name: 'Pipeline Overhaul',
    title: 'Data Pipeline Overhaul',
    org: 'RedDoorz',
    period: '2021 — 2023',
    category: 'Data engineering',
    status: 'live',
    cover: 'network',
    summary:
      'Rebuilt the Meltano/DBT/Airflow stack feeding both the recommender and churn model, replacing brittle nightly batch jobs with monitored, retry-safe DAGs.',
    detail:
      'Cut data latency 50% and lifted pipeline reliability 25–40%, which is what made the downstream real-time models trustworthy in the first place.',
    metric: '50% lower data latency · 25–40% reliability improvement',
    tags: ['Airflow', 'DBT', 'Meltano', 'ETL'],
    stack: ['Airflow', 'DBT', 'Meltano', 'ETL', 'SQL'],
  },
];

export const STATUS_LABEL = {
  live: 'Live',
  beta: 'Beta',
  poc: 'Concept',
  published: 'Published',
};
