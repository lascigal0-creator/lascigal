import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { getAllScrollFilms } from '@/lib/scroll-film';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lascigal.com';

  // 1. Core static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/aboutus`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contactus`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // 2. Dynamic event and celebration pages
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await prisma.eventService.findMany({
      select: { slug: true, updatedAt: true },
    });
    eventRoutes = events.map((e) => ({
      url: `${baseUrl}/events/${e.slug}`,
      lastModified: e.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }));
  } catch {
    // Graceful fallback during static generation if DB is temporarily unreachable
  }

  // 3. Dynamic interactive scroll-film tours
  let filmRoutes: MetadataRoute.Sitemap = [];
  try {
    const films = getAllScrollFilms();
    filmRoutes = films.map((f) => ({
      url: `${baseUrl}/film/${f.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    }));
  } catch {
    // Graceful fallback
  }

  return [...staticRoutes, ...eventRoutes, ...filmRoutes];
}
