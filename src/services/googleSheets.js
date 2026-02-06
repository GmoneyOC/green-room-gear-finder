// Google Sheets CSV fetcher and parser
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPZZjMddxqb8wwlzhexZ_qXGbtudxagqcLFBDIIkJHTK6JmMgnmZuUvIoxjTh-vNvxbeZsSO-6ZaQN/pub?output=csv';

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV text
 * @returns {Array} Array of product objects
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parse CSV line handling quoted values
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Push last value
    
    // Create product object
    const product = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Parse comma-separated arrays
      if (['levels', 'styles', 'terrains', 'budgets'].includes(header)) {
        product[header] = value ? value.split(',').map(v => v.trim()) : [];
      } else {
        product[header] = value;
      }
    });
    
    products.push(product);
  }
  
  return products;
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
    const allProducts = parseCSV(csvText);
    
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
    console.error('Error fetching products from Google Sheets:', error);
    throw error;
  }
}

/**
 * Get cached products from localStorage
 * @returns {Object|null} Cached products or null
 */
export function getCachedProducts() {
  try {
    const cached = localStorage.getItem('grgf_products');
    const timestamp = localStorage.getItem('grgf_products_timestamp');
    
    if (cached && timestamp) {
      return {
        products: JSON.parse(cached),
        timestamp: parseInt(timestamp, 10)
      };
    }
  } catch (error) {
    console.error('Error reading cached products:', error);
  }
  return null;
}

/**
 * Save products to localStorage
 * @param {Object} products - Products object
 */
export function cacheProducts(products) {
  try {
    localStorage.setItem('grgf_products', JSON.stringify(products));
    localStorage.setItem('grgf_products_timestamp', Date.now().toString());
  } catch (error) {
    console.error('Error caching products:', error);
  }
}

/**
 * Clear cached products
 */
export function clearCache() {
  try {
    localStorage.removeItem('grgf_products');
    localStorage.removeItem('grgf_products_timestamp');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}
