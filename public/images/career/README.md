# Career moment photos

These power the **Career Moments** gallery on the About page
(`/vi/gioi-thieu-luat-su`, `/en/lawyer-profile`), plus the hero and bio
portraits.

## Current state
`01.webp` … `18.webp` are Mr Hien's photos, optimized (WebP, ≤1600px, EXIF-rotated)
from the originals in `/assets/About/` via `scripts/optimize-about-images.mjs`.
Captions live in the `MOMENTS` array of `src/components/about/CareerGallery.tsx`.

- Hero portrait → `01.webp` · Bio portrait → `04.webp` (set in the About page).
- Gallery shows all 18, with tall tiles for portraits and wide tiles for landscapes.

## To add or replace photos
1. Drop / replace files here (keep the `NN.webp` naming, or run
   `node scripts/optimize-about-images.mjs` after adding originals to `/assets/About`).
2. In `src/components/about/CareerGallery.tsx` → `MOMENTS`, add/edit the item:
   ```ts
   { id: 19, image: '/images/career/19.webp', vi: 'Địa điểm', en: 'Place', year: '2024' },
   ```
   - `image` — path under `/public` (omit `public`).
   - `vi` / `en` — caption per photo. `year` optional (small gold label).
3. Any item **without** an `image` falls back to an on-brand placeholder tile.
4. Adjust the `SPAN` map if you want a specific tile wide/tall.

Local `/public` paths need no `next.config` change.
