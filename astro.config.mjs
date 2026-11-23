import { defineConfig } from 'astro/config';

// Fully static build. The only server code is the Pages Function in functions/api/waitlist.ts.
export default defineConfig({
  site: 'https://i-on.pages.dev',
  build: { format: 'directory' },
});
