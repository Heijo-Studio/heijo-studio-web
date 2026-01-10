import { getCollection } from 'astro:content';

export async function getAllCategories() {
  const allWorks = await getCollection('works');

  const categories = [
    ...new Set(allWorks.map((entry) => entry.id.split('/')[0])),
  ];

  return categories;
}

export async function getWorksByCategory(category: string) {
  const allWorks = await getCollection('works', (entry) => {
    return entry.id.split('/')[0] === category;
  });

  return allWorks;
}
