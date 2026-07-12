# Kamba Ramayanam Knowledge Repository — Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, cross-referenced Kamba Ramayanam study site — validated end-to-end on a 5-pasuram pilot (opening of Sundara Kandam) — ready to deploy free on Cloudflare Pages.

**Architecture:** Astro static site. All content lives as typed files in Astro content collections (Zod-validated at build time). Kamban verses link by stable ID to shared source-text records (Valmiki, Desikan, etc.); a build-time integrity check fails the build if any link is broken. Pages are generated statically; search is a build-time Pagefind index; media is embedded (YouTube/Spotify/audio) and never hosted directly; images use Astro's image optimization.

**Tech Stack:** Astro 4+, TypeScript, Zod (via Astro content collections), Pagefind (search), Vitest (unit tests for pure helpers), Cloudflare Pages (hosting), Node 23 / npm 10.

## Global Constraints

- **Node ≥ 20.3, npm** — environment has Node 23.7.0, npm 10.9.2. Do not add pnpm/yarn.
- **Static output only** — `output: 'static'`. No SSR, no server, no database.
- **No verse/content unit is shown as authoritative unless `status: 'published'`.** Draft/verified content may exist in the repo but pages must visibly mark anything not `published` as a draft.
- **Progressive enrichment** — every enrichment layer is optional; a page renders only the layers present and never shows empty scaffolding.
- **Copyright** — never store full copyrighted text of valmikiramayan.net or holy-bhagavad-gita.org. Source records hold a short fair-use excerpt (≤ ~2 lines) plus `sourceUrl` deep-link. Every source record carries a `license` note.
- **Cross-references are typed and validated** — every `link.targetId` must resolve to an existing record in the collection named by `link.category`, or the build fails.
- **Imagery house style: Tanjore (Thanjavur) painting.** All images are original AI-generated Tanjore-style renderings — never copies of third-party artwork or copyrighted photographs. Each image record stores caption, scene, generation tool, prompt, license, and review status.
- **Transliteration convention: ISO 15919.** Stored as an author-provided string field; the site does not auto-transliterate.
- **Canonical domain:** `kambaramayanam.org`.
- **Pilot passage:** the opening of Sundara Kandam, first 5 pasurams (Hanuman preparing to leap / ocean crossing begins).

---

## File Structure

```
/                              repo root
├── astro.config.mjs           Astro config (static, image, integrations)
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
├── src/
│   ├── content/
│   │   ├── config.ts          ← all collection schemas (Zod). Heart of the model.
│   │   ├── verses/            Kamban verse files (.md/.mdx with frontmatter)
│   │   ├── valmiki/           Valmiki sloka source records
│   │   ├── desikan/           Swami Desikan source records
│   │   ├── prabandham/        Divya Prabandham source records
│   │   ├── gita/              Bhagavad Gita source records
│   │   ├── upanishads/
│   │   ├── purana/
│   │   ├── annamacharya/
│   │   ├── thyagaraja/
│   │   ├── commentaries/
│   │   ├── works/             parent records for source works (for source-text pages)
│   │   └── images/            image asset metadata records
│   ├── lib/
│   │   ├── links.ts           resolveLinks(): join a verse's links to target records
│   │   ├── validate.ts        assertLinksResolve(): build-time integrity check
│   │   └── categories.ts      CATEGORY → collection name map + labels (single source of truth)
│   ├── components/
│   │   ├── VerseLayers.astro  renders the progressive layers of one verse
│   │   ├── CrossRefCard.astro one cross-reference card (citation + reason + deep-link)
│   │   ├── MediaEmbed.astro    YouTube/Spotify/audio embed (lazy)
│   │   ├── SceneImage.astro    optimized Tanjore image with caption
│   │   └── DraftBanner.astro   visible banner when status !== 'published'
│   ├── layouts/
│   │   └── BaseLayout.astro    HTML shell, header/nav, Pagefind UI, footer
│   ├── pages/
│   │   ├── index.astro         landing page (Pattabhishekam + 4 acharyas)
│   │   ├── about.astro         methodology / Vishishtadvaita lens / review process
│   │   ├── verse/[...id].astro verse pages (one per verse)
│   │   ├── browse/index.astro  kandam → padalam → verse navigation
│   │   └── source/[...id].astro source-text pages (bidirectional back-links)
│   └── styles/
│       └── global.css
├── src/assets/images/         Tanjore image files (optimized by Astro)
├── docs/
│   └── art-direction-tanjore.md   image style guide + prompt language
└── public/                     static passthrough (favicon, etc.)
```

---

## Task 1: Scaffold Astro project, git, and tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `vitest.config.ts`
- Create: `src/pages/index.astro` (temporary placeholder, replaced in Task 8)
- Create: `src/styles/global.css` (minimal)

**Interfaces:**
- Produces: a buildable Astro project. `npm run build` produces `dist/`. `npm test` runs Vitest.

- [ ] **Step 1: Initialize the project non-interactively**

Run:
```bash
npm create astro@latest . -- --template minimal --no-install --no-git --skip-houston --typescript strict
```
Expected: files scaffolded into the current directory (`src/`, `astro.config.mjs`, `package.json`, `tsconfig.json`).

- [ ] **Step 2: Install dependencies and dev tooling**

Run:
```bash
npm install
npm install -D vitest pagefind
```
Expected: `node_modules/` populated; no errors.

- [ ] **Step 3: Configure Astro for static output + image service**

