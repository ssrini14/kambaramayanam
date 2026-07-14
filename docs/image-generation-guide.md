# Image Generation Guide — Tanjore Header Art

How to generate the Tanjore-style images and drop them into the site. Once a file
is in place and its record set to `published`, it appears automatically (the
placeholder swaps out with zero layout change).

## Which tool

Any modern text-to-image model works. Recommendations:

| Tool | Notes | Cost |
|---|---|---|
| **DALL·E 3** (ChatGPT Plus, or API) | Best at following detailed prompts + "no text". Easiest. | Plus plan, or API ≈ $0.04–0.08/image |
| **Ideogram** | Strong at ornate/decorative styles, good at avoiding gibberish text | Free tier + paid |
| **Midjourney** | Most beautiful painterly output; needs Discord; may over-stylize iconography | ~$10/mo |
| **Flux (e.g. via Replicate)** | High quality, cheap per image | ~$0.003–0.03/image |

**Aspect ratio:** the headers render wide (hero). Generate at **21:9 or 16:9** (landscape).
The acharya portraits (later) should be **3:4** (portrait).

## Review checklist before publishing (per docs/art-direction-tanjore.md)

- [ ] Iconography correct: attributes, number of arms, vahana, posture
- [ ] Respectful, devotional tone — not "fantasy" art
- [ ] Consistent Tanjore palette + gold + arched border across the whole set
- [ ] No garbled text (add "no text" to the prompt; regenerate if text appears)
- [ ] Record the tool used + its license in the image record (fields below)

## The 7 header prompts + target filenames

Priority order (do these 7 first for a shareable prototype):

### 1. Bala Kandam — `bala-kandam-header.png`
> Traditional Tanjore (Thanjavur) style devotional painting: the young Lord Rama lifting and breaking the mighty bow of Shiva at King Janaka's court, while Janaka, the sage Vishwamitra, Lakshmana, and the royal assembly watch in astonishment; rich jewel-tone colors, gold-leaf gilded ornamentation and halos, ornate arched temple border, serene rounded figures, flat decorative background, classical South Indian temple art, no text.

### 2. Ayodhya Kandam — `ayodhya-kandam-header.png`
> Traditional Tanjore (Thanjavur) style devotional painting: Bharata holding Lord Rama's golden sandals (paaduka) upon his own bowed head with both hands, surrounded by the people of Ayodhya gazing reverently at him as he sets out for Nandigram; rich jewel-tone colors, gold-leaf gilded ornamentation and halos, ornate arched temple border, serene rounded figures, flat decorative background, classical South Indian temple art, no text.

> ### ⚠️ Iconography rules for exile-period scenes (Aranya, Kishkindha, Sundara, Yuddha)
> During the 14-year exile, **Rama and Lakshmana are forest ascetics**: jaṭāmukuṭa
> (piled-up matted hair / dreadlocks), valkala (bark/grass garments), **NO crowns, NO
> royal silk, NO ornate jewelry**. Rama stays blue-skinned with a halo. Sita in simple
> forest attire. And when Rama holds his bow, it is the **kodanda — a tall warrior's
> longbow, as tall as Rama himself, upright with its tip near the ground; large and
> majestic, not small.** (Bala Kandam and Pattabhishekam are pre-/post-exile — royal
> Rama is correct there.) These are baked into the prompts below.

### 3. Aranya Kandam — `aranya-kandam-header.png`
> **Note:** at Sita's abduction, Rama and Lakshmana are NOT present (Rama was lured away by
> Maricha's golden deer, Lakshmana went after him). So this scene shows only Ravana, Sita,
> and Jatayu — do **not** add Rama/Lakshmana.
>
> Traditional Tanjore (Thanjavur) style devotional painting, wide landscape 16:9: the ten-headed twenty-armed Ravana in his flying aerial chariot carrying off Sita, while the great vulture-king Jatayu with vast outstretched wings and talons attacks him mid-sky to save her; Sita in simple forest attire reaching out in distress. A forest and sky setting. Rich jewel-tone colors, gold-leaf gilded ornamentation and halos, ornate arched temple border, dramatic composition, classical South Indian temple art, no text, no lettering.

### 4. Kishkindha Kandam — `kishkindha-kandam-header.png`
> Traditional Tanjore (Thanjavur) style devotional painting, wide landscape 16:9: Lord Rama and the vanara king Sugriva circling a sacred fire together to take vows of alliance and friendship, with Lakshmana and Hanuman witnessing reverently. Rama and Lakshmana are forest ascetics — matted hair (jaṭāmukuṭa), bark-fiber garments (valkala), no crowns or royal jewelry; Rama holds his tall kodanda longbow (as tall as himself, upright, tip near the ground). Rama blue-skinned with a halo. Rich jewel-tone colors, gold-leaf gilded ornamentation and halos, ornate arched temple border, serene rounded figures, forest setting, classical South Indian temple art, no text, no lettering.

### 5. Sundara Kandam — `sundara-kandam-header.png`
> Traditional Tanjore (Thanjavur) style devotional painting: Hanuman kneeling on one knee, head reverently bowed, extending one hand palm-up to offer Lord Rama's golden signet ring to Sita who sits beneath the Ashoka tree; rich jewel-tone colors, gold-leaf gilded ornamentation and halos, ornate arched temple border, serene rounded figures, flat decorative background, classical South Indian temple art, no text.

### 6. Yuddha Kandam — `yuddha-kandam-header.png`
> Traditional Tanjore (Thanjavur) style devotional painting, wide landscape 16:9: Lord Rama drawing his great kodanda longbow — a tall, majestic warrior's bow — to release the Brahmastra against the ten-headed twenty-armed demon king Ravana on the battlefield of Lanka, the vanara army behind him. Rama as a forest ascetic (matted hair / jaṭāmukuṭa, no crown), blue-skinned with a halo, heroic stance. Rich jewel-tone colors, gold-leaf gilded ornamentation and halos, ornate arched temple border, dramatic heroic composition, classical South Indian temple art, no text, no lettering.

### 7. Sundara scene (landing + verse) — `hanuman-crossing-ocean.png`
> Traditional Tanjore style devotional painting of Hanuman leaping across the ocean, rich jewel-tone colors, gold-leaf gilded ornamentation and halo, ornate arched temple border, serene rounded figure, flat decorative background, classical South Indian temple art, no text.

## Later: landing scene cards + acharya portraits

These records don't exist yet — create them when ready (or ask me to). Landing scene
cards: hanuman-meets-sita, hanuman-in-ravanas-court, hanuman-burns-lanka,
hanuman-embraces-rama. Acharya portraits (3:4): acharya-ramanuja, acharya-desikan,
acharya-parakala, acharya-uttamur. Plus the landing hero: rama-pattabhishekam.
IMPORTANT for acharyas: paint an original portrait honoring the traditional likeness —
never copy a specific copyrighted photograph.

## Drop-in steps (per image)

1. Generate the image; pick your best version.
2. Save it as the **exact filename** above into: `src/assets/images/`
   (e.g. `src/assets/images/sundara-kandam-header.png`). PNG or JPG both fine; keep
   the `.png` name or update the record's `file` field to match.
3. In the matching record under `src/content/images/<name>.json`, update:
   - `"tool"`: what you used (e.g. `"DALL·E 3"`)
   - `"license"`: e.g. `"Generated with DALL·E 3; usable per OpenAI content policy"`
   - `"status"`: change `"draft"` → `"published"`
4. Run `npm run dev` (or rebuild) — the art now shows in place of the placeholder.
5. Commit the image + record.

Tip: do all 7, review as a set for visual consistency, then publish them together.
