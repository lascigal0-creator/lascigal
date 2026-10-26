import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import { mediaUrl } from '@/lib/media';
import '@/app/homepage.css';

interface EventDetailPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const events = await prisma.eventService.findMany({ select: { slug: true } });
  return events.map((e) => ({ slug: e.slug }));
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const [event, settingsList] = await Promise.all([
    prisma.eventService.findUnique({
      where: { slug: params.slug },
      include: { highlights: { orderBy: { order: 'asc' } } },
    }),
    prisma.siteSetting.findMany(),
  ]);

  if (!event) {
    notFound();
  }

  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';
  const logo = settings['site_logo'] || 'images/laslogo1.png';

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: event.title,
    serviceType: event.categoryName,
    description: event.summary || event.description,
    provider: {
      '@type': 'EventVenue',
      name: 'Lascigal Convention Centre',
      url: 'https://www.lascigal.com',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kerala, India',
    },
    image: mediaUrl(event.heroImage),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

      {/* ─── LUXURY HERO BANNER ─── */}
      <section className="las_page_hero">
        <div className="las_page_hero_inner">
          <span className="las_page_badge">{event.categoryName}</span>
          <h1 className="las_page_title">{event.title}</h1>
          <nav className="las_breadcrumbs" aria-label="Breadcrumbs">
            <Link href="/">Home</Link>
            <span className="las_breadcrumbs_sep">/</span>
            <Link href="/portfolio">Portfolio</Link>
            <span className="las_breadcrumbs_sep">/</span>
            <span className="las_breadcrumbs_current">{event.title}</span>
          </nav>
        </div>
      </section>

      {/* ─── EVENT DETAILS SECTION ─── */}
      <section className="las_section" style={{ backgroundColor: '#ffffff', padding: '60px 0' }}>
        <div className="las_container">
          {/* Main Hero Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              maxHeight: '480px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.12)',
              marginBottom: '45px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(event.heroImage)}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '45px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Description & Gallery */}
            <div>
              <span className="las_eyebrow">Event Experience</span>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(24px, 3.5vw, 34px)',
                  color: '#0f172a',
                  margin: '8px 0 16px',
                }}
              >
                About {event.title}
              </h2>

              {event.summary && (
                <p
                  style={{
                    fontSize: '17px',
                    color: '#c5a880',
                    fontWeight: 600,
                    lineHeight: 1.6,
                    marginBottom: '20px',
                  }}
                >
                  {event.summary}
                </p>
              )}

              <div style={{ color: '#475569', lineHeight: 1.8, fontSize: '15.5px', marginBottom: '35px' }}>
                {event.description ||
                  'Experience world-class event execution with personalized attention to detail, bespoke decor setups, and exceptional hospitality.'}
              </div>

              {/* Gallery Images */}
              {event.galleryImages && event.galleryImages.length > 0 && (
                <div style={{ marginTop: '35px' }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.4rem',
                      color: '#0f172a',
                      marginBottom: '16px',
                    }}
                  >
                    Event Moments &amp; Decor
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 160px), 1fr))',
                      gap: '14px',
                    }}
                  >
                    {event.galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          height: '140px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          position: 'relative',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaUrl(img)}
                          alt={`${event.title} moment ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Key Features & Booking Card */}
            <div>
              {/* Features Card */}
              {event.features && event.features.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '30px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
                    marginBottom: '30px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.3rem',
                      color: '#0f172a',
                      marginBottom: '20px',
                      fontWeight: 700,
                    }}
                  >
                    Key Venue Inclusions
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {event.features.map((feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          paddingBottom: '10px',
                          borderBottom: idx !== event.features.length - 1 ? '1px solid #e2e8f0' : 'none',
                          color: '#334155',
                          fontSize: '14.5px',
                        }}
                      >
                        <i className="fas fa-check-circle" style={{ color: '#c5a880', fontSize: '16px', flexShrink: 0 }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Inquiry CTA Card */}
              <div
                style={{
                  backgroundColor: '#be9f76',
                  backgroundImage: 'linear-gradient(135deg, #be9f76 0%, #b29165 100%)',
                  color: '#fff',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  textAlign: 'center',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 12px 35px rgba(190, 159, 118, 0.3)',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.22)',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    marginBottom: '16px',
                  }}
                >
                  <i className="fas fa-calendar-check" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#fff',
                    fontSize: '1.4rem',
                    margin: '0 0 10px',
                    fontWeight: 700,
                  }}
                >
                  Plan Your {event.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '14px', lineHeight: 1.6, marginBottom: '22px' }}>
                  Reserve your date with our event coordination team. Inquire now for hall availability and custom packages.
                </p>
                <Link
                  href="/contactus"
                  style={{
                    display: 'block',
                    backgroundColor: '#ffffff',
                    color: '#b29165',
                    padding: '13px 24px',
                    borderRadius: '50px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.2s',
                  }}
                >
                  Inquire &amp; Reserve Date
                </Link>
              </div>
            </div>
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
    </>
  );
}
