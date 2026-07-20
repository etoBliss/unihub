// Run with: node generate-icons.mjs
// Requires: npm install -D sharp
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, 'public', 'logo.svg');
const outDir = join(__dirname, 'public', 'icons');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(join(outDir, `icon-${size}x${size}.png`));
  console.log(`✅ Generated icon-${size}x${size}.png`);
}

console.log('\nAll PWA icons generated successfully!');
