---
name: country-guide-writer
description: Produce one weekly data-driven guide article for the whatsthepop.world country-comparison site. Use this skill whenever the user mentions writing a guide, a curation post, a listicle, weekly content, the content routine, "이번 주 가이드", "가이드 하나 써줘", or asks what to publish next — and also whenever they ask for site content, blog posts, or SEO articles for this project, even if they don't say the word "guide". This skill handles topic selection from the backlog, querying the country dataset, writing the human intro, generating the Next.js page, wiring internal links, and updating the backlog. Do not hand-write guide content without consulting this skill first.
---

# Country Guide Writer

Produces the weekly `/reports/*` article for whatsthepop.world.

These guides carry three jobs at once. Understanding all three prevents optimizing for one and breaking the others:

1. **Internal link hub** — each guide links out to 20–30 country detail pages, giving crawlers a path into the long tail
2. **Quality signal** — the site is ~40,000 templated pages. These guides are the human-written evidence that it isn't a content farm. They're what an AdSense reviewer and a Google quality system will actually read
3. **Shareable asset** — data-driven lists get posted to Reddit and communities, which is where early backlinks come from

Job #2 is the one most easily broken by automation. A guide generated entirely from a template defeats its own purpose. See "Avoiding the content-farm trap" below.

---

## Before doing anything: the cadence rule

**One guide per week. Never batch-publish.**

A new domain that ships 15 near-identical list pages in one day is the exact pattern Google's scaled-content-abuse policy targets. The cadence isn't a productivity preference — it's the protection.

If the user asks for several guides at once, produce one and say why the rest should wait. Offer to draft outlines for the next two so the work isn't lost.

Check the backlog before starting:

```bash
grep -n "status:" references/topics-backlog.md | head -20
```

If a guide was published within the last 5 days, say so and confirm before proceeding.

---

## Workflow

### 1. Pick the topic

Read `references/topics-backlog.md`. Take the highest-priority item with `status: todo` unless the user names a specific topic.

Confirm the pick in one line before writing — the user may have a reason to reorder (a news event, a seasonal window). Seasonal topics matter here: "월별 기온으로 고른 여행지" lands better in spring, "남반구 여행 가이드" before the northern winter.

### 2. Build the data

Guides are derived from `data/countries/*.json`, never from memory. Writing "Canada is the second largest country" from recall is how factual errors enter a site whose entire value proposition is accurate data.

Query the dataset first and look at what comes back:

```bash
node -e "
const fs=require('fs');
const all=fs.readdirSync('data/countries').map(f=>JSON.parse(fs.readFileSync('data/countries/'+f)));
const kr=all.find(c=>c.iso2==='KR');
const out=all.filter(c=>c.area_km2>kr.area_km2).sort((a,b)=>b.area_km2-a.area_km2);
console.log(out.length, out.slice(0,30).map(c=>c.names.ko+' '+c.area_km2).join('\n'));
"
```

Then read the result before writing about it. The interesting angle usually lives in something surprising in the actual numbers — a country higher or lower than expected, a cluster, a gap. That observation is what makes the intro worth reading, and it can't be predicted before seeing the data.

If a needed field is missing for several countries, exclude them and note the exclusion in the article rather than guessing values.

See `references/code-patterns.md` for the standard query and page-generation patterns.

### 3. Write the intro

300–500 words of actual prose above the list. This is the part that does the quality-signal job.

Read `references/voice-and-style.md` before writing. The short version:

- Open with the specific surprising thing found in the data, not with a definition. "지구상에서 한국보다 큰 나라는 108개국이다" is a worse opening than "면적 순위 100위인 나라도 한국의 세 배가 넘는다"
- Reference the reader's likely situation (planning a trip, mid-trip curiosity) rather than addressing "여행자 여러분"
- Explain at least one thing the raw numbers don't show — why Iceland's population density is misleading given the uninhabitable interior, why nominal GDP misranks countries with cheap domestic prices
- No SEO throat-clearing. Never write "이 글에서는 ~에 대해 알아보겠습니다"

**Structural variety is a hard requirement.** Before writing, check `references/topics-backlog.md`'s "발행 기록" (publish log) table for the `intro_shape` used in the most recent 1-2 published reports.

The new intro must not follow their shape. If both opened with a question, don't open with a question. If both were three paragraphs of equal length, break the rhythm. `references/voice-and-style.md` lists five distinct intro shapes to rotate through.

### 4. Generate the report

Reports are **data, not pages**. Each one is a JSON file at `data/reports/{slug}.json`, validated against the Zod schema in `src/lib/reportSchema.ts`, and rendered by the single shared template at `src/app/[locale]/reports/[slug]/page.tsx` and index at `src/app/[locale]/reports/page.tsx`. Do not create a new route or `.tsx` page per report — write JSON matching the existing schema. Use `assets/report-template.json` as the starting shape and the two published reports under `data/reports/` as worked examples.

Schema shape (see `src/lib/reportSchema.ts` for the authoritative version):

