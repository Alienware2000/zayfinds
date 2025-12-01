/**
 * CSV to Products Converter
 * 
 * Reads data/raw/Sheet1.csv (exported from Google Sheets) and converts
 * valid product rows into a JSON file at data/products.json.
 * 
 * Features:
 * - Handles multi-line quoted fields (product names with newlines)
 * - Extracts category from header rows and assigns to products
 * 
 * Usage: node scripts/csv-to-products.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths relative to project root
const PROJECT_ROOT = join(__dirname, '..');
const CSV_INPUT_PATH = join(PROJECT_ROOT, 'data', 'raw', 'Sheet1.csv');
const JSON_OUTPUT_PATH = join(PROJECT_ROOT, 'data', 'products.json');
const UNCATEGORIZED_OUTPUT_PATH = join(PROJECT_ROOT, 'data', 'uncategorized-products.json');

/* ===========================================
   NEW CATEGORY SYSTEM
   =========================================== */

/**
 * The 8 new categories for zayfinds.
 * This is the single source of truth for all category operations.
 */
const NEW_CATEGORIES = [
  'Tops',
  'Shorts',
  'Pants',
  'Shoes',
  'Outerwear',
  'Accessories',
  'Room decor',
  'Electronics',
  'Vehicle Modifications',
];

/**
 * Maps old category names from CSV to new category names.
 * 
 * @param {string|null} oldCategory - The old category name from CSV
 * @returns {string|null} - The new category name, or null if no mapping found
 */
function mapOldCategoryToNew(oldCategory) {
  if (!oldCategory) return null;

  const normalized = oldCategory.trim().toLowerCase();

  // Tops
  if (
    normalized.includes('shirt') ||
    normalized.includes('polo') ||
    normalized.includes('longsleeve') ||
    normalized.includes('hoodie') ||
    normalized.includes('zip-up') ||
    normalized.includes('knit') ||
    normalized === 'tops'
  ) {
    return 'Tops';
  }

  // Shorts
  if (normalized.includes('short')) {
    return 'Shorts';
  }

  // Pants
  if (
    normalized.includes('pant') ||
    normalized.includes('jean') ||
    normalized.includes('trouser') ||
    normalized.includes('sweatpant')
  ) {
    return 'Pants';
  }

  // Shoes
  if (
    normalized.includes('shoe') ||
    normalized.includes('jordan') ||
    normalized.includes('sneaker') ||
    normalized.includes('boot')
  ) {
    return 'Shoes';
  }

  // Outerwear
  if (
    normalized.includes('jacket') ||
    normalized.includes('coat') ||
    normalized.includes('parka') ||
    normalized.includes('bomber')
  ) {
    return 'Outerwear';
  }

  // Accessories
  if (
    normalized.includes('bag') ||
    normalized.includes('backpack') ||
    normalized.includes('wallet') ||
    normalized.includes('belt') ||
    normalized.includes('hat') ||
    normalized.includes('cap') ||
    normalized.includes('beanie') ||
    normalized.includes('balaclava') ||
    normalized.includes('mask') ||
    normalized.includes('glove') ||
    normalized.includes('scarf') ||
    normalized.includes('sock') ||
    normalized.includes('jewelry') ||
    normalized.includes('accessory') ||
    normalized.includes('travel') ||
    normalized.includes('crossbody') ||
    normalized.includes('glasses')
  ) {
    return 'Accessories';
  }

  // Electronics
  if (
    normalized.includes('electronic') ||
    normalized.includes('apple') ||
    normalized.includes('phone') ||
    normalized.includes('airpod')
  ) {
    return 'Electronics';
  }

  // Room decor
  if (
    normalized.includes('decor') ||
    normalized.includes('lamp') ||
    normalized.includes('poster') ||
    normalized.includes('art')
  ) {
    return 'Room decor';
  }

  // Vehicle Modifications
  if (
    normalized.includes('vehicle') ||
    normalized.includes('car') ||
    normalized.includes('mod')
  ) {
    return 'Vehicle Modifications';
  }

  // No mapping found
  return null;
}

/**
 * Infers category from product name using keyword matching.
 * Uses word boundaries to avoid false positives (e.g., "print" in "Cheetah Print Jogger").
 * 
 * @param {string} productName - The product name to analyze
 * @returns {string|null} - Inferred category, or null if no match
 */
