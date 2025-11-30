/**
 * Weidian Image Fetcher
 *
 * Fetches product images directly from Weidian (bypasses Mulebuy/Cloudflare).
 * Weidian doesn't have aggressive bot protection like Mulebuy.
 *
 * Strategy:
 * 1. Extract Weidian item ID from buyUrl (e.g., id=7611168397)
 * 2. Fetch Weidian product page directly
 * 3. Parse HTML to find main product image
 * 4. Update products.json with imageUrl
 *
 * Usage:
 *   node scripts/fetch-weidian-images.mjs [start] [end]
 *   - start: First product index (default: 0)
 *   - end: Last product index (default: all)
 *
 * Examples:
 *   node scripts/fetch-weidian-images.mjs           # Process all
 *   node scripts/fetch-weidian-images.mjs 0 100    # Process first 100
 *   node scripts/fetch-weidian-images.mjs 100 200  # Process 100-200
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as cheerio from 'cheerio';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const PROJECT_ROOT = join(__dirname, '..');
const PRODUCTS_JSON_PATH = join(PROJECT_ROOT, 'data', 'products.json');

// Configuration
const REQUEST_DELAY_MS = 150; // 150ms between requests
const DEFAULT_IMAGE_PLACEHOLDER = '/images/placeholder-item.png';
const CONCURRENT_REQUESTS = 5; // Process 5 at a time for speed

/**
 * Extracts Weidian item ID from a Mulebuy URL.
 * @param {string} buyUrl - The Mulebuy buy URL
 * @returns {string|null} - Weidian item ID or null
 */
function extractWeidianId(buyUrl) {
  try {
    const url = new URL(buyUrl);
    return url.searchParams.get('id');
  } catch {
    // Try regex fallback for malformed URLs
    const match = buyUrl.match(/[?&]id=(\d+)/);
    return match ? match[1] : null;
  }
}

/**
 * Builds the Weidian product page URL.
 * @param {string} itemId - Weidian item ID
 * @returns {string} - Full Weidian URL
 */
function buildWeidianUrl(itemId) {
  return `https://weidian.com/item.html?itemID=${itemId}`;
}

/**
 * Fetches HTML from Weidian with proper headers.
 * @param {string} url - URL to fetch
 * @returns {Promise<string|null>} - HTML content or null
 */
async function fetchHtml(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return null;
    }

    return await response.text();
  } catch (error) {
    return null;
  }
}

/**
 * Parses Weidian HTML to extract the main product image.
 * 
 * Weidian embeds product data as JSON in a script tag. The main image is in:
 * - "item_head": "https://..." (primary product image)
 * - "imgs": ["...", "..."] (array of gallery images)
 * 
 * We also look for <link rel="preload" as="image"> tags as a fallback.
 * 
 * @param {string} html - HTML content
 * @returns {string|null} - Image URL or null
 */
