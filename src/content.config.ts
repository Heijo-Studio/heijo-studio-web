import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const works = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '**/*.mdx'],
    base: './src/content/works',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      thumbnail: image().optional(),
      size: z.string().optional(),
      design: z.string().optional(),
      construction: z.coerce.date().optional(),
      location: z.string().optional(),
    }),
});

export const collections = {
  works,
};