Replace `astro.config.mjs` with:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kambaramayanam.org',
  output: 'static',
  image: {
    // Astro's built-in sharp service handles resize + WebP/AVIF.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
```

- [ ] **Step 4: Add scripts and Vitest config**

In `package.json`, ensure the `scripts` block contains exactly:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "test": "vitest run",
    "check": "astro check"
  }
}
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 5: Add `.gitignore`**

Create `.gitignore`:
```
node_modules/
dist/
.astro/
.DS_Store
*.log
```

- [ ] **Step 6: Verify the project builds**

Run:
```bash
npm run build
```
Expected: build succeeds, `dist/` is created. (Pagefind will warn "no indexable content" — acceptable at this stage; the `astro build` half must succeed.)

- [ ] **Step 7: Initialize git and commit**

Run:
```bash
git init
git add -A
git commit -m "chore: scaffold Astro static site with vitest and pagefind"
```

---

## Task 2: Category registry (single source of truth)

**Files:**
- Create: `src/lib/categories.ts`
- Test: `src/lib/categories.test.ts`

**Interfaces:**
- Produces:
  - `CATEGORIES` — readonly tuple of the 9 cross-reference category slugs: `['valmiki','desikan','prabandham','gita','upanishad','purana','annamacharya','thyagaraja','commentary']`
  - `type Category = typeof CATEGORIES[number]`
  - `CATEGORY_COLLECTION: Record<Category, string>` — maps each category to its content-collection name (e.g. `upanishad → 'upanishads'`)
  - `CATEGORY_LABEL: Record<Category, string>` — human labels (e.g. `valmiki → 'Valmiki Ramayana'`)

- [ ] **Step 1: Write the failing test**

Create `src/lib/categories.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { CATEGORIES, CATEGORY_COLLECTION, CATEGORY_LABEL } from './categories';

describe('category registry', () => {
  it('defines all nine cross-reference categories', () => {
    expect(CATEGORIES).toEqual([
      'valmiki', 'desikan', 'prabandham', 'gita',
      'upanishad', 'purana', 'annamacharya', 'thyagaraja', 'commentary',
    ]);
  });

  it('maps every category to a collection name and a label', () => {
    for (const c of CATEGORIES) {
      expect(CATEGORY_COLLECTION[c]).toBeTruthy();
      expect(CATEGORY_LABEL[c]).toBeTruthy();
    }
  });

  it('pluralizes the upanishad collection name', () => {
    expect(CATEGORY_COLLECTION.upanishad).toBe('upanishads');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- categories`
Expected: FAIL — cannot find module `./categories`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/categories.ts`:
```ts
export const CATEGORIES = [
  'valmiki', 'desikan', 'prabandham', 'gita',
  'upanishad', 'purana', 'annamacharya', 'thyagaraja', 'commentary',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLLECTION: Record<Category, string> = {
  valmiki: 'valmiki',
  desikan: 'desikan',
  prabandham: 'prabandham',
  gita: 'gita',
  upanishad: 'upanishads',
  purana: 'purana',
  annamacharya: 'annamacharya',
  thyagaraja: 'thyagaraja',
  commentary: 'commentaries',
};

export const CATEGORY_LABEL: Record<Category, string> = {
  valmiki: 'Valmiki Ramayana',
  desikan: 'Swami Desikan',
  prabandham: 'Divya Prabandham',
  gita: 'Bhagavad Gita',
  upanishad: 'Upanishads',
  purana: 'Vishnu Purana / Bhagavatam',
  annamacharya: 'Annamacharya Kirtanas',
  thyagaraja: 'Thyagaraja Kirtanas',
  commentary: 'Traditional Commentaries',
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- categories`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/categories.ts src/lib/categories.test.ts
git commit -m "feat: add cross-reference category registry"
```

---

## Task 3: Content collection schemas (the data model)

**Files:**
- Create: `src/content/config.ts`
- Create one `.gitkeep` per collection folder so empty dirs are tracked.

**Interfaces:**
- Consumes: `CATEGORIES` from `src/lib/categories.ts`.
- Produces: Astro collections `verses`, plus the 10 source collections (`valmiki`, `desikan`, `prabandham`, `gita`, `upanishads`, `purana`, `annamacharya`, `thyagaraja`, `commentaries`, `works`) and `images`. Exported types inferred by Astro's `getCollection`.
- Verse frontmatter shape (relied on by Tasks 4–9):
  - `kandam: string`, `padalam: string`, `verseNumber: number`
  - `tamil: string`, `transliteration: string`, `translationEnglish: string`
  - `wordByWord?: {word:string; meaning:string}[]`
  - `literaryAnalysis?: string`
  - `kambanContribution?: {expands?:string; changes?:string; poeticDevices?:string}`
  - `links?: {category: Category; targetId: string; citation: string; reason: string}[]`
  - `insights?: {theological?:string; literary?:string; philosophical?:string}`
  - `media?: {type:'youtube'|'spotify'|'audio'; url:string; label:string}[]`
  - `image?: string` (id of a record in `images`)
  - `status: 'draft'|'verified'|'published'`, `verifiedBy?:string`, `verifiedOn?:string`, `sources?: string[]`
- Source-record frontmatter shape (all 9 source collections + `works` share it, relied on by Task 6):
  - `work: string` (id into `works`), `citation: string`
  - `textExcerpt?: string`, `transliteration?: string`, `translation?: string`
  - `sourceUrl?: string`, `license: string`, `status: 'draft'|'verified'|'published'`
- `works` record shape: `title: string`, `author?: string`, `tradition?: string`, `description?: string`.
- Image record shape (relied on by Task 7 & 11): `caption: string`, `scene: string`, `tool: string`, `prompt: string`, `license: string`, `status: 'draft'|'verified'|'published'`, `file: string` (path under `src/assets/images/`).

- [ ] **Step 1: Create the collection folders with `.gitkeep`**

Run:
```bash
mkdir -p src/content/{verses,valmiki,desikan,prabandham,gita,upanishads,purana,annamacharya,thyagaraja,commentaries,works,images} src/assets/images
for d in verses valmiki desikan prabandham gita upanishads purana annamacharya thyagaraja commentaries works images; do touch "src/content/$d/.gitkeep"; done
```

- [ ] **Step 2: Write the schema config**

Create `src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';
import { CATEGORIES } from '../lib/categories';

const status = z.enum(['draft', 'verified', 'published']);

const link = z.object({
  category: z.enum(CATEGORIES),
  targetId: z.string(),
  citation: z.string(),
  reason: z.string(),
});

const verses = defineCollection({
  type: 'content',
  schema: z.object({
    kandam: z.string(),
    padalam: z.string(),
    verseNumber: z.number().int().positive(),
    tamil: z.string(),
    transliteration: z.string(),
    translationEnglish: z.string(),
    wordByWord: z.array(z.object({ word: z.string(), meaning: z.string() })).optional(),
    literaryAnalysis: z.string().optional(),
    kambanContribution: z
      .object({
        expands: z.string().optional(),
        changes: z.string().optional(),
        poeticDevices: z.string().optional(),
      })
      .optional(),
    links: z.array(link).optional(),
    insights: z
      .object({
        theological: z.string().optional(),
        literary: z.string().optional(),
        philosophical: z.string().optional(),
      })
      .optional(),
    media: z
      .array(
        z.object({
          type: z.enum(['youtube', 'spotify', 'audio']),
          url: z.string().url(),
          label: z.string(),
        }),
      )
      .optional(),
    image: z.string().optional(),
    status,
    verifiedBy: z.string().optional(),
    verifiedOn: z.string().optional(),
    sources: z.array(z.string()).optional(),
  }),
});

const sourceSchema = z.object({
  work: z.string(),
  citation: z.string(),
  textExcerpt: z.string().optional(),
  transliteration: z.string().optional(),
  translation: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  license: z.string(),
  status,
});

const sourceCollection = () => defineCollection({ type: 'content', schema: sourceSchema });

const works = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    tradition: z.string().optional(),
    description: z.string().optional(),
  }),
});

const images = defineCollection({
  type: 'data',
  schema: z.object({
    caption: z.string(),
    scene: z.string(),
    tool: z.string(),
    prompt: z.string(),
    license: z.string(),
    status,
    file: z.string(),
  }),
});

export const collections = {
  verses,
  valmiki: sourceCollection(),
  desikan: sourceCollection(),
  prabandham: sourceCollection(),
  gita: sourceCollection(),
  upanishads: sourceCollection(),
  purana: sourceCollection(),
  annamacharya: sourceCollection(),
  thyagaraja: sourceCollection(),
  commentaries: sourceCollection(),
  works,
  images,
};
```

- [ ] **Step 3: Verify the schema compiles**

Run:
```bash
npm run check
```
Expected: `astro check` passes with 0 errors (0 warnings acceptable). This runs `astro sync` to generate collection types.

- [ ] **Step 4: Commit**

Run:
```bash
git add src/content/config.ts src/content/*/.gitkeep src/assets/images
git commit -m "feat: define content collection schemas for verses and source texts"
```

---

## Task 4: Link resolution helper

**Files:**
- Create: `src/lib/links.ts`
- Test: `src/lib/links.test.ts`

**Interfaces:**
- Consumes: `Category`, `CATEGORY_COLLECTION`, `CATEGORY_LABEL` from `categories.ts`.
- Produces:
  - `type ResolvedLink = { category: Category; label: string; citation: string; reason: string; targetId: string; found: boolean; target?: SourceEntry }`
  - `resolveLinks(links, lookup): ResolvedLink[]` — pure function. `lookup` is `(collection: string, id: string) => SourceEntry | undefined`. Keeps the function testable without Astro's runtime.
  - `type SourceEntry = { id: string; data: { citation: string; sourceUrl?: string; translation?: string; textExcerpt?: string; status: string } }`

- [ ] **Step 1: Write the failing test**

Create `src/lib/links.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { resolveLinks } from './links';

const target = {
  id: 'valmiki-5-1-1',
  data: { citation: 'Sundara Kandam 1.1', sourceUrl: 'https://x', translation: 't', status: 'published' },
};
const lookup = (collection: string, id: string) =>
  collection === 'valmiki' && id === 'valmiki-5-1-1' ? target : undefined;

describe('resolveLinks', () => {
  it('resolves a valid link and attaches label + target', () => {
    const [r] = resolveLinks(
      [{ category: 'valmiki', targetId: 'valmiki-5-1-1', citation: 'VR 5.1.1', reason: 'same scene' }],
      lookup,
    );
    expect(r.found).toBe(true);
    expect(r.label).toBe('Valmiki Ramayana');
    expect(r.target?.id).toBe('valmiki-5-1-1');
  });

  it('marks an unresolved link as not found', () => {
    const [r] = resolveLinks(
      [{ category: 'valmiki', targetId: 'missing', citation: 'x', reason: 'y' }],
      lookup,
    );
    expect(r.found).toBe(false);
    expect(r.target).toBeUndefined();
  });

  it('returns an empty array when links is undefined', () => {
    expect(resolveLinks(undefined, lookup)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- links`
Expected: FAIL — cannot find module `./links`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/links.ts`:
```ts
import { CATEGORY_COLLECTION, CATEGORY_LABEL, type Category } from './categories';

export type SourceEntry = {
  id: string;
  data: {
    citation: string;
    sourceUrl?: string;
    translation?: string;
    textExcerpt?: string;
    status: string;
  };
};

export type LinkInput = {
  category: Category;
  targetId: string;
  citation: string;
  reason: string;
};

export type ResolvedLink = {
  category: Category;
  label: string;
  citation: string;
  reason: string;
  targetId: string;
  found: boolean;
  target?: SourceEntry;
};

export function resolveLinks(
  links: LinkInput[] | undefined,
  lookup: (collection: string, id: string) => SourceEntry | undefined,
): ResolvedLink[] {
  if (!links) return [];
  return links.map((l) => {
    const target = lookup(CATEGORY_COLLECTION[l.category], l.targetId);
    return {
      category: l.category,
      label: CATEGORY_LABEL[l.category],
      citation: l.citation,
      reason: l.reason,
      targetId: l.targetId,
      found: Boolean(target),
      target,
    };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- links`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/links.ts src/lib/links.test.ts
git commit -m "feat: add link resolution helper"
```

---

## Task 5: Build-time cross-reference integrity check

**Files:**
- Create: `src/lib/validate.ts`
- Test: `src/lib/validate.test.ts`

**Interfaces:**
- Consumes: `CATEGORY_COLLECTION` from `categories.ts`, `LinkInput` from `links.ts`.
- Produces:
  - `type VerseLike = { id: string; data: { links?: LinkInput[] } }`
  - `findBrokenLinks(verses, exists): {verseId:string; category:string; targetId:string}[]` — pure; `exists(collection, id) => boolean`.
  - `assertLinksResolve(verses, exists): void` — throws `Error` listing every broken link if any exist. Called from a page/build context in Task 6 so the build fails loudly on a bad reference.

- [ ] **Step 1: Write the failing test**

Create `src/lib/validate.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { findBrokenLinks, assertLinksResolve } from './validate';

const verses = [
  { id: 'v1', data: { links: [{ category: 'valmiki', targetId: 'ok', citation: 'c', reason: 'r' }] } },
  { id: 'v2', data: { links: [{ category: 'desikan', targetId: 'nope', citation: 'c', reason: 'r' }] } },
];
const exists = (collection: string, id: string) => collection === 'valmiki' && id === 'ok';

describe('cross-reference integrity', () => {
  it('lists only the broken links', () => {
    const broken = findBrokenLinks(verses as any, exists);
    expect(broken).toEqual([{ verseId: 'v2', category: 'desikan', targetId: 'nope' }]);
  });

  it('throws with the broken reference in the message', () => {
    expect(() => assertLinksResolve(verses as any, exists)).toThrow(/v2.*desikan.*nope/s);
  });

  it('does not throw when everything resolves', () => {
    expect(() => assertLinksResolve([verses[0]] as any, exists)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- validate`
Expected: FAIL — cannot find module `./validate`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/validate.ts`:
```ts
import { CATEGORY_COLLECTION, type Category } from './categories';
import type { LinkInput } from './links';

export type VerseLike = { id: string; data: { links?: LinkInput[] } };

export function findBrokenLinks(
  verses: VerseLike[],
  exists: (collection: string, id: string) => boolean,
): { verseId: string; category: string; targetId: string }[] {
  const broken: { verseId: string; category: string; targetId: string }[] = [];
  for (const v of verses) {
    for (const l of v.data.links ?? []) {
      const collection = CATEGORY_COLLECTION[l.category as Category];
      if (!exists(collection, l.targetId)) {
        broken.push({ verseId: v.id, category: l.category, targetId: l.targetId });
      }
    }
  }
  return broken;
}

export function assertLinksResolve(
  verses: VerseLike[],
  exists: (collection: string, id: string) => boolean,
): void {
  const broken = findBrokenLinks(verses, exists);
  if (broken.length > 0) {
    const lines = broken.map((b) => `  - verse "${b.verseId}" -> ${b.category}:${b.targetId}`);
    throw new Error(`Broken cross-references (build aborted):\n${lines.join('\n')}`);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- validate`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/validate.ts src/lib/validate.test.ts
git commit -m "feat: add build-time cross-reference integrity check"
```

---

## Task 6: Base layout, shared components, verse pages, and source pages

This task delivers the rendering layer plus the two dynamic page types. It ends with the integrity check wired into the build.

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/DraftBanner.astro`, `src/components/MediaEmbed.astro`, `src/components/SceneImage.astro`, `src/components/CrossRefCard.astro`, `src/components/VerseLayers.astro`
- Create: `src/pages/verse/[...id].astro`, `src/pages/source/[...id].astro`
- Create: `src/styles/global.css` (replace placeholder)

**Interfaces:**
- Consumes: collections from Task 3; `resolveLinks` (Task 4); `assertLinksResolve` (Task 5); `CATEGORY_LABEL` (Task 2).
- Produces: `/verse/<id>` for every verse; `/source/<id>` for every source record; both reachable by later tasks' links.

- [ ] **Step 1: Global styles**

Replace `src/styles/global.css`:
```css
:root { --maxw: 44rem; --accent: #7a1f1f; --muted: #666; --bg: #fffaf3; --fg: #1a1a1a; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Georgia, 'Noto Serif', serif; color: var(--fg); background: var(--bg); line-height: 1.6; }
main { max-width: var(--maxw); margin: 0 auto; padding: 1.5rem; }
a { color: var(--accent); }
header nav, footer { max-width: var(--maxw); margin: 0 auto; padding: 1rem 1.5rem; }
header nav a { margin-right: 1rem; }
.tamil { font-size: 1.4rem; line-height: 1.9; }
.translit { color: var(--muted); font-style: italic; }
.layer { margin: 1.5rem 0; }
.layer h2 { border-bottom: 1px solid #e5d8c5; padding-bottom: .25rem; }
.crossref { border: 1px solid #e5d8c5; border-radius: 8px; padding: .75rem 1rem; margin: .5rem 0; }
.crossref .cat { font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; color: var(--accent); }
.crossref .reason { color: var(--muted); }
.draft-banner { background: #fde68a; border: 1px solid #d4a72c; padding: .5rem .75rem; border-radius: 6px; margin-bottom: 1rem; }
figure { margin: 1rem 0; } figure img { width: 100%; height: auto; border-radius: 8px; }
figcaption { color: var(--muted); font-size: .9rem; text-align: center; }
```

- [ ] **Step 2: BaseLayout with Pagefind search UI**

Create `src/layouts/BaseLayout.astro`:
```astro
---
import '../styles/global.css';
interface Props { title: string; description?: string; }
const { title, description = 'A cross-referenced study of Kamba Ramayanam.' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} · Kamba Ramayanam</title>
    <meta name="description" content={description} />
    <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
    <script is:inline src="/pagefind/pagefind-ui.js"></script>
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/browse">Browse</a>
        <a href="/about">About</a>
      </nav>
    </header>
    <main data-pagefind-body>
      <slot />
    </main>
    <footer>
      <div id="search"></div>
      <p><small>kambaramayanam.org · content is AI-assisted and human-verified.</small></p>
    </footer>
    <script is:inline>
      window.addEventListener('DOMContentLoaded', () => {
        if (window.PagefindUI) new window.PagefindUI({ element: '#search', showsubResults: true });
      });
    </script>
  </body>
</html>
```

- [ ] **Step 3: DraftBanner, MediaEmbed, SceneImage components**

Create `src/components/DraftBanner.astro`:
```astro
---
interface Props { status: string; }
const { status } = Astro.props;
---
{status !== 'published' && (
  <div class="draft-banner">⚠️ This entry is a <strong>{status}</strong> — not yet finalized for authority.</div>
)}
```

Create `src/components/MediaEmbed.astro`:
```astro
---
interface Props { type: 'youtube' | 'spotify' | 'audio'; url: string; label: string; }
const { type, url, label } = Astro.props;
function ytId(u: string) { const m = u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/); return m?.[1]; }
---
<figure>
  {type === 'youtube' && ytId(url) && (
    <iframe width="100%" height="315" loading="lazy" title={label}
      src={`https://www.youtube-nocookie.com/embed/${ytId(url)}`}
      frameborder="0" allowfullscreen></iframe>
  )}
  {type === 'spotify' && (
    <iframe style="border-radius:12px" src={url.replace('open.spotify.com/', 'open.spotify.com/embed/')}
      width="100%" height="152" loading="lazy" frameborder="0" title={label}></iframe>
  )}
  {type === 'audio' && (<audio controls preload="none" src={url}></audio>)}
  <figcaption>{label}</figcaption>
</figure>
```

Create `src/components/SceneImage.astro`:
```astro
---
import { Image } from 'astro:assets';
interface Props { src: ImageMetadata; alt: string; caption?: string; }
const { src, alt, caption } = Astro.props;
---
<figure>
  <Image src={src} alt={alt} widths={[400, 800, 1200]} sizes="(max-width: 800px) 100vw, 800px" />
  {caption && <figcaption>{caption}</figcaption>}
</figure>
```

- [ ] **Step 4: CrossRefCard and VerseLayers**

Create `src/components/CrossRefCard.astro`:
```astro
---
import type { ResolvedLink } from '../lib/links';
interface Props { link: ResolvedLink; }
const { link } = Astro.props;
const href = link.found ? `/source/${link.targetId}` : undefined;
---
<div class="crossref">
  <div class="cat">{link.label}</div>
  <div class="citation">
    {href ? <a href={href}>{link.citation}</a> : <span>{link.citation}</span>}
  </div>
  <div class="reason">{link.reason}</div>
</div>
```

Create `src/components/VerseLayers.astro`:
```astro
---
import type { ResolvedLink } from '../lib/links';
import CrossRefCard from './CrossRefCard.astro';
import MediaEmbed from './MediaEmbed.astro';
import { CATEGORY_LABEL, CATEGORIES } from '../lib/categories';
interface Props { data: any; resolvedLinks: ResolvedLink[]; }
const { data, resolvedLinks } = Astro.props;
const byCategory = CATEGORIES
  .map((c) => ({ c, label: CATEGORY_LABEL[c], links: resolvedLinks.filter((l) => l.category === c) }))
  .filter((g) => g.links.length > 0);
const kc = data.kambanContribution;
const ins = data.insights;
---
<section class="layer">
  <p class="tamil">{data.tamil}</p>
  <p class="translit">{data.transliteration}</p>
  <p class="translation">{data.translationEnglish}</p>
</section>

{data.wordByWord && (
  <section class="layer">
    <h2>Word by word</h2>
    <dl>{data.wordByWord.map((w: any) => (<><dt>{w.word}</dt><dd>{w.meaning}</dd></>))}</dl>
  </section>
)}

{data.literaryAnalysis && (
  <section class="layer"><h2>Literary analysis</h2><p>{data.literaryAnalysis}</p></section>
)}

{kc && (kc.expands || kc.changes || kc.poeticDevices) && (
  <section class="layer">
    <h2>Kamban's contribution</h2>
    {kc.expands && <p><strong>Expands:</strong> {kc.expands}</p>}
    {kc.changes && <p><strong>Changes:</strong> {kc.changes}</p>}
    {kc.poeticDevices && <p><strong>Poetic devices:</strong> {kc.poeticDevices}</p>}
  </section>
)}

{byCategory.length > 0 && (
  <section class="layer">
    <h2>Cross-references</h2>
    {byCategory.map((g) => (
      <div>{g.links.map((l) => (<CrossRefCard link={l} />))}</div>
    ))}
  </section>
)}

{ins && (ins.theological || ins.literary || ins.philosophical) && (
  <section class="layer">
    <h2>Insights</h2>
    {ins.theological && <p><strong>Theological:</strong> {ins.theological}</p>}
    {ins.literary && <p><strong>Literary:</strong> {ins.literary}</p>}
    {ins.philosophical && <p><strong>Philosophical:</strong> {ins.philosophical}</p>}
  </section>
)}

{data.media && (
  <section class="layer">
    <h2>Recitation & media</h2>
    {data.media.map((m: any) => (<MediaEmbed type={m.type} url={m.url} label={m.label} />))}
  </section>
)}
```

- [ ] **Step 5: Verse page with integrity check wired in**

Create `src/pages/verse/[...id].astro`:
```astro
---
import { getCollection, getEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import DraftBanner from '../../components/DraftBanner.astro';
import VerseLayers from '../../components/VerseLayers.astro';
import SceneImage from '../../components/SceneImage.astro';
import { resolveLinks, type SourceEntry } from '../../lib/links';
import { assertLinksResolve } from '../../lib/validate';
import { CATEGORY_COLLECTION } from '../../lib/categories';

export async function getStaticPaths() {
  const verses = await getCollection('verses');

  // Build-time integrity check: every link target must exist.
  const cache: Record<string, Set<string>> = {};
  async function loadIds(collection: string) {
    if (!cache[collection]) {
      const entries = await getCollection(collection as any);
      cache[collection] = new Set(entries.map((e: any) => e.id));
    }
    return cache[collection];
  }
  for (const c of Object.values(CATEGORY_COLLECTION)) await loadIds(c);
  assertLinksResolve(
    verses.map((v) => ({ id: v.id, data: { links: v.data.links } })),
    (collection, id) => cache[collection]?.has(id) ?? false,
  );

  return verses.map((v) => ({ params: { id: v.id }, props: { verse: v } }));
}

const { verse } = Astro.props;
const { Content } = await verse.render();

async function lookup(collection: string, id: string): Promise<SourceEntry | undefined> {
  const entry = await getEntry(collection as any, id);
  return entry ? { id: entry.id, data: entry.data as any } : undefined;
}
// Pre-resolve link targets (async lookups gathered up front).
const rawLinks = verse.data.links ?? [];
const targets = await Promise.all(rawLinks.map((l) => lookup(CATEGORY_COLLECTION[l.category], l.targetId)));
const resolvedLinks = resolveLinks(rawLinks, (collection, id) => {
  const idx = rawLinks.findIndex((l) => CATEGORY_COLLECTION[l.category] === collection && l.targetId === id);
  return idx >= 0 ? targets[idx] : undefined;
});

let sceneImage: { src: ImageMetadata; alt: string; caption: string } | null = null;
if (verse.data.image) {
  const img = await getEntry('images', verse.data.image);
  if (img) {
    const mod = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*', { eager: true });
    const found = mod[`/src/assets/images/${img.data.file}`];
    if (found) sceneImage = { src: found.default, alt: img.data.caption, caption: img.data.caption };
  }
}
---
<BaseLayout title={`${verse.data.kandam} · verse ${verse.data.verseNumber}`}>
  <DraftBanner status={verse.data.status} />
  <p><a href="/browse">← Browse</a></p>
  <h1>{verse.data.padalam} — verse {verse.data.verseNumber}</h1>
  {sceneImage && <SceneImage src={sceneImage.src} alt={sceneImage.alt} caption={sceneImage.caption} />}
  <VerseLayers data={verse.data} resolvedLinks={resolvedLinks} />
  <div class="layer"><Content /></div>
</BaseLayout>
```

- [ ] **Step 6: Source-text page with back-links (bidirectional)**

Create `src/pages/source/[...id].astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import DraftBanner from '../../components/DraftBanner.astro';
import { CATEGORY_COLLECTION, CATEGORIES, type Category } from '../../lib/categories';

export async function getStaticPaths() {
  const sourceCollections = [...new Set(Object.values(CATEGORY_COLLECTION))];
  const verses = await getCollection('verses');
  const paths: any[] = [];
  for (const collection of sourceCollections) {
    const entries = await getCollection(collection as any);
    const category = (CATEGORIES as readonly string[]).find(
      (c) => CATEGORY_COLLECTION[c as Category] === collection,
    ) as Category;
    for (const e of entries) {
      const citing = verses.filter((v) =>
        (v.data.links ?? []).some((l) => l.category === category && l.targetId === e.id),
      );
      paths.push({
        params: { id: e.id },
        props: {
          entry: e,
          citing: citing.map((v) => ({ id: v.id, label: `${v.data.padalam} v.${v.data.verseNumber}` })),
        },
      });
    }
  }
  return paths;
}

const { entry, citing } = Astro.props;
const d = entry.data as any;
const { Content } = await entry.render();
---
<BaseLayout title={d.citation}>
  <DraftBanner status={d.status} />
  <h1>{d.citation}</h1>
  {d.transliteration && <p class="translit">{d.transliteration}</p>}
  {d.textExcerpt && <blockquote>{d.textExcerpt}</blockquote>}
  {d.translation && <p>{d.translation}</p>}
  <div class="layer"><Content /></div>
  {d.sourceUrl && <p><a href={d.sourceUrl} rel="noopener" target="_blank">Read the full text at the source ↗</a></p>}
  <p><small>License / provenance: {d.license}</small></p>
  {citing.length > 0 && (
    <section class="layer">
      <h2>Kamban verses that cite this</h2>
      <ul>{citing.map((v: any) => (<li><a href={`/verse/${v.id}`}>{v.label}</a></li>))}</ul>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 7: Verify build (no content yet — pages compile, zero routes)**

Run:
```bash
npm run check && npm run build
```
Expected: `astro check` 0 errors; build succeeds. With no content files yet, `/verse` and `/source` produce zero pages — acceptable. The integrity check runs and passes trivially.

- [ ] **Step 8: Commit**

Run:
```bash
git add src/layouts src/components src/pages/verse src/pages/source src/styles/global.css
git commit -m "feat: add layout, verse pages, source pages, and cross-ref rendering"
```

---

## Task 7: Art-direction guide and image records

**Files:**
- Create: `docs/art-direction-tanjore.md`
- Create: `src/content/images/hanuman-crossing-ocean.json` (+ 4 more image records)
- Add: placeholder image files under `src/assets/images/` (real Tanjore art generated separately; placeholders keep the build green)

**Interfaces:**
- Consumes: `images` collection schema (Task 3).
- Produces: image record `hanuman-crossing-ocean` referenced by the pilot verses (Task 9) and the landing/scene set.

- [ ] **Step 1: Write the art-direction guide**

Create `docs/art-direction-tanjore.md`:
```markdown
# Art Direction — Tanjore (Thanjavur) Painting Style

All site imagery is **original, AI-generated Tanjore-style painting**. Never copy
third-party artwork or reproduce copyrighted photographs (including photos of modern
acharyas — render a painted portrait honoring traditional likeness instead).

## Visual signature (include in every prompt)
- Rich, saturated jewel-tone colors (deep red, emerald, ultramarine, ochre)
- Gold-leaf / gilded ornamentation and halos (gesso-relief look)
- Ornate arched border / temple-gopuram framing
- Rounded, serene, almond-eyed divine figures; frontal, iconic poses
- Flat decorative background; minimal perspective; devotional composition

## Prompt template
> "Traditional Tanjore (Thanjavur) style devotional painting of {SCENE}, rich jewel-tone
> colors, gold-leaf gilded ornamentation and halo, ornate arched temple border, serene
> rounded figures, flat decorative background, classical South Indian temple art, no text."

## Review checklist (before status: published)
- [ ] Iconography correct (attributes, number of arms, vahana, posture)
- [ ] Respectful, devotional tone; not "fantasy" art
- [ ] Consistent palette/border with the rest of the set
- [ ] License of the generating tool permits public display — record it

## Launch image set
Landing: Sri Rama Pattabhishekam (centerpiece); painted portraits of Ramanuja, Swami
Desikan, Brahmatantra Parakala Swamy, Uttamur Veeraraghavachariar Swamy.
Sundara Kandam scenes: (1) Hanuman crossing the ocean, (2) meeting Sita & choodamani,
(3) in Ravana's court, (4) burning Lanka, (5) embracing Rama.
```

- [ ] **Step 2: Add a placeholder image file**

Run (creates a tiny valid PNG so Astro's image pipeline has a real file to optimize):
```bash
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xcf\xc0\x00\x00\x00\x03\x00\x01\xff\xff\xff\xff\x00\x00\x00\x00IEND\xaeB`\x82' > src/assets/images/hanuman-crossing-ocean.png
```
Note: replace with the real generated Tanjore artwork before publishing; keep the same filename.

- [ ] **Step 3: Add the image metadata record**

Create `src/content/images/hanuman-crossing-ocean.json`:
```json
{
  "caption": "Hanuman leaps across the ocean to Lanka",
  "scene": "Hanuman crossing the ocean",
  "tool": "PLACEHOLDER — record the actual generator (e.g. DALL·E 3) when the real image is added",
  "prompt": "Traditional Tanjore style devotional painting of Hanuman leaping across the ocean, rich jewel-tone colors, gold-leaf gilded ornamentation and halo, ornate arched temple border, serene rounded figure, flat decorative background, classical South Indian temple art, no text.",
  "license": "PLACEHOLDER — record tool license permitting public display",
  "status": "draft",
  "file": "hanuman-crossing-ocean.png"
}
```

- [ ] **Step 4: Verify build**

Run:
```bash
npm run check && npm run build
```
Expected: passes; the image data record validates against the schema.

- [ ] **Step 5: Commit**

Run:
```bash
git add docs/art-direction-tanjore.md src/content/images src/assets/images
git commit -m "docs: add Tanjore art-direction guide and first image record"
```

---

## Task 8: Landing page, browse page, and About page

**Files:**
- Create/replace: `src/pages/index.astro`
- Create: `src/pages/browse/index.astro`, `src/pages/about.astro`

**Interfaces:**
- Consumes: `verses` collection (Task 3), `BaseLayout` (Task 6).
- Produces: `/`, `/browse`, `/about` — the site's fixed pages.

- [ ] **Step 1: Landing page**

Replace `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
// Landing acharya/hero images are added to src/content/images + src/assets/images as they
// are generated (Pattabhishekam + 4 acharyas). Until then this renders the intro + entry point.
---
<BaseLayout title="Home">
  <h1>Kamba Ramayanam</h1>
  <p>
    A cross-referenced study of Kamban's Tamil Ramayanam — each verse connected to the
    Valmiki Ramayana, Swami Desikan, the Divya Prabandham, the Bhagavad Gita, the
    Upanishads, and more, read through the Vishishtadvaita tradition.
  </p>
  <p><a href="/browse">Begin with the opening of Sundara Kandam →</a></p>
  <p><a href="/about">About this project & method →</a></p>
</BaseLayout>
```

- [ ] **Step 2: Browse page (kandam → padalam → verse)**

Create `src/pages/browse/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
const verses = await getCollection('verses');
const byKandam = new Map<string, Map<string, typeof verses>>();
for (const v of verses) {
  const k = v.data.kandam, p = v.data.padalam;
  if (!byKandam.has(k)) byKandam.set(k, new Map());
  const pad = byKandam.get(k)!;
  if (!pad.has(p)) pad.set(p, [] as any);
  pad.get(p)!.push(v);
}
for (const pad of byKandam.values())
  for (const list of pad.values()) list.sort((a, b) => a.data.verseNumber - b.data.verseNumber);
---
<BaseLayout title="Browse">
  <h1>Browse verses</h1>
  {byKandam.size === 0 && <p>No verses yet.</p>}
  {[...byKandam.entries()].map(([k, pad]) => (
    <section class="layer">
      <h2>{k}</h2>
      {[...pad.entries()].map(([p, list]) => (
        <div>
          <h3>{p}</h3>
          <ul>{list.map((v) => (
            <li><a href={`/verse/${v.id}`}>Verse {v.data.verseNumber}</a>
              {v.data.status !== 'published' && <em> ({v.data.status})</em>}</li>
          ))}</ul>
        </div>
      ))}
    </section>
  ))}
</BaseLayout>
```

- [ ] **Step 3: About / methodology page**

Create `src/pages/about.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="About">
  <h1>About this project</h1>
  <h2>What this is</h2>
  <p>A study repository connecting Kamban's Ramayanam to the wider Sri Vaishnava and
     Sanskrit tradition, read through the Vishishtadvaita lens.</p>
  <h2>Sources & copyright</h2>
  <p>We cite and deep-link to authoritative sources (e.g. valmikiramayan.net,
     holy-bhagavad-gita.org) and quote only short excerpts for comparison. Full texts
     remain with their sources.</p>
  <h2>How content is verified</h2>
  <p>Content is AI-assisted and then human-verified. Every entry carries a status —
     <strong>draft</strong>, <strong>verified</strong>, or <strong>published</strong>.
     Anything not yet published is visibly marked, so nothing unverified is presented
     as authoritative.</p>
  <h2>Imagery</h2>
  <p>All images are original Tanjore-style paintings, reviewed for iconographic accuracy.</p>
</BaseLayout>
```

- [ ] **Step 4: Verify build**

Run:
```bash
npm run check && npm run build
```
Expected: passes; `/`, `/browse`, `/about` present in `dist/`.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/pages/index.astro src/pages/browse src/pages/about.astro
git commit -m "feat: add landing, browse, and about pages"
```

---

## Task 9: Pilot content — 5 pasurams + linked source records

This task proves the whole format. It adds real (author-provided, marked `draft` until you verify) content: 5 opening Sundara Kandam verses and the source records they link to.

**Files:**
- Create: `src/content/works/valmiki-ramayana.json`, `src/content/works/raghuveera-gadyam.json`
- Create: `src/content/valmiki/valmiki-sundara-1-1.md`, `src/content/desikan/raghuveera-gadyam-hanuman.md`
- Create: `src/content/verses/sundara-1-001.md` … `sundara-1-005.md`

**Interfaces:**
- Consumes: all schemas (Task 3), pages (Tasks 6, 8).
- Produces: the live pilot — verses reachable at `/verse/sundara-1-001` … `-005`, with resolving cross-references.

- [ ] **Step 1: Add `works` parent records**

Create `src/content/works/valmiki-ramayana.json`:
```json
{ "title": "Valmiki Ramayana", "author": "Valmiki", "tradition": "Sanskrit epic",
  "description": "The original Sanskrit Ramayana." }
```
Create `src/content/works/raghuveera-gadyam.json`:
```json
{ "title": "Raghuveera Gadyam", "author": "Swami Vedanta Desika", "tradition": "Sri Vaishnava stotra",
  "description": "Desikan's prose-poem in praise of Rama's valor." }
```

- [ ] **Step 2: Add the source records the pilot links to**

Create `src/content/valmiki/valmiki-sundara-1-1.md`:
```md
---
work: "valmiki-ramayana"
citation: "Valmiki Ramayana, Sundara Kandam, Sarga 1"
transliteration: "tato rāvaṇanītāyāḥ sītāyāḥ..."
translation: "Then Hanuman, intent on finding Sita whom Ravana had carried off, resolved to cross the ocean."
sourceUrl: "https://www.valmikiramayan.net/utf8/sundara/sarga1/sundara_1_frame.htm"
license: "Excerpt for comparison only; full text © valmikiramayan.net."
status: "draft"
---
Valmiki opens Sundara Kandam with Hanuman resolving to leap the ocean. Kamban's treatment is compared in the linked verses.
```

Create `src/content/desikan/raghuveera-gadyam-hanuman.md`:
```md
---
work: "raghuveera-gadyam"
citation: "Raghuveera Gadyam (on Hanuman's service)"
translation: "Salutations to the Lord served by Hanuman, whose leap across the sea proclaimed His glory."
license: "Traditional stotra; excerpt for study."
status: "draft"
---
Desikan celebrates Rama through the valor of His servants; Hanuman's ocean-leap is a recurring image of devoted service.
```

- [ ] **Step 3: Add pilot verse 1 (full-depth example)**

Create `src/content/verses/sundara-1-001.md`:
```md
---
kandam: "Sundara Kandam"
padalam: "Kadal Thாண்டு Padalam (The Ocean-Crossing)"
verseNumber: 1
tamil: "நளிர்மதிச் சடையான் ... (replace with verified Kamban Tamil text)"
transliteration: "naḷir mati... (ISO 15919; replace with verified transliteration)"
translationEnglish: "Hanuman, resolute, gazed upon the vast ocean and prepared to leap toward Lanka. (replace with verified translation)"
wordByWord:
  - { word: "நளிர்", meaning: "cool / vast (placeholder — verify)" }
  - { word: "கடல்", meaning: "ocean" }
literaryAnalysis: "Kamban frames the crossing as an inner resolve before an outer leap. (draft)"
kambanContribution:
  expands: "Kamban dwells on Hanuman's state of mind before the leap, beyond Valmiki's briefer account."
  poeticDevices: "Sea-as-obstacle metaphor; alliteration in the Tamil line."
links:
  - { category: "valmiki", targetId: "valmiki-sundara-1-1", citation: "VR Sundara 1.1", reason: "Same narrative moment — Hanuman resolves to cross the ocean." }
  - { category: "desikan", targetId: "raghuveera-gadyam-hanuman", citation: "Raghuveera Gadyam", reason: "Desikan invokes the same ocean-leap as an emblem of devoted service." }
insights:
  theological: "The leap prefigures the soul's surrender (prapatti) — effort offered to the Lord. (draft)"
  literary: "The ocean is both literal barrier and figure for samsara."
image: "hanuman-crossing-ocean"
status: "draft"
sources: ["Kamban Ramayanam, Sundara Kandam (edition TBD)"]
---
Editor's note: verify Tamil text, transliteration, and translation against a published Kamban edition before promoting to `verified`.
```

- [ ] **Step 4: Add pilot verses 2–5 (base layer, draft)**

Create `src/content/verses/sundara-1-002.md`:
```md
---
kandam: "Sundara Kandam"
padalam: "Kadal Thாண்டு Padalam (The Ocean-Crossing)"
verseNumber: 2
tamil: "(replace with verified Kamban Tamil text — verse 2)"
transliteration: "(ISO 15919 transliteration — verse 2)"
translationEnglish: "(verified English translation — verse 2)"
status: "draft"
---
```
Repeat identically for `sundara-1-003.md`, `sundara-1-004.md`, `sundara-1-005.md`, changing `verseNumber` to 3, 4, 5 and the placeholder text accordingly.

- [ ] **Step 5: Verify build, integrity check, and search index**

Run:
```bash
npm run check && npm run build
```
Expected: `astro check` 0 errors; build succeeds; the cross-reference integrity check passes (both link targets resolve); Pagefind indexes the verse pages. `dist/verse/sundara-1-001/index.html` exists.

- [ ] **Step 6: Manually verify the integrity check actually fails on a bad link**

Temporarily edit `src/content/verses/sundara-1-001.md`, change one `targetId` to `does-not-exist`, then run:
```bash
npm run build
```
Expected: build **fails** with `Broken cross-references (build aborted)` naming `sundara-1-001`. Then revert the change and rebuild to confirm it passes again. (This proves the safety net works.)

- [ ] **Step 7: Commit**

Run:
```bash
git add src/content/works src/content/valmiki src/content/desikan src/content/verses
git commit -m "feat: add pilot content — 5 Sundara Kandam opening pasurams with cross-refs"
```

---

## Task 10: Local preview verification and Cloudflare Pages deploy config

**Files:**
- Create: `README.md` (build/deploy instructions)
- Create: `docs/deploy-cloudflare.md`

**Interfaces:**
- Consumes: the full build from prior tasks.
- Produces: documented, reproducible deploy to Cloudflare Pages at `kambaramayanam.org`.

- [ ] **Step 1: Preview the built site locally and eyeball it**

Run:
```bash
npm run build && npm run preview
```
Then open the printed local URL and confirm: landing page loads; `/browse` lists the 5 verses; `/verse/sundara-1-001` shows Tamil + translation + cross-reference cards + draft banner + image; clicking a cross-reference opens `/source/...` which lists the citing verse (bidirectional link works); the footer search box returns the verse when searching an English word from the translation. Stop the preview server (Ctrl-C) when done.

- [ ] **Step 2: Write the README**

Create `README.md`:
```markdown
# Kamba Ramayanam Knowledge Repository

Static Astro site cross-referencing Kamban's Ramayanam to Valmiki, Swami Desikan, the
Divya Prabandham, and more, through the Vishishtadvaita tradition. Deployed on Cloudflare
Pages at https://kambaramayanam.org.

## Develop
```
npm install
npm run dev        # local dev server
npm run check      # type + content schema check
npm test           # unit tests (vitest)
npm run build      # static build + pagefind search index -> dist/
npm run preview    # serve the production build locally
```

## Content
Content lives in `src/content/`. Each Kamban verse is one file in `verses/`; it links by
id to shared source records (`valmiki/`, `desikan/`, …). The build fails if any
cross-reference target is missing. Nothing is authoritative until `status: published`.
See `docs/art-direction-tanjore.md` for image style and `docs/deploy-cloudflare.md` to deploy.
```

- [ ] **Step 2b: Verify README build commands block is accurate**

Run each command listed in the README once more to confirm it works as written:
```bash
npm run check && npm test && npm run build
```
Expected: all pass.

- [ ] **Step 3: Write the deploy guide**

Create `docs/deploy-cloudflare.md`:
```markdown
# Deploy to Cloudflare Pages

## One-time setup
1. Push this repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → select the repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: set env var `NODE_VERSION` = `20` (or higher).
4. Deploy. Every push to the main branch redeploys automatically.

## Custom domain (kambaramayanam.org)
1. Register the domain (Cloudflare Registrar recommended, ~$10/yr).
2. Pages project → Custom domains → add `kambaramayanam.org` and `www`.
3. Cloudflare auto-creates the DNS + TLS. Done.

## Media & large images
- Video/audio: embed via YouTube/Spotify (already supported in verse `media`).
- Large own-hosted audio/images later: put in a Cloudflare R2 bucket and reference by URL.
```

- [ ] **Step 4: Commit**

Run:
```bash
git add README.md docs/deploy-cloudflare.md
git commit -m "docs: add README and Cloudflare Pages deploy guide"
```

---

## Self-Review Notes (verified against the spec)

- **Astro + Cloudflare Pages static** → Tasks 1, 10. ✓
- **Progressive-enrichment verse model + review status** → Task 3 schema (all layers optional, `status` required); Task 6 renders only present layers; DraftBanner enforces "not authoritative unless published." ✓
- **9 cross-reference categories, shared linked records, bidirectional, build-time validated** → Task 2 (registry), Task 3 (schemas), Task 4 (resolve), Task 5 (integrity), Task 6 (verse + source pages with back-links). ✓
- **Copyright: cite + deep-link, excerpts only, license note** → Task 3 source schema (`textExcerpt`, `sourceUrl`, `license` required); Task 9 records model it; About page states it. ✓
- **Four page types** (verse, browse/nav, source, about) → Tasks 6, 8. ✓
- **Tri-script search** → Pagefind in Task 1/6 (indexes Tamil + transliteration + English in `data-pagefind-body`). ✓
- **Tanjore imagery, reviewed assets, style guide, landing Pattabhishekam + 4 acharyas + 5 scenes** → Task 7 (guide + records + review status), Task 8 (landing entry point). Note: only the crossing-ocean image record is created in the pilot; the guide lists the full set to add as art is generated. ✓
- **Media embeds (YouTube/Spotify/audio)** → Task 6 MediaEmbed. ✓
- **Domain kambaramayanam.org** → Tasks 1 (site), 10 (deploy). ✓
- **Pilot: 5 opening Sundara Kandam pasurams, full depth** → Task 9. ✓
- **Transliteration = ISO 15919 (authoring convention, string field)** → Global Constraints + Task 3. ✓
```
