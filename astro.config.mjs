import { defineConfig } from 'astro/config';

// Fully static build. The only server code is the Pages Function in functions/api/waitlist.ts.
export default defineConfig({
  site: 'https://ion-2d8.pages.dev',
  build: { format: 'directory' },
  // Fonts and other assets are always files, never inlined as data: addresses, so the content security policy can stay strict.
  vite: { build: { assetsInlineLimit: 0 } },
});
