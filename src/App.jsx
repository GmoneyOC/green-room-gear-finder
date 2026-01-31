import React, { useState, useMemo } from 'react';
import { ChevronRight, Mountain, Award, TrendingUp, DollarSign, ExternalLink, User, Ruler, Scale } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'sport',
    question: 'What sport are you shopping for?',
    options: ['Snowboarding', 'Skiing']
  },
  {
    id: 'level',
    question: 'What is your skill level?',
    options: ['Beginner - First timer or learning basics', 'Intermediate - Comfortable on most runs', 'Advanced - Tackling black diamonds', 'Expert - Professional level']
  },
  {
    id: 'style',
    question: 'What\'s your riding style?',
    options: ['All-Mountain - Mix of everything', 'Freestyle/Park - Jumps and tricks', 'Powder/Freeride - Deep snow adventure', 'Carving/Groomer - Fast turns on trails']
  },
  {
    id: 'terrain',
    question: 'Where do you ride most?',
    options: ['Resort groomers', 'Park and pipes', 'Backcountry/Off-piste', 'Mixed terrain']
  },
  {
    id: 'budget',
    question: 'What\'s your budget?',
    options: ['Under $300', '$300 - $500', '$500 - $800', '$800+']
  },
  {
    id: 'height',
    question: 'What\'s your height?',
    options: ['Under 5\'4"', '5\'4" - 5\'8"', '5\'8" - 6\'0"', 'Over 6\'0"']
  },
  {
    id: 'weight',
    question: 'What\'s your weight range?',
    options: ['Under 130 lbs', '130-160 lbs', '160-190 lbs', 'Over 190 lbs']
  }
];

const NORMALIZED_ANSWERS = {
  level: {
    'Beginner - First timer or learning basics': 'Beginner',
    'Intermediate - Comfortable on most runs': 'Intermediate',
    'Advanced - Tackling black diamonds': 'Advanced',
    'Expert - Professional level': 'Expert'
  },
  style: {
    'All-Mountain - Mix of everything': 'All-Mountain',
    'Freestyle/Park - Jumps and tricks': 'Freestyle',
    'Powder/Freeride - Deep snow adventure': 'Powder',
    'Carving/Groomer - Fast turns on trails': 'Carving'
  },
  terrain: {
    'Resort groomers': 'Resort',
    'Park and pipes': 'Park',
    'Backcountry/Off-piste': 'Backcountry',
    'Mixed terrain': 'Mixed'
  }
};

