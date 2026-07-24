// All copy lives here — edit this file to update the site.
// Content sourced from resume-pv.pdf (updated) + the original portfolio.

export const profile = {
  name: 'Pranav Verma',
  handle: 'pranav',
  eyebrow: 'Welcome to my universe',
  roles: ['Data Scientist', 'GenAI Engineer', 'Data Analyst'],
  tagline:
    '“Driven by curiosity, guided by logic, and inspired by creativity — I build intelligent systems that not only solve problems but empower people. A journey of continuous learning, strategic thinking and meaningful impact through data.”',
  email: 'pranavverma1295@hotmail.com',
  phone: '+91 77289 91790',
  location: 'Bangalore, India',
  cv: '/docs/resume-pv.pdf',
  photo: '/images/slider/banner-02.png',
  contactPhoto: '/images/contact/contact.jpg',
  socials: [
    { label: 'GitHub', href: 'https://github.com/pranavverma12/', icon: 'github' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/pranav-verma-da-ds', icon: 'linkedin' },
  ],
};

// Rotating skill badges for the hero ticker (names must exist in lib/techIcons)
export const skillBadges = [
  'Python',
  'LangChain',
  'LangGraph',
  'AutoGen',
  'CrewAI',
  'RAG',
  'Hugging Face',
  'Claude',
  'Llama',
  'Ollama',
  'FastAPI',
  'MCP',
  'Milvus',
  'Qdrant',
  'Snowflake',
  'Docker',
  'Kubernetes',
  'Redis',
  'Airflow',
  'MongoDB',
  'Tableau',
  'Power BI',
];

export const about = {
  eyebrow: 'A glimpse of my industrial experience',
  title: 'Overview',
  body: 'Strategic Data Science & GenAI Engineer with 7.5+ years of diagnosing business constraints, identifying high-impact opportunities, and engineering production-grade AI platforms — from conceiving the idea to leading the team to shipping the solution. Expert in Agentic AI, RAG, LLM and multi-modal architectures deployed on cloud infrastructure. Proven track record of leading teams, scaling platforms to 1,500+ enterprise users, and delivering 20–50% efficiency gains across compliance, development, and data operations.',
  stats: [
    { value: '7.5+', label: 'Years of experience' },
    { value: '1.5K+', label: 'Users scaled to' },
    { value: '4', label: 'Flagship AI platforms' },
    { value: '2', label: 'Peer-reviewed papers' },
  ],
};

export const expertise = [
  {
    icon: 'aperture',
    title: 'Generative AI (GenAI)',
    desc: "Agentic AI, RAG and multi-modal LLM architectures — turning logic into imagination and code into creativity, in production, every day.",
  },
  {
    icon: 'slack',
    title: 'Data Science',
    desc: 'Predictive & statistical modelling, recommendation and churn systems — building models that move real business metrics.',
  },
  {
    icon: 'bar-chart',
    title: 'Data Analysis',
    desc: 'Throw me the data and I will hand back the insight — dashboards and self-served analytics that drive decisions.',
  },
  {
    icon: 'tool',
    title: 'Analytics & Data Engineering',
    desc: 'ETL/ELT pipelines, data warehouses and MLOps — the bridge between developers, data teams and clean, production-ready data.',
  },
  {
    icon: 'terminal',
    title: 'Platform & Full-Stack',
    desc: 'FastAPI/Flask services, CI/CD and cloud infra (OpenShift, Docker, Kubernetes) — shipping AI platforms end-to-end.',
  },
  {
    icon: 'briefcase',
    title: 'Technical Leadership',
    desc: 'Roadmapping, mentoring, hiring and executive pitching — leading teams from a hackathon PoC to enterprise adoption.',
  },
];

// Categorized technical skills (from the resume)
export const skillCategories = [
  {
    icon: 'aperture',
    title: 'Generative AI & LLMs',
    items: [
      'Agentic AI',
      'AutoGen',
      'CrewAI',
      'RAG',
      'LangChain',
      'LangGraph',
      'Hugging Face',
      'Prompt Engineering',
      'Vision LLMs',
      'Ollama',
      'Milvus',
      'FAISS',
      'Qdrant',
      'MCP',
      'A2A',
      'Multi-agent Architectures',
    ],
  },
  {
    icon: 'bar-chart',
    title: 'ML & Analytics',
    items: [
      'Predictive Modelling',
      'Statistical Modelling',
      'NLP',
      'Recommendation Systems',
      'Churn Prediction',
      'Financial Modelling',
    ],
  },
  {
    icon: 'tool',
    title: 'Cloud & MLOps',
    items: ['AWS', 'Azure', 'Red Hat OpenShift', 'Docker', 'GitLab CI/CD', 'Kubernetes', 'Redis'],
  },
  {
    icon: 'slack',
    title: 'Data Engineering',
    items: [
      'Snowflake',
      'AWS Redshift',
      'MySQL',
      'MongoDB',
      'DBT',
      'Apache Airflow',
      'Meltano',
      'ETL / ELT',
      'Salesforce',
      'Oracle DB',
    ],
  },
  {
    icon: 'terminal',
    title: 'Languages & Tools',
    items: [
      'Python',
      'FastAPI',
      'Flask',
      'Pandas',
      'SQL',
      'R',
      'Git',
      'Tableau',
      'Power BI',
      'Dataiku',
      'KNIME',
      'n8n',
    ],
  },
  {
    icon: 'award',
    title: 'Leadership',
    items: [
      'Technical Roadmapping',
      'Agile / Scrum',
      'JIRA',
      'Mentoring & Hiring',
      'Stakeholder Management',
      'Executive Pitching',
    ],
  },
];

// 5 consolidated roles — each is a "station" on the experience railway.
export const experience = [
  {
    code: 'INF',
    role: 'Sr. Staff Engineer, Data Science',
    org: 'Infineon Technologies',
    location: 'Bangalore, India',
    period: 'Jul 2025 — Present',
    current: true,
    desc: 'Architecting production GenAI platforms (Hivemind, PRIMO, VIZARD) on Red Hat OpenShift — scaling internal AI tools to 1,500+ users, mentoring engineers, and driving code-quality standards across 50+ projects.',
  },
  {
    code: 'EMO',
    role: 'Lead Data Analyst',
    org: 'Emorphis Technologies',
    location: 'Remote',
    period: 'May 2023 — Jun 2025',
    desc: 'Built RAG + LLM chatbots and a Vision-LLM OCR pipeline for financial documents (15% faster FINRA processing), led a 4-person team consolidating 30M+ rows into a data warehouse, and shipped an M365 Copilot onboarding agent.',
  },
  {
    code: 'RED',
    role: 'Sr. Data Analyst',
    org: 'RedDoorz',
    location: 'Noida, India',
    period: 'Jan 2021 — Apr 2023',
    desc: 'Built property-recommendation (85% accuracy, +12% occupancy) and churn-prediction systems, and optimized ETL pipelines (Meltano / DBT / Airflow) for 50% lower data latency across 10–20K daily transactions.',
  },
  {
    code: 'GAL',
    role: 'ML Researcher & Developer',
    org: 'Freelance Data Scientist',
    location: 'Galway, Ireland',
    period: 'Jan 2020 — Dec 2020',
    desc: 'Delivered ML research across sports analytics and NLP alongside MSc studies — resulting in 2 peer-reviewed publications at LREC 2020 and ICACCS 2020.',
  },
  {
    code: 'ONG',
    role: 'Software Developer',
    org: 'Ongraph Technologies',
    location: 'Jaipur, India',
    period: 'Jan 2017 — Jun 2018',
    desc: 'Designed and delivered RESTful APIs, backend microservices, and early-stage ML models for client web and mobile products using Ruby on Rails and JavaScript.',
  },
];

// Flagship projects — from the resume KEY PROJECTS section.
export const projects = [
  {
    name: 'Hivemind',
    kind: 'Enterprise Knowledge Platform',
    org: 'Infineon Technologies',
    icon: 'aperture',
    desc: 'A centralized LLM platform letting 25+ teams document, version and standardize processes in one place. Engineered with GitLab CI/CD, Redis caching and SSO — plus Confluence & JIRA plugins.',
    metrics: [
      { value: '1,500+', label: 'users' },
      { value: '100', label: 'daily active' },
      { value: '35%', label: 'less doc time' },
    ],
    tags: ['LLM', 'RAG', 'Red Hat OpenShift', 'GitLab CI/CD', 'Redis'],
    featured: true,
  },
  {
    name: 'VIZARD',
    kind: 'AI Dashboard Recommender',
    org: 'Infineon Technologies',
    icon: 'bar-chart',
    desc: 'An automated pipeline over 2,000+ Tableau assets — server extraction, cleaning, LLM summaries and ML auto-tagging — powering a hybrid NLP + RAG recommender for intelligent dashboard discovery.',
    metrics: [
      { value: '2,000+', label: 'Tableau assets' },
      { value: '63.73%', label: 'tagging accuracy' },
    ],
    tags: ['NLP', 'RAG', 'ML', 'Tableau', 'LLM'],
    featured: true,
  },
  {
    name: 'PRIMO',
    kind: 'Developer Community Platform',
    org: 'Infineon Technologies',
    icon: 'terminal',
    desc: 'A self-initiated web app centralizing reusable code modules with n8n webhook-powered chat Q&A and structured docs. Roadmapping a LangGraph Agentic-AI layer to auto-recommend approved stacks.',
    metrics: [
      { value: '20–30%', label: 'less redundant effort' },
      { value: 'Beta', label: 'active adoption' },
    ],
    tags: ['n8n', 'LangGraph', 'Agentic AI', 'Web App'],
  },
  {
    name: 'Acquisition Data Migration',
    kind: 'Data Warehouse Integration',
    org: 'Emorphis Technologies',
    icon: 'slack',
    desc: 'A strategic data-warehouse integration for acquired entities across Salesforce, Oracle DB and SQL — consolidating 30M+ rows with rigorous QA and zero critical data loss.',
    metrics: [
      { value: '30M+', label: 'rows consolidated' },
      { value: '6h → 2h', label: 'migration downtime' },
    ],
    tags: ['Snowflake', 'Salesforce', 'Oracle DB', 'ETL', 'SQL'],
  },
];

export const education = [
  {
    degree: 'M.Sc. Computer Science — Data Analytics',
    school: 'National University of Ireland, Galway',
    location: 'Galway, Ireland',
    period: '2018 — 2019',
    grade: '1:1 Honours',
    icon: 'award',
  },
  {
    degree: 'B.Tech — Information Technology',
    school: 'Manipal University Jaipur',
    location: 'Jaipur, India',
    period: '2013 — 2017',
    grade: 'CGPA 8.9',
    icon: 'award',
  },
];

// Research papers presented as an interactive grid.
export const research = [
  {
    title: 'Unsupervised Methods to Analyze EPL Football Team Playing Style',
    venue: 'LREC 2020',
    tags: ['k-Means', 'Data Pre-processing', 'Python'],
    readTime: '15 min read',
    image: '/images/papers/football.jpg',
    href: 'https://ieeexplore.ieee.org/document/9074426/',
  },
  {
    title: 'A Dataset for Troll Classification of Tamil Memes',
    venue: 'ICACCS 2020',
    tags: ['Image Classification', 'Web Scraping', 'NLP'],
    readTime: '10 min read',
    image: '/images/papers/memes.jpg',
    href: 'https://aclanthology.org/2020.wildre-1.2.pdf',
  },
];

export const certifications = [
  { title: 'Machine Learning Specialization', issuer: 'University of Washington · Coursera', date: '03/25' },
  { title: 'Product Management: AI & Data Science', issuer: '365 Data Science', date: '11/24' },
  { title: 'Intro to Vector Databases with Pinecone', issuer: '365 Data Science', date: '11/24' },
  { title: 'ChatGPT for Data Science', issuer: '365 Data Science', date: '11/24' },
  { title: 'Soft Skills for Data Analytics Managers', issuer: '365 Data Science', date: '12/23' },
  { title: 'Data Analysis with ChatGPT', issuer: '365 Data Science', date: '12/23' },
  { title: 'Power BI with ChatGPT', issuer: '365 Data Science', date: '11/23' },
  { title: 'Intro to ChatGPT and GenAI', issuer: '365 Data Science', date: '11/23' },
  { title: 'R for Data Analytics', issuer: 'DataCamp', date: '10/18' },
  { title: 'Python for Data Analytics', issuer: 'DataCamp', date: '08/18' },
];

export const hobbies = [
  {
    title: 'Chess',
    tag: 'Sports',
    image: '/images/hobbies/chess.avif',
    desc: 'Played chess up to National Level and competed in a few tournaments Internationally, winning many along the way.',
  },
  {
    title: 'Listening to Music',
    tag: 'Music',
    image: '/images/hobbies/music.jpg',
    desc: 'I love music of any genre. I also play the piano whenever I feel like it and try to learn new songs.',
  },
  {
    title: 'Learning & Exploring',
    tag: 'Educational',
    image: '/images/hobbies/reading.avif',
    desc: 'I stay updated with emerging tech — especially in Data — reading about upcoming GenAI/LLM models and trends to build better solutions.',
  },
  {
    title: 'Carrom',
    tag: 'Sports',
    image: '/images/hobbies/carrom.png',
    desc: 'I love playing carrom. I have played up to State Level and won many tournaments.',
  },
  {
    title: 'Productivity',
    tag: 'Lifestyle',
    image: '/images/hobbies/productivity.jpg',
    desc: 'I enjoy learning about productivity tools and techniques, and how to implement them into a busy daily lifestyle.',
  },
];

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Products', href: '#projects' },
  { label: 'Writing', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

// Footer link columns (modelled on the reference footer).
export const footerColumns = [
  {
    heading: 'Navigate',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Experience', href: '#experience' },
      { label: 'Products', href: '#projects' },
      { label: 'Education', href: '#education' },
      { label: 'Certificates', href: '#certifications' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Skills & stack', href: '#skills' },
      { label: 'Research papers', href: '#research' },
      { label: 'Writing', href: '#blog' },
      { label: 'Hobbies', href: '#hobbies' },
      { label: "Let's talk", href: '#contact' },
    ],
  },
];
