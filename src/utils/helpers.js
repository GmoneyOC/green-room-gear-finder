import { OPTION_LABELS } from '../data/questions';

/**
 * Utility to convert internal IDs to human-readable labels
 */
export const getAnswerLabel = (questionId, answerId) => {
  return OPTION_LABELS[questionId]?.[answerId] ?? answerId;
};

/**
 * Extracts unique brands from the product list for the selection step
 */
export const extractBrands = (allProducts) => {
  const brands = { snowboarding: new Set(), skiing: new Set() };

  Object.keys(brands).forEach(sport => {
    (allProducts[sport] ?? []).forEach(product => {
      if (product.brand) brands[sport].add(product.brand);
    });
  });

  return {
    snowboarding: Array.from(brands.snowboarding).sort(),
    skiing: Array.from(brands.skiing).sort()
  };
};

/**
 * Weighted recommendation engine
 * Returns all matching products sorted by match quality
 */
export const getRecommendations = (answers, allProducts, selectedBrands = null) => {
  const sportProducts = allProducts[answers.sport] ?? [];

  // Filter by selected brands if the user is in 'specific' brand mode
  const pool = selectedBrands && selectedBrands.length > 0
    ? sportProducts.filter(p => selectedBrands.includes(p.brand))
    : sportProducts;

  return pool
    .map(product => {
      const matches = [];
      // Scoring logic looks at the parsed arrays from Google Sheets
      if (product.bestFor.levels?.includes(answers.level)) matches.push('Skill level');
      if (product.bestFor.styles?.includes(answers.style)) matches.push('Riding style');
      if (product.bestFor.terrains?.includes(answers.terrain)) matches.push('Terrain');
      if (product.bestFor.budgets?.includes(answers.budget)) matches.push('Budget');

      return {
        ...product,
        score: matches.length,
        matches
      };
    })
    // Sort by highest match score, then alphabetically for UI stability
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
};

/**
 * Provides size guidance based on the height/weight matrix
 */
export const getSizeRecommendation = (answers) => {
  if (!answers.sport || !answers.height || !answers.weight) return null;

  const hMap = { 'under-5-4': 1, '5-4-to-5-8': 2, '5-8-to-6-0': 3, 'over-6-0': 4 };
  const wMap = { 'under-130': 1, '130-160': 2, '160-190': 3, 'over-190': 4 };

  const sizeIndex = Math.round(((hMap[answers.height] || 2) + (wMap[answers.weight] || 2)) / 2);

  const ranges = answers.sport === 'snowboarding' 
    ? { 1: '140–148cm', 2: '148–154cm', 3: '154–160cm', 4: '160–168cm' }
    : { 1: '150–160cm', 2: '160–170cm', 3: '170–180cm', 4: '180–190cm' };

  const label = answers.sport === 'snowboarding' ? 'board length' : 'ski length';
  return `Suggested ${label}: ${ranges[sizeIndex] || 'Standard'}`;
};