function inferCategoryFromName(productName) {
  if (!productName) return null;

  const normalized = productName.toLowerCase();
  
  // Helper to check for whole words (more precise - avoids partial matches)
  const hasWord = (word) => {
    // Check for word boundaries: start of string, space, or hyphen before/after
    const regex = new RegExp(`(^|[\\s-])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s-]|$)`, 'i');
    return regex.test(productName);
  };

  // Shoes (check early - very specific keywords)
  if (
    hasWord('shoe') ||
    hasWord('sneaker') ||
    hasWord('boot') ||
    hasWord('jordan') ||
    hasWord('yeezy') ||
    hasWord('dunk') ||
    hasWord('air max') ||
    hasWord('foam') ||
    hasWord('slide') ||
    hasWord('loafer') ||
    hasWord('chuck') ||
    hasWord('geibasket') ||
    hasWord('tabi') ||
    normalized.includes('doc martens') ||
    normalized.includes('converse')
  ) {
    return 'Shoes';
  }

  // Outerwear (check early - specific keywords)
  if (
    hasWord('jacket') ||
    hasWord('coat') ||
    hasWord('parka') ||
    hasWord('bomber') ||
    hasWord('windbreaker')
  ) {
    return 'Outerwear';
  }

  // Pants (check before Shirts to catch "jogger", "sweatpant")
  if (
    hasWord('pant') ||
    hasWord('jean') ||
    hasWord('trouser') ||
    hasWord('sweatpant') ||
    hasWord('cargo') ||
    hasWord('jogger')
  ) {
    return 'Pants';
  }

  // Tops
  if (
    hasWord('shirt') ||
    hasWord('tee') ||
    hasWord('t-shirt') ||
    hasWord('hoodie') ||
    hasWord('sweater') ||
    hasWord('knit') ||
    hasWord('polo') ||
    hasWord('longsleeve') ||
    hasWord('crewneck') ||
    hasWord('zip-up') ||
    hasWord('zipup')
  ) {
    return 'Tops';
  }

  // Shorts
  if (hasWord('short')) {
    return 'Shorts';
  }

  // Accessories (more specific keywords first)
  if (
    hasWord('bag') ||
    hasWord('backpack') ||
    hasWord('wallet') ||
    hasWord('belt') ||
    hasWord('hat') ||
    hasWord('cap') ||
    hasWord('beanie') ||
    hasWord('glove') ||
    hasWord('scarf') ||
    hasWord('sock') ||
    hasWord('jewelry') ||
    hasWord('accessory') ||
    hasWord('chain') ||
    hasWord('ring') ||
    hasWord('bracelet')
  ) {
    return 'Accessories';
  }

  // Electronics (very specific - avoid false positives)
  if (
    hasWord('phone') ||
    hasWord('charger') ||
    hasWord('electronic') ||
    hasWord('airpod') ||
    hasWord('iphone') ||
    hasWord('ipad') ||
    (normalized.includes('apple') && (hasWord('case') || hasWord('phone')))
  ) {
    return 'Electronics';
  }

  // Room decor (very specific - avoid "print" in product names)
  if (
    hasWord('decor') ||
    hasWord('lamp') ||
    hasWord('poster') ||
    (normalized.includes('room') && hasWord('decor')) ||
    (normalized.includes('wall') && hasWord('art'))
  ) {
    return 'Room decor';
  }

  // Vehicle Modifications (very specific)
  if (
    (hasWord('car') && (hasWord('mod') || hasWord('part'))) ||
    hasWord('vehicle') ||
    (hasWord('automotive') && hasWord('mod'))
  ) {
    return 'Vehicle Modifications';
  }

  // No inference found - be conservative
  return null;
}

/**
 * Parses CSV content handling multi-line quoted fields.
 * This is necessary because Google Sheets exports can have product names
 * that span multiple lines inside quoted fields.
 * 
 * @param {string} csvContent - The entire CSV file content
 * @returns {string[][]} - Array of rows, each row is an array of field values
 */
function parseCSV(csvContent) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote ("") - add single quote and skip next
          currentField += '"';
          i++;
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        // Regular character inside quotes (including newlines)
        currentField += char;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
      } else if (char === ',') {
        // End of field
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        // End of row
        if (char === '\r') i++; // Skip \n in \r\n
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char !== '\r') {
        // Regular character (skip standalone \r)
        currentField += char;
      }
    }
  }

  // Handle last field/row if file doesn't end with newline
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Parses price text (e.g., "90.00$") into a numeric value.
 * @param {string} priceText - The raw price string from the CSV
 * @returns {number|null} - Parsed price or null if unparseable
 */
