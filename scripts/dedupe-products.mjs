/**
 * Product Deduplication Script
 * 
 * Removes duplicate products from products.json based on buyUrl.
 * Keeps the first occurrence of each unique product.
 * 
 * Usage: node scripts/dedupe-products.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const PRODUCTS_JSON_PATH = join(PROJECT_ROOT, 'data', 'products.json');

console.log('🔄 Product Deduplication');
console.log('========================\n');

// Load products
const products = JSON.parse(readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
console.log(`📂 Loaded ${products.length} products`);

// Track seen buyUrls
const seen = new Set();
const duplicates = [];

// Filter to unique products (keep first occurrence)
const deduped = products.filter(product => {
  if (seen.has(product.buyUrl)) {
    duplicates.push(product);
    return false;
  }
  seen.add(product.buyUrl);
  return true;
});

// Re-assign sequential IDs
deduped.forEach((product, index) => {
  product.id = index + 1;
});

console.log(`\n📊 Results`);
console.log(`===========`);
console.log(`✅ Unique products: ${deduped.length}`);
console.log(`❌ Duplicates removed: ${duplicates.length}`);
console.log(`📉 Reduction: ${((duplicates.length / products.length) * 100).toFixed(1)}%`);

// Show some example duplicates
if (duplicates.length > 0) {
  console.log(`\n🔍 Sample duplicates removed:`);
  duplicates.slice(0, 5).forEach((dup, i) => {
    console.log(`   ${i + 1}. "${dup.name.substring(0, 50)}..." (ID: ${dup.id})`);
  });
  if (duplicates.length > 5) {
    console.log(`   ... and ${duplicates.length - 5} more`);
  }
}

// Save deduplicated products
writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(deduped, null, 2), 'utf-8');
console.log(`\n💾 Saved ${deduped.length} unique products to products.json`);

console.log('\n🎉 Done!');

