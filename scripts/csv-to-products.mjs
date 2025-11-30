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
 * @param {string[]} fields - Array of CSV fields
 * @param {number} id - Sequential product ID
 * @param {string|null} category - Current category (from last category header)
 * @returns {object} - Product object
 */
function transformToProduct(fields, id, category) {
  const name = cleanProductName(fields[1] || '');
  const priceText = fields[2] || '';
  const buyUrl = fields[4] || '';

  return {
    id,
    name,
    price: parsePrice(priceText),
    priceText,
    category,
    buyUrl,
    imageUrl: '/images/placeholder-item.png',
  };
}

/**
 * Main function to convert CSV to JSON.
 */
function main() {
  console.log('📂 Reading CSV from:', CSV_INPUT_PATH);

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
  let currentCategory = null;
  let skippedCount = 0;
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
      const product = transformToProduct(fields, products.length + 1, currentCategory);
      products.push(product);
    } else {
      skippedCount++;
    }
  }

  console.log(`✅ Valid products found: ${products.length}`);
  console.log(`📁 Categories found: ${categoriesFound.size}`);
  console.log(`   Categories: ${[...categoriesFound].join(', ')}`);
  console.log(`⏭️  Skipped rows (empty/invalid): ${skippedCount}`);

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
