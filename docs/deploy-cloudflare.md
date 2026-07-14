# Deploy to Cloudflare Pages

## One-time setup
1. Push this repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → select the repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: **`npm run build`** — IMPORTANT: override the Astro preset's
     default of `astro build`. The preset omits the `&& pagefind --site dist` step,
     which would ship the site with **no search index**. It must be `npm run build`.
   - Build output directory: `dist`
   - Environment variable: set `NODE_VERSION` = `22` (Astro 5 requires ≥ 20.3; 22 is
     current LTS).
4. Deploy. Every push to the `main` branch redeploys automatically. A `*.pages.dev`
   preview URL is available immediately.

## Custom domain (kambaramayanam.org)
1. Register the domain (Cloudflare Registrar recommended, ~$10/yr).
2. Pages project → Custom domains → add `kambaramayanam.org` and `www`.
3. Cloudflare auto-creates the DNS + TLS. Done.

## Media & large images
- Video/audio: embed via YouTube/Spotify (already supported in verse `media`).
- Large own-hosted audio/images later: put in a Cloudflare R2 bucket and reference by URL.
