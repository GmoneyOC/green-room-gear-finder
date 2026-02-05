// Question configuration with ID-based options
export const QUESTIONS = [
  {
    id: 'sport',
    question: 'What sport are you shopping for?',
    options: [
      { id: 'snowboarding', label: 'Snowboarding' },
      { id: 'skiing', label: 'Skiing' }
    ]
  },
  {
    id: 'level',
    question: 'What is your skill level?',
    options: [
      { id: 'beginner', label: 'Beginner - First timer or learning basics' },
      { id: 'intermediate', label: 'Intermediate - Comfortable on most runs' },
      { id: 'advanced', label: 'Advanced - Tackling black diamonds' },
      { id: 'expert', label: 'Expert - Professional level' }
    ]
  },
  {
    id: 'style',
    question: 'What\'s your riding style?',
    options: [
      { id: 'all-mountain', label: 'All-Mountain - Mix of everything' },
      { id: 'freestyle', label: 'Freestyle/Park - Jumps and tricks' },
      { id: 'powder', label: 'Powder/Freeride - Deep snow adventure' },
      { id: 'carving', label: 'Carving/Groomer - Fast turns on trails' }
    ]
  },
  {
    id: 'terrain',
    question: 'Where do you ride most?',
    options: [
      { id: 'resort', label: 'Resort groomers' },
      { id: 'park', label: 'Park and pipes' },
      { id: 'backcountry', label: 'Backcountry/Off-piste' },
      { id: 'mixed', label: 'Mixed terrain' }
    ]
  },
  {
    id: 'budget',
    question: 'What\'s your budget?',
    options: [
      { id: '500-800', label: '$500 - $800' },
      { id: '800-plus', label: '$800+' }
    ]
  },
  {
    id: 'height',
    question: 'What\'s your height?',
    options: [
      { id: 'under-5-4', label: 'Under 5\'4"' },
      { id: '5-4-to-5-8', label: '5\'4" - 5\'8"' },
      { id: '5-8-to-6-0', label: '5\'8" - 6\'0"' },
      { id: 'over-6-0', label: 'Over 6\'0"' }
    ]
  },
  {
    id: 'weight',
    question: 'What\'s your weight range?',
    options: [
      { id: 'under-130', label: 'Under 130 lbs' },
      { id: '130-160', label: '130-160 lbs' },
      { id: '160-190', label: '160-190 lbs' },
      { id: 'over-190', label: 'Over 190 lbs' }
    ]
  }
];

// Lookup maps for converting IDs back to display labels
export const OPTION_LABELS = {
  sport: {
    'snowboarding': 'Snowboarding',
    'skiing': 'Skiing'
  },
  level: {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
    'expert': 'Expert'
  },
  style: {
    'all-mountain': 'All-Mountain',
    'freestyle': 'Freestyle',
    'powder': 'Powder',
    'carving': 'Carving'
  },
  terrain: {
    'resort': 'Resort',
    'park': 'Park',
    'backcountry': 'Backcountry',
    'mixed': 'Mixed'
  },
  budget: {
    '500-800': '$500 - $800',
    '800-plus': '$800+'
  },
  height: {
    'under-5-4': 'Under 5\'4"',
    '5-4-to-5-8': '5\'4" - 5\'8"',
    '5-8-to-6-0': '5\'8" - 6\'0"',
    'over-6-0': 'Over 6\'0"'
  },
  weight: {
    'under-130': 'Under 130 lbs',
    '130-160': '130-160 lbs',
    '160-190': '160-190 lbs',
    'over-190': 'Over 190 lbs'
  }
};
