# Scroll-Film Details Page: 3-Step Publishing Guide

This guide describes how to publish a new interactive 120-frame scroll-film page to Lascigal.

No code modifications or router configurations are required per page.

---

## 3-Step Publishing Workflow

### Step 1: Place the Frames Folder & Stills
When you receive your `frames-<slug>.zip` and still images from your assistant (or export them using the `/admin/films` browser extractor):

1. Unzip the frames into:
   ```
   public/frames-<slug>/
   ```
   *Frame validation:* Ensure the folder contains exactly 120 WebP images named `frame_00001.webp` through `frame_00120.webp` (1280px wide).

2. Place the hero poster and gallery stills into:
   ```
   public/stills/
   ```
   *(e.g., `public/stills/my-hero.webp`)*

---

### Step 2: Add One Data Entry
Add a new JSON object to `data/scroll-films.json` (or use the **Add New Scroll Film** form in `/admin/films`):

```json
{
  "slug": "las-cigal",
  "title": "LAS CIGAL Convention Center",
  "tagline": "Celebrate in Style",
  "hero": "stills/las-cigal-hero.webp",
  "filmDir": "frames-las-cigal",
  "filmFrom": 1,
  "filmTo": 120,
  "filmLabel": "Celebrate in Style · LAS CIGAL film",
  "intro": [
    "LAS CIGAL Convention Center is a modern event venue built for weddings, conferences and large celebrations, with a grand entrance, landscaped grounds and a spacious main hall.",
    "Inside, the Majestic Hall seats a large gathering in comfort, with a raised stage, modern lighting and easy access — and outside, parking for 300 to 400 cars keeps arrival simple for every guest."
  ],
  "stats": {
    "hall": "Majestic Hall",
    "parking": "300 to 400 cars",
    "onsite": "Chocoberry Cakes & Bakes",
    "contact": "7306107515, 9048207515",
    "website": "www.lascigal.com"
  },
  "highlights": [
    { "title": "Majestic Hall", "body": "Large air-conditioned hall with rows of seating, a central carpet aisle and a raised stage." },
    { "title": "Grand entrance", "body": "Covered portico and wide paved forecourt for easy guest arrival and photographs." },
    { "title": "300–400 car parking", "body": "Large paved parking grounds shown in the aerial views, with a dedicated parking entrance." },
    { "title": "Chocoberry Cakes & Bakes", "body": "In-house cakes and bakes outlet at the front of the building." },
    { "title": "Day and night presence", "body": "The building is fully lit at night, with illuminated signage visible from the road and from the air." }
  ],
  "gallery": [
    "stills/las-cigal-hero.webp",
    "stills/gallery-aerial.webp",
    "stills/gallery-hall.webp",
    "stills/gallery-stage.webp",
    "stills/gallery-night-front.webp",
    "stills/gallery-night-aerial.webp"
  ],
  "contact": {
    "phones": ["7306107515", "9048207515"],
    "website": "www.lascigal.com"
  },
  "relatedSlugs": []
}
```

---

### Step 3: View the Live Page
Your new interactive scroll-film page is immediately live at:
```
https://www.lascigal.com/film/<slug>
```
*(e.g., `/film/las-cigal`)*

Unknown slugs automatically render the site's 404 page.

---

## Technical Specifications & Features

- **Player Component:** `components/ScrollFilm.tsx` (reusable, full-viewport sticky canvas).
- **Scrubbing:** Hardware-accelerated `requestAnimationFrame` lerp easing (`current += diff * 0.22`), no jitter or tearing.
- **Fitting:** Device Pixel Ratio (`dpr`) cover scaling, centered, zero stretching, zero gaps.
- **Preloading:** First 30 frames load eagerly on initial page load; frames 31–120 stream progressively. Hero poster displays instantly until frame 1 is ready.
- **Accessibility:** Automatically honors `prefers-reduced-motion: reduce` by replacing canvas scrubbing with the high-resolution hero poster and gallery.
- **In-Browser Extractor:** Available at `/admin/films` to turn any MP4/MOV into the 120-frame WebP ZIP completely client-side.
