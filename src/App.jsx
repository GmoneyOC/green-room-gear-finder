import React, { useState } from 'react';
import { ChevronRight, Mountain, Award, TrendingUp, DollarSign, ExternalLink } from 'lucide-react';

const App = () => {
  const [step, setStep] = useState('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
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

  const getRecommendations = () => {
    const sport = answers.sport;
    const level = answers.level;
    const budget = answers.budget;
    const style = answers.style;

    if (sport === 'Snowboarding') {
      return [
        {
          name: 'Burton Custom Camber',
          category: 'All-Mountain Snowboard',
          price: '$679.95',
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop&q=80',
          specs: '156cm • Directional Twin • Medium Flex',
          stiffness: '6/10',
          styleRating: 'All-Mountain: 9/10 | Freestyle: 7/10',
          terrain: 'Best for groomers, powder, park',
          reason: 'The most iconic all-mountain board since 1996. Perfect balance of power and playfulness with traditional camber for precise edge control and explosive pop.',
          productLink: 'https://www.evo.com/snowboards/burton-custom-snowboard',
          affiliate: 'https://affiliate-link-1.com',
          featured: level?.includes('Intermediate') || level?.includes('Advanced')
        },
        {
          name: 'Capita DOA',
          category: 'Freestyle Snowboard',
          price: '$589.95',
          image: 'https://images.unsplash.com/photo-1519315901367-a3dfe6b30043?w=600&h=600&fit=crop&q=80',
          specs: '154cm • True Twin • Medium Flex',
          stiffness: '5/10',
          styleRating: 'Freestyle: 10/10 | All-Mountain: 8/10',
          terrain: 'Park, rails, jumps, all-mountain',
          reason: 'Award-winning freestyle legend. Ultra-light P2 core with explosive pop. Seven-time Transworld Good Wood winner for park domination.',
          productLink: 'https://www.evo.com/snowboards/capita-doa-snowboard',
          affiliate: 'https://affiliate-link-2.com',
          featured: style?.includes('Freestyle')
        },
        {
          name: 'Jones Explorer Split',
          category: 'Splitboard',
          price: '$849.95',
          image: 'https://images.unsplash.com/photo-1583792986380-e8694c770e46?w=600&h=600&fit=crop&q=80',
          specs: '161cm • Directional • Stiff Flex',
          stiffness: '8/10',
          styleRating: 'Backcountry: 10/10 | Powder: 9/10',
          terrain: 'Backcountry, powder, technical terrain',
          reason: 'Built for backcountry exploration. Directional shape floats effortlessly in powder while maintaining edge hold on firm snow. Eco-friendly construction.',
          productLink: 'https://www.evo.com/splitboards/jones-explorer-split-splitboard',
          affiliate: 'https://affiliate-link-3.com',
          featured: style?.includes('Powder') || answers.terrain?.includes('Backcountry')
        },
        {
          name: 'Ride Twinpig',
          category: 'All-Mountain Snowboard',
          price: '$449.95',
          image: 'https://images.unsplash.com/photo-1593016540846-8e1a724e7089?w=600&h=600&fit=crop&q=80',
          specs: '151cm • Twin • Soft-Medium Flex',
          stiffness: '4/10',
          styleRating: 'Beginner-Friendly: 10/10 | Playful: 9/10',
          terrain: 'All conditions, perfect for progression',
          reason: 'Wide platform for incredible stability. Perfect for learning and progression with forgiving flex. Volume-shifted design means ride shorter for better maneuverability.',
          productLink: 'https://www.evo.com/snowboards/ride-twinpig-snowboard',
          affiliate: 'https://affiliate-link-4.com',
          featured: level?.includes('Beginner') || budget?.includes('Under $300') || budget?.includes('$300 - $500')
        }
      ];
    } else {
      return [
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
          featured: level?.includes('Intermediate') || level?.includes('Advanced')
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
          featured: style?.includes('Freestyle')
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
          featured: style?.includes('Powder') || answers.terrain?.includes('Backcountry')
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
          featured: style?.includes('Carving') || answers.terrain?.includes('Resort')
        }
      ];
    }
  };

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: option };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
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

  const recommendations = step === 'results' ? getRecommendations() : [];
  const topPicks = recommendations.filter(r => r.featured).slice(0, 3);
  const otherOptions = recommendations.filter(r => !r.featured);

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white relative bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80')"}}>
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Green Room Gear Finder" className="w-100 h-100 object-contain" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Find Your Perfect Ride</h1>
            <p className="text-xl text-blue-100 mb-8">
              Answer a few quick questions and we'll match you with the ideal snowboard or skis for your style
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/15 backdrop-blur-md rounded-lg p-6 text-center border border-white/20 shadow-xl">
              <Award className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-semibold mb-2">Expert Matched</h3>
              <p className="text-sm text-blue-100">Recommendations based on your skill and style</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-green-300" />
              <h3 className="font-semibold mb-2">Top Rated Gear</h3>
              <p className="text-sm text-blue-100">Only the best products trusted by riders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-blue-300" />
              <h3 className="font-semibold mb-2">All Budgets</h3>
              <p className="text-sm text-blue-100">Find great gear at any price point</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep('questionnaire')}
              className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-blue-200">
            Takes less than 2 minutes • Free recommendations
          </p>
        </div>
      </div>
    );
  }

  if (step === 'questionnaire') {
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white relative bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1920&q=80')"}}>
        <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm"></div>
        <div className="max-w-2xl mx-auto px-6 py-16 relative z-10">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-200">Question {currentQuestion + 1} of {questions.length}</span>
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
            <h2 className="text-3xl font-bold mb-8">{questions[currentQuestion].question}</h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full bg-white/10 hover:bg-white/25 border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-102 hover:border-white/50 backdrop-blur-sm shadow-lg"
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

          {topPicks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-300" />
                Top Picks For You
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {topPicks.map((product, index) => (
                  <div key={index} className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-all">
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
                {otherOptions.map((product, index) => (
                  <div key={index} className="bg-white/15 backdrop-blur-md rounded-xl p-6 flex gap-4 border border-white/20 shadow-xl">
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
