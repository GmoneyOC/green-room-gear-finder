// Google Sheets CSV fetcher and parser
import Papa from 'papaparse';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPZZjMddxqb8wwlzhexZ_qXGbtudxagqcLFBDIIkJHTK6JmMgnmZuUvIoxjTh-vNvxbeZsSO-6ZaQN/pub?output=csv';

/**
 * Parse list-like CSV fields into string arrays
 * @param {string | undefined} value - Raw list value
 * @returns {string[]} Parsed values
 */
function parseListField(value) {
  if (!value || typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Fetch products from Google Sheets
 * @returns {Promise<Object>} Object with snowboarding and skiing arrays
 */
export async function fetchProducts() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const { data: parsedRows, errors = [] } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: 'greedy'
    });

    if (errors.length > 0) {
      console.warn('CSV parse warnings from Google Sheets:', errors);
    }

    const safeRows = Array.isArray(parsedRows) ? parsedRows : [];

    const allProducts = safeRows
      .filter((row) => row && typeof row === 'object')
      .map((row) => ({
        ...row,
        levels: parseListField(row.levels),
        styles: parseListField(row.styles),
        terrains: parseListField(row.terrains),
        budgets: parseListField(row.budgets),
        sport: typeof row.sport === 'string' ? row.sport.trim().toLowerCase() : ''
      }))
      .filter((product) => {
        const hasAnyData = Object.values(product).some((value) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }

          return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
        });

        return hasAnyData && ['snowboarding', 'skiing'].includes(product.sport);
      });
    
    // Split by sport
    const snowboarding = allProducts.filter(p => p.sport === 'snowboarding');
    const skiing = allProducts.filter(p => p.sport === 'skiing');
    
    // Create bestFor object and full name for each product
    const formatProduct = (product) => ({
      ...product,
      // Create full display name from brand + productName
      name: product.brand && product.productName 
        ? `${product.brand} ${product.productName}` 
        : product.name || '',
      bestFor: {
        levels: product.levels || [],
        styles: product.styles || [],
        terrains: product.terrains || [],
        budgets: product.budgets || []
      }
    });
    
    return {
      snowboarding: snowboarding.map(formatProduct),
      skiing: skiing.map(formatProduct)
    };
  } catch (error) {
