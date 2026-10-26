export default function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['EventVenue', 'LocalBusiness'],
        '@id': 'https://www.lascigal.com/#venue',
        name: 'Lascigal Convention Centre',
        alternateName: [
          'Las Cigal Convention Center',
          'Malekudiyil Lascigal',
          'Las Cigal Majestic Hall',
        ],
        url: 'https://www.lascigal.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.lascigal.com/images/laslogo1.png',
        },
        image: [
          'https://www.lascigal.com/stills/las-cigal-hero.webp',
          'https://www.lascigal.com/stills/gallery-aerial.webp',
          'https://www.lascigal.com/stills/gallery-hall.webp',
          'https://www.lascigal.com/stills/gallery-night-front.webp',
        ],
        description:
          'Lascigal Convention Centre is a premier luxury event venue in Kalampoor, Muvattupuzha, Kerala featuring the air-conditioned Majestic Hall, luxury banquet dining, and generous 300 to 400 car parking for weddings, conferences, and celebrations.',
        telephone: ['+917306107515', '+919745897834'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Piravom Road, Kalampoor',
          addressLocality: 'Muvattupuzha',
          addressRegion: 'Kerala',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 9.9972091,
          longitude: 76.6284003,
        },
        hasMap: 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8',
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, Credit Card, UPI, Bank Transfer',
        amenityFeature: [
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Air Conditioned Banquet Hall',
            value: true,
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: '300 to 400 Car Parking',
            value: true,
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Pillarless Sightlines',
            value: true,
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Chocoberry Cakes & Bakes Counter',
            value: true,
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: '100% Diesel Generator Power Backup',
            value: true,
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Wheelchair Accessible Ramps & Elevators',
            value: true,
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.lascigal.com/#website',
        url: 'https://www.lascigal.com',
        name: 'Lascigal Convention Centre',
        description: 'Celebrate in Style at Lascigal Convention Centre, Kalampoor, Muvattupuzha.',
        publisher: {
          '@id': 'https://www.lascigal.com/#venue',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
