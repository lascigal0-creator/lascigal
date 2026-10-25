import filmsData from '@/data/scroll-films.json';
import { mediaUrl } from './media';

export interface ScrollFilmStat {
  label: string;
  value: string;
  icon?: string;
}

export interface ScrollFilmHighlight {
  title: string;
  description: string;
  icon?: string;
}

export interface ScrollFilmTimelineStep {
  timeOrStep: string;
  title: string;
  description: string;
}

export interface ScrollFilmHowTo {
  title: string;
  description: string;
}

export interface ScrollFilmGalleryItem {
  image: string;
  title?: string;
  caption?: string;
}

export interface ScrollFilmPageData {
  slug: string;
  title: string;
  tagline: string;
  heroImage: string;
  filmFolder: string;
  frameCount: number;
  filmFromTo?: { from: string; to: string };
  filmLabel: string;
  introParagraphs: [string, string];
  stats: ScrollFilmStat[];
  highlights: ScrollFilmHighlight[];
  timeline: ScrollFilmTimelineStep[];
  features: string[];
  howTo: ScrollFilmHowTo[];
  gallery: ScrollFilmGalleryItem[];
  relatedSlugs: string[];
}

/**
 * Normalizes raw json into canonical ScrollFilmPageData, supporting both:
 * 1. Detailed schema (heroImage, filmFolder, introParagraphs, etc.)
 * 2. Muse / prompt shorthand schema (hero, filmDir, intro, body in highlights, string[] in gallery)
 */
