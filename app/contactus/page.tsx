import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import CouponGenerator from '@/components/CouponGenerator';
import prisma from '@/lib/prisma';
import '@/app/homepage.css';

export const revalidate = 60;

export default async function ContactUsPage() {
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
  const email = settings['email_address'] || 'lascigal@gmail.com';
  const addressLine1 = settings['address_line1'] || 'Las Cigal Convention Center, Kalampoor, Muvattupuzha, Ernakulam District, Kerala';
  const addressPincode = settings['address_pincode'] || '';

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

      {/* ─── LUXURY HERO BANNER ─── */}
      <section className="las_page_hero">
        <div className="las_page_hero_inner">
          <span className="las_page_badge">Get In Touch</span>
          <h1 className="las_page_title">Contact &amp; Reservations</h1>
          <nav className="las_breadcrumbs" aria-label="Breadcrumbs">
            <Link href="/">Home</Link>
            <span className="las_breadcrumbs_sep">/</span>
            <span className="las_breadcrumbs_current">Contact Us</span>
          </nav>
        </div>
      </section>

      {/* ─── CONTACT CARDS SECTION ─── */}
      <section className="las_section" style={{ backgroundColor: '#ffffff', padding: '60px 0 20px' }}>
        <div className="las_container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '24px',
              marginBottom: '50px',
            }}
          >
            {/* Card 1: Phone */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(197, 168, 128, 0.15)',
                  color: '#c5a880',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginBottom: '16px',
                }}
              >
                <i className="fas fa-phone-alt" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 8px', fontWeight: 700 }}>
                Direct Hotline
              </h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 12px' }}>
                Call us directly for date availability and hall bookings.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: 600, fontSize: '14.5px' }}>
                <a href={`tel:${phone1}`} style={{ color: '#c5a880' }}>
                  {phone1}
                </a>
                <a href={`tel:${phone2}`} style={{ color: '#c5a880' }}>
                  {phone2}
                </a>
              </div>
            </div>

            {/* Card 2: WhatsApp */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(37, 211, 102, 0.15)',
                  color: '#25D366',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '16px',
                }}
              >
                <i className="fab fa-whatsapp" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 8px', fontWeight: 700 }}>
                WhatsApp Chat
              </h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 12px' }}>
                Connect with our venue manager on WhatsApp.
              </p>
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%20Lascigal%20Convention%20Centre`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  color: '#25D366',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Start Instant Chat →
              </a>
            </div>

            {/* Card 3: Location */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(197, 168, 128, 0.15)',
                  color: '#c5a880',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginBottom: '16px',
                }}
              >
                <i className="fas fa-map-marker-alt" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 8px', fontWeight: 700 }}>
                Venue Address
              </h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 12px' }}>
                {addressLine1}{addressPincode ? `, PIN: ${addressPincode}` : ''}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#c5a880',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Open Google Maps →
              </a>
            </div>

            {/* Card 4: Email */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(197, 168, 128, 0.15)',
                  color: '#c5a880',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginBottom: '16px',
                }}
              >
                <i className="fas fa-envelope" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 8px', fontWeight: 700 }}>
                Official Email
              </h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 12px' }}>
                Send formal RFPs, invoices, or event specifications.
              </p>
              <a
                href={`mailto:${email}`}
                style={{
                  color: '#c5a880',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COUPON SECTION ─── */}
      <section className="las_section_coupon" style={{ padding: '60px 0' }}>
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

      {/* ─── BOOKING SECTION ─── */}
      <section className="las_section las_section_booking">
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
