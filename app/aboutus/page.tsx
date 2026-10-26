import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import '@/app/homepage.css';

export const revalidate = 60;

export default async function AboutUsPage() {
  const settingsList = await prisma.siteSetting.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';
  const logo = settings['site_logo'] || 'images/laslogo1.png';
  const directorTitle =
    settings['director_title'] ||
    'A Vision of Grandeur, Warmth & Unforgettable Celebrations';
  const directorMessage =
    settings['director_message'] ||
    'Welcome to Lascigal Convention Center.\n\nWhen we set out to build Lascigal in Kalampoor, our dream was not merely to create another banquet venue, but to craft an architectural landmark that elevates every milestone of life into a cherished, timeless memory. From the majestic pillarless sightlines of our grand auditorium to our climate-controlled dining hall and landscaped arrivals, every single detail has been engineered with uncompromising devotion to excellence.\n\nWe understand that a wedding, an anniversary, or an executive conference is far more than a gathering—it is a sacred celebration of love, achievement, and family togetherness. That is why our team is committed to delivering not only world-class infrastructure and seamless logistics, but the genuine Kerala warmth, care, and hospitality that makes every guest feel truly honored.\n\nOn behalf of the entire Lascigal family, I welcome you to experience our venue, celebrate your finest moments with us, and let us help write the next beautiful chapter of your story.';

  // Sanitize YouTube URL in case raw embed HTML / iframe attributes were stored
  const rawVideoUrl =
    settings['director_video_url'] ||
    'https://www.youtube.com/embed/AzCr_TVEpe0?si=M3fNrsrxDAMWlMbA';
  const videoMatch = rawVideoUrl.match(/src=["']?([^"'\s>]+)/i);
  const videoUrl = videoMatch
    ? videoMatch[1]
    : rawVideoUrl.split(/[\s"']/)[0] ||
      'https://www.youtube.com/embed/AzCr_TVEpe0?si=M3fNrsrxDAMWlMbA';

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

      {/* ─── LUXURY HERO BANNER ─── */}
      <section className="las_page_hero">
        <div className="las_page_hero_inner">
          <span className="las_page_badge">Our Vision &amp; Heritage</span>
          <h1 className="las_page_title">About Lascigal</h1>
          <nav className="las_breadcrumbs" aria-label="Breadcrumbs">
            <Link href="/">Home</Link>
            <span className="las_breadcrumbs_sep">/</span>
            <span className="las_breadcrumbs_current">About Us</span>
          </nav>
        </div>
      </section>

      {/* ─── DIRECTOR'S MESSAGE SECTION ─── */}
      <section className="las_section" style={{ backgroundColor: '#ffffff' }}>
        <div className="las_container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: '50px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Message */}
            <div>
              <span className="las_eyebrow">Director&apos;s Word</span>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(24px, 3.5vw, 36px)',
                  lineHeight: 1.3,
                  color: '#0f172a',
                  margin: '10px 0 24px',
                }}
              >
                {directorTitle}
              </h2>

              <div style={{ color: '#475569', lineHeight: 1.8, fontSize: '15.5px' }}>
                {directorMessage.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '18px' }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Director Signature & Credentials */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e2e8f0',
                  marginTop: '24px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(190, 159, 118, 0.15)',
                    border: '2px solid #be9f76',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#be9f76',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}
                >
                  <i className="fas fa-user-tie" />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '19px',
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: '0 0 2px',
                    }}
                  >
                    Baiju Thomas
                  </h4>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#be9f76', fontWeight: 600 }}>
                    Managing Director &amp; Visionary
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                    Malekudiyil Lascigal Convention Center
                  </p>
                </div>
              </div>

              {/* Social Channels */}
              <div style={{ marginTop: '28px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a
                  href="#"
                  aria-label="Facebook"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fab fa-facebook-f" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fab fa-instagram" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fab fa-youtube" />
                </a>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hello%20Lascigal`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 211, 102, 0.15)',
                    color: '#25D366',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fab fa-whatsapp" />
                </a>
              </div>
            </div>

            {/* Right Column: Video Embed */}
            <div>
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  backgroundColor: '#be9f76',
                  border: '1.5px solid rgba(190, 159, 118, 0.4)',
                }}
              >
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  src={videoUrl}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Lascigal Showcase Video"
                />
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
