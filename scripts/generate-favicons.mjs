// Generate a complete favicon / app-icon set from the VH monogram.
//  public/favicon.ico        (16/32/48, PNG-encoded entries)
//  public/icon.png           (32, modern <link rel=icon>)
//  public/apple-touch-icon.png (180)
//  public/icon-192.png, public/icon-512.png (PWA / manifest)
// sharp can't write .ico, so we hand-roll a minimal PNG-in-ICO container,
// which every modern browser (Chrome/Edge/Firefox/Safari) accepts.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('public/images/icon/favicon-vh.webp');
const PUB = path.resolve('public');

const png = (size) => sharp(SRC).resize(size, size, { fit: 'cover' }).png().toBuffer();

function buildIco(entries) {
  // entries: [{ size, data(Buffer of PNG) }]
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach((e, i) => {
    const b = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 0); // width
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 1); // height
    dir.writeUInt8(0, b + 2); // palette
    dir.writeUInt8(0, b + 3); // reserved
    dir.writeUInt16LE(1, b + 4); // color planes
    dir.writeUInt16LE(32, b + 6); // bits per pixel
    dir.writeUInt32LE(e.data.length, b + 8); // size of image data
    dir.writeUInt32LE(offset, b + 12); // offset
    offset += e.data.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

const [p16, p32, p48, p180, p192, p512] = await Promise.all([
  png(16), png(32), png(48), png(180), png(192), png(512),
]);

await writeFile(path.join(PUB, 'favicon.ico'), buildIco([
  { size: 16, data: p16 },
  { size: 32, data: p32 },
  { size: 48, data: p48 },
]));
await writeFile(path.join(PUB, 'icon.png'), p32);
await writeFile(path.join(PUB, 'apple-touch-icon.png'), p180);
await writeFile(path.join(PUB, 'icon-192.png'), p192);
await writeFile(path.join(PUB, 'icon-512.png'), p512);

console.log('favicons written: favicon.ico (16/32/48), icon.png, apple-touch-icon.png (180), icon-192.png, icon-512.png');
