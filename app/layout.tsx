import type { Metadata } from 'next';
import './globals.css';
import './homepage.css';
import ScrollToTop from '@/components/ScrollToTop';
import JsonLd from '@/components/JsonLd';
import prisma from '@/lib/prisma';
import { mediaUrl } from '@/lib/media';

export async function generateMetadata(): Promise<Metadata> {
  let favicon = 'images/favicons.png';
  let title = 'Lascigal Convention Centre | Kalampoor, Muvattupuzha';
  let description =
    'Lascigal Convention Centre offers spacious air-conditioned halls, modern audio-visual amenities, dedicated dining, and ample car parking for weddings, corporate summits, and celebrations.';

  try {
    const settingsList = await prisma.siteSetting.findMany({
      where: {
        key: { in: ['site_favicon', 'site_title', 'site_description'] },
      },
    });
    for (const s of settingsList) {
      if (s.key === 'site_favicon' && s.value) favicon = s.value;
      if (s.key === 'site_title' && s.value) title = s.value;
      if (s.key === 'site_description' && s.value) description = s.value;
    }
  } catch (err) {
    // Fallback gracefully during early build step if DB connection is unavailable
  }

  const faviconUrl = mediaUrl(favicon);

  return {
    metadataBase: new URL('https://www.lascigal.com'),
    title: {
      default: title,
      template: '%s | Lascigal Convention Centre',
    },
    description,
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: 'https://www.lascigal.com',
      siteName: 'Lascigal Convention Centre',
      title,
      description,
      images: [
        {
          url: '/stills/las-cigal-hero.webp',
          width: 1280,
          height: 720,
          alt: 'Lascigal Convention Centre',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/stills/las-cigal-hero.webp'],
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let favicon = 'images/favicons.png';
  try {
    const favSetting = await prisma.siteSetting.findUnique({
      where: { key: 'site_favicon' },
    });
    if (favSetting?.value) favicon = favSetting.value;
  } catch (err) {}

  return (
    <html lang="en-US" className="scheme_original">
      <head>
        <JsonLd />
        <link rel="icon" href={mediaUrl(favicon)} />
        <link rel="shortcut icon" href={mediaUrl(favicon)} />
        <link rel="apple-touch-icon" href={mediaUrl(favicon)} />
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_MEDIA_BASE || 'https://pub-fc1ea4fa629e4540a5972566a72a858c.r2.dev'}
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className="home page body_filled scheme_original">
        <div className="body_wrap">
          <div className="page_wrap">
            {children}
            <ScrollToTop />
          </div>
        </div>
      </body>
    </html>
  );
}
