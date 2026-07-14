# Open items — pending user confirmation / sources

Things deliberately left provisional, to revisit when sources/permissions arrive.

## Content accuracy (awaiting verification)
- **Kambar legends order** (`src/pages/kambar.astro`): currently Dikshitars → Nammalvar →
  Narasimha. This is a traditional account whose sequence varies; confirm against a reliable
  source and switch if needed (easy reorder of the three `<section>` blocks).
- **Kambar-legend images tilaka** (`src/content/images/kambar-*.json`, status: draft):
  regenerate so Chidambaram Dikshitars wear thiruneeru (Śaiva horizontal ash) and
  Kambar/Srivaishnavas wear thirunāmam (Vaishnava U-shape); then set status: published.
- **Pāyiram verses 11 & 12** and **all pilot verse text**: Tamil taken from Tamil
  Wikisource / placeholders — verify exact akṣaras and verse numbers against the tamilvu.org
  PD edition; verify translations against P.S. Sundaram.
- **Kandam "At a glance" counts**: padalam/sarga/sloka numbers pending the tamilvu edition.

## Permissions / sources (awaiting)
- **Śrīmad Rāmāyaṇa Sarvasvam** (Uttamur Swamy's Sankshepa commentary): obtain the
  book/PDF + copyright permission, then add his commentary text to the `sarvasvam` slokas
  and flip to published.
- **P.S. Sundaram translation**: confirm permission for verbatim use of his English.
- **Acharya portraits** (Parakala Swamy = current pontiff; Uttamur Swamy): prefer an
  authorized photograph / commissioned portrait over an AI likeness.

## Theological content (user/parampara to author)
- Rewrite the DRAFT `insights.theological` and cross-reference `reason` fields on the
  showcase verses in the user's own words / the parampara's reading — these are the moat
  and must be authentic, not AI-drafted.

## Deferred technical polish (from code review)
- devDeps hygiene (@astrojs/check, typescript → devDependencies); MediaEmbed frameborder →
  style; extract stripExt to src/lib; add package.json engines; lang="ta" on Tamil spans;
  Spotify iframe host allow-list before any CMS phase.

## Deployment
- Push to Cloudflare (deferred) when ready to update the live site; needs GitHub token
  (SSH blocked on this network — see memory).