- `slug`, `publishedAt` (`YYYY-MM-DD`), `readingMinutes`, `coverArt`, `tags`, `title`, `excerpt` — all localized (`{ ko, en }`) except slug/date/reading time/coverArt
- `stats` (optional) — 3-5 headline `{label, value}` pairs shown as cards
- `sections` (required, 1+) — each a `{heading, body}` pair; `body` is an **array of plain-text paragraphs per locale, no markdown or HTML**. There is no table or list component — group and narrate in prose instead (see "Avoiding the content-farm trap" below)
- `sources` (required, 1+) — real citations with a name, URL, and retrieval date
- `relatedCountrySlugs` (optional) — every country mentioned in the article; the page renders these as a link section to `/{locale}/country/{slug}`, since prose paragraphs can't carry inline links

Requirements that don't vary:

- `slug` in English kebab-case, matching the JSON filename
- **ko and en only.** Other locales wait until traffic data shows which languages are worth the effort
- Every country mentioned goes into `relatedCountrySlugs` so it gets linked
- `coverArt` must reference a variant registered in both `reportCoverArtSchema` (`src/lib/reportSchema.ts`) and `artByVariant` (`src/components/reports/ReportCoverArt.tsx`). If no existing variant fits, add a new static SVG component there, following the visual language of the existing ones (big/small comparison squares, flag emoji, a headline ratio) — don't add a charting library or a per-report component
- Static generation, no client-side data fetching (this is automatic — you're writing data, not a component)
- `excerpt` contains at least one concrete number (it becomes the meta description)
- No JSON-LD is wired up yet for reports — don't claim otherwise in the article; this is a gap to fix later, not something to fake per-report

### 5. Wire the links both ways

The report links to countries via `relatedCountrySlugs`; countries should link back. Check whether `src/app/[locale]/country/[slug]/page.tsx` (or its data layer) already surfaces a "이 나라가 등장하는 리포트" section driven by scanning `data/reports/*.json` for each country's slug — if not, that reverse link doesn't exist yet and is worth flagging rather than silently skipping. This bidirectional graph is most of the SEO value — a report nobody links to, and that links to nothing, is a dead end.

### 6. Verify before handing off

```bash
npm run build
```

Then check:
- Every slug in `relatedCountrySlugs` matches an actual file in `data/countries/` (no 404s from a typo'd slug)
- Numbers in the prose match the numbers you queried — these drift when the intro is written before the query is finalized
- `excerpt` and `title` are set for both locales, not placeholder text

### 7. Update the backlog

Mark the topic `status: published`, record the date and slug in `references/topics-backlog.md`, and note the intro shape used so the next run can avoid repeating it.

---

## Avoiding the content-farm trap

The failure mode for this skill is producing 15 guides that are recognizably the same document with different filters applied. That outcome is worse than publishing nothing, because it converts the guides from a quality signal into evidence for the opposite conclusion.

Concrete guards:

**Vary the article shape, not just the topic.** Not every guide is a top-30 ranked list. Some should be: a decision tree ("어느 달에 어디로"), a paired comparison ("기후가 비슷한 나라"), a practical checklist (plugs and voltage), a debunking piece (why GDP rankings mislead travelers).

**Let the data change the plan.** If the query for "물가가 한국의 절반인 나라" returns 4 countries instead of 20, the article becomes a short piece about why the list is short — not a padded list of 20 loosely qualifying countries.

**One genuinely non-derivable sentence per guide, minimum.** Something that required a human to know it: a visa quirk, a seasonal closure, a common traveler mistake. If a guide contains nothing that couldn't be computed from the dataset, it hasn't earned its position as the site's quality evidence.

**Don't reuse the sentence frame.** "1위는 ○○로 ○○km²다. 2위는..." repeated 30 times across 15 articles is a fingerprint. Group, cluster, and comment instead of enumerating uniformly.

---

## When the user asks for something adjacent

- **"가이드 10개 아이디어 뽑아줘"** — brainstorm freely, add promising ones to the backlog, but don't write them
- **"이 가이드 다른 언어로 번역해줘"** — check whether that locale has traffic first; translating into a dead locale is wasted effort and adds thin pages
- **"기존 가이드 업데이트해줘"** — after a quarterly data refresh, numbers in prose go stale. Re-run the query, diff against what's written, fix the drifted figures in the JSON. The schema has no `dateModified` field yet — either add one if this becomes routine, or note the correction inline in the affected section
- **"이번 주 뭐 써야 해?"** — read the backlog, consider the season, propose one with a sentence on why now

---

## Reference files

- `references/topics-backlog.md` — the 15 planned topics, priority, status, published dates, intro shapes used
- `references/voice-and-style.md` — intro shapes, tone rules, Korean/English differences, worked examples
- `references/code-patterns.md` — dataset query patterns, the report JSON schema, cover art variants, internal linking
- `assets/report-template.json` — starting scaffold for a new report's data file
- `data/reports/*.json` — the published reports themselves are the most reliable worked examples; read one before writing a new one
