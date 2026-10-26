import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollFilm from '@/components/ScrollFilm';
import ScrollFilmGallery from '@/components/ScrollFilmGallery';
import prisma from '@/lib/prisma';
import { mediaUrl } from '@/lib/media';
import { getAllScrollFilms, getScrollFilmBySlug } from '@/lib/scroll-film';
import '@/app/homepage.css';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const films = getAllScrollFilms();
  return films.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const film = getScrollFilmBySlug(params.slug);
  if (!film) {
    return {
      title: 'Experience Not Found | Lascigal Convention Centre',
    };
  }

  return {
    title: `${film.title} | 120-Frame Interactive Walkthrough | Lascigal`,
    description: film.tagline,
    openGraph: {
      title: `${film.title} | Lascigal Convention Centre`,
      description: film.tagline,
      images: [{ url: mediaUrl(film.heroImage) }],
    },
  };
}

export default async function FilmDetailsPage({ params }: Props) {
  const film = getScrollFilmBySlug(params.slug);
  if (!film) {
    notFound();
  }

  // Fetch site settings for global Header and Footer
  const settingsList = await prisma.siteSetting.findMany().catch(() => []);
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';
  const logo = settings['site_logo'] || 'images/laslogo1.png';

  // Resolve related scroll films
  const allFilms = getAllScrollFilms();
  const relatedFilms = (film.relatedSlugs || [])
    .map((slug) => allFilms.find((f) => f.slug === slug))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  const filmJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: film.title,
    description: film.tagline,
    thumbnailUrl: [
      mediaUrl(film.heroImage),
      'https://www.lascigal.com/stills/gallery-aerial.webp',
    ],
    uploadDate: '2026-10-25T00:00:00Z',
    contentUrl: `https://www.lascigal.com/film/${film.slug}`,
    embedUrl: `https://www.lascigal.com/film/${film.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Lascigal Convention Centre',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.lascigal.com/images/laslogo1.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(filmJsonLd) }}
      />
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

      {/* ─── SCROLL FILM HERO PLAYER ─── */}
      <section aria-label="Interactive Scroll Film">
        <ScrollFilm
          slug={film.slug}
          title={film.title}
          tagline={film.tagline}
          heroImage={film.heroImage}
          filmFolder={film.filmFolder}
          frameCount={film.frameCount || 120}
          filmLabel={film.filmLabel}
          filmFromTo={film.filmFromTo}
        />
      </section>

      {/* ─── BREADCRUMBS BAR ─── */}
      <nav
        aria-label="Breadcrumb navigation"
        style={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 20px',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', fontSize: '13px', color: '#64748b' }}>
          <Link href="/" style={{ color: '#be9f76', textDecoration: 'none', fontWeight: 600 }}>
            Home
          </Link>
          <span style={{ margin: '0 8px', color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#475569' }}>Interactive Tours</span>
          <span style={{ margin: '0 8px', color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{film.title}</span>
        </div>
      </nav>

      {/* ─── DETAILS SECTIONS BELOW FILM (IN STRICT ORDER) ─── */}

      {/* 1. INTRO PARAGRAPHS (2) */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 20px 60px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span
              style={{
                color: '#be9f76',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Overview &amp; Architecture
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                color: '#0f172a',
                margin: 0,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {film.title}
            </h2>
          </div>

          <div
            style={{
              fontSize: '17px',
              lineHeight: 1.85,
              color: '#334155',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {film.introParagraphs.map((para, idx) => (
              <p
                key={idx}
                style={{
                  margin: 0,
                  fontSize: idx === 0 ? '18px' : '17px',
                  fontWeight: idx === 0 ? 500 : 400,
                  color: idx === 0 ? '#1e293b' : '#475569',
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 2. KEY FACTS / STATS GRID */}
      <section style={{ backgroundColor: '#f8fafc', padding: '70px 20px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span
              style={{
                color: '#be9f76',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Venue Specifications
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '32px',
                color: '#0f172a',
                margin: 0,
                fontWeight: 700,
              }}
            >
              Key Facts &amp; Capacities
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {film.stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '28px 24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {stat.icon && (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(190, 159, 118, 0.12)',
                      color: '#be9f76',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    <i className={stat.icon}></i>
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '4px',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHTS CARDS */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                color: '#be9f76',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Distinguished Elegance
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '34px',
                color: '#0f172a',
                margin: 0,
                fontWeight: 700,
              }}
            >
              Architectural &amp; Event Highlights
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '24px',
            }}
          >
            {film.highlights.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '32px 26px',
                  borderRadius: '14px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#be9f76',
                  }}
                />
                {item.icon && (
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(190, 159, 118, 0.15)',
                      color: '#be9f76',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}
                  >
                    <i className={item.icon}></i>
                  </div>
                )}
                <h4
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '20px',
                    color: '#0f172a',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ margin: 0, fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TIMELINE / ITINERARY / STEPS */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '80px 20px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span
              style={{
                color: '#be9f76',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Guest Journey
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '34px',
                color: '#ffffff',
                margin: 0,
                fontWeight: 700,
              }}
            >
              Event Experience Flow
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {film.timeline.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '22px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px 28px',
                }}
              >
                <div
                  style={{
                    minWidth: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#be9f76',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '18px',
                    fontWeight: 700,
                    boxShadow: '0 0 15px rgba(190, 159, 118, 0.4)',
                  }}
                >
                  {step.timeOrStep}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: 600, color: '#ffffff' }}>
                    {step.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.65 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES / LIST SECTION */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 20px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span
              style={{
                color: '#be9f76',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Full Amenities
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '34px',
                color: '#0f172a',
                margin: 0,
                fontWeight: 700,
              }}
            >
              Comprehensive Venue Features
            </h3>
          </div>

          <ol
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              counterReset: 'feature-counter',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {film.features.map((feature, idx) => (
              <li
                key={idx}
                style={{
                  counterIncrement: 'feature-counter',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 22px',
                  fontSize: '15.5px',
                  color: '#334155',
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(190, 159, 118, 0.2)',
                    color: '#be9f76',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                    flexShrink: 0,
                  }}
                >
                  <i className="fas fa-check" style={{ fontSize: '11px' }}></i>
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. HOW TO GET THERE / HOW IT WORKS */}
      <section style={{ backgroundColor: '#f8fafc', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                color: '#be9f76',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Location &amp; Access
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '34px',
                color: '#0f172a',
                margin: 0,
                fontWeight: 700,
              }}
            >
              How to Get There &amp; Booking Process
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {film.howTo.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '30px 26px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    color: '#be9f76',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fas fa-location-arrow" style={{ fontSize: '13px' }}></i>
                  {item.title}
                </div>
                <p style={{ margin: 0, fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GALLERY (CLICKABLE IMAGES, LAZY-LOADED) */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 20px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span
              style={{
                color: '#be9f76',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Photo Collection
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '34px',
                color: '#0f172a',
                margin: 0,
                fontWeight: 700,
              }}
            >
              High-Resolution Gallery
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px', margin: '10px 0 0' }}>
              Click any photograph to inspect the venue in high-resolution detail.
            </p>
          </div>

          <ScrollFilmGallery items={film.gallery} title={film.title} />
        </div>
      </section>

      {/* 8. RELATED PAGES CARDS */}
      {relatedFilms.length > 0 && (
        <section style={{ backgroundColor: '#f8fafc', padding: '80px 20px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <span
                style={{
                  color: '#be9f76',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                More Cinematic Tours
              </span>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '34px',
                  color: '#0f172a',
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                Explore Related Venues
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '28px',
              }}
            >
              {relatedFilms.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/film/${rel.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    }}
                    className="las_related_card"
                  >
                    <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                      <Image
                        src={mediaUrl(rel.heroImage)}
                        alt={rel.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '14px',
                          backgroundColor: 'rgba(10, 12, 16, 0.75)',
                          backdropFilter: 'blur(6px)',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        120-Frame Film
                      </span>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <h4
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '20px',
                          color: '#0f172a',
                          margin: '0 0 8px',
                          fontWeight: 700,
                        }}
                      >
                        {rel.title}
                      </h4>
                      <p
                        style={{
                          margin: '0 0 16px',
                          fontSize: '14px',
                          color: '#64748b',
                          lineHeight: 1.6,
                        }}
                      >
                        {rel.tagline}
                      </p>
                      <span
                        style={{
                          color: '#be9f76',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        Launch Interactive Film <i className="fas fa-arrow-right" style={{ fontSize: '11px' }}></i>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. CALL-TO-ACTION + CONTACT BLOCK */}
      <section
        style={{
          backgroundColor: '#0a0c10',
          color: '#ffffff',
          padding: '90px 20px',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(190, 159, 118, 0.3)',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span
            style={{
              color: '#be9f76',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2.5px',
              display: 'inline-block',
              marginBottom: '12px',
              backgroundColor: 'rgba(190, 159, 118, 0.15)',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(190, 159, 118, 0.3)',
            }}
          >
            Reserve Your Date
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 4.5vw, 46px)',
              margin: '0 0 18px',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Plan Your Grand Celebration at Lascigal
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '17px',
              maxWidth: '680px',
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}
          >
            Connect directly with our senior venue directors to schedule a private walkthrough, reserve preferred dates, and customize your celebration package.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <a
              href={`tel:${phone1}`}
              style={{
                backgroundColor: '#be9f76',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(190, 159, 118, 0.4)',
              }}
            >
              <i className="fas fa-phone-volume"></i>
              <span>Call: +91 {phone1}</span>
            </a>

            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello Lascigal, I am interested in booking the ${film.title}. Please share available dates and packages.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#25D366',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: '18px' }}></i>
              <span>WhatsApp Us</span>
            </a>

            <Link
              href="/contactus"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Venue Enquiry Form</span>
              <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i>
            </Link>
          </div>
        </div>
      </section>

      <Footer
        phone1={phone1}
        phone2={phone2}
        email={settings['email_address']}
        addressLine1={settings['address_line1']}
        addressPincode={settings['address_pincode']}
        mapsUrl={mapsUrl}
        mapsEmbed={settings['google_maps_embed']}
        logo={logo}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .las_related_card:hover {
              transform: translateY(-5px);
              box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08) !important;
            }
          `,
        }}
      />
    </>
  );
}
