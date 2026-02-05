import { OPTION_LABELS } from '../data/questions';

// Get display label for an answer ID
export const getAnswerLabel = (questionId, answerId) => {
  return OPTION_LABELS[questionId]?.[answerId] ?? answerId;
};

// Get recommendations based on user answers
export const getRecommendations = (answers, allProducts) => {
  const products = allProducts[answers.sport] ?? [];

  return products
    .map((product) => {
      const matches = [];
      
      // Check level match
      if (product.bestFor.levels?.includes(answers.level)) {
        matches.push('Skill level');
      }
      
      // Check style match
      if (product.bestFor.styles?.includes(answers.style)) {
        matches.push('Riding style');
      }
      
      // Check terrain match
      if (product.bestFor.terrains?.includes(answers.terrain)) {
        matches.push('Terrain');
      }
      
      // Check budget match
      if (product.bestFor.budgets?.includes(answers.budget)) {
        matches.push('Budget');
      }

      return {
        ...product,
        score: matches.length,
        matches
      };
    })
    .sort((a, b) => {
      // Sort by score descending, then by name ascending (stable sort)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.name.localeCompare(b.name);
    });
};

// Get size recommendation based on height and weight
export const getSizeRecommendation = (answers) => {
  if (!answers.sport || !answers.height || !answers.weight) {
    return null;
  }

  // Convert height ID to index
  const heightIndex = {
    'under-5-4': 1,
    '5-4-to-5-8': 2,
    '5-8-to-6-0': 3,
    'over-6-0': 4
  }[answers.height] ?? 2;

  // Convert weight ID to index
  const weightIndex = {
    'under-130': 1,
    '130-160': 2,
    '160-190': 3,
    'over-190': 4
  }[answers.weight] ?? 2;

  // Calculate size index (average of height and weight)
  const sizeIndex = Math.round((heightIndex + weightIndex) / 2);

  // Return size ranges based on sport
  if (answers.sport === 'snowboarding') {
    const ranges = {
      1: '140–148 cm',
      2: '148–154 cm',
      3: '154–160 cm',
      4: '160–168 cm'
    };
    return `Suggested board length: ${ranges[sizeIndex] ?? '150–158 cm'}`;
  }

  // Skiing size ranges
  const ranges = {
    1: '150–160 cm',
    2: '160–170 cm',
    3: '170–180 cm',
    4: '180–190 cm'
  };
  return `Suggested ski length: ${ranges[sizeIndex] ?? '165–175 cm'}`;
};
