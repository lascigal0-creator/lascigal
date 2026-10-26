import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Lascigal database...');

  // 1. Site Settings
  const settings = [
    { key: 'site_logo', value: 'images/laslogo1.png' },
    { key: 'site_favicon', value: 'images/favicons.png' },
    { key: 'site_title', value: 'Lascigal Convention Centre | Kalampoor, Muvattupuzha' },
    { key: 'site_description', value: 'Lascigal Convention Centre offers spacious air-conditioned halls, modern audio-visual amenities, dedicated dining, and ample car parking for weddings, corporate summits, and celebrations.' },
    { key: 'phone_primary', value: '7306107515' },
    { key: 'phone_secondary', value: '9745897834' },
    { key: 'whatsapp_number', value: '917306107515' },
    { key: 'email_address', value: 'lascigal@gmail.com' },
    { key: 'address_line1', value: 'Las Cigal Convention Center, Kalampoor, Muvattupuzha, Ernakulam District, Kerala' },
    { key: 'address_pincode', value: '' },
    { key: 'google_maps_url', value: 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8' },
    { key: 'google_maps_embed', value: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14223.02209307127!2d76.6284003!3d9.9972091!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e79536923b0b%3A0x1d30fe64d311d295!2sLas%20Cigal%20Convention%20Centre%2C%20Kalampoor!5e1!3m2!1sen!2sin!4v1758356626772!5m2!1sen!2sin' },
    { key: 'offer_banner_text', value: '“Exclusive Deal: Reserve your spot today & save big with our limited-time discount!”' },
    { key: 'hero_heading', value: 'Creating Unforgettable Moments for Every Occasion' },
    { key: 'hero_subheading', value: 'Welcome to Lascigal Convention Centre' },
    { key: 'hero_image', value: 'images/gallery/DSC01156.jpg.webp' },
    { key: 'about_heading', value: 'Transforming Events Into Experiences Celebrating Life' },
    { key: 'about_text', value: 'At Lascigal Convention Center, we believe every event is more than just a gathering—it’s a memory in the making. Our vision has always been to create a space where elegance meets excellence, and where your special moments are celebrated with the care, warmth, and sophistication they truly deserve.' },
    { key: 'about_image', value: 'images/gallery/FRONT_VIEW.jpeg' },
    { key: 'director_title', value: 'A Vision of Grandeur, Warmth & Unforgettable Celebrations' },
    { key: 'director_message', value: 'Welcome to Lascigal Convention Center.\n\nWhen we set out to build Lascigal in Kalampoor, our dream was not merely to create another banquet venue, but to craft an architectural landmark that elevates every milestone of life into a cherished, timeless memory. From the majestic pillarless sightlines of our grand auditorium to our climate-controlled dining hall and landscaped arrivals, every single detail has been engineered with uncompromising devotion to excellence.\n\nWe understand that a wedding, an anniversary, or an executive conference is far more than a gathering—it is a sacred celebration of love, achievement, and family togetherness. That is why our team is committed to delivering not only world-class infrastructure and seamless logistics, but the genuine Kerala warmth, care, and hospitality that makes every guest feel truly honored.\n\nOn behalf of the entire Lascigal family, I welcome you to experience our venue, celebrate your finest moments with us, and let us help write the next beautiful chapter of your story.' },
    { key: 'director_video_url', value: 'https://www.youtube.com/embed/AzCr_TVEpe0?si=M3fNrsrxDAMWlMbA' },
    { key: 'director_eyebrow', value: 'Message from Management' },
    { key: 'director_signatory_name', value: 'Management' },
    { key: 'director_signatory_role', value: 'Las Cigal Convention Centre' },
    { key: 'director_signatory_sub', value: 'Kalampoor, Muvattupuzha, Kerala' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log(`✓ Seeded ${settings.length} site settings`);

  // 2. Venue Facilities (Homepage 6 core features)
  const facilities = [
    {
      title: 'Spacious Air-Conditioned Halls',
      description: 'Fully central air-conditioned halls accommodating grand weddings, formal galas, and business summits comfortably.',
      image: 'images/INDEX_ITEMS/hall1.jpg',
      icon: 'fas fa-building-columns',
      order: 1,
    },
    {
      title: 'Ample Car Parking Facility',
      description: 'Extensive on-site parking spaces with hassle-free parking management for hundreds of vehicles.',
      image: 'images/INDEX_ITEMS/car.jpeg',
      icon: 'fas fa-car',
      order: 2,
    },
    {
      title: 'Dedicated Food & Dining Area',
      description: 'Expansive banquet dining hall designed for seamless buffet and traditional feast service with modern kitchen amenities.',
      image: 'images/INDEX_ITEMS/food.jpg',
      icon: 'fas fa-utensils',
      order: 3,
    },
    {
      title: 'Fully-Equipped Conference Hall',
      description: 'State-of-the-art audiovisual setups, acoustic architecture, and modular layouts for corporate summits.',
      image: 'images/INDEX_ITEMS/hall.jpeg',
      icon: 'fas fa-chalkboard-user',
      order: 4,
    },
    {
      title: 'Dedicated Security Services',
      description: '24/7 CCTV surveillance, fire-safety certified facilities, and trained security personnel for peace of mind.',
      image: 'images/INDEX_ITEMS/sequ.jpg',
      icon: 'fas fa-shield-halved',
      order: 5,
    },
    {
      title: 'Streamlined Guest Experience',
      description: 'Elevator accessibility, bridal green rooms, guest lounges, and clean restroom facilities.',
      image: 'images/INDEX_ITEMS/lift.jpeg',
      icon: 'fas fa-elevator',
      order: 6,
    },
  ];

  await prisma.venueFacility.deleteMany({});
  for (const f of facilities) {
    await prisma.venueFacility.create({ data: f });
  }
  console.log(`✓ Seeded ${facilities.length} venue facilities`);

  // 3. Event Categories & Event Services
  const cat1 = await prisma.eventCategory.upsert({
    where: { slug: 'lifes-celebrations' },
    update: { name: "Life's Celebrations", order: 1 },
    create: { name: "Life's Celebrations", slug: 'lifes-celebrations', order: 1 },
  });

  const cat2 = await prisma.eventCategory.upsert({
    where: { slug: 'conferences-conventions' },
    update: { name: 'Conferences & Conventions', order: 2 },
    create: { name: 'Conferences & Conventions', slug: 'conferences-conventions', order: 2 },
  });

  const events = [
    {
      slug: 'weddings-receptions',
      title: 'Weddings & Receptions',
      categoryId: cat1.id,
      categoryName: "Life's Celebrations",
      heroImage: 'images/gallery/portfolio/wed1.jpeg',
      summary: 'Grand celebrations with bespoke stage decors, air-conditioned banquet facilities, and seamless hospitality.',
      description: 'Make your wedding day truly unforgettable at Lascigal Convention Center. We offer expansive air-conditioned auditoriums, magnificent stage backdrops, dedicated green rooms for bride and groom, and a dedicated dining hall that caters effortlessly to thousands of guests.',
      features: [
        'Grand air-conditioned auditorium',
        'Dedicated bride & groom suites',
        'Expansive banquet dining hall',
        'Advanced acoustics and stage lighting',
        'Ample parking with valet assistance',
      ],
      galleryImages: [
        'images/gallery/wed.png',
        'images/gallery/wed1.jpeg',
        'images/gallery/hall3.jpeg',
        'images/gallery/8 (5).jpeg',
      ],
      order: 1,
    },
    {
      slug: 'engagement-betrothal',
      title: 'Engagement & Betrothal',
      categoryId: cat1.id,
      categoryName: "Life's Celebrations",
      heroImage: 'images/gallery/portfolio/en.jpeg',
      summary: 'Intimate to grand engagement ceremonies in an opulent, picture-perfect setting.',
      description: 'Celebrate the beginning of your forever in an ambiance that reflects love and elegance. From floral stage styling to curated guest experiences, Lascigal provides the perfect canvas for your engagement ceremony.',
      features: [
        'Custom floral stage design',
        'Crystal clear sound setup for ceremonies',
        'Comfortable seating arrangements',
        'Fine dining catering infrastructure',
      ],
      galleryImages: [
        'images/gallery/8 (3).jpeg',
        'images/gallery/wed1.jpeg',
      ],
      order: 2,
    },
    {
      slug: 'birthdays-anniversaries',
      title: 'Birthdays & Anniversaries',
      categoryId: cat1.id,
      categoryName: "Life's Celebrations",
      heroImage: 'images/gallery/portfolio/bithday.jpg',
      summary: 'Vibrant celebrations filled with joy, music, and exquisite catering.',
      description: 'Whether it is a milestone first birthday, sweet sixteen, silver jubilee, or 50th golden anniversary, Lascigal creates joyous memories with vibrant themes, fun party lighting, and appetizing spreads.',
      features: [
        'Themed decorations and lighting',
        'Dedicated dance and music setup',
        'Custom buffet arrangements',
        'Family-friendly spaces and accessibility',
      ],
      galleryImages: [
        'images/gallery/BIRTHDAY01.jpeg',
        'images/gallery/BIRTHDAY1.jpeg',
      ],
      order: 3,
    },
    {
      slug: 'baptisms-naming',
      title: 'Baptisms & Naming',
      categoryId: cat1.id,
      categoryName: "Life's Celebrations",
      heroImage: 'images/gallery/portfolio/child.jpeg',
      summary: 'Blessing your little one with family and friends in a warm and serene ambiance.',
      description: 'A serene and joyous venue to welcome your child. Lascigal offers comfortable family seating, ambient music, and hospitality that lets you focus entirely on your little one and your cherished guests.',
      features: [
        'Warm and welcoming environment',
        'Comfortable dining setups',
        'Ample parking for family convenience',
      ],
      galleryImages: [
        'images/gallery/BIRTHDAY1.jpeg',
        'images/gallery/portfolio/child.jpeg',
      ],
      order: 4,
    },
    {
      slug: 'social-family-gatherings',
      title: 'Social & Family Gatherings',
      categoryId: cat1.id,
      categoryName: "Life's Celebrations",
      heroImage: 'images/gallery/portfolio/gathering.png',
      summary: 'Reunions, community get-togethers, and family festivities.',
      description: 'From grand alumni meets to extended family reunions and festive banquets, our flexible spaces cater to gatherings of every scale with ease and warmth.',
      features: [
        'Flexible seating configurations',
        'Full dining service support',
        'High-capacity parking',
      ],
      galleryImages: [
        'images/gallery/FRONT_VIEW.jpeg',
        'images/INDEX_ITEMS/food.jpg',
      ],
      order: 5,
    },
    {
      slug: 'conferences-summits',
      title: 'Conferences & Summits',
      categoryId: cat2.id,
      categoryName: 'Conferences & Conventions',
      heroImage: 'images/gallery/portfolio/meeting.jpg',
      summary: 'Professional business summits and international conferences with high-tech audiovisual equipment.',
      description: 'Elevate your corporate events at Lascigal. Equipped with cutting-edge AV technology, high-speed connectivity, professional podiums, and VIP green rooms, we host corporate summits with world-class distinction.',
      features: [
        'High-definition LED screens and projectors',
        'Acoustically treated conference hall',
        'High-speed Wi-Fi and presentation tech',
        'Executive dining and coffee lounge zones',
      ],
      galleryImages: [
        'images/gallery/screen.jpeg',
        'images/INDEX_ITEMS/hall.jpeg',
      ],
      order: 6,
    },
    {
      slug: 'trade-shows-exhibitions',
      title: 'Trade Shows & Exhibitions',
      categoryId: cat2.id,
      categoryName: 'Conferences & Conventions',
      heroImage: 'images/gallery/portfolio/show.jpg',
      summary: 'Expansive floor areas designed for large crowds, exhibition booths, and brand presentations.',
      description: 'Spacious column-free spaces allowing seamless stall setups, product showcases, and high-footfall brand exhibitions with heavy-load electrical routing and logistics bays.',
      features: [
        'Expansive open exhibition area',
        'Convenient vehicle loading & unloading bays',
        'Dedicated attendee parking zones',
      ],
      galleryImages: [
        'images/INDEX_ITEMS/3(1).png',
        'images/INDEX_ITEMS/hall_1.jpeg',
      ],
      order: 7,
    },
    {
      slug: 'awards-gala-dinners',
      title: 'Awards & Gala Dinners',
      categoryId: cat2.id,
      categoryName: 'Conferences & Conventions',
      heroImage: 'images/gallery/portfolio/award.jpg',
      summary: 'Prestige award nights, corporate galas, and celebratory dinners in supreme style.',
      description: 'Host your company award ceremony or annual gala dinner with glamour. Stage lighting, red-carpet entryway, premium dining, and pristine acoustics make every celebration unforgettable.',
      features: [
        'Red carpet arrival and backdrop photo zones',
        'Multi-tiered stage and spotlighting',
        'Exquisite banquet culinary service',
      ],
      galleryImages: [
        'images/gallery/1.jpeg',
        'images/gallery/7.jpg',
      ],
      order: 8,
    },
  ];

  for (const e of events) {
    await prisma.eventService.upsert({
      where: { slug: e.slug },
      update: e,
      create: e,
    });
  }
  console.log(`✓ Seeded ${events.length} event services`);

  // 4. Gallery Items (Cobbles / Lightbox)
  const galleryItems = [
    { title: 'Birthday Celebration Stage', altText: 'BIRTHDAY', category: 'Birthday', image: 'images/gallery/BIRTHDAY01.jpeg', order: 1 },
    { title: 'Lascigal Front View', altText: 'lascigal', category: 'Exterior', image: 'images/gallery/FRONT_VIEW.jpeg', order: 2 },
    { title: 'Ample Car Parking', altText: 'parking', category: 'Parking', image: 'images/INDEX_ITEMS/3(1).png', order: 3 },
    { title: 'Cake Cutting Ceremony', altText: 'cake', category: 'Birthday', image: 'images/gallery/BIRTHDAY1.jpeg', order: 4 },
    { title: 'Stage Decor', altText: 'Engagement', category: 'Stage', image: 'images/portfolio/wed1.jpeg', order: 5 },
    { title: 'Banquet Dining Hall', altText: 'Dining', category: 'Dining', image: 'images/gallery/8 (2).jpeg', order: 6 },
    { title: 'LED Screen Setup', altText: 'Screen', category: 'Hall', image: 'images/gallery/screen.jpeg', order: 7 },
    { title: 'Engagement Stage', altText: 'Engagement', category: 'Stage', image: 'images/gallery/8 (3).jpeg', order: 8 },
    { title: 'Wedding Auditorium', altText: 'Wedding hall', category: 'Hall', image: 'images/gallery/hall3.jpeg', order: 9 },
    { title: 'Security Services', altText: 'Security', category: 'Amenities', image: 'images/INDEX_ITEMS/sequ.jpg', order: 10 },
    { title: 'Dining Setup', altText: 'Dining', category: 'Dining', image: 'images/gallery/wed.png', order: 11 },
    { title: 'Banquet Table Setting', altText: 'Dining', category: 'Dining', image: 'images/gallery/wed1.jpeg', order: 12 },
    { title: 'Floral Wedding Stage', altText: 'Wedding', category: 'Stage', image: 'images/gallery/8 (5).jpeg', order: 13 },
    { title: 'Convention Center View', altText: 'View', category: 'Exterior', image: 'images/index_banner/1.png', order: 14 },
    { title: 'Celebration Moment', altText: 'Love', category: 'Events', image: 'images/index_banner/4.jpg', order: 15 },
    { title: 'Auditorium Hall', altText: 'Hall', category: 'Hall', image: 'images/INDEX_ITEMS/hall.jpeg', order: 16 },
    { title: 'Venue Entrance', altText: 'View', category: 'Exterior', image: 'images/index_banner/2.jpeg', order: 17 },
    { title: 'Dining Hall Experience', altText: 'Dining', category: 'Dining', image: 'images/INDEX_ITEMS/4.jpg', order: 18 },
    { title: 'Main Conference Hall', altText: 'Hall', category: 'Hall', image: 'images/INDEX_ITEMS/hall_1.jpeg', order: 19 },
    { title: 'Catering & Food Display', altText: 'Dining', category: 'Dining', image: 'images/INDEX_ITEMS/food.jpg', order: 20 },
    { title: 'Paved Parking Area', altText: 'Parking', category: 'Parking', image: 'images/INDEX_ITEMS/3.png', order: 21 },
    { title: 'Elevator & Modern Amenities', altText: 'Amenities', category: 'Amenities', image: 'images/INDEX_ITEMS/lift.jpeg', order: 22 },
    { title: 'Illuminated Night View', altText: 'Night', category: 'Exterior', image: 'images/gallery/1.jpeg', order: 23 },
    { title: 'Decorated Event Hall', altText: 'Hall', category: 'Hall', image: 'images/gallery/7.jpg', order: 24 },
    { title: 'Photographic Showcase 1', altText: 'Gallery image DSC01146', category: 'Showcase', image: 'images/gallery/DSC01146.jpg.webp', order: 25 },
    { title: 'Photographic Showcase 2', altText: 'Gallery image DSC01156', category: 'Showcase', image: 'images/gallery/DSC01156.jpg.webp', order: 26 },
    { title: 'Photographic Showcase 3', altText: 'Gallery image DSC01186', category: 'Showcase', image: 'images/gallery/DSC01186.jpg.webp', order: 27 },
    { title: 'Photographic Showcase 4', altText: 'Gallery image DSC01198', category: 'Showcase', image: 'images/gallery/DSC01198.jpg.webp', order: 28 },
    { title: 'Photographic Showcase 5', altText: 'Gallery image DSC01272', category: 'Showcase', image: 'images/gallery/DSC01272.jpg.webp', order: 29 },
  ];

  await prisma.galleryItem.deleteMany({});
  for (const g of galleryItems) {
    await prisma.galleryItem.create({ data: g });
  }
  console.log(`✓ Seeded ${galleryItems.length} gallery items`);

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
