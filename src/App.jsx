import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Mountain, Award, TrendingUp, DollarSign, ExternalLink, User, Ruler, Scale, RefreshCw } from 'lucide-react';
import { QUESTIONS, OPTION_LABELS } from './data/questions';
import { getAnswerLabel, getRecommendations, getSizeRecommendation } from './utils/helpers';
import { fetchProducts, getCachedProducts, cacheProducts } from './services/googleSheets';

const App = () => {
  // Product data state
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz state
  const [step, setStep] = useState('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached.products);
        setLoading(false);
        console.log('Loaded products from cache');
        return;
      }

      // Fetch from Google Sheets
      const data = await fetchProducts();
      setProducts(data);
      cacheProducts(data);
      setLoading(false);
      console.log('Loaded products from Google Sheets:', data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Failed to load products:', err);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);

    try {
      // Clear cache first, then fetch fresh data
      localStorage.removeItem('grgf_products');
      localStorage.removeItem('grgf_products_timestamp');
      
      // Fetch fresh from Google Sheets
      const data = await fetchProducts();
      setProducts(data);
      cacheProducts(data);
      setLoading(false);
      console.log('Refreshed products from Google Sheets:', data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Failed to refresh products:', err);
    }
  };

  // Calculate recommendations
  const recommendations = useMemo(
    () => (step === 'results' && products ? getRecommendations(answers, products) : []),
    [answers, products, step]
  );

  const topPicks = recommendations.slice(0, 3);
  const otherOptions = recommendations.slice(3);
  const sizeRecommendation = useMemo(() => getSizeRecommendation(answers), [answers]);

  // Create summary items with labels
  const summaryItems = [
    { label: 'Sport', value: getAnswerLabel('sport', answers.sport), icon: User },
    { label: 'Skill level', value: getAnswerLabel('level', answers.level), icon: Award },
    { label: 'Riding style', value: getAnswerLabel('style', answers.style), icon: TrendingUp },
    { label: 'Terrain', value: getAnswerLabel('terrain', answers.terrain), icon: Mountain },
    { label: 'Budget', value: getAnswerLabel('budget', answers.budget), icon: DollarSign },
    { label: 'Height', value: getAnswerLabel('height', answers.height), icon: Ruler },
    { label: 'Weight', value: getAnswerLabel('weight', answers.weight), icon: Scale }
  ].filter((item) => item.value);

  const handleAnswer = (optionId) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: optionId };
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

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading gear inventory...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-bold mb-2">Failed to Load Products</h2>
            <p className="text-sm mb-4">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Landing page
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

            <button
              onClick={handleRefresh}
              className="mt-4 text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Questionnaire page
  if (step === 'questionnaire') {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    const currentQ = QUESTIONS[currentQuestion];

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
            <h2 className="text-3xl font-bold mb-8">{currentQ.question}</h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className="w-full bg-white/10 hover:bg-white/25 border border-white/30 rounded-lg p-4 text-left transition-all hover:scale-[1.01] hover:border-white/50 backdrop-blur-sm shadow-lg"
                >
                  {option.label}
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

  // Results page
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
            <div className="mb-8 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg max-w-md">
              <h3 className="text-sm font-bold mb-2 text-blue-100">Your Preferences:</h3>
              <ul className="text-sm space-y-1 text-white">
                {summaryItems.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}:</strong> {item.value}
                  </li>
                ))}
                {sizeRecommendation && (
                  <li className="pt-2 border-t border-white/20 mt-2">
                    <strong>Size guidance:</strong> {sizeRecommendation}
                  </li>
                )}
              </ul>
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