function parseWeidianImage(html) {
  // Strategy 1: Extract from embedded JSON data (most reliable)
  // The JSON is often HTML-encoded, so we need to handle both regular and HTML-encoded quotes
  // Look for "item_head":"URL" pattern (regular or HTML-encoded)
  const itemHeadMatch = html.match(/(?:"|&#34;)item_head(?:"|&#34;)\s*:\s*(?:"|&#34;)(https?:\/\/[^"&#]+)/);
  if (itemHeadMatch && isValidProductImage(itemHeadMatch[1])) {
    return cleanImageUrl(itemHeadMatch[1]);
  }

  // Strategy 2: Look for imgs array in JSON (handles HTML entities and regular quotes)
  const imgsMatch = html.match(/(?:"|&#34;)imgs(?:"|&#34;)\s*:\s*\[\s*(?:"|&#34;)(https?:\/\/[^"&#]+)/);
  if (imgsMatch && isValidProductImage(imgsMatch[1])) {
    return cleanImageUrl(imgsMatch[1]);
  }

  // Strategy 3: Look for preload link tags with large images (750px or larger)
  const preloadMatch = html.match(/<link[^>]+rel="preload"[^>]+as="image"[^>]+href="(https?:\/\/[^"]+(?:_750_|_800_|_1000_|_1200_|_1600_)[^"]+)"/);
  if (preloadMatch && isValidProductImage(preloadMatch[1])) {
    return cleanImageUrl(preloadMatch[1]);
  }

  // Strategy 4: Fallback - find any large product image from CDN
  const cdnPattern = /https?:\/\/si\.geilicdn\.com\/[^"'\s]+_(?:750|800|1000|1600|2400|3000)_\d+\.(jpg|jpeg|png)/gi;
  const matches = html.match(cdnPattern);
  if (matches && matches.length > 0) {
    for (const url of matches) {
      if (isValidProductImage(url)) {
        return cleanImageUrl(url);
      }
    }
  }

  return null;
}

/**
 * Checks if an image URL is likely a valid product image (not a logo/icon).
 * @param {string} url - Image URL
 * @returns {boolean} - True if valid product image
 */
function isValidProductImage(url) {
  // Reject small images (logos, icons)
  const smallImagePattern = /_(?:74|96|52|45|42|110)_\d+/;
  if (smallImagePattern.test(url)) {
    return false;
  }

  // Reject known non-product images
  const blacklist = [
    'poseidon-',
    'hz_img_',
    'default_headimg',
    'favicon',
    'logo',
    'unadjust_74',
    'unadjust_96',
  ];
  
  for (const pattern of blacklist) {
    if (url.includes(pattern)) {
      return false;
    }
  }

  return true;
}

/**
 * Cleans an image URL by removing resize parameters for full quality.
 * @param {string} url - Image URL
 * @returns {string} - Cleaned URL
 */
function cleanImageUrl(url) {
  // Remove .webp extension, query parameters, and any JSON artifacts
  return url
    .replace(/\.webp(\?.*)?$/, '')    // Remove .webp and params
    .replace(/\?.*$/, '')              // Remove query params
    .replace(/&#34;.*$/, '')           // Remove any HTML entity artifacts
    .replace(/".*$/, '')               // Remove any quote artifacts
    .trim();
}

/**
 * Processes a single product - fetches its Weidian page and extracts image.
 * @param {object} product - Product object
 * @returns {Promise<string|null>} - Image URL or null
 */
async function processProduct(product) {
  const weidianId = extractWeidianId(product.buyUrl);
  
  if (!weidianId) {
    return null;
  }

  const weidianUrl = buildWeidianUrl(weidianId);
  const html = await fetchHtml(weidianUrl);
  
  if (!html) {
    return null;
  }

  return parseWeidianImage(html);
}

/**
 * Processes products in batches with concurrency control.
 * @param {object[]} products - Array of products to process
 * @param {number} concurrency - Number of concurrent requests
 * @param {function} onProgress - Progress callback
 * @returns {Promise<Map<number, string>>} - Map of product ID to image URL
 */
async function processBatch(products, concurrency, onProgress) {
  const results = new Map();
  let completed = 0;

  // Process in chunks
  for (let i = 0; i < products.length; i += concurrency) {
    const chunk = products.slice(i, i + concurrency);
    
    const promises = chunk.map(async (product) => {
      const imageUrl = await processProduct(product);
      return { id: product.id, imageUrl };
    });

    const chunkResults = await Promise.all(promises);
    
    for (const result of chunkResults) {
      if (result.imageUrl) {
        results.set(result.id, result.imageUrl);
      }
      completed++;
      onProgress(completed, products.length, result);
    }

    // Small delay between chunks
    if (i + concurrency < products.length) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
    }
  }

  return results;
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Weidian Image Fetcher');
  console.log('========================\n');

  // Parse command line arguments
  const startIndex = parseInt(process.argv[2], 10) || 0;
  const endIndex = process.argv[3] ? parseInt(process.argv[3], 10) : undefined;

  // Load products
  let products;
  try {
    products = JSON.parse(readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
    console.log(`📂 Loaded ${products.length} products from products.json`);
  } catch (error) {
    console.error('❌ Error loading products.json:', error.message);
    process.exit(1);
  }

  // Filter to products without images
  const productsNeedingImages = products.filter(
    p => !p.imageUrl || p.imageUrl === DEFAULT_IMAGE_PLACEHOLDER
  );

  console.log(`📊 ${productsNeedingImages.length} products need images`);

  // Apply range filter
  const targetProducts = productsNeedingImages.slice(
    startIndex,
    endIndex !== undefined ? endIndex : undefined
  );

  console.log(`🎯 Processing products ${startIndex} to ${startIndex + targetProducts.length - 1}`);
  console.log(`⏱️  Estimated time: ~${Math.ceil((targetProducts.length / CONCURRENT_REQUESTS) * (REQUEST_DELAY_MS + 500) / 60000)} minutes\n`);

  // Track stats
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  // Progress callback
  const onProgress = (completed, total, result) => {
    const percent = ((completed / total) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    
    if (result.imageUrl) {
      successCount++;
      process.stdout.write(`\r✅ ${completed}/${total} (${percent}%) | ✓ ${successCount} | ✗ ${failCount} | ${elapsed}s`);
    } else {
      failCount++;
      process.stdout.write(`\r❌ ${completed}/${total} (${percent}%) | ✓ ${successCount} | ✗ ${failCount} | ${elapsed}s`);
    }
  };

  // Process products
  const imageResults = await processBatch(targetProducts, CONCURRENT_REQUESTS, onProgress);

  console.log('\n\n📊 Results Summary');
  console.log('==================');
  console.log(`✅ Success: ${successCount} images found`);
  console.log(`❌ Failed: ${failCount} (no image found)`);
  console.log(`📈 Success rate: ${((successCount / targetProducts.length) * 100).toFixed(1)}%`);

  // Update products with found images
  let updatedCount = 0;
  for (const product of products) {
    const newImageUrl = imageResults.get(product.id);
    if (newImageUrl) {
      product.imageUrl = newImageUrl;
      updatedCount++;
    }
  }

  // Save updated products
  try {
    writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`\n💾 Updated ${updatedCount} products in products.json`);
  } catch (error) {
    console.error('❌ Error saving products.json:', error.message);
    process.exit(1);
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n⏱️  Total time: ${totalTime} minutes`);
  console.log('🎉 Done!');
}

// Run
main();

