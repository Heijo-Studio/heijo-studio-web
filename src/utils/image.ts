import type { ImageMetadata } from 'astro';

function getNormalizedPath(path: string): string | null {
  const match = path.match(/\/src\/assets\/images\/[^?]+/);
  return match ? match[0] : null;
}

export function getDynamicImageSrc(
  path: string,
): Promise<{ default: ImageMetadata }> | null {
  const images = import.meta.glob<{ default: ImageMetadata }>(
    '/src/assets/images/works/**/*.{jpeg,jpg,png,gif,webp}',
  );

  const normalizedPath = getNormalizedPath(path);
  if (normalizedPath && images[normalizedPath]) {
    return images[normalizedPath]();
  }
  return null;
}
