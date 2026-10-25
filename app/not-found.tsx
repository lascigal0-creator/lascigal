import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import '@/app/homepage.css';

export const revalidate = 300;

export default async function NotFound() {
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

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

      <main
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <span
            style={{
              fontSize: '84px',
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
              color: '#be9f76',
              display: 'block',
              lineHeight: 1,
              marginBottom: '16px',
            }}
          >
            404
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              color: '#0f172a',
              margin: '0 0 16px',
              fontWeight: 700,
            }}
          >
            Page or Experience Not Found
          </h1>
          <p
            style={{
              color: '#64748b',
              fontSize: '16px',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            The interactive tour or page you requested could not be located. It may have been moved, renamed, or is temporarily unavailable.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link
              href="/"
              style={{
                backgroundColor: '#be9f76',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '15px',
              }}
            >
              Return to Homepage
            </Link>
            <Link
              href="/film/las-cigal"
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '15px',
              }}
            >
              View Lascigal Tour
            </Link>
          </div>
        </div>
      </main>

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
