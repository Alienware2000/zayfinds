/**
 * Product Image Scraper
 * 
 * Fetches product images from Mulebuy URLs and updates products.json.
 * 
 * Usage:
 *   node scripts/fetch-images.mjs           # Process all products
 *   node scripts/fetch-images.mjs --test    # Test on first 10 products only
 *   node scripts/fetch-images.mjs --resume  # Resume from last checkpoint
 * 
 * Features:
 * - Extracts main product image from Mulebuy pages
 * - Handles errors gracefully (sets imageUrl to null on failure)
 * - Rate limiting with 200ms delay between requests
 * - Progress logging every 50 products
 * - Checkpoint saving every 100 products for resume capability
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as cheerio from 'cheerio';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const PROJECT_ROOT = join(__dirname, '..');
const PRODUCTS_PATH = join(PROJECT_ROOT, 'data', 'products.json');
const CHECKPOINT_PATH = join(PROJECT_ROOT, 'data', 'images-checkpoint.json');

// Configuration
const DELAY_MS = 200; // Delay between requests
const PROGRESS_LOG_INTERVAL = 50; // Log progress every N products
const CHECKPOINT_INTERVAL = 100; // Save checkpoint every N products

/**
 * Image selectors to try, in priority order.
 * These are common patterns found on e-commerce pages.
 */
const IMAGE_SELECTORS = [
  // Mulebuy-specific selectors
  '.product-image img',
  '.product-gallery img:first-child',
  '.gallery-wrapper img:first-child',
  '.main-image img',
  '.product-main-image img',
  
  // Common e-commerce patterns
  'img[src*="img.alicdn"]',
  'img[src*="weidian"]',
  'img[src*="mulebuy"]',
  
  // Data attribute patterns (lazy loading)
  'img[data-src]',
  'img[data-lazy-src]',
  'img[data-original]',
  
  // Generic fallbacks
  '.product-detail img:first-child',
  '.item-image img',
  'article img:first-child',
  '.content img:first-child',
];

/**
 * Delay helper function.
 * @param {number} ms - Milliseconds to wait
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetches HTML content from a URL.
 * @param {string} url - The URL to fetch
 * @returns {Promise<string|null>} - HTML content or null on error
 */
async function fetchHTML(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
    });
    
    if (!response.ok) {
      console.error(`  ❌ HTTP ${response.status} for ${url}`);
      return null;
    }
    
    return await response.text();
  } catch (error) {
    console.error(`  ❌ Fetch error: ${error.message}`);
    return null;
  }
}

/**
 * Extracts the main product image URL from HTML.
 * @param {string} html - The HTML content
 * @param {string} baseUrl - The base URL for resolving relative paths
 * @returns {string|null} - Image URL or null if not found
 */
function extractImageUrl(html, baseUrl) {
  const $ = cheerio.load(html);
  
  // Try each selector in priority order
  for (const selector of IMAGE_SELECTORS) {
    const img = $(selector).first();
    
    if (img.length > 0) {
      // Try different attributes where image URL might be stored
      let imageUrl = img.attr('src') || 
                     img.attr('data-src') || 
                     img.attr('data-lazy-src') ||
                     img.attr('data-original');
      
      if (imageUrl) {
        // Skip placeholder/loading images
        if (imageUrl.includes('loading') || 
            imageUrl.includes('placeholder') ||
            imageUrl.includes('data:image') ||
            imageUrl.length < 10) {
          continue;
        }
        
        // Resolve relative URLs
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        } else if (imageUrl.startsWith('/')) {
          const url = new URL(baseUrl);
          imageUrl = url.origin + imageUrl;
        }
        
        return imageUrl;
      }
    }
  }
  
  // Fallback: Look for any large image in the page
  const allImages = $('img').toArray();
  for (const img of allImages) {
    const src = $(img).attr('src') || $(img).attr('data-src');
    if (src && 
        !src.includes('logo') && 
        !src.includes('icon') &&
        !src.includes('avatar') &&
        !src.includes('loading') &&
        !src.includes('placeholder') &&
        !src.startsWith('data:') &&
        src.length > 20) {
      
      let imageUrl = src;
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      }
      return imageUrl;
    }
  }
  
  return null;
}

/**
 * Processes a single product to fetch its image.
 * @param {object} product - The product object
 * @returns {Promise<string|null>} - Image URL or null
 */
