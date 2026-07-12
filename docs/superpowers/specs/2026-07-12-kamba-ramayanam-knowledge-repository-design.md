# Kamba Ramayanam Knowledge Repository — Design

**Date:** 2026-07-12
**Status:** Draft for review

---

## 1. Vision

A publicly hosted, scholarly knowledge repository for **Kamba Ramayanam** that connects
each Kamban verse (pasuram) to the wider Sri Vaishnava and Sanskrit tradition, viewed
through a **Vishishtadvaita** lens. Each verse becomes a rich study experience rather
than a bare translation, linking to:

- **Valmiki Ramayana** — exact sarga/sloka, literal comparison, what Kamban adds or omits
- **Swami Desikan** — Raghuveera Gadyam, Dasavatara Stotram, Abheethi Stavam, and other works
- **Divya Prabandham** — Nammalvar, Periyalvar, Andal, Kulasekhara Alvar
- **Bhagavad Gita** — chapter/verse references
- **Upanishads** — selective
- **Vishnu Purana / Bhagavatam** — selective
- **Annamacharya kirtanas** — selected lines
- **Thyagaraja kirtanas** — selected lines
- **Traditional commentaries**

**Audience:** religious practitioners, students, and anyone interested in Tamil literature
and Kamban's work.

---

## 2. Guiding Principles

1. **Progressive enrichment.** A verse can exist with only a base layer (Tamil +
   transliteration + translation) and grow richer over time. Adding deeper layers never
   requires restructuring existing content.
2. **Review status is first-class.** Content is AI-assisted but human-verified. Every
   verse and asset carries a status (`draft → verified → published`). Nothing unverified
   is ever presented as authoritative. This is essential for scripture.
3. **Cross-references are the heart.** The value is in the *connections* between texts,
   each carrying a short reason-for-connection (the "samayam" comparison), not a link dump.
4. **Cheap, fast, scalable.** Static site, no server database, effectively infinite scale
   at near-zero cost. Fast even on poor connections (global devotee/student audience).
5. **Respect copyright.** Cite and deep-link to copyrighted sources; quote only short
   fair-use excerpts for comparison. Do not mirror copyrighted text wholesale.
6. **Cultural authenticity.** Imagery and interpretation must be traditionally sound.
   AI-generated assets are reviewed, not auto-published.

---

## 2a. Domain

**Canonical domain: `kambaramayanam.org`** (confirmed available via registry RDAP on
2026-07-12). Rationale: `.org` fits a non-commercial scholarly/devotional repository and
signals trust; no hyphen, matching the most common spelling and easiest to type/search.

- Register via **Cloudflare Registrar** (at-cost, ~$10/yr, pairs directly with Cloudflare
  Pages hosting — pointing the domain at the site is a short DNS step).
- Optionally also register `kambaramayanam.com` as a defensive redirect to the `.org`.

---

## 3. Technology Stack

| Concern            | Choice                          | Why |
|--------------------|---------------------------------|-----|
| Site generator     | **Astro** (static output)       | Purpose-built for content-heavy, cross-linked, multilingual sites. Typed content collections validate cross-references at build time. Ships ~zero JS → fast pages. Strong i18n for Tamil + transliteration. |
| Hosting            | **Cloudflare Pages** (free tier)| Free, global CDN, scales to any traffic, one-command deploy. |
| Large media/images | **Cloudflare R2** (later)       | Own audio/large images if/when repo storage is insufficient. |
| Video / audio      | **YouTube / Spotify embeds**    | No media hosted directly; embedded lazily. |
| Search             | **Client-side index** (e.g. Pagefind/Fuse) | Works on static sites, no server. Tri-script search. |
| Editing (Phase 1)  | Raw files in git                | Owner is technical; simplest start. |
| Editing (Phase 2)  | **Git-based CMS** (Decap/Tina)  | Web-form UI for non-technical scholar collaborators. Commits to the same repo — **no data migration** because the schema is designed for it now. |

