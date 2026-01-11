// @ts-check
import markdoc from '@astrojs/markdoc';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), markdoc(), keystatic()],
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
