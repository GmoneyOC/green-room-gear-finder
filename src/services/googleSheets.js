import Papa from 'papaparse';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPZZjMddxqb8wwlzhexZ_qXGbtudxagqcLFBDIIkJHTK6JmMgnmZuUvIoxjTh-vNvxbeZsSO-6ZaQN/pub?output=csv';
const CACHE_KEY = 'grgf_products';
const CACHE_TS_KEY = 'grgf_products_timestamp';
const ONE_HOUR = 60 * 60 * 1000;

export async function fetchProducts() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const formatProduct = (p) => ({
      ...p,
      name: p.brand && p.productName ? `${p.brand} ${p.productName}` : p.name || 'Unknown Product',
      bestFor: {
        levels: p.levels ? p.levels.split(',').map(s => s.trim()) : [],
        styles: p.styles ? p.styles.split(',').map(s => s.trim()) : [],
        terrains: p.terrains ? p.terrains.split(',').map(s => s.trim()) : [],
        budgets: p.budgets ? p.budgets.split(',').map(s => s.trim()) : []
      }
    });

    const result = {
      snowboarding: data.filter(p => p.sport === 'snowboarding').map(formatProduct),
      skiing: data.filter(p => p.sport === 'skiing').map(formatProduct)
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
    return result;
  } catch (error) {
    console.error('Error fetching gear data:', error);
    throw error;
  }
}

export function getCachedProducts() {
  const cached = localStorage.getItem(CACHE_KEY);
  const ts = localStorage.getItem(CACHE_TS_KEY);
  if (!cached || !ts) return null;

  const isExpired = Date.now() - parseInt(ts) > ONE_HOUR;
  return {
    products: JSON.parse(cached),
    isExpired
  };
}