export function normalizeScrollFilm(raw: any): ScrollFilmPageData {
  const heroImage = raw.heroImage || raw.hero || 'stills/las-cigal-hero.webp';
  const filmFolder = raw.filmFolder || raw.filmDir || 'frames-las-cigal';
  const frameCount = raw.frameCount || (raw.filmTo && raw.filmFrom ? raw.filmTo - raw.filmFrom + 1 : 120);

  // Intro paragraphs
  let introParagraphs: [string, string] = ['', ''];
  if (Array.isArray(raw.introParagraphs) && raw.introParagraphs.length >= 2) {
    introParagraphs = [raw.introParagraphs[0], raw.introParagraphs[1]];
  } else if (Array.isArray(raw.intro) && raw.intro.length >= 2) {
    introParagraphs = [raw.intro[0], raw.intro[1]];
  } else if (Array.isArray(raw.intro) && raw.intro.length === 1) {
    introParagraphs = [raw.intro[0], ''];
  }

  // Stats: can be array of { label, value, icon } or key-value object
  let stats: ScrollFilmStat[] = [];
  if (Array.isArray(raw.stats)) {
    stats = raw.stats.map((s: any) => ({
      label: s.label || '',
      value: s.value || '',
      icon: s.icon || 'fas fa-check-circle',
    }));
  } else if (raw.stats && typeof raw.stats === 'object') {
    const iconMap: Record<string, string> = {
      hall: 'fas fa-building',
      parking: 'fas fa-square-parking',
      onsite: 'fas fa-cake-candles',
      contact: 'fas fa-phone-volume',
      website: 'fas fa-globe',
      location: 'fas fa-map-pin',
    };
    stats = Object.entries(raw.stats).map(([k, v]) => ({
      label: k.charAt(0).toUpperCase() + k.slice(1),
      value: String(v),
      icon: iconMap[k.toLowerCase()] || 'fas fa-circle-info',
    }));
  }

  // Highlights: supports description or body
  const highlights: ScrollFilmHighlight[] = (raw.highlights || []).map((h: any) => ({
    title: h.title || '',
    description: h.description || h.body || '',
    icon: h.icon || 'fas fa-star',
  }));

  // Timeline
  const timeline: ScrollFilmTimelineStep[] = (raw.timeline || [
    { timeOrStep: '01', title: 'Grand Arrival & Parking', description: 'Ample parking for 300 to 400 vehicles with direct access to the entrance portico.' },
    { timeOrStep: '02', title: 'Welcome at the Portico', description: 'Wide paved forecourt and covered entrance for photo opportunities and guest greetings.' },
    { timeOrStep: '03', title: 'Majestic Hall Experience', description: 'Central aisle procession and raised stage celebration in full air-conditioned comfort.' },
    { timeOrStep: '04', title: 'Reception & Hospitality', description: 'Spacious guest circulation, dining transition, and in-house Chocoberry bakes counter.' },
  ]).map((t: any, idx: number) => ({
    timeOrStep: t.timeOrStep || `0${idx + 1}`,
    title: t.title || '',
    description: t.description || '',
  }));

  // Features
  const features: string[] = raw.features || [
    'Spacious Majestic Hall with central carpet aisle and raised stage',
    'Expansive paved parking grounds accommodating 300 to 400 cars',
    'Wide covered entrance portico with illuminated signage',
    'On-site Chocoberry Cakes & Bakes outlet at the building front',
    'High-resolution full-building exterior illumination for night galas',
    'Climate-controlled indoor environment with modern lighting infrastructure',
  ];

  // How-to / Location
  const howTo: ScrollFilmHowTo[] = raw.howTo || [
    {
      title: 'Location & Arrival',
      description: 'Lascigal Convention Center (Malekudiyil) is conveniently situated along Piravom Road, Kalampoor, Muvattupuzha, Ernakulam District, Kerala.',
    },
    {
      title: 'Dedicated Parking Access',
      description: 'Follow the illuminated directional signage to enter the 300-400 vehicle parking grounds directly from the main thoroughfare.',
    },
    {
      title: 'Private Walkthrough & Booking',
      description: 'Contact our venue coordinators at 7306107515 or 9048207515 to verify dates, schedule a site visit, or reserve the Majestic Hall.',
    },
  ];

  // Gallery: supports string[] or object[]
  const gallery: ScrollFilmGalleryItem[] = (raw.gallery || []).map((g: any, idx: number) => {
    if (typeof g === 'string') {
      const filename = g.split('/').pop()?.replace('.webp', '').replace(/-/g, ' ') || `View ${idx + 1}`;
      const title = filename.charAt(0).toUpperCase() + filename.slice(1);
      return {
        image: g,
        title,
        caption: 'LAS CIGAL Convention Center',
      };
    }
    return {
      image: g.image || '',
      title: g.title,
      caption: g.caption,
    };
  });

  return {
    slug: raw.slug || 'las-cigal',
    title: raw.title || 'LAS CIGAL Convention Center',
    tagline: raw.tagline || 'Celebrate in Style',
    heroImage,
    filmFolder,
    frameCount,
    filmFromTo: raw.filmFromTo || { from: '00:00 Arrival', to: '00:38 Celebration' },
    filmLabel: raw.filmLabel || 'Celebrate in Style · LAS CIGAL film',
    introParagraphs,
    stats,
    highlights,
    timeline,
    features,
    howTo,
    gallery,
    relatedSlugs: raw.relatedSlugs || [],
  };
}

/**
 * Returns all configured scroll films from data store.
 */
export function getAllScrollFilms(): ScrollFilmPageData[] {
  return (filmsData as any[]).map(normalizeScrollFilm);
}

/**
 * Finds a scroll film by its slug.
 */
export function getScrollFilmBySlug(slug: string): ScrollFilmPageData | null {
  const raw = (filmsData as any[]).find((f) => f.slug === slug);
  if (!raw) return null;
  return normalizeScrollFilm(raw);
}

/**
 * Resolves the exact WebP frame URL following the fixed frame spec:
 * frame_00001.webp, frame_00002.webp ... frame_00120.webp
 */
export function resolveFrameUrl(folder: string, frameNumber: number): string {
  const pad = String(frameNumber).padStart(5, '0');
  const filename = `frame_${pad}.webp`;
  const cleanFolder = folder.replace(/\/$/, '').replace(/^\//, '');

  // If local static folder in public/
  if (cleanFolder.startsWith('frames-') || cleanFolder.startsWith('public/')) {
    const publicPath = cleanFolder.replace(/^public\//, '');
    return `/${publicPath}/${filename}`;
  }

  // If already absolute URL
  if (cleanFolder.startsWith('http://') || cleanFolder.startsWith('https://')) {
    return `${cleanFolder}/${filename}`;
  }

  // Otherwise route through project's mediaUrl helper (R2 / CDN)
  return mediaUrl(`${cleanFolder}/${filename}`);
}