const RECOMMENDATIONS = {
  Snowboarding: [
    {
      name: 'Salomon Assassin',
      category: 'All-Mountain Snowboard',
      price: '$589.95',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop&q=80',
      specs: '156cm • Directional Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 10/10 | Freestyle: 8/10',
      terrain: 'Best for pow, park, groomers',
      reason: 'One-board quiver killer. Rock Out Camber blends pop with pressability. Explosive Popster Eco Booster tech gives you max snap without bulk. Crushes everything from powder to park.',
      productLink: 'https://www.evo.com/snowboards/salomon-assassin-snowboard',
      affiliate: 'https://www.evo.com/snowboards/salomon-assassin-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Resort', 'Mixed', 'Park'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Lib Tech T.Rice Orca',
      category: 'Freeride Snowboard',
      price: '$749.95',
      image: 'https://images.unsplash.com/photo-1583792986380-e8694c770e46?w=600&h=600&fit=crop&q=80',
      specs: '159cm • Volume Shifted • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'Powder: 10/10 | Freeride: 9/10',
      terrain: 'Backcountry, powder, technical terrain',
      reason: 'Travis Rice signature beast. Wide, short, powerful. Whale Tail Technology and tight 7m sidecut devour mountains. Ride 3-6cm shorter than normal.',
      productLink: 'https://www.evo.com/snowboards/lib-tech-t-rice-orca-snowboard',
      affiliate: 'https://www.evo.com/snowboards/lib-tech-t-rice-orca-snowboard',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['Powder', 'All-Mountain'],
        terrains: ['Backcountry', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Rome Ravine',
      category: 'All-Mountain Snowboard',
      price: '$579.95',
      image: 'https://images.unsplash.com/photo-1519315901367-a3dfe6b30043?w=600&h=600&fit=crop&q=80',
      specs: '158cm • Directional • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 9/10 | Powder: 9/10',
      terrain: 'Powder, groomers, side hits',
      reason: 'Laid-back one-board quiver. 3D nose for surfy flow and effortless float. Free-The-Ride Camber delivers playful fun anywhere on the mountain.',
      productLink: 'https://www.evo.com/snowboards/rome-ravine-snowboard',
      affiliate: 'https://www.evo.com/snowboards/rome-ravine-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Powder'],
        terrains: ['Resort', 'Mixed', 'Backcountry'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Capita DOA',
      category: 'Freestyle Snowboard',
      price: '$589.95',
      image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
      specs: '154cm • True Twin • Medium Flex',
      stiffness: '5/10',
      styleRating: 'Freestyle: 10/10 | All-Mountain: 8/10',
      terrain: 'Park, rails, jumps, all-mountain',
      reason: 'Award-winning freestyle legend. Ultra-light P2 core with explosive pop. Seven-time Transworld Good Wood winner for park domination.',
      productLink: 'https://www.evo.com/snowboards/capita-doa-snowboard',
      affiliate: 'https://www.evo.com/snowboards/capita-doa-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced', 'Expert'],
        styles: ['Freestyle'],
        terrains: ['Park'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Burton Custom Camber',
      category: 'All-Mountain Snowboard',
      price: '$679.95',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '156cm • Directional Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 9/10 | Freestyle: 7/10',
      terrain: 'Best for groomers, powder, park',
      reason: 'The most iconic all-mountain board since 1996. Perfect balance of power and playfulness with traditional camber for precise edge control and explosive pop.',
      productLink: 'https://www.evo.com/snowboards/burton-custom-snowboard',
      affiliate: 'https://www.evo.com/snowboards/burton-custom-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Carving'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Ride Twinpig',
      category: 'All-Mountain Snowboard',
      price: '$449.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '151cm • Twin • Soft-Medium Flex',
      stiffness: '4/10',
      styleRating: 'Beginner-Friendly: 10/10 | Playful: 9/10',
      terrain: 'All conditions, perfect for progression',
      reason: 'Wide platform for incredible stability. Perfect for learning and progression with forgiving flex. Volume-shifted design means ride shorter for better maneuverability.',
      productLink: 'https://www.evo.com/snowboards/ride-twinpig-snowboard',
      affiliate: 'https://www.evo.com/snowboards/ride-twinpig-snowboard',
      bestFor: {
        levels: ['Beginner', 'Intermediate'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Resort', 'Mixed', 'Park'],
        budgets: ['$300 - $500', '$500 - $800']
      }
    },
    {
      name: 'K2 Commonwealth',
      category: 'Freeride Snowboard',
      price: '$699.95',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop&q=80',
      specs: '157cm • Directional • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'Freeride: 10/10 | All-Mountain: 9/10',
      terrain: 'Powder, groomers, steep terrain',
      reason: 'Beefed-up evolution of the Passport. A1 Core wrapped in heavy tri-axial glass and Spectral Braid tech for independent flex control. Wax-infused Sintered 4001 base keeps you moving fast. Gender-inclusive design for all riders seeking demanding performance.',
      productLink: 'https://www.evo.com/snowboards/k2-commonwealth-snowboard',
      affiliate: 'https://www.evo.com/snowboards/k2-commonwealth-snowboard',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['Powder', 'All-Mountain'],
        terrains: ['Backcountry', 'Resort', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'K2 Hypnotist',
      category: 'Freestyle Snowboard',
      price: '$649.95',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '155cm • True Twin • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'Freestyle: 10/10 | Park: 10/10',
      terrain: 'Park, jumps, all-mountain freestyle',
      reason: 'Premium freestyle weapon with full camber for explosive pop. BAP Core with Carbon DarkWeb and Carbon Backbone deliver incredible snap. SpaceGlass tip/tail reduce swing weight for extra rotation. Built for medium to large features and transitions.',
      productLink: 'https://www.evo.com/snowboards/k2-hypnotist-snowboard',
      affiliate: 'https://www.evo.com/snowboards/k2-hypnotist-snowboard',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['Freestyle'],
        terrains: ['Park', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'K2 Medium',
      category: 'Freestyle Snowboard',
      price: '$599.95',
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=600&fit=crop&q=80',
      specs: '152cm • True Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'Freestyle: 10/10 | All-Mountain: 8/10',
      terrain: 'Park, streets, all-mountain',
      reason: 'Jake Kuzyk pro model redesigned for modern freestyle. Classic twin shape with mostly-camber profile and predictable flex. Carbon Backbone adds snap without stiffness. Deep sidecut for stability, smooth blend zones for low-speed nimbleness. Street-ready versatility.',
      productLink: 'https://www.evo.com/snowboards/k2-medium-snowboard',
      affiliate: 'https://www.evo.com/snowboards/k2-medium-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Freestyle', 'All-Mountain'],
        terrains: ['Park', 'Resort', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Signal Disruptor',
      category: 'All-Mountain Freestyle Snowboard',
      price: '$599.00',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop&q=80',
      specs: '152cm • True Twin • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'All-Mountain: 10/10 | Freestyle: 9/10',
      terrain: 'All-mountain, big jumps, groomers',
      reason: 'True twin with bold blunted shape. Medium-stiff flex with traditional camber for explosive pop and control. Sintered 7500 base for maximum speed. One board to dominate all-mountain and freestyle terrain with confidence and style.',
      productLink: 'https://www.signalsnowboards.com/products/disruptor-higher-power',
      affiliate: 'https://www.signalsnowboards.com/products/disruptor-higher-power',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Resort', 'Mixed', 'Park'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Signal Yup',
      category: 'Powder/All-Mountain Snowboard',
      price: '$619.00',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop&q=80',
      specs: '157cm • Directional • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'Powder: 10/10 | Carving: 9/10',
      terrain: 'Groomers, powder, all-mountain',
      reason: 'Directional powerhouse for speed and control. Classic camber with subtle early rise for powder float. Tapered sidecut delivers smooth powerful carves. Channel system for micro stance adjustments. Built for all-mountain domination.',
      productLink: 'https://www.signalsnowboards.com/products/yup-rpm-x-taylor-schulz',
      affiliate: 'https://www.signalsnowboards.com/products/yup-rpm-x-taylor-schulz',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['Powder', 'All-Mountain'],
        terrains: ['Backcountry', 'Resort', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Signal Park Pro',
      category: 'Freestyle Snowboard',
      price: '$589.99',
      image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
      specs: '151cm • True Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'Freestyle: 10/10 | Park: 10/10',
      terrain: 'Park, rails, jumps',
      reason: 'Dedicated park weapon with true twin shape for perfect switch riding. Balanced medium flex delivers pop and press-ability. Traditional camber for edge control and stability on features. Built for progression in the terrain park.',
      productLink: 'https://www.signalsnowboards.com/products/park-pro-gutter-phoenix',
      affiliate: 'https://www.signalsnowboards.com/products/park-pro-gutter-phoenix',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Freestyle'],
        terrains: ['Park'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Nitro Team Pro',
      category: 'All-Mountain Snowboard',
      price: '$629.95',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '158cm • Directional Twin • Stiff',
      stiffness: '8/10',
      styleRating: 'All-Mountain: 10/10 | Freestyle: 8/10',
      terrain: 'All-mountain, park, steeps',
      reason: 'Pro-level all-mountain weapon. Traditional camber with carbon tape for explosive pop and response. Sintered Speed Formula II base for maximum velocity. Stiffer flex delivers stability at speed and power for aggressive riding. Team-proven performance.',
      productLink: 'https://www.evo.com/snowboards/nitro-team-pro-snowboard',
      affiliate: 'https://www.evo.com/snowboards/nitro-team-pro-snowboard',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Resort', 'Mixed', 'Park'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Nitro Team',
      category: 'All-Mountain Snowboard',
      price: '$579.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '156cm • Directional Twin • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'All-Mountain: 10/10 | Versatility: 10/10',
      terrain: 'All conditions, any terrain',
      reason: 'Legendary 20+ year all-terrain classic. Proven directional twin with traditional camber for stability and pop. Versatile flex pattern for any riding style. Mellow sidecut and semi-blunted tips handle everything. From Olympians to weekend warriors.',
      productLink: 'https://www.evo.com/snowboards/nitro-team-snowboard',
      affiliate: 'https://www.evo.com/snowboards/nitro-team-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed', 'Backcountry'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Nitro Phase',
      category: 'All-Mountain Snowboard',
      price: '$459.95',
      image: 'https://images.unsplash.com/photo-1519315901367-a3dfe6b30043?w=600&h=600&fit=crop&q=80',
      specs: '154cm • Directional • Medium Flex',
      stiffness: '5/10',
      styleRating: 'All-Mountain: 9/10 | Beginner-Friendly: 10/10',
      terrain: 'Groomers, tree runs, side hits',
      reason: 'New affordable all-mountain cruiser for daydreamers and path-finders. Medium playful flex with perfectly matched widths. Dual Degressive sidecut for forgiving turns. Ideal daily snowboard from team riders to weekend warriors seeking versatile fun.',
      productLink: 'https://www.evo.com/snowboards/nitro-phase-snowboard',
      affiliate: 'https://www.evo.com/snowboards/nitro-phase-snowboard',
      bestFor: {
        levels: ['Beginner', 'Intermediate'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$300 - $500', '$500 - $800']
      }
    },
    {
      name: 'Never Summer Proto T3 Eclipse',
      category: 'All-Mountain Freeride Snowboard',
      price: '$649.99',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop&q=80',
      specs: '158cm • Directional • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'Freeride: 10/10 | All-Mountain: 9/10',
      terrain: 'Powder, groomers, all-terrain',
      reason: 'Throwback Eclipse logo meets cutting-edge tech. Recurve Triple Camber with extended nose rocker for float. Precision Stitched Carbon Matrix for unrivaled response. R.I.P. Edge-Hold and 10mm taper provide stability and control. Freeride/freestyle hybrid perfection.',
      productLink: 'https://www.evo.com/snowboards/never-summer-proto-t3-eclipse-snowboard',
      affiliate: 'https://www.evo.com/snowboards/never-summer-proto-t3-eclipse-snowboard',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['Powder', 'All-Mountain'],
        terrains: ['Backcountry', 'Resort', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Never Summer Proto Type 3',
      category: 'All-Mountain Snowboard',
      price: '$649.99',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '154cm • Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 10/10 | Park: 8/10',
      terrain: 'All-mountain, side hits, jumps',
      reason: 'Advanced all-terrain charger with incredible pop and stability. Triple camber profile for edge hold even through ice. Perfect flex for side hits and big air. Handcrafted in Denver with premium materials and cutting-edge technology.',
      productLink: 'https://neversummer.com/products/mens-proto-type-3-snowboard',
      affiliate: 'https://neversummer.com/products/mens-proto-type-3-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Resort', 'Mixed', 'Park'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Never Summer Llama',
      category: 'Freestyle Snowboard',
      price: '$659.99',
      image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
      specs: '153cm • True Twin • Soft-Medium Flex',
      stiffness: '5/10',
      styleRating: 'Freestyle: 10/10 | Park: 10/10',
      terrain: 'Park, all-mountain freestyle',
      reason: 'California Grass Roots x Jimbo Phillips collaboration. Ultimate freestyle all-mountain twin with Recurve Traditional Camber. Soft flex generates explosive pop and boost. Perfectly balanced for spins and switch riding. Tested park dominator.',
      productLink: 'https://www.evo.com/snowboards/never-summer-llama-snowboard',
      affiliate: 'https://www.evo.com/snowboards/never-summer-llama-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Freestyle'],
        terrains: ['Park', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Bataleon Goliath+',
      category: 'All-Mountain Freestyle Snowboard',
      price: '$699.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '157cm • Directional Twin • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'All-Mountain: 10/10 | Freestyle: 9/10',
      terrain: 'Park, powder, all-terrain',
      reason: 'Upgraded Goliath with lighter core, enhanced carbon, faster ISOSPORT 7000 base. Triple Base Technology with SideKick for catch-free riding. AirRide dampening, Aramid X-Ply reinforcement. Directional twin beast for all-mountain freestyle domination.',
      productLink: 'https://www.evo.com/snowboards/bataleon-goliath-snowboard',
      affiliate: 'https://www.evo.com/snowboards/bataleon-goliath-snowboard',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Resort', 'Mixed', 'Park'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Bataleon Evil Twin',
      category: 'Freestyle Snowboard',
      price: '$579.95',
      image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
      specs: '154cm • True Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'Freestyle: 10/10 | Park: 10/10',
      terrain: 'Park, rails, all-mountain',
      reason: '20-year freestyle legend with iconic Triple Base Technology. True twin shape with medium camber for playful, catch-free riding. Poppy, versatile park powerhouse. Perfect balance of creativity and control for side hits and terrain park mastery.',
      productLink: 'https://www.evo.com/snowboards/bataleon-evil-twin-snowboard',
      affiliate: 'https://www.evo.com/snowboards/bataleon-evil-twin-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Freestyle'],
        terrains: ['Park', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Bataleon Disaster',
      category: 'Jib/Freestyle Snowboard',
      price: '$499.95',
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=600&fit=crop&q=80',
      specs: '151cm • True Twin • Soft Flex',
      stiffness: '4/10',
      styleRating: 'Jib: 10/10 | Freestyle: 9/10',
      terrain: 'Park, rails, street',
      reason: 'Super playful jib machine with soft flex and forgiving ride. Triple Base Technology with SideKick eliminates edge catch. Central Super Tube adds pop without torsional stiffness. Perfect for presses, butters, and creative park laps.',
      productLink: 'https://www.evo.com/snowboards/bataleon-disaster-snowboard',
      affiliate: 'https://www.evo.com/snowboards/bataleon-disaster-snowboard',
      bestFor: {
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        styles: ['Freestyle'],
        terrains: ['Park'],
        budgets: ['$300 - $500', '$500 - $800']
      }
    },
    {
      name: 'Arbor El Camino',
      category: 'All-Mountain Snowboard',
      price: '$629.95',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '157cm • Directional • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'All-Mountain: 10/10 | Big Air: 9/10',
      terrain: 'All-mountain, jumps, resort',
      reason: 'Jared Elston pro model built to charge. Parabolic camber, slightly directional shaping. Grip Tech contact points, real wood topsheet. Freight train power meets Formula 1 agility. Spec-heavy to be airtime-light. Apex mountain predator.',
      productLink: 'https://www.evo.com/snowboards/arbor-el-camino-snowboard',
      affiliate: 'https://www.evo.com/snowboards/arbor-el-camino-snowboard',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Arbor Formula',
      category: 'All-Mountain Snowboard',
      price: '$549.95',
      image: 'https://images.unsplash.com/photo-1519315901367-a3dfe6b30043?w=600&h=600&fit=crop&q=80',
      specs: '154cm • Directional Twin • Medium Flex',
      stiffness: '5/10',
      styleRating: 'All-Mountain: 9/10 | Progression: 10/10',
      terrain: 'Groomers, all-mountain',
      reason: 'Timeless directional twin for resort adventures. System Camber with 3D Fenders for smooth turns. Grip Tech for reliable edge hold. Accessible high-value board built to inspire. Perfect all-mountain ride for progressing and seasoned shredders.',
      productLink: 'https://www.evo.com/snowboards/arbor-formula-snowboard',
      affiliate: 'https://www.evo.com/snowboards/arbor-formula-snowboard',
      bestFor: {
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Arbor Bryan Iguchi Pro',
      category: 'Freeride Snowboard',
      price: '$649.95',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop&q=80',
      specs: '161cm • Directional • Stiff',
      stiffness: '8/10',
      styleRating: 'Powder: 10/10 | Freeride: 10/10',
      terrain: 'Backcountry, powder, steeps',
      reason: 'Legendary Bryan Iguchi signature board 2.0. Premium freeride weapon with sustainable wood core. Double carbon stringers, Vector netting. Built for backcountry pow lines and aggressive charging. Over a decade of proven performance.',
      productLink: 'https://www.evo.com/snowboards/arbor-bryan-iguchi-pro-snowboard',
      affiliate: 'https://www.evo.com/snowboards/arbor-bryan-iguchi-pro-snowboard',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['Powder'],
        terrains: ['Backcountry'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Academy Propaganda',
      category: 'Freestyle Snowboard',
      price: '$588.95',
      image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
      specs: '152cm • True Twin • Soft-Medium Flex',
      stiffness: '5/10',
      styleRating: 'Freestyle: 10/10 | Park: 10/10',
      terrain: 'Park, rails, all-mountain',
      reason: 'Rider-owned park dominator since 2003. Micro camber with tons of pop off nose or tail without sacrificing flex. Easy to press and butter. Made by Never Summer with highest quality materials. Torsionally flexible but stable for loose creative style.',
      productLink: 'https://academysnowboards.com/products/propaganda',
      affiliate: 'https://academysnowboards.com/products/propaganda',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Freestyle'],
        terrains: ['Park', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Academy Propacamba',
      category: 'All-Mountain Snowboard',
      price: '$588.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '154cm • Directional Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 9/10 | Versatility: 10/10',
      terrain: 'All-mountain, groomers, powder',
      reason: 'New hybrid all-mountain ripper. Perfect blend of camber underfoot with rocker. Easy to ride with early rise. Directional twin for resort domination. Built by Never Summer Industries. Confidence-inspiring edge control with playful versatility.',
      productLink: 'https://academysnowboards.com/products/propacamba',
      affiliate: 'https://academysnowboards.com/products/propacamba',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Academy Masters',
      category: 'All-Mountain Camber Snowboard',
      price: '$639.00',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '157cm • Directional Twin • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'All-Mountain: 10/10 | Versatility: 10/10',
      terrain: 'All conditions, any terrain',
      reason: 'One board that performs anywhere in all conditions. Expert tooling with best materials available. Traditional camber for power and precision. Heavy damp construction cuts vibrations. Built like a tank for charging steeps, trees, cliffs, bumps, and park.',
      productLink: 'https://academysnowboards.com/products/masters',
      affiliate: 'https://academysnowboards.com/products/masters',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed', 'Backcountry'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Jones Howler',
      category: 'Freeride Snowboard',
      price: '$699.95',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop&q=80',
      specs: '161cm • Directional • Stiff',
      stiffness: '8/10',
      styleRating: 'Freeride: 10/10 | Big Mountain: 10/10',
      terrain: 'Steep technical terrain, spines, big airs',
      reason: 'New 2026 Victor de Le Rue & Elena Hight collaboration. Built for steep technical terrain playground. Minimally tapered directional with hybrid full camber. Koroyd dampening, insane pop and edge hold. Float down spine lines, stomp huge airs with authority.',
      productLink: 'https://www.jonessnowboards.com/products/men-howler-snowboard-2026',
      affiliate: 'https://www.jonessnowboards.com/products/men-howler-snowboard-2026',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['Powder'],
        terrains: ['Backcountry'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Jones Frontier 2.0',
      category: 'All-Mountain Snowboard',
      price: '$529.95',
      image: 'https://images.unsplash.com/photo-1519315901367-a3dfe6b30043?w=600&h=600&fit=crop&q=80',
      specs: '156cm • Directional • Medium Flex',
      stiffness: '5/10',
      styleRating: 'All-Mountain: 10/10 | Versatility: 9/10',
      terrain: 'All-terrain, all-conditions',
      reason: 'Redesigned 2026 all-mountain workhorse. Tapered directional shape with friendly flex. New long nose, 5mm taper, directional rocker. 3D Flip Tip for float. Stable, forgiving, perfect daily driver. Bio-based epoxy for sustainability.',
      productLink: 'https://www.jonessnowboards.com/products/men-frontier-2-0-snowboard-2026',
      affiliate: 'https://www.jonessnowboards.com/products/men-frontier-2-0-snowboard-2026',
      bestFor: {
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Jones Stratos',
      category: 'All-Mountain Snowboard',
      price: '$669.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '159cm • Directional • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 10/10 | Moguls: 9/10',
      terrain: 'Variable conditions, trees, moguls',
      reason: 'Versatile all-mountain ripper. Triple-density bamboo/paulownia core. BComp Carbon/Flax stringers for pop without chatter. Floats in moguls, quick snappy turns. Built for diehard enthusiasts who ride varying conditions daily.',
      productLink: 'https://www.jonessnowboards.com/products/men-stratos-snowboard-2026',
      affiliate: 'https://www.jonessnowboards.com/products/men-stratos-snowboard-2026',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Yes. Greats',
      category: 'All-Mountain Freestyle Snowboard',
      price: '$629.95',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '154cm • Asymmetrical Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 10/10 | Freestyle: 9/10',
      terrain: 'All-mountain, park, switch riding',
      reason: 'Innovation meets style with asymmetrical twin design. Revolutionary asymmetrical MidBite in opposing sidecut specs. Perfect for switch riding, butters, side hits. Ultimate daily driver for creative all-mountain progression.',
      productLink: 'https://www.evo.com/snowboards/yes-greats-snowboard',
      affiliate: 'https://www.evo.com/snowboards/yes-greats-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Resort', 'Mixed', 'Park'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Yes. Standard',
      category: 'All-Mountain Freestyle Snowboard',
      price: '$579.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '156cm • Directional Volume Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 9/10 | Float: 10/10',
      terrain: 'Powder, cliffs, all-mountain',
      reason: 'Versatility defined. CamRock profile blends responsive camber with forgiving rocker. MidBite edges for enhanced grip on hardpack. Torrent Core delivers smooth stability and reliable pop. One board that carves, floats, and pops with equal confidence.',
      productLink: 'https://www.evo.com/snowboards/yes-standard-snowboard',
      affiliate: 'https://www.evo.com/snowboards/yes-standard-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed', 'Backcountry'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Yes. Basic',
      category: 'All-Mountain Snowboard',
      price: '$449.95',
      image: 'https://images.unsplash.com/photo-1519315901367-a3dfe6b30043?w=600&h=600&fit=crop&q=80',
      specs: '152cm • True Twin • Soft-Medium Flex',
      stiffness: '4/10',
      styleRating: 'Beginner-Friendly: 10/10 | Park: 8/10',
      terrain: 'All-mountain, park, progression',
      reason: 'Entry-level legend from Yes. crew. True twin shape perfect for learning and progression. Forgiving flex pattern with reliable construction. Great value for beginners wanting quality without compromise. Built by riders who live and breathe snowboarding.',
      productLink: 'https://www.evo.com/snowboards/yes-basic-snowboard',
      affiliate: 'https://www.evo.com/snowboards/yes-basic-snowboard',
      bestFor: {
        levels: ['Beginner', 'Intermediate'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Resort', 'Mixed', 'Park'],
        budgets: ['$300 - $500', '$500 - $800']
      }
    },
    {
      name: 'Nidecker Sensor Team',
      category: 'Freestyle Snowboard',
      price: '$579.95',
      image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
      specs: '155cm • True Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'Freestyle: 10/10 | Park: 10/10',
      terrain: 'Park, jumps, rails, all-mountain',
      reason: 'Battle-tested by Nidecker crew from Laax to Mammoth. Added width for stability with dialed flex for transitions. Super light core for spins and creativity. Carbon inlays for pop and dampening. Sintruded base tough as nails, fast as hell.',
      productLink: 'https://www.nidecker.com/products/sensor-team-2026',
      affiliate: 'https://www.nidecker.com/products/sensor-team-2026',
      bestFor: {
        levels: ['Intermediate', 'Advanced', 'Expert'],
        styles: ['Freestyle'],
        terrains: ['Park'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Nidecker Thruster',
      category: 'All-Mountain Snowboard',
      price: '$579.95',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '156cm • Directional • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'All-Mountain: 10/10 | Speed: 10/10',
      terrain: 'Corduroy, powder, high speed',
      reason: 'Decades of experience in this all-mountain charger. Lightest core in Nidecker line with powerful camber. Super dense sintered base minimizes drag. SideKick 3D nose for float and smooth edge changes. Carbon dampens at terminal velocity.',
      productLink: 'https://www.nidecker.com/products/thruster-2026',
      affiliate: 'https://www.nidecker.com/products/thruster-2026',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed', 'Backcountry'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Nidecker Alpha',
      category: 'Freeride Snowboard',
      price: '$599.95',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop&q=80',
      specs: '159cm • Directional • Medium Flex',
      stiffness: '6/10',
      styleRating: 'Powder: 10/10 | Flow: 10/10',
      terrain: 'Powder, trees, creative lines',
      reason: 'Inspired by efficient shapes in nature. Mat Crepel go-to deck. 3D spooned nose for maximum float and smooth initiation. Subtle pinch helps sink in deep snow. Surfy CamRock profile. All about flow for creative mountain surfers.',
      productLink: 'https://www.nidecker.com/products/alpha-2026',
      affiliate: 'https://www.nidecker.com/products/alpha-2026',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Powder', 'All-Mountain'],
        terrains: ['Backcountry', 'Resort', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Sims Nub',
      category: 'Freestyle Freeride Snowboard',
      price: '$610.00',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '156cm • Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'Freeride: 10/10 | Freestyle: 10/10',
      terrain: 'Powder, park, switch riding',
      reason: 'Legendary freerider\'s freestyle board. Long nose twin shape with progressive sidecut. Rides and lands switch without directional twitch. Long nose provides powder float. Traditional camber in sweet spot. Team favorite since Tom Sims era.',
      productLink: 'https://www.evo.com/snowboards/sims-nub-snowboard',
      affiliate: 'https://www.evo.com/snowboards/sims-nub-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced', 'Expert'],
        styles: ['All-Mountain', 'Freestyle', 'Powder'],
        terrains: ['Resort', 'Mixed', 'Park', 'Backcountry'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Sims ATV',
      category: 'All-Mountain Snowboard',
      price: '$540.00',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '155cm • Directional Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'All-Mountain: 10/10 | Versatility: 10/10',
      terrain: 'Steeps, deeps, groomers, everything',
      reason: 'Attack the entire mountain with vehemence. Traditional camber for pop and energy. Flexible Thin Tip tech for maneuverability. Tip to tail bamboo stringers for lasting fun. Single board that does it all. Take it for a drive anywhere.',
      productLink: 'https://www.evo.com/snowboards/sims-atv-snowboard',
      affiliate: 'https://www.evo.com/snowboards/sims-atv-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed', 'Backcountry'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Sims Bowl Squad',
      category: 'All-Mountain Snowboard',
      price: '$419.95',
      image: 'https://images.unsplash.com/photo-1519315901367-a3dfe6b30043?w=600&h=600&fit=crop&q=80',
      specs: '152cm • Twin • Soft-Medium Flex',
      stiffness: '4/10',
      styleRating: 'Beginner-Friendly: 10/10 | Value: 10/10',
      terrain: 'All-mountain, progression',
      reason: 'Quality board under $500 from snowboarding pioneers. Camber-dominated for all terrain and rider levels. Perfect entry into snowboarding with heritage brand quality. Support the original. Pure juice from Tom Sims legacy.',
      productLink: 'https://www.evo.com/snowboards/sims-bowl-squad-snowboard',
      affiliate: 'https://www.evo.com/snowboards/sims-bowl-squad-snowboard',
      bestFor: {
        levels: ['Beginner', 'Intermediate'],
        styles: ['All-Mountain'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$300 - $500', '$500 - $800']
      }
    },
    {
      name: 'Salomon Huck Knife',
      category: 'Freestyle Snowboard',
      price: '$579.95',
      image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
      specs: '154cm • True Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'Freestyle: 10/10 | Park: 10/10',
      terrain: 'Park, jumps, rails, all-mountain',
      reason: 'Top-of-the-line freestyle weapon. Quad Camber profile with Popster Booster carbon stringers. Launches effortlessly, lands smoother. EQ Rad sidecut for chaos and control. Park passport with all-mountain secret powers. Freestyle PhD.',
      productLink: 'https://www.evo.com/snowboards/salomon-huck-knife-snowboard',
      affiliate: 'https://www.evo.com/snowboards/salomon-huck-knife-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Freestyle'],
        terrains: ['Park'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Salomon Sleepwalker',
      category: 'Freestyle Snowboard',
      price: '$449.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '152cm • True Twin • Soft-Medium Flex',
      stiffness: '4/10',
      styleRating: 'Freestyle: 10/10 | Playful: 10/10',
      terrain: 'Park, rails, side hits',
      reason: 'Sounds chill but ready to throw down. Medium-soft flex with Rock Out Camber for snappy pop. Royal Rubber Pads soften sketchy landings. Perfect for rails, buttery laps, moonwalking through park. Freestyle fun that never hits snooze.',
      productLink: 'https://www.evo.com/snowboards/salomon-sleepwalker-snowboard',
      affiliate: 'https://www.evo.com/snowboards/salomon-sleepwalker-snowboard',
      bestFor: {
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        styles: ['Freestyle'],
        terrains: ['Park', 'Mixed'],
        budgets: ['$300 - $500', '$500 - $800']
      }
    },
    {
      name: 'Lib Tech Skate Banana',
      category: 'All-Mountain Freestyle Snowboard',
      price: '$579.99',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '154cm • True Twin • Medium Flex',
      stiffness: '5/10',
      styleRating: 'All-Mountain: 10/10 | Freestyle: 10/10',
      terrain: 'Park, powder, groomers, everything',
      reason: 'Legendary board that flipped design on its head. Revolutionary Banana Tech rocker/camber profile. Buttery presses, catch-free carving, effortless control. Magne-Traction turns ice into powder. Made in USA. From park laps to pow stashes.',
      productLink: 'https://www.evo.com/snowboards/lib-tech-skate-banana-btx-snowboard',
      affiliate: 'https://www.evo.com/snowboards/lib-tech-skate-banana-btx-snowboard',
      bestFor: {
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Park', 'Resort', 'Mixed'],
        budgets: ['$500 - $800']
      }
    },
    {
      name: 'Lib Tech Legitimizer',
      category: 'Freestyle Freeride Snowboard',
      price: '$499.99',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=600&fit=crop&q=80',
      specs: '155cm • Twin • Medium Flex',
      stiffness: '6/10',
      styleRating: 'Park: 9/10 | Steeps: 9/10',
      terrain: 'Park, chutes, rails, big lines',
      reason: 'Box Scratcher meets Box Knife. Playful in park, legit on steeps. Buttery medium flex with Banana Tech. Blended with camber power and precision. Press rails and charge chutes same run. Creative both park and big lines.',
      productLink: 'https://www.evo.com/snowboards/lib-tech-legitimizer-c3-snowboard',
      affiliate: 'https://www.evo.com/snowboards/lib-tech-legitimizer-c3-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Freestyle', 'All-Mountain'],
        terrains: ['Park', 'Mixed', 'Backcountry'],
        budgets: ['$300 - $500', '$500 - $800']
      }
    },
    {
      name: 'Rome Artifact',
      category: 'Freestyle Snowboard',
      price: '$499.95',
      image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
      specs: '153cm • True Twin • Soft Flex',
      stiffness: '3/10',
      styleRating: 'Freestyle: 10/10 | Jib: 10/10',
      terrain: 'Park, rails, streets, creative',
      reason: 'Freestyle fiend built to press and jib. Buttery-soft flex with retro-modern shape. Twin Double Kick for presses and style. Perfect for downrails, pole jams, rope ollies. Bringing freestyle flavor all over the hill. Born to clip up.',
      productLink: 'https://www.evo.com/snowboards/rome-artifact-snowboard',
      affiliate: 'https://www.evo.com/snowboards/rome-artifact-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['Freestyle'],
        terrains: ['Park'],
        budgets: ['$300 - $500', '$500 - $800']
      }
    },
    {
      name: 'Rome Boneless',
      category: 'All-Mountain Freestyle Snowboard',
      price: '$549.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '155cm • True Twin • Medium Flex',
      stiffness: '5/10',
      styleRating: 'All-Mountain: 9/10 | Freestyle: 9/10',
      terrain: 'Park, pillow lines, side hits, trees',
      reason: 'NEW 2026! Fresh twist on freestyle all-mountain. Medium-playful flex with Twin Diamond 3D profile. Fusion Camber for versatility. Press, pop, carve through anything. From park laps to pillow lines. Keeps good times rolling.',
      productLink: 'https://www.evo.com/snowboards/rome-boneless-snowboard',
      affiliate: 'https://www.evo.com/snowboards/rome-boneless-snowboard',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Freestyle'],
        terrains: ['Park', 'Resort', 'Mixed'],
        budgets: ['$500 - $800']
      }
    }
  ],
  Skiing: [
    {
      name: 'Rossignol Experience 88 Ti',
      category: 'All-Mountain Skis',
      price: '$749.95',
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=600&fit=crop&q=80',
      specs: '172cm • 88mm Waist • Medium-Stiff',
      stiffness: '7/10',
      styleRating: 'All-Mountain: 9/10 | Groomer: 10/10',
      terrain: 'Groomers, bumps, light powder',
      reason: 'Versatile powerhouse with titanal construction. Exceptional edge grip on hardpack with enough width to handle variable conditions. Smooth, damp, confidence-inspiring.',
      productLink: 'https://www.evo.com/skis/rossignol-experience-88-ti',
      affiliate: 'https://affiliate-link-5.com',
      bestFor: {
        levels: ['Intermediate', 'Advanced'],
        styles: ['All-Mountain', 'Carving'],
        terrains: ['Resort', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'Armada ARV 96',
      category: 'Freestyle Skis',
      price: '$649.95',
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=600&fit=crop&q=80',
      specs: '177cm • 96mm Waist • Medium Flex',
      stiffness: '5/10',
      styleRating: 'Freestyle: 10/10 | Park: 9/10',
      terrain: 'Park, powder, all-mountain',
      reason: 'The ultimate playful twin tip. Poppy ash core for endless butter tricks. Equally at home stomping jumps or slashing powder. True twin shape rides switch perfectly.',
      productLink: 'https://www.evo.com/skis/armada-arv-96',
      affiliate: 'https://affiliate-link-6.com',
      bestFor: {
        levels: ['Intermediate', 'Advanced', 'Expert'],
        styles: ['Freestyle'],
        terrains: ['Park', 'Mixed'],
        budgets: ['$500 - $800', '$800+']
      }
    },
    {
      name: 'K2 Mindbender 108Ti',
      category: 'Freeride Skis',
      price: '$849.95',
      image: 'https://images.unsplash.com/photo-1609595363415-e3d5e1f0a4c7?w=600&h=600&fit=crop&q=80',
      specs: '184cm • 108mm Waist • Stiff Flex',
      stiffness: '8/10',
      styleRating: 'Powder: 10/10 | Big Mountain: 9/10',
      terrain: 'Deep snow, steeps, backcountry',
      reason: 'Big mountain destroyer. 108mm waist provides effortless float in powder. Titanal Y-beam construction delivers power and stability at speed without the weight penalty.',
      productLink: 'https://www.evo.com/skis/k2-mindbender-108ti',
      affiliate: 'https://affiliate-link-7.com',
      bestFor: {
        levels: ['Advanced', 'Expert'],
        styles: ['Powder'],
        terrains: ['Backcountry'],
        budgets: ['$800+']
      }
    },
    {
      name: 'Blizzard Brahma 82',
      category: 'Carving Skis',
      price: '$599.95',
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=600&fit=crop&q=80',
      specs: '174cm • 82mm Waist • Stiff Flex',
      stiffness: '8/10',
      styleRating: 'Carving: 10/10 | Groomer: 10/10',
      terrain: 'Groomers, hardpack, fast turns',
      reason: 'Precision carving machine. Two sheets of titanal provide unmatched edge hold and stability. Perfect for ripping high-speed arcs on firm snow. Confidence at any speed.',
      productLink: 'https://www.evo.com/skis/blizzard-brahma-82',
      affiliate: 'https://affiliate-link-8.com',
      bestFor: {
        levels: ['Intermediate', 'Advanced', 'Expert'],
        styles: ['Carving'],
        terrains: ['Resort'],
        budgets: ['$500 - $800', '$800+']
      }
    }
  ]
};

const normalizeAnswer = (id, answer) => {
  if (!answer) return null;
  return NORMALIZED_ANSWERS[id]?.[answer] ?? answer;
};

const getNormalizedAnswers = (answers) => ({
  sport: answers.sport,
  level: normalizeAnswer('level', answers.level),
  style: normalizeAnswer('style', answers.style),
  terrain: normalizeAnswer('terrain', answers.terrain),
  budget: answers.budget,
  height: answers.height,
  weight: answers.weight
});

const getRecommendations = (currentAnswers) => {
  const products = RECOMMENDATIONS[currentAnswers.sport] ?? [];

  return products
    .map((product) => {
      const matches = [];
      if (product.bestFor.levels?.includes(currentAnswers.level)) {
        matches.push('Skill level');
      }
      if (product.bestFor.styles?.includes(currentAnswers.style)) {
        matches.push('Riding style');
      }
      if (product.bestFor.terrains?.includes(currentAnswers.terrain)) {
        matches.push('Terrain');
      }
      if (product.bestFor.budgets?.includes(currentAnswers.budget)) {
        matches.push('Budget');
      }
      return {
        ...product,
        score: matches.length,
        matches
      };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
};

const getSizeRecommendation = (answers) => {
  if (!answers.sport || !answers.height || !answers.weight) {
    return null;
  }
  const heightIndex = {
    'Under 5\'4"': 1,
    '5\'4" - 5\'8"': 2,
    '5\'8" - 6\'0"': 3,
    'Over 6\'0"': 4
  }[answers.height] ?? 2;
  const weightIndex = {
    'Under 130 lbs': 1,
    '130-160 lbs': 2,
    '160-190 lbs': 3,
    'Over 190 lbs': 4
  }[answers.weight] ?? 2;
  const sizeIndex = Math.round((heightIndex + weightIndex) / 2);

  if (answers.sport === 'Snowboarding') {
    const ranges = {
      1: '140–148 cm',
      2: '148–154 cm',
      3: '154–160 cm',
      4: '160–168 cm'
    };
    return `Suggested board length: ${ranges[sizeIndex] ?? '150–158 cm'}`;
  }

  const ranges = {
    1: '150–160 cm',
    2: '160–170 cm',
    3: '170–180 cm',
    4: '180–190 cm'
  };
  return `Suggested ski length: ${ranges[sizeIndex] ?? '165–175 cm'}`;
};

const App = () => {
  const [step, setStep] = useState('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const normalizedAnswers = useMemo(() => getNormalizedAnswers(answers), [answers]);
  const recommendations = useMemo(
    () => (step === 'results' ? getRecommendations(normalizedAnswers) : []),
    [normalizedAnswers, step]
  );
  const topPicks = recommendations.slice(0, 3);
  const otherOptions = recommendations.slice(3);
  const sizeRecommendation = useMemo(() => getSizeRecommendation(answers), [answers]);

  const summaryItems = [
    { label: 'Sport', value: normalizedAnswers.sport, icon: User },
    { label: 'Skill level', value: normalizedAnswers.level, icon: Award },
    { label: 'Riding style', value: normalizedAnswers.style, icon: TrendingUp },
    { label: 'Terrain', value: normalizedAnswers.terrain, icon: Mountain },
    { label: 'Budget', value: normalizedAnswers.budget, icon: DollarSign },
    { label: 'Height', value: normalizedAnswers.height, icon: Ruler },
    { label: 'Weight', value: normalizedAnswers.weight, icon: Scale }
  ].filter((item) => item.value);

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: option };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('results');
    }
  };

  const restartQuiz = () => {
    setStep('landing');
    setCurrentQuestion(0);
    setAnswers({});
  };

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white relative bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80')"}}>
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img src="/logo.png" alt="Green Room Gear Finder" className="w-[100px] h-[100px] object-contain" />
            </div>

            <button
              onClick={() => setStep('questionnaire')}
              className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-2xl"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'questionnaire') {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white relative bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1920&q=80')"}}>
        <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm"></div>
        <div className="max-w-2xl mx-auto px-6 py-16 relative z-10">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-200">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <span className="text-sm text-blue-200">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-blue-700 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8">{QUESTIONS[currentQuestion].question}</h2>
            
            <div className="space-y-3">
              {QUESTIONS[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full bg-white/10 hover:bg-white/25 border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-[1.01] hover:border-white/50 backdrop-blur-sm shadow-lg"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="mt-6 text-blue-200 hover:text-white transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white relative bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80')"}}>
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Perfect Match</h1>
            <p className="text-xl text-blue-100">
              Based on your answers, here are our top recommendations
            </p>
          </div>

          {summaryItems.length > 0 && (
            <div className="mb-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-green-300" />
                <h2 className="text-2xl font-bold">Your Ride Profile</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {summaryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-white/10 rounded-xl p-4 flex gap-3 items-start border border-white/15">
                      <span className="bg-white/20 rounded-lg p-2">
                        <Icon className="w-4 h-4 text-white" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-blue-200">{item.label}</p>
                        <p className="text-sm font-semibold">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {sizeRecommendation && (
                <div className="mt-4 bg-white/15 rounded-xl p-4 border border-white/20 text-sm text-blue-50">
                  <strong>Size guidance:</strong> {sizeRecommendation}
                </div>
              )}
            </div>
          )}

          {topPicks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-300" />
                Top Picks For You
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {topPicks.map((product) => (
                  <div key={product.name} className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-all">
                    <div className="h-64 overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-blue-600 font-semibold mb-1">{product.category}</div>
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-blue-600 mb-3">{product.price}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-semibold text-gray-600">SPECS</div>
                        <p className="text-sm text-gray-700">{product.specs}</p>
                        <div className="flex gap-4 text-xs">
                          <span className="bg-gray-100 px-2 py-1 rounded">Stiffness: {product.stiffness}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          <strong>Best For:</strong> {product.terrain}
                        </div>
                        <div className="text-xs text-gray-600">
                          {product.styleRating}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{product.reason}</p>

                      {product.matches.length > 0 && (
                        <div className="mb-4 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-2">
                          ✓ Matched on: {product.matches.join(', ')}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <a
                          href={product.affiliate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                        >
                          Buy Now →
                        </a>
                        <a
                          href={product.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Full Product Details <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherOptions.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Other Great Options</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {otherOptions.map((product) => (
                  <div key={product.name} className="bg-white/15 backdrop-blur-md rounded-xl p-6 flex gap-4 border border-white/20 shadow-xl">
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-white/30 backdrop-blur-sm border border-white/20">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-blue-200 mb-1">{product.category}</div>
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-lg font-bold text-yellow-300 mb-2">{product.price}</p>
                      <p className="text-xs text-blue-100 mb-1">{product.specs}</p>
                      <p className="text-xs text-blue-200 mb-3">Stiffness: {product.stiffness}</p>
                      {product.matches.length > 0 && (
                        <p className="text-xs text-blue-50 mb-3">✓ Matched: {product.matches.join(', ')}</p>
                      )}
                      <div className="flex gap-2">
                        <a
                          href={product.affiliate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Buy Now →
                        </a>
                        <a
                          href={product.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-200 hover:text-white transition-colors px-2"
                        >
                          Details <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={restartQuiz}
              className="bg-white/20 hover:bg-white/35 px-6 py-3 rounded-lg font-semibold transition-colors border border-white/30 backdrop-blur-sm"
            >
              Start Over
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-blue-200">
            <p>* Disclosure: We may earn a commission if you purchase through our links, at no extra cost to you.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
