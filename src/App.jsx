import React, { useState } from 'react';
import { ChevronRight, Mountain, Award, TrendingUp, DollarSign } from 'lucide-react';

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
          name: 'Burton Custom 2026',
          category: 'All-Mountain Snowboard',
          price: '$549.95',
          image: image: 'https://cdn.shopify.com/s/files/1/0019/1451/7627/files/106881_Jungle_2.jpg?v=1726166934',
          specs: '156cm • Directional • Medium Flex',
          reason: 'Perfect all-mountain board for progressive riders. The Custom offers versatility across all terrain with a playful feel.',
          affiliate: 'https://affiliate-link-1.com',
          featured: level?.includes('Intermediate') || level?.includes('Advanced')
        },
        {
          name: 'Capita DOA',
          category: 'Freestyle Snowboard',
          price: '$499.95',
          image: 'https://cdn.shopify.com/s/files/1/1338/8133/files/DOA_W26_TOPSHEET_WEB.png?v=1725568627',
          specs: '154cm • Twin • Medium Flex',
          reason: 'Ideal for park and all-mountain freestyle. Known for its pop and buttery feel.',
          affiliate: 'https://affiliate-link-2.com',
          featured: style?.includes('Freestyle')
        },
        {
          name: 'Jones Explorer',
          category: 'Splitboard',
          price: '$749.95',
          image: 'https://www.evo.com/imgp/1500/235961/985788/jones-explorer-splitboard-2024-.jpg',
          specs: '158cm • Directional • Stiff Flex',
          reason: 'Built for backcountry adventures. Floats in powder and handles technical terrain.',
          affiliate: 'https://affiliate-link-3.com',
          featured: style?.includes('Powder') || answers.terrain?.includes('Backcountry')
        },
        {
          name: 'Ride Twinpig',
          category: 'All-Mountain Snowboard',
          price: '$399.95',
          image: 'https://www.evo.com/imgp/1500/214894/785885/ride-twinpig-snowboard-2024-.jpg',
          specs: '148cm • Twin • Medium Flex',
          reason: 'Great value board with a wide platform for stability. Perfect for learning and progression.',
          affiliate: 'https://affiliate-link-4.com',
          featured: level?.includes('Beginner') || budget?.includes('Under $300') || budget?.includes('$300 - $500')
        }
      ];
    } else {
      return [
        {
          name: 'Rossignol Experience 88',
          category: 'All-Mountain Skis',
          price: '$599.95',
          image: 'https://www.evo.com/imgp/1500/235682/987445/rossignol-experience-88-ti-skis-2025-.jpg',
          specs: '172cm • 88mm Waist • Medium Flex',
          reason: 'Versatile all-mountain ski that excels on groomed runs and handles light powder well.',
          affiliate: 'https://affiliate-link-5.com',
          featured: level?.includes('Intermediate') || level?.includes('Advanced')
        },
        {
          name: 'Armada ARV 96',
          category: 'Freestyle Skis',
          price: '$549.95',
          image: 'https://www.evo.com/imgp/1500/229956/963574/armada-arv-96-skis-2025-.jpg',
          specs: '177cm • 96mm Waist • Twin Tip',
          reason: 'Perfect park ski with all-mountain capability. Playful and poppy for tricks and jumps.',
          affiliate: 'https://affiliate-link-6.com',
          featured: style?.includes('Freestyle')
        },
        {
          name: 'K2 Mindbender 108',
          category: 'Freeride Skis',
          price: '$749.95',
          image: 'https://www.evo.com/imgp/1500/235706/987702/k2-mindbender-108-skis-2025-.jpg',
          specs: '184cm • 108mm Waist • Stiff Flex',
          reason: 'Built for powder and big mountain riding. Floats effortlessly in deep snow.',
          affiliate: 'https://affiliate-link-7.com',
          featured: style?.includes('Powder') || answers.terrain?.includes('Backcountry')
        },
        {
          name: 'Blizzard Brahma 82',
          category: 'Carving Skis',
          price: '$499.95',
          image: 'https://www.evo.com/imgp/1500/235643/986891/blizzard-brahma-82-skis-2025-.jpg',
          specs: '174cm • 82mm Waist • Stiff Flex',
          reason: 'Excellent groomer ski with precise edge control. Perfect for carving turns at speed.',
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Mountain className="w-20 h-20" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Find Your Perfect Ride</h1>
            <p className="text-xl text-blue-100 mb-8">
              Answer a few quick questions and we'll match you with the ideal snowboard or skis for your style
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">
        <div className="max-w-2xl mx-auto px-6 py-16">
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

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">{questions[currentQuestion].question}</h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full bg-white/5 hover:bg-white/20 border border-white/20 rounded-lg p-4 text-left transition-all hover:scale-102 hover:border-white/40"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
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
                    <div className="h-64 overflow-hidden">
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
                      <p className="text-sm text-gray-600 mb-3">{product.specs}</p>
                      <p className="text-sm text-gray-700 mb-4">{product.reason}</p>
                      <a
                        href={product.affiliate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                      >
                        Check Price →
                      </a>
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
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
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
                      <p className="text-sm text-blue-100 mb-3">{product.specs}</p>
                      <a
                        href={product.affiliate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={restartQuiz}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-colors"
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
