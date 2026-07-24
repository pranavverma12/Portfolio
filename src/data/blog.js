// Long-form notes. Bodies are block arrays rendered by BlogModal.
// The author-only TODO blocks from the source drafts are intentionally omitted.

export const blogPosts = [
  {
    slug: 'the-token-bill-nobody-budgets-for',
    title: 'The Token Bill Nobody Budgets For',
    excerpt:
      "A platform can be 'working' and still be quietly burning money on every single turn. Where tokens actually go once real users show up — and the instrumentation you need before you can fix any of it.",
    tags: ['LLM Ops', 'Cost'],
    date: '2026-02-14',
    readMins: 8,
    cover: 'flow',
    featured: true,
    body: [
      {
        type: 'p',
        text: "Nobody budgets for tokens the way they budget for compute. A Kubernetes bill is a line item someone owns; a token bill is something that shows up at the end of the month looking three times bigger than anyone expected, with no single commit to blame. That gap between 'it works in the demo' and 'it costs what at 1,500 users' is where most LLM platforms quietly bleed.",
      },
      { type: 'h2', text: "The bill is not the model call. It's everything around it." },
      {
        type: 'p',
        text: 'When a platform is new, every request is treated as one unit of work: prompt in, completion out. Nobody looks closely at what actually rides along in that prompt. By the time a system has real users, a single "user asks a question" turn is usually paying for four separate things, and only one of them is the question.',
      },
      {
        type: 'list',
        items: [
          'The system prompt — re-sent, verbatim, on every single turn of every single conversation.',
          'Retrieved context — however many chunks your retriever decided were relevant, often padded wider than necessary "just in case."',
          'Conversation history — the last N turns, re-sent again so the model has continuity, growing linearly with conversation length.',
          'Retries and tool-calls — a failed parse, a tool that needed a second attempt, an agent step that looped once more than it needed to.',
        ],
      },
      {
        type: 'p',
        text: "None of these show up as anomalies. Each one looks reasonable in isolation. It's only when you sum them across a real user base that the shape becomes obvious: most of the token bill isn't the question being asked, it's the scaffolding built to answer it.",
      },
      { type: 'h2', text: 'Instrument before you optimize' },
      {
        type: 'p',
        text: "The instinct, once you suspect this, is to start trimming immediately — shorten the system prompt, cap the retrieved chunks, truncate history. Resist it until you can actually see where the tokens are going per request, not just in aggregate. A cost dashboard that only shows total spend per day tells you the bill is going up; it doesn't tell you whether that's because usage grew (good) or because retrieval got wider (fixable).",
      },
      {
        type: 'p',
        text: "The instrumentation that actually pays for itself is per-request token attribution: log input tokens split into system / retrieved-context / history / user-turn, and output tokens split into the answer and any tool-call scaffolding. Once every request carries that breakdown, the expensive category is usually obvious within a day of real traffic — and it's rarely the one anyone would have guessed by staring at the prompt template.",
      },
      { type: 'h2', text: 'Where the cheap wins actually are' },
      {
        type: 'list',
        items: [
          'System prompt — cache it. Providers that support prompt caching (or a simple hash-keyed local cache) turn a re-sent system prompt from a per-turn cost into a one-time cost.',
          'Retrieved context — measure citation rate, not just retrieval count. If a chunk is fetched but never referenced in the final answer across a sample of real traffic, your top-k is too wide.',
          'History — summarize past a fixed turn window instead of re-sending raw transcript. A compressed running summary costs a fraction of the raw text and rarely loses anything the model actually uses.',
          'Retries — cap them, and log why they happened. A tool call that fails 4% of the time silently doubles the token cost of every one of those requests.',
        ],
      },
      {
        type: 'p',
        text: "None of this is exotic. It's the unglamorous, boring work of measuring before cutting — the same discipline that makes any cost-optimization defensible instead of a guess. The platforms that stay cheap at scale aren't the ones that started cheap; they're the ones that instrumented early enough to catch the bill before it became a headline.",
      },
    ],
  },
  {
    slug: 'semantic-caching-the-cheapest-win-youll-ship',
    title: "Semantic Caching: The Cheapest Win You'll Ship",
    excerpt:
      'A Redis layer in front of the model turns a meaningful slice of your traffic into a cache hit instead of an API call. The part nobody mentions: when a cache hit is actually the wrong answer.',
    tags: ['LLM Ops', 'Caching', 'Redis'],
    date: '2026-03-02',
    readMins: 7,
    cover: 'network',
    featured: true,
    body: [
      {
        type: 'p',
        text: "The first time semantic caching gets pitched, it sounds almost too simple: embed the incoming query, check it against a cache of recently-answered queries, and if something close enough already has an answer, skip the model call entirely. It works. It is genuinely one of the cheapest wins available to any LLM platform with real traffic. It's also easy to ship badly, because the failure mode is silent — a wrong cache hit doesn't crash, it just quietly returns the wrong answer with total confidence.",
      },
      { type: 'h2', text: 'What it actually is' },
      {
        type: 'p',
        text: "An exact-match cache (same string in, same string out) barely helps a natural-language interface — nobody types the same question the same way twice. A semantic cache instead keys on meaning: embed the query, store the embedding alongside the model's response, and on a new query, do a nearest-neighbour lookup. If the closest cached entry is above a similarity threshold, serve it. Redis with a vector-similarity module (or a lightweight local index if you don't want another moving part) does this well — the lookup itself is single-digit milliseconds against a warm cache, which is also just faster than the model call it's replacing.",
      },
      { type: 'h2', text: 'The threshold is the whole product' },
      {
        type: 'p',
        text: "Every writeup about semantic caching skips straight to the architecture diagram and treats the similarity threshold as an implementation detail. It isn't — it's the actual design decision, and it's a genuine precision/recall trade with real consequences on both sides.",
      },
      {
        type: 'list',
        items: [
          'Threshold too loose: "How do I reset my password" and "How do I reset my API key" look close enough in embedding space to collide. The cache serves the wrong runbook. The user trusts it, because nothing about a cache hit looks uncertain.',
          "Threshold too tight: the cache almost never fires, you've added a lookup cost to every request for a negligible hit rate, and the caching layer becomes pure overhead instead of savings.",
        ],
      },
      {
        type: 'p',
        text: "The threshold that works isn't a number you pick once — it's a number you tune against a labelled sample of real near-duplicate queries from your own traffic, because 'close enough' means something different for a documentation Q&A bot than it does for a system answering questions where a wrong answer has compliance consequences.",
      },
      { type: 'h2', text: 'Invalidation is the part that actually breaks' },
      {
        type: 'p',
        text: "The classic caching problem — cache invalidation is one of the two hard things in computer science — doesn't go away just because the cache is semantic. If the underlying knowledge changes (a document gets updated, a policy changes, a product ships a new version), every cached answer built on the old version is now confidently, silently wrong until it expires or gets evicted.",
      },
      {
        type: 'list',
        items: [
          'TTL as a blunt but honest default — every entry expires on a fixed schedule, tuned to how fast your underlying content actually changes.',
          'Source-linked invalidation — tag cache entries with the document IDs that fed the retrieval, and flush on write when those documents change. More work, much more correct.',
          "Never cache across a version boundary you can't detect — if there's no clean signal for 'the source changed,' TTL is safer than pretending you have invalidation you don't.",
        ],
      },
      {
        type: 'p',
        text: "Done carefully, semantic caching is close to a free win — cheaper, faster, and it takes real load off the model. Done carelessly, it's a layer that occasionally hands out yesterday's answer with today's confidence. The difference between the two is entirely in the threshold tuning and the invalidation story, not in the architecture diagram.",
      },
    ],
  },
];