function parsePrice(priceText) {
  if (!priceText) return null;

  // Remove $ symbol and whitespace
  const cleaned = priceText.replace(/\$/g, '').trim();

  // Parse as float
  const parsed = parseFloat(cleaned);

  // Return null if not a valid number
  return isNaN(parsed) ? null : parsed;
}

/**
 * Checks if a row is a category header.
 * Category headers have text in column A and empty columns B-E.
 * Example: "Jackets,,,,"
 * 
 * @param {string[]} fields - Array of CSV fields
 * @returns {boolean} - True if this is a category header row
 */
function isCategoryHeader(fields) {
  const colA = fields[0] || '';
  const colB = fields[1] || '';
  const colC = fields[2] || '';
  const colD = fields[3] || '';
  const colE = fields[4] || '';

  // Category header: has text in column A, all other columns empty
  return (
    colA.length > 0 &&
    colB.length === 0 &&
    colC.length === 0 &&
    colD.length === 0 &&
    colE.length === 0
  );
}

/**
 * Checks if a row represents a valid product.
 * @param {string[]} fields - Array of CSV fields
 * @returns {boolean} - True if the row is a valid product
 */
function isValidProductRow(fields) {
  // CSV columns: ignoreImage (A), name (B), price (C), buyUrl (D), realBuyUrl (E)
  // Indices:     0              1          2          3           4

  const name = fields[1] || '';
  const price = fields[2] || '';
  const realBuyUrl = fields[4] || '';

  // Valid if: name is not empty, price is not empty, realBuyUrl starts with http
  return (
    name.length > 0 &&
    price.length > 0 &&
    realBuyUrl.startsWith('http')
  );
}

/**
 * Cleans a product name by normalizing whitespace.
 * Multi-line names like "Balenciaga x Adidas\nLeather Duffel" become
 * "Balenciaga x Adidas Leather Duffel".
 * 
 * @param {string} name - Raw product name (may contain newlines)
 * @returns {string} - Cleaned product name
 */
