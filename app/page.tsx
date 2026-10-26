import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import CouponGenerator from '@/components/CouponGenerator';
import prisma from '@/lib/prisma';
import { mediaUrl } from '@/lib/media';
import { getAllScrollFilms } from '@/lib/scroll-film';
import './homepage.css';

// Revalidate page data every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const [settingsList, facilities, featuredEvents] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.venueFacility.findMany({ orderBy: { order: 'asc' } }),
    prisma.eventService.findMany({ orderBy: { order: 'asc' }, take: 8 }),
  ]);

  const scrollFilms = getAllScrollFilms();

  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';
  const logo = settings['site_logo'] || 'images/laslogo1.png';

  const heroHeading = settings['hero_heading'] || 'Creating Unforgettable Moments for Every Occasion';
  const heroSubheadingRaw = settings['hero_subheading'] || 'Welcome to Lascigal Convention Centre';
  const heroSubheading =
    heroSubheadingRaw.trim().toLowerCase() === 'welcome'
      ? 'Welcome to Lascigal Convention Centre'
      : heroSubheadingRaw;
  const heroImage = settings['hero_image'] || 'images/gallery/DSC01156.jpg.webp';
  const offerBannerText =
    settings['offer_banner_text'] ||
    'Exclusive Deal: Reserve your spot today & save big with our limited-time discount!';
  const aboutHeading = settings['about_heading'] || 'Transforming Events Into Experiences Celebrating Life';
  const aboutText =
    settings['about_text'] ||
    'At Lascigal Convention Center, we believe every event is more than just a gathering—it\u2019s a memory in the making. Our vision has always been to create a space where elegance meets excellence, and where your special moments are celebrated with the care, warmth, and sophistication they truly deserve.';
  const aboutImage = settings['about_image'] || 'images/gallery/FRONT_VIEW.jpeg';

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <Header
        phone1={phone1}
        phone2={phone2}
        whatsapp={whatsapp}
        mapsUrl={mapsUrl}
        logo={logo}
      />

      {/* ─── HERO BANNER ─── */}
      <section className="las_hero_section">
        <div className="las_hero_bg_wrap">
          <Image
            src={mediaUrl(heroImage)}
            alt="Lascigal Convention Center Grand Hall"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
          <div className="las_hero_overlay" />
        </div>

        <div className="las_hero_content">
          <div className="las_hero_badge">
            <span>✦</span>
            <span>{heroSubheading}</span>
          </div>

          <h1 className="las_hero_title">{heroHeading}</h1>

          <p className="las_hero_description">
            Premier destination in Kalampoor, Muvattupuzha for grand weddings, formal conventions,
            family celebrations, and milestone events with world-class hospitality.
          </p>

          <div className="las_hero_btn_group">
            <a href="#book" className="las_hero_btn_primary">
              <span>Reserve Your Date</span>
              <i className="fas fa-arrow-right" />
            </a>

            <Link href="/gallery" className="las_hero_btn_secondary">
              <i className="fas fa-images" />
              <span>Explore Gallery</span>
            </Link>

            <a
              href={`https://wa.me/${whatsapp}?text=Hello%20Lascigal%20Convention%20Centre,%20I%20would%20like%20to%20inquire%20about%20booking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="las_hero_btn_wa"
            >
              <i className="fab fa-whatsapp" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Trust Highlight Pills */}
          <div className="las_hero_pills_strip">
            <div className="las_hero_pill_item">
              <i className="fas fa-users" />
              <span>1000+ Guests</span>
            </div>
            <div className="las_hero_pill_item">
              <i className="fas fa-snowflake" />
              <span>Central AC</span>
            </div>
            <div className="las_hero_pill_item">
              <i className="fas fa-square-parking" />
              <span>Ample Parking</span>
            </div>
            <div className="las_hero_pill_item">
              <i className="fas fa-utensils" />
              <span>Banquet Dining</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OFFER RIBBON ─── */}
      <section id="offer" className="las_offer_ribbon">
        <div className="las_container las_offer_inner">
          <div className="las_offer_icon_badge">
            <i className="fas fa-tag" />
          </div>
          <div className="las_offer_text_wrap">
            <h2 className="las_offer_text">{offerBannerText}</h2>
          </div>
          <a href="#coupon" className="las_offer_btn">
            Claim Discount →
          </a>
        </div>
      </section>

      {/* ─── FACILITIES ─── */}
      <section id="facilities" className="las_section las_section_facilities">
        <div className="las_container">
          <div className="las_section_header">
            <span className="las_eyebrow">World-Class Infrastructure</span>
            <h2 className="las_section_title">Premier Convention &amp; Event Facilities</h2>
            <p className="las_section_subtitle">
              Every detail engineered to ensure seamless grandeur, exceptional comfort, and peace of mind.
            </p>
          </div>

          <div className="las_facilities_grid">
            {facilities.map((fac, idx) => (
              <div key={fac.id} className="las_facility_card">
                <div className="las_facility_img_wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(fac.image)}
                    alt={fac.title}
                    className="las_facility_img"
                    loading="lazy"
                  />
                  <div className="las_facility_num_badge">{idx < 9 ? `0${idx + 1}` : idx + 1}</div>
                </div>

                <div className="las_facility_content">
                  <div className="las_facility_title_row">
                    {fac.icon && (
                      <div className="las_facility_icon_circle">
                        <i className={fac.icon} />
                      </div>
                    )}
                    <h3 className="las_facility_title">{fac.title}</h3>
                  </div>
                  <p className="las_facility_desc">{fac.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section id="about" className="las_section las_section_about">
        <div className="las_container">
          <div className="las_about_grid">
            <div className="las_about_text_col">
              <span className="las_eyebrow">About Lascigal Convention Centre</span>
              <h2 className="las_about_title">{aboutHeading}</h2>
              <p className="las_about_p">{aboutText}</p>

              <div className="las_about_checks">
                <div className="las_check_item">
                  <i className="fas fa-check-circle" />
                  <span>Multi-tier Stage &amp; Dynamic Audio-Visual Systems</span>
                </div>
                <div className="las_check_item">
                  <i className="fas fa-check-circle" />
                  <span>Dedicated Bride &amp; Groom VIP Green Rooms</span>
                </div>
                <div className="las_check_item">
                  <i className="fas fa-check-circle" />
                  <span>CCTV Surveillance &amp; Professional Valet Management</span>
                </div>
              </div>

              <div className="las_about_actions">
                <Link href="/aboutus" className="las_btn_gold">
                  <span>Director&apos;s Message</span>
                  <i className="fas fa-arrow-right" />
                </Link>
                <a href="#book" className="las_btn_outline">
                  Inquire Venue
                </a>
              </div>
            </div>

            <div className="las_about_img_col">
              <div className="las_about_img_card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(aboutImage)}
                  alt="Lascigal Convention Center Architecture"
                  className="las_about_img"
                />
                <div className="las_about_img_badge">
                  <span className="las_badge_num">1000+</span>
                  <span className="las_badge_text">Guest Capacity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EVENTS SHOWCASE ─── */}
      <section id="events" className="las_section las_section_events">
        <div className="las_container">
          <div className="las_section_header">
            <span className="las_eyebrow">Exceptional Experiences</span>
            <h2 className="las_section_title">Crafted for Every Milestone &amp; Celebration</h2>
            <p className="las_section_subtitle">
              From lavish traditional weddings to high-profile business conferences, our versatile venues adapt to your aspirations.
            </p>
          </div>

          <div className="las_events_grid">
            {featuredEvents.map((evt) => (
              <Link
                key={evt.id}
                href={`/events/${evt.slug}`}
                className="las_event_card"
              >
                <div className="las_event_img_wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(evt.heroImage)}
                    alt={evt.title}
                    className="las_event_img"
                    loading="lazy"
                  />
                  <span className="las_event_cat_badge">{evt.categoryName}</span>
                </div>

                <div className="las_event_body">
                  <h3 className="las_event_title">{evt.title}</h3>
                  <p className="las_event_summary">
                    {evt.summary ? evt.summary.slice(0, 90) + '...' : 'Explore seating arrangements and hall configurations.'}
                  </p>
                  <span className="las_event_link_arrow">
                    <span>View Details</span>
                    <i className="fas fa-arrow-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="las_events_footer_btn">
            <Link href="/portfolio" className="las_btn_dark_lg">
              <span>View All Events</span>
              <i className="fas fa-layer-group" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CINEMATIC SCROLL FILMS ─── */}
      <section id="films" className="las_section" style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
        <div className="las_container">
          <div className="las_section_header">
            <span className="las_eyebrow">Interactive Virtual Exploration</span>
            <h2 className="las_section_title">Cinematic 120-Frame Scroll Films</h2>
            <p className="las_section_subtitle">
              Control your tour with precision frame-by-frame scrolling. Experience our grand spaces, architectural mastery, and atmosphere at your own pace.
            </p>
          </div>

          <div className="las_events_grid">
            {scrollFilms.map((film) => (
              <Link
                key={film.slug}
                href={`/film/${film.slug}`}
                className="las_event_card"
              >
                <div className="las_event_img_wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(film.heroImage)}
                    alt={film.title}
                    className="las_event_img"
                    loading="lazy"
                  />
                  <span className="las_event_cat_badge">120-Frame Film</span>
                </div>

                <div className="las_event_body">
                  <h3 className="las_event_title">{film.title}</h3>
                  <p className="las_event_summary">
                    {film.tagline}
                  </p>
                  <span className="las_event_link_arrow">
                    <span>Scrub Film</span>
                    <i className="fas fa-play" style={{ fontSize: '11px' }} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COUPON GENERATOR ─── */}
      <section id="coupon" className="las_section las_section_coupon">
        <div className="las_container">
          <div className="las_coupon_card">
            <div className="las_coupon_badge">
              <i className="fas fa-gift" />
              <span>Special Promotional Offer</span>
            </div>
            <h3 className="las_coupon_title">Claim Your Exclusive Venue Discount</h3>
            <p className="las_coupon_desc">
              Generate your unique promo code below and mention it during reservation to receive special pricing on wedding and corporate dates.
            </p>
            <div className="las_coupon_generator_box">
              <CouponGenerator />
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOOKING FORM ─── */}
      <section id="book" className="las_section las_section_booking">
        <div className="las_container">
          <div className="las_booking_card">
            <div className="las_section_header" style={{ marginBottom: '32px' }}>
              <span className="las_eyebrow">Reserve Your Date</span>
              <h2 className="las_section_title">Book Lascigal Convention Centre</h2>
              <p className="las_section_subtitle">
                Fill out the inquiry form below. Our venue coordinators will get back to you with availability and customized packages.
              </p>
            </div>

            <BookingForm />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
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