**Rejected alternatives:** Hugo (Go templating awkward for the relational cross-reference
graph); Docusaurus (opinionated docs layout, React-heavy output); database-backed CMS like
WordPress/Strapi (hosting cost, maintenance/security burden, doesn't scale as cheaply).

---

## 4. Content Model

### 4.1 Core principle: verses link to shared source-text records

Cross-referenced texts (Valmiki slokas, Desikan works, pasurams, Gita verses, kirtanas)
are stored **once** as their own files. A Kamban verse *links* to them by stable ID. One
Valmiki sloka referenced by ten Kamban verses is stored a single time. Astro validates at
build time that every link resolves — **no broken references** ship.

### 4.2 Collections (each a folder of structured files)

- `verses/` — Kamban verses
- `valmiki/` — Valmiki Ramayana slokas
- `desikan/` — Swami Desikan works/passages
- `prabandham/` — Divya Prabandham pasurams
- `gita/` — Bhagavad Gita verses
- `upanishads/` — selective passages
- `purana/` — Vishnu Purana / Bhagavatam passages
- `annamacharya/` — kirtana lines
- `thyagaraja/` — kirtana lines
- `commentaries/` — traditional commentary passages
- `images/` — scene image assets + metadata
- `works/` — parent records for source works (e.g. "Raghuveera Gadyam") to power
  source-text pages

### 4.3 Kamban verse record (schema)

**Identity**
- `id` — stable unique ID (e.g. `sundara-1-001`)
- `kandam` — e.g. `sundara`
- `padalam` — Kamban section name/number
- `verseNumber`

**Base layer** (Sundara Kandam launches with this)
- `tamil` — original Tamil text
- `transliteration`
- `translationEnglish` — fluent English translation

**Enrichment layers** (each independently optional, added over time)
- `wordByWord[]` — { word, meaning }
- `literaryAnalysis` — prose
- `kambanContribution` — { expands, changes, poeticDevices }

**Cross-reference links** (arrays; each link is a small record)
- `links[]` — { category, targetId, citation, reason }
  - `category` ∈ {valmiki, desikan, prabandham, gita, upanishad, purana, annamacharya, thyagaraja, commentary}
  - `targetId` — points to a record in the matching collection
  - `citation` — human-readable reference
  - `reason` — short note: *why* this connection illuminates the verse

**Insights**
- `insights` — { theological, literary, philosophical }

**Media** (optional)
- `media[]` — { type: youtube|spotify|audio, url, label }

**Review metadata**
- `status` — draft | verified | published
- `verifiedBy`, `verifiedOn`
- `sources[]` — provenance list

Rendering rule: **layers that are empty simply do not render.** No empty scaffolding.

### 4.4 Source-text record (shared shape across source collections)

- `id`, `work` (link to `works/` parent), `citation`
- `textOriginal` (short excerpt only if copyrighted), `transliteration`, `translation`
- `sourceUrl` — deep-link to authoritative source
- `license` — note on copyright status
- `status` — review status

---

## 5. Sources & Copyright

| Source | Use |
|--------|-----|
| **valmikiramayan.net** (Sundara Kandam) | Cite + deep-link per sarga/sloka. Short fair-use excerpts only for comparison. **Copyrighted — do not mirror.** |
| **holy-bhagavad-gita.org** | Cite + deep-link per chapter/verse. Short fair-use excerpts only. **Copyrighted — do not mirror.** |
| Kamban Tamil e-texts (e.g. Project Madurai) | Verify public-domain status per text before ingesting full text. |
| Desikan stotras, Divya Prabandham | Prefer public-domain/traditional editions; cite editions used. |
| Annamacharya / Thyagaraja kirtanas | Selected lines; verify public-domain status; cite. |

Every source-text record stores a `license`/provenance note. When in doubt, link out
rather than reproduce.

---

## 6. Page Types

1. **Verse page (core experience).** Renders whatever layers exist: Tamil →
   transliteration → translation → word-by-word → literary analysis → Kamban's
   contribution → grouped cross-reference cards (each with citation + reason + deep-link)
   → Insights → optional media embeds → optional scene image.
2. **Navigation/index pages.** Browse Kandam → Padalam → Verse. Sundara Kandam is the
   launch content; structure accommodates all six kandams.
3. **Source-text pages.** One per referenced work (e.g. Raghuveera Gadyam), listing every
   Kamban verse that cites it — **bidirectional linking**. A reader exploring Desikan can
   jump into every Kamban verse it illuminates.
4. **About / methodology page.** Explains the Vishishtadvaita lens, the sources, the
   review process, and the verified-vs-draft distinction. Builds trust with religious
   readers and scholars.

**Search:** client-side, tri-script (Tamil / transliteration / English).

---

## 7. Images & Media

### 7.1 Launch image set (Sundara Kandam scenes, Tanjore-painting style)

1. Hanuman crossing the ocean (the leap / sea crossing)
2. Hanuman meeting Sita & receiving the choodamani (Ashoka vana)
3. Hanuman in Ravana's court (diplomacy / confrontation)
4. Hanuman burning Lanka (tail-fire)
5. Hanuman embracing Rama (return with the message)

Each is a header/scene image attached to its relevant padalam(s).

### 7.1a Landing-page image set (Tanjore-painting style)

The landing/index page carries a devotional anchor set, all in the Tanjore house style:

1. **Sri Rama Pattabhishekam** (the coronation) — the hero/centerpiece image.
2. **Four acharyas**, as painted portraits honoring traditional likeness:
   - Sri Ramanuja
   - Swami Desikan
   - Brahmatantra Parakala Swamy
   - Sri Uttamur Veeraraghavachariar Swamy

**Copyright note:** These are rendered as **original Tanjore-style paintings**, not copies
of existing artwork or photographs. In particular, do **not** reproduce third-party images
(e.g. Google-cached thumbnails) or photo-realistic copies of specific copyrighted
photographs of modern acharyas. A painted portrait in the house style honoring the
traditional likeness is the correct, copyright-clean approach and keeps the landing page
visually consistent with the rest of the site.

### 7.2 Approach

- **AI-generated** to avoid third-party copyright. Use a tool whose license clearly
  permits public/commercial display; record that in each image's metadata.
- **Reviewed asset.** Same `draft → verified → published` flow as text. AI models often
  render Hindu iconography subtly wrong (attributes, arms, generic aesthetic) — every
  image is reviewed for cultural authenticity before publishing.
- **House style: traditional Tanjore (Thanjavur) painting.** All scene images are
  generated and reviewed to look like classical Tanjore artwork — rich, saturated colors;
  gold-leaf / gilded ornamentation; ornate arched borders; rounded, serene divine figures;
  flat decorative backgrounds. A shared art-direction style guide in the repo codifies the
  prompt language and reference cues so imagery is coherent and authentic across
  contributors.
- **Metadata per image:** caption, scene depicted, tool + generation prompt used, license,
  review status. Recording the prompt keeps things transparent and reproducible.

### 7.3 Delivery

- Served via Astro's built-in image optimization (resizing, WebP/AVIF, lazy loading).
- Stored in-repo initially; move to Cloudflare R2 if assets grow large.
- Video/audio: YouTube/Spotify embeds, lazy-loaded; own audio on R2 later.

---

## 8. Launch Scope & Roadmap

**Milestone 1 — Pilot: one padalam, five pasurams, full depth.**
**Pilot passage: the opening of Sundara Kandam** (the first ~5 pasurams — Hanuman
preparing to leap / the ocean crossing begins; pairs with the "Hanuman crossing the ocean"
Tanjore image). Build these **5 pasurams with every layer complete** —
base layer, word-by-word, literary analysis, Kamban's contribution, cross-reference links
(across the relevant categories), Insights, and at least one Tanjore-style scene image.
Ship the full site skeleton around it: verse pages, navigation, source-text pages, search,
About page, and the landing page (Pattabhishekam + four acharyas). The goal is to
**validate the entire format, schema, linking model, and review flow end-to-end** on a
real slice before scaling. Expect to tweak the structure based on what this reveals.

**Milestone 1b — Rinse and repeat.**
Once the pilot's structure is settled, extend the same pattern padalam by padalam across
Sundara Kandam. Add the remaining scene images as their padalams are built.

**Milestone 2 — Enrichment & breadth of layers.**
Broaden cross-reference coverage (Valmiki + Desikan first, then Prabandham, Gita,
Upanishads, Purana, kirtanas, commentaries) across completed verses. Prioritize famous
passages.

**Milestone 3 — Collaboration.**
Add a git-based CMS (Decap/Tina) for non-technical scholar collaborators. No data
migration — the schema is CMS-ready from day one.

**Milestone 4 — Breadth.**
Extend to other kandams reusing the same structure; broaden cross-reference categories
(Prabandham, Gita, Upanishads, Purana, kirtanas, commentaries).

---

## 9. Does anything like this exist?

Known adjacent resources (to confirm during build, and to differentiate from):

- **valmikiramayan.net** — Valmiki text + word meanings, but Valmiki only, not Kamban, no
  cross-tradition linking.
- **Project Madurai / tamilvu / other Tamil e-text archives** — raw Kamban Tamil text,
  little/no translation or cross-referencing.
- **holy-bhagavad-gita.org** — Gita only.
- General Sri Vaishnava sites (e.g. divyaprabandham resources, Desikan stotra sites) —
  single-corpus, not cross-linked to Kamban.

**Gap this project fills:** no existing resource cross-links *Kamban's* verses to Valmiki,
Desikan, Divya Prabandham, Gita/Upanishads, and kirtanas through a Vishishtadvaita
interpretive lens with a bidirectional, verified, study-oriented structure. That is the
differentiator.

*(This section should be verified with fresh research during Milestone 1.)*

---

## 10. Open Questions / To Confirm During Build

- Exact public-domain status of chosen Kamban Tamil e-text edition.
- Which AI image tool's license best fits public display.
- Transliteration scheme (IAST vs. a Tamil-specific romanization) — pick one and apply
  consistently.
- Client-side search library choice (Pagefind vs. Fuse.js) — decide in implementation plan.