function cleanProductName(name) {
  // Replace newlines and multiple spaces with single space
  return name.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Cleans a category name by normalizing whitespace.
 * 
 * @param {string} category - Raw category name
 * @returns {string} - Cleaned category name
 */
function cleanCategoryName(category) {
  return category.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Transforms a CSV row into a product object.
 * Applies smart category mapping:
 * 1. First tries to map the provided category using mapOldCategoryToNew()
 * 2. If null, tries to infer category from product name
 * 3. If still null, leaves as null (for manual review)
 * 
 * Preserves existing image URLs from previous import.
 * 
 * @param {string[]} fields - Array of CSV fields
 * @param {number} id - Sequential product ID
 * @param {string|null} category - Current category (from last category header)
 * @param {Map<string, string>} imageUrlMap - Map of buyUrl -> imageUrl to preserve existing images
 * @returns {object} - Product object
 */
function transformToProduct(fields, id, category, imageUrlMap) {
  const name = cleanProductName(fields[1] || '');
  const priceText = fields[2] || '';
  const buyUrl = fields[4] || '';

  // Smart category mapping:
  // 1. Try mapping the provided category
  let mappedCategory = mapOldCategoryToNew(category);
  
  // 2. If still null, try inferring from product name
  if (!mappedCategory) {
    mappedCategory = inferCategoryFromName(name);
  }

  // Preserve existing image URL if available, otherwise use placeholder
  const imageUrl = imageUrlMap.get(buyUrl) || '/images/placeholder-item.png';

  return {
    id,
    name,
    price: parsePrice(priceText),
    priceText,
    category: mappedCategory, // Use mapped/inferred category, or null
    buyUrl,
    imageUrl,
  };
}

/**
 * Main function to convert CSV to JSON.
 */
function main() {
  console.log('📂 Reading CSV from:', CSV_INPUT_PATH);

  // Load existing products.json to preserve image URLs
  let existingProducts = [];
  let imageUrlMap = new Map(); // buyUrl -> imageUrl
  
  try {
    const existingData = readFileSync(JSON_OUTPUT_PATH, 'utf-8');
    existingProducts = JSON.parse(existingData);
    // Create map of buyUrl -> imageUrl to preserve images
    for (const product of existingProducts) {
      if (product.buyUrl && product.imageUrl && 
          product.imageUrl !== '/images/placeholder-item.png' &&
          product.imageUrl !== null) {
        imageUrlMap.set(product.buyUrl, product.imageUrl);
      }
    }
    console.log(`📸 Found ${imageUrlMap.size} existing product images to preserve`);
  } catch (error) {
    // File doesn't exist yet, that's okay for first run
    console.log('📸 No existing products.json found, starting fresh');
  }

  // Read the CSV file
  let csvContent;
  try {
    csvContent = readFileSync(CSV_INPUT_PATH, 'utf-8');
  } catch (error) {
    console.error('❌ Error reading CSV file:', error.message);
    process.exit(1);
  }

  // Parse CSV with multi-line field support
  const rows = parseCSV(csvContent);

  console.log(`📊 Total rows parsed: ${rows.length}`);

  // Skip header row (row 0)
  const dataRows = rows.slice(1);

  // Parse and filter valid products, tracking current category
  const products = [];
  const seenBuyUrls = new Set(); // Track seen buyUrls to prevent duplicates
  let currentCategory = null;
  let skippedCount = 0;
  let duplicateCount = 0;
  const categoriesFound = new Set();

  for (const fields of dataRows) {
    // Check if this is a category header row
    if (isCategoryHeader(fields)) {
      currentCategory = cleanCategoryName(fields[0]);
      categoriesFound.add(currentCategory);
      continue; // Don't count as skipped, it's a category marker
    }

    // Check if this is a valid product row
    if (isValidProductRow(fields)) {
      const buyUrl = fields[4] || '';
      
      // Skip if we've already seen this buyUrl (deduplication)
      if (seenBuyUrls.has(buyUrl)) {
        duplicateCount++;
        continue;
      }
      
      seenBuyUrls.add(buyUrl);
      const product = transformToProduct(fields, products.length + 1, currentCategory, imageUrlMap);
      products.push(product);
    } else {
      skippedCount++;
    }
  }

  // Category reporting
  const categoryCounts = {};
  const uncategorizedProducts = [];

  for (const category of NEW_CATEGORIES) {
    categoryCounts[category] = 0;
  }

  for (const product of products) {
    if (product.category && NEW_CATEGORIES.includes(product.category)) {
      categoryCounts[product.category]++;
    } else {
      uncategorizedProducts.push({
        id: product.id,
        name: product.name,
        originalCategory: currentCategory,
      });
    }
  }

  console.log(`✅ Valid products found: ${products.length}`);
  console.log(`📁 Old categories found in CSV: ${categoriesFound.size}`);
  console.log(`   Old categories: ${[...categoriesFound].join(', ')}`);
  console.log(`⏭️  Skipped rows (empty/invalid): ${skippedCount}`);
  console.log(`🔄 Duplicate products skipped: ${duplicateCount}`);
  console.log('\n📊 Products by NEW category:');
  for (const category of NEW_CATEGORIES) {
    console.log(`   ${category}: ${categoryCounts[category]}`);
  }
  console.log(`\n⚠️  Uncategorized products: ${uncategorizedProducts.length}`);
  
  // Save uncategorized products for manual review
  if (uncategorizedProducts.length > 0) {
    try {
      const uncategorizedOutput = JSON.stringify(uncategorizedProducts, null, 2);
      writeFileSync(UNCATEGORIZED_OUTPUT_PATH, uncategorizedOutput, 'utf-8');
      console.log(`💾 Uncategorized products saved to: ${UNCATEGORIZED_OUTPUT_PATH}`);
      console.log(`   Review and manually categorize these ${uncategorizedProducts.length} products.`);
    } catch (error) {
      console.error('❌ Error writing uncategorized products file:', error.message);
    }
  }

  // Write JSON output
  try {
    const jsonOutput = JSON.stringify(products, null, 2);
    writeFileSync(JSON_OUTPUT_PATH, jsonOutput, 'utf-8');
    console.log('💾 JSON written to:', JSON_OUTPUT_PATH);
  } catch (error) {
    console.error('❌ Error writing JSON file:', error.message);
    process.exit(1);
  }

  console.log('🎉 Conversion complete!');
}

// Run the script
main();
