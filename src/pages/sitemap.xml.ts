import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const KNOWN_CATEGORIES = [
  'architecture',
  'construction-engineering',
  'interior',
  'products',
];

export const GET: APIRoute = async ({ site }) => {
  const base = site
    ? site.toString().endsWith('/')
      ? site.toString()
      : `${site.toString()}/`
    : 'https://heijostudio.com/';

  type UrlEntry = { loc: string; priority: number; changefreq: string };
  const urls: UrlEntry[] = [
    { loc: base, priority: 1.0, changefreq: 'monthly' },
    { loc: `${base}about/`, priority: 0.8, changefreq: 'yearly' },
    { loc: `${base}works/`, priority: 0.9, changefreq: 'weekly' },
    ...KNOWN_CATEGORIES.map((category) => ({
      loc: `${base}works/${category}/`,
      priority: 0.8,
      changefreq: 'weekly',
    })),
  ];

  const entries = await getCollection('works');
  for (const entry of entries) {
    const [category, filename] = entry.id.split('/');
    if (!category || !filename) continue;
    const slug = filename.replace(/\.(md|mdx)$/, '');
    urls.push({
      loc: `${base}works/${category}/${slug}/`,
      priority: 0.7,
      changefreq: 'yearly',
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
