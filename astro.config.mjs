import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
//import cloudinary from 'astro-cloudinary';

export default defineConfig({
  site: 'https://staugustinefilmsociety.org',
  integrations: [tailwind(), mdx()],
  output: 'hybrid',
  experimental: {
    contentLayer: true,
  },
});
