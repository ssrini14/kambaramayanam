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
