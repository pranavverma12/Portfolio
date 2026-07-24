import {
  SiPython,
  SiLangchain,
  SiLanggraph,
  SiCrewai,
  SiHuggingface,
  SiClaude,
  SiMeta,
  SiOllama,
  SiFastapi,
  SiFlask,
  SiPandas,
  SiNumpy,
  SiMilvus,
  SiQdrant,
  SiRedhatopenshift,
  SiDocker,
  SiKubernetes,
  SiGitlab,
  SiGit,
  SiRedis,
  SiSnowflake,
  SiApacheairflow,
  SiApachespark,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiN8N,
  SiModelcontextprotocol,
  SiScikitlearn,
  SiPytorch,
  SiTensorflow,
  SiGooglegemini,
  SiKnime,
  SiJira,
  SiR,
} from 'react-icons/si';

// Every `icon` below was verified against the installed react-icons/si export
// list. Where simple-icons carries no brand mark (AWS, Azure, Oracle, Tableau,
// Power BI, Salesforce, dbt and a few AI-specific names — several pulled over
// trademark disputes), we fall back to a coloured monogram rather than
// importing something that doesn't exist and breaking the build.
export const TECH = {
  // ---- GenAI / LLM ----
  'Agentic AI': { color: '#A855F7', mono: 'AA' },
  AutoGen: { color: '#7C3AED', mono: 'AG' },
  CrewAI: { icon: SiCrewai, color: '#FF5A1F' },
  RAG: { color: '#64748B', mono: 'R' },
  LangChain: { icon: SiLangchain, color: '#1C3C3C' },
  LangGraph: { icon: SiLanggraph, color: '#2D6A4F' },
  'Hugging Face': { icon: SiHuggingface, color: '#FFD21E' },
  'Prompt Engineering': { color: '#EC4899', mono: 'PE' },
  'Vision LLMs': { color: '#F472B6', mono: 'VL' },
  'Multi-modal / Vision LLMs': { color: '#F472B6', mono: 'VL' },
  'Vision LLM': { color: '#F472B6', mono: 'VL' },
  OpenAI: { color: '#10A37F', mono: 'AI' },
  Claude: { icon: SiClaude, color: '#D97757' },
  Llama: { icon: SiMeta, color: '#0866FF' },
  Gemma: { icon: SiGooglegemini, color: '#4285F4' },
  DeepSeek: { color: '#4D6BFE', mono: 'DS' },
  Ollama: { icon: SiOllama, color: '#E8E8E8' },
  LLM: { color: '#C084FC', mono: 'LM' },
  MCP: { icon: SiModelcontextprotocol, color: '#8B5CF6' },
  'MCP / A2A': { icon: SiModelcontextprotocol, color: '#8B5CF6' },
  A2A: { color: '#64748B', mono: 'A2' },
  'Multi-agent Architectures': { color: '#A78BFA', mono: 'MA' },
  'Vector DBs': { color: '#00A1EA', mono: 'VD' },
  Milvus: { icon: SiMilvus, color: '#00A1EA' },
  FAISS: { color: '#1877F2', mono: 'FS' },
  Qdrant: { icon: SiQdrant, color: '#DC244C' },
  'M365 Copilot': { color: '#0078D4', mono: 'CP' },

  // ---- ML & Analytics ----
  NLP: { color: '#22D3EE', mono: 'NL' },
  'Predictive Modelling': { color: '#34D399', mono: 'PM' },
  'Statistical Modelling': { color: '#34D399', mono: 'SM' },
  'Recommendation Systems': { color: '#FBBF24', mono: 'RS' },
  Recommenders: { color: '#FBBF24', mono: 'RS' },
  'Churn Prediction': { color: '#FB7185', mono: 'CH' },
  'Financial Modelling': { color: '#4ADE80', mono: 'FM' },
  'Real-time ML': { color: '#38BDF8', mono: 'RT' },
  'ML Auto-tagging': { color: '#818CF8', mono: 'ML' },
  'Unsupervised Learning': { color: '#A3E635', mono: 'UL' },
  'Sports Analytics': { color: '#F59E0B', mono: 'SA' },
  'Low-resource languages': { color: '#2DD4BF', mono: 'LR' },
  'Multi-modal': { color: '#F472B6', mono: 'MM' },
  'Image Classification': { color: '#60A5FA', mono: 'IC' },
  'Web Scraping': { color: '#94A3B8', mono: 'WS' },
  'k-Means': { color: '#A3E635', mono: 'KM' },
  'Data Pre-processing': { color: '#94A3B8', mono: 'DP' },
  'scikit-learn': { icon: SiScikitlearn, color: '#F7931E' },
  PyTorch: { icon: SiPytorch, color: '#EE4C2C' },
  TensorFlow: { icon: SiTensorflow, color: '#FF6F00' },

  // ---- Cloud & MLOps ----
  AWS: { color: '#FF9900', mono: 'AWS' },
  Azure: { color: '#0078D4', mono: 'AZ' },
  'Red Hat OpenShift': { icon: SiRedhatopenshift, color: '#EE0000' },
  OpenShift: { icon: SiRedhatopenshift, color: '#EE0000' },
  Docker: { icon: SiDocker, color: '#2496ED' },
  Kubernetes: { icon: SiKubernetes, color: '#326CE5' },
  'GitLab CI/CD': { icon: SiGitlab, color: '#FC6D26' },
  'CI/CD': { icon: SiGitlab, color: '#FC6D26' },
  Redis: { icon: SiRedis, color: '#DC382D' },
  SSO: { color: '#38BDF8', mono: 'SS' },
  Git: { icon: SiGit, color: '#F05032' },

  // ---- Data engineering ----
  Snowflake: { icon: SiSnowflake, color: '#29B5E8' },
  'AWS Redshift': { color: '#8C4FFF', mono: 'RS' },
  Redshift: { color: '#8C4FFF', mono: 'RS' },
  DBT: { color: '#FF694B', mono: 'dbt' },
  'Apache Airflow': { icon: SiApacheairflow, color: '#017CEE' },
  Airflow: { icon: SiApacheairflow, color: '#017CEE' },
  Spark: { icon: SiApachespark, color: '#E25A1C' },
  Meltano: { color: '#663399', mono: 'M' },
  'ETL / ELT': { color: '#5EEAD4', mono: 'ET' },
  ETL: { color: '#5EEAD4', mono: 'ET' },
  DWH: { color: '#5EEAD4', mono: 'DW' },
  MySQL: { icon: SiMysql, color: '#4479A1' },
  PostgreSQL: { icon: SiPostgresql, color: '#4169E1' },
  MongoDB: { icon: SiMongodb, color: '#47A248' },
  'Oracle DB': { color: '#F80000', mono: 'OR' },
  Salesforce: { color: '#00A1E0', mono: 'SF' },
  SQL: { color: '#38BDF8', mono: 'SQL' },

  // ---- Languages & tools ----
  Python: { icon: SiPython, color: '#3776AB' },
  'Python (FastAPI, Flask, Pandas)': { icon: SiPython, color: '#3776AB' },
  FastAPI: { icon: SiFastapi, color: '#009688' },
  Flask: { icon: SiFlask, color: '#E8E8E8' },
  Pandas: { icon: SiPandas, color: '#E8E8E8' },
  NumPy: { icon: SiNumpy, color: '#4DABCF' },
  R: { icon: SiR, color: '#276DC3' },
  Tableau: { color: '#E97627', mono: 'TB' },
  'Power BI': { color: '#F2C811', mono: 'BI' },
  Dataiku: { color: '#2AB1AC', mono: 'DK' },
  KNIME: { icon: SiKnime, color: '#FDD400' },
  n8n: { icon: SiN8N, color: '#EA4B71' },
  'Web App': { color: '#94A3B8', mono: 'WA' },
  Electron: { color: '#47848F', mono: 'EL' },
  'Local-first': { color: '#22C55E', mono: 'LF' },

  // ---- Leadership ----
  'Technical Roadmapping': { color: '#F0ABFC', mono: 'TR' },
  'Agile / Scrum': { color: '#60A5FA', mono: 'AG' },
  JIRA: { icon: SiJira, color: '#0052CC' },
  'Mentoring & Hiring': { color: '#FCD34D', mono: 'MH' },
  'Stakeholder Management': { color: '#FDBA74', mono: 'SK' },
  'Executive Pitching': { color: '#F87171', mono: 'EP' },

  // ---- Domain ----
  FINRA: { color: '#94A3B8', mono: 'FN' },
  Compliance: { color: '#94A3B8', mono: 'CO' },
  OCR: { color: '#A5B4FC', mono: 'OC' },
  Onboarding: { color: '#FDA4AF', mono: 'ON' },
};

/** Look up a tech entry, tolerating unknown names with a neutral monogram. */
export function techEntry(name) {
  const hit = TECH[name];
  if (hit) return hit;
  const letters = name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return { color: '#8A93A0', mono: letters || '•' };
}
