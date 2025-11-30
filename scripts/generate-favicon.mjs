/**
 * Favicon Generator
 * 
 * Creates favicon.ico and apple-touch-icon.png for the site.
 * Uses a simple "Z" letter as the icon.
 * 
 * Usage: node scripts/generate-favicon.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const PUBLIC_DIR = join(PROJECT_ROOT, 'public');

// Colors matching site theme
const BG_COLOR = '#0a0a0a';
const TEXT_COLOR = '#f5f5f5';

/**
 * Creates an SVG icon with "Z" letter
 */
function createIconSvg(size) {
  const fontSize = Math.round(size * 0.65);
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${BG_COLOR}" rx="${size * 0.15}"/>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${fontSize}px" 
            font-weight="800" 
            fill="${TEXT_COLOR}">Z</text>
    </svg>
  `;
}

async function main() {
  console.log('🎨 Generating favicons...');

  try {
    // Generate 32x32 favicon PNG (will serve as favicon.ico replacement)
    const favicon32 = Buffer.from(createIconSvg(32));
    await sharp(favicon32)
      .png()
      .toFile(join(PUBLIC_DIR, 'favicon.png'));
    console.log('✅ favicon.png (32x32)');

    // Generate apple-touch-icon (180x180)
    const appleIcon = Buffer.from(createIconSvg(180));
    await sharp(appleIcon)
      .png()
      .toFile(join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('✅ apple-touch-icon.png (180x180)');

    // Generate favicon.ico (32x32 PNG, browsers accept PNG for favicon)
    await sharp(favicon32)
      .png()
      .toFile(join(PUBLIC_DIR, 'favicon.ico'));
    console.log('✅ favicon.ico (32x32)');

    console.log('\n🎉 All favicons generated in public/');
  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

main();

