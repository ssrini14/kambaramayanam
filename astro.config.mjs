import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kambaramayanam.org',
  output: 'static',
  image: {
    // Astro's built-in sharp service handles resize + WebP/AVIF.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
