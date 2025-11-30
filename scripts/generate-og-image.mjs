/**
 * OG Image Generator
 * 
 * Creates a 1200x630 PNG image for Open Graph / Twitter Card previews.
 * Uses sharp to composite text onto a dark background.
 * 
 * Usage: node scripts/generate-og-image.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const OUTPUT_PATH = join(PROJECT_ROOT, 'public', 'og-image.png');

// Image dimensions (standard OG image size)
const WIDTH = 1200;
const HEIGHT = 630;

// Colors matching site theme
const BG_COLOR = '#0a0a0a';
const TEXT_PRIMARY = '#f5f5f5';
const TEXT_MUTED = '#888888';

/**
 * Creates an SVG with the site branding text
 */
function createSvgText() {
  return `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { 
          font-family: system-ui, -apple-system, sans-serif; 
          font-size: 120px; 
          font-weight: 800; 
          letter-spacing: -3px;
        }
        .subtitle { 
          font-family: system-ui, -apple-system, sans-serif; 
          font-size: 32px; 
          font-weight: 400;
        }
      </style>
      <rect width="100%" height="100%" fill="${BG_COLOR}"/>
      <text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" 
            class="title" fill="${TEXT_PRIMARY}">ZAYFINDS</text>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" 
            class="subtitle" fill="${TEXT_MUTED}">Curated rep fashion finds — no gatekeeping</text>
      
      <!-- Subtle border -->
      <rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}" 
            fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" rx="8"/>
    </svg>
  `;
}

async function main() {
  console.log('🖼️  Generating OG Image...');
  console.log(`📐 Size: ${WIDTH}x${HEIGHT}px`);

  try {
    const svgBuffer = Buffer.from(createSvgText());
    
    await sharp(svgBuffer)
      .png()
      .toFile(OUTPUT_PATH);

    console.log('✅ OG image saved to:', OUTPUT_PATH);
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
  }
}

main();

