import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const works = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '**/*.mdx'],
    base: './src/content/works',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  works,
};
