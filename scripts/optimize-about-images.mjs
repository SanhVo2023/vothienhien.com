// One-off: convert assets/About/*.jpg → public/images/career/NN.webp
// Resized to max 1600px long edge, EXIF-rotated, quality 82.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('assets/About');
const OUT = path.resolve('public/images/career');

const files = (await readdir(SRC))
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10)); // by leading number

await mkdir(OUT, { recursive: true });

let i = 0;
for (const f of files) {
  i += 1;
  const nn = String(i).padStart(2, '0');
  const dest = path.join(OUT, `${nn}.webp`);
  const info = await sharp(path.join(SRC, f))
    .rotate() // honour EXIF orientation
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest);
  console.log(`${nn}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB  ← ${f}`);
}
console.log(`\nDone: ${i} images → public/images/career/`);
