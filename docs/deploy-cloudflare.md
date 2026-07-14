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
