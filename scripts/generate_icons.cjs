const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public', 'icons');

async function main() {
  await sharp({
    create: { width: 192, height: 192, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  }).composite([
    { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192"><rect width="192" height="192" rx="36" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><text x="96" y="115" text-anchor="middle" font-family="Arial" font-size="80" font-weight="bold" fill="white">V</text></svg>`), top: 0, left: 0 }
  ]).png().toFile(path.join(publicDir, 'icon-192x192.png'));

  await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  }).composite([
    { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="96" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><text x="256" y="295" text-anchor="middle" font-family="Arial" font-size="220" font-weight="bold" fill="white">V</text></svg>`), top: 0, left: 0 }
  ]).png().toFile(path.join(publicDir, 'icon-512x512.png'));

  console.log('Icons created!');
}
main().catch(e => console.error(e));