async function processProduct(product) {
  if (!product.buyUrl) {
    return null;
  }
  
  const html = await fetchHTML(product.buyUrl);
  if (!html) {
    return null;
  }
  
  return extractImageUrl(html, product.buyUrl);
}

/**
 * Saves checkpoint for resume capability.
 * @param {number} lastProcessedIndex - Last processed product index
 * @param {object[]} products - Products array with partial updates
 */
function saveCheckpoint(lastProcessedIndex, products) {
  const checkpoint = {
    lastProcessedIndex,
    timestamp: new Date().toISOString(),
    products,
  };
  writeFileSync(CHECKPOINT_PATH, JSON.stringify(checkpoint, null, 2));
  console.log(`💾 Checkpoint saved at index ${lastProcessedIndex}`);
}

/**
 * Loads checkpoint if exists.
 * @returns {object|null} - Checkpoint data or null
 */
function loadCheckpoint() {
  if (existsSync(CHECKPOINT_PATH)) {
    try {
      const data = readFileSync(CHECKPOINT_PATH, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Main function to process all products.
 */
async function main() {
  const args = process.argv.slice(2);
  const isTestMode = args.includes('--test');
  const isResumeMode = args.includes('--resume');
  
  console.log('🖼️  Product Image Scraper');
  console.log('========================');
  
  // Load products
  console.log('📂 Loading products from:', PRODUCTS_PATH);
  let products;
  let startIndex = 0;
  
  if (isResumeMode) {
    const checkpoint = loadCheckpoint();
    if (checkpoint) {
      console.log(`📌 Resuming from checkpoint (index ${checkpoint.lastProcessedIndex})`);
      products = checkpoint.products;
      startIndex = checkpoint.lastProcessedIndex + 1;
    } else {
      console.log('⚠️  No checkpoint found, starting from beginning');
      products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));
    }
  } else {
    products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));
  }
  
  const totalProducts = products.length;
  const endIndex = isTestMode ? Math.min(10, totalProducts) : totalProducts;
  
  console.log(`📊 Total products: ${totalProducts}`);
  console.log(`🎯 Processing: ${startIndex + 1} to ${endIndex}`);
  if (isTestMode) console.log('🧪 TEST MODE: Only processing first 10 products');
  console.log(`⏱️  Estimated time: ~${Math.ceil((endIndex - startIndex) * DELAY_MS / 1000 / 60)} minutes`);
  console.log('');
  
  // Statistics
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  
  // Process products
  for (let i = startIndex; i < endIndex; i++) {
    const product = products[i];
    
    // Skip if already has a non-placeholder image
    if (product.imageUrl && 
        !product.imageUrl.includes('placeholder') &&
        product.imageUrl !== '/images/placeholder-item.png') {
      skippedCount++;
      continue;
    }
    
    // Log progress
    if ((i - startIndex) % PROGRESS_LOG_INTERVAL === 0 || i === startIndex) {
      const progress = ((i - startIndex) / (endIndex - startIndex) * 100).toFixed(1);
      console.log(`📦 Processing ${i + 1}/${endIndex} (${progress}%) - "${product.name.substring(0, 40)}..."`);
    }
    
    // Fetch image
    const imageUrl = await processProduct(product);
    
    if (imageUrl) {
      products[i].imageUrl = imageUrl;
      successCount++;
      console.log(`  ✅ Found image: ${imageUrl.substring(0, 60)}...`);
    } else {
      products[i].imageUrl = null;
      failCount++;
    }
    
    // Save checkpoint periodically
    if ((i + 1) % CHECKPOINT_INTERVAL === 0) {
      saveCheckpoint(i, products);
    }
    
    // Rate limiting delay
    await delay(DELAY_MS);
  }
  
  // Save final results
  console.log('');
  console.log('💾 Saving results to:', PRODUCTS_PATH);
  writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
  
  // Clean up checkpoint
  if (existsSync(CHECKPOINT_PATH) && !isTestMode) {
    const fs = await import('fs');
    fs.unlinkSync(CHECKPOINT_PATH);
    console.log('🧹 Checkpoint file removed');
  }
  
  // Summary
  console.log('');
  console.log('📊 Summary');
  console.log('==========');
  console.log(`✅ Success: ${successCount} images found`);
  console.log(`❌ Failed: ${failCount} (no image found)`);
  console.log(`⏭️  Skipped: ${skippedCount} (already had images)`);
  console.log(`📦 Total processed: ${successCount + failCount + skippedCount}`);
  console.log('');
  console.log('🎉 Done!');
}

// Run
main().catch(console.error);

