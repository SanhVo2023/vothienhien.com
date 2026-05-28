// One-off: give the logos real transparent backgrounds.
//  - logo-symbolic-1..4.webp: gold artwork sat on a baked gray/white
//    "transparency" checkerboard (no real alpha). Key out the bright,
//    low-chroma checkerboard → transparent; keep the gold.
//  - logo-aea.png: white artwork on a solid blue brand box. Keep the near-white
//    artwork; drop everything else → transparent (matches the footer siblings).
import sharp from 'sharp';
import path from 'node:path';
import { rename } from 'node:fs/promises';

const ICON = path.resolve('public/images/icon');

async function deChecker(srcFile, dstFile) {
  const src = path.join(ICON, srcFile);
  const dst = path.join(ICON, dstFile);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let cleared = 0;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    // The checkerboard is grayscale (r≈g≈b) at any brightness; the logo is gold
    // (warm, large spread). Key out low-chroma pixels, keep the gold.
    if (chroma < 30) { data[i + 3] = 0; cleared++; }
  }
  await sharp(data, { raw: { width, height, channels } }).webp({ quality: 90 }).toFile(dst);
  console.log(`${dstFile}  ${width}x${height}  cleared ${(cleared / (width * height) * 100).toFixed(0)}% → transparent`);
}

async function keepWhite(srcRel, dstRel) {
  const abs = path.resolve(srcRel);
  const { data, info } = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let cleared = 0;
  for (let i = 0; i < data.length; i += channels) {
    const mn = Math.min(data[i], data[i + 1], data[i + 2]);
    if (mn < 170) { data[i + 3] = 0; cleared++; } // anything not near-white (the blue box) → transparent
  }
  await sharp(data, { raw: { width, height, channels } }).png().toFile(path.resolve(dstRel));
  console.log(`${path.basename(dstRel)}  ${width}x${height}  cleared ${(cleared / (width * height) * 100).toFixed(0)}% → transparent`);
}

await deChecker('logo-symbolic-1-scales.webp', 'logo-mark-1-scales.webp');
await deChecker('logo-symbolic-2-pillar.webp', 'logo-mark-2-pillar.webp');
await deChecker('logo-symbolic-3-gavel-book.webp', 'logo-mark-3-gavel-book.webp');
await deChecker('logo-symbolic-4-laurel-scales.webp', 'logo-mark-4-laurel-scales.webp');
await keepWhite('public/asset/logo-aea.png', 'public/asset/logo-aea-white.png');
console.log('\nDone.');
