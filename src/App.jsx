import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Mountain, Award, TrendingUp, DollarSign, ExternalLink, User, Ruler, Scale, RefreshCw, Check } from 'lucide-react';
import { QUESTIONS, OPTION_LABELS } from './data/questions';
import { getAnswerLabel, getRecommendations, getSizeRecommendation, extractBrands } from './utils/helpers';
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

  // Brand filtering state
  const [brandMode, setBrandMode] = useState('all'); // 'all' or 'specific'
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const cached = getCachedProducts();
      if (cached) {
        setProducts(cached.products);
        setLoading(false);
        return;
      }

      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('grgf_products');
      localStorage.removeItem('grgf_products_timestamp');
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const availableBrands = useMemo(() => {
    if (!products) return { snowboarding: [], skiing: [] };
    return extractBrands(products);
  }, [products]);

  const recommendations = useMemo(() => {
    if (step !== 'results' || !products) return [];
    const brandsToFilter = brandMode === 'specific' ? selectedBrands : null;
    return getRecommendations(answers, products, brandsToFilter);
  }, [answers, products, step, brandMode, selectedBrands]);

  const topPicks = recommendations.slice(0, 3);
  
  const secondaryBrandPicks = useMemo(() => {
    if (brandMode !== 'specific' || step !== 'results') return {};
    
    const topPickNames = topPicks.map(p => p.name);
    const remainingPool = recommendations.filter(p => !topPickNames.includes(p.name));
    
    const grouped = {};
    selectedBrands.forEach(brand => {
      const brandMatches = remainingPool
        .filter(p => p.brand === brand)
        .slice(0, 3);
      
      if (brandMatches.length > 0) {
        grouped[brand] = brandMatches;
      }
    });
    return grouped;
  }, [recommendations, topPicks, brandMode, selectedBrands, step]);

  const sizeRecommendation = useMemo(() => getSizeRecommendation(answers), [answers]);

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
    setBrandMode('all');
    setSelectedBrands([]);
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleSelectAllSnowboarding = () => {
    const allSnowboardBrands = availableBrands.snowboarding;
    const allSelected = allSnowboardBrands.every(brand => selectedBrands.includes(brand));
    setSelectedBrands(prev => {
      const filtered = prev.filter(brand => !allSnowboardBrands.includes(brand));
      return allSelected ? filtered : [...filtered, ...allSnowboardBrands];
    });
  };

  const handleSelectAllSkiing = () => {
    const allSkiBrands = availableBrands.skiing;
    const allSelected = allSkiBrands.every(brand => selectedBrands.includes(brand));
    setSelectedBrands(prev => {
      const filtered = prev.filter(brand => !allSkiBrands.includes(brand));
      return allSelected ? filtered : [...filtered, ...allSkiBrands];
    });
  };

  const proceedToQuestionnaire = () => {
    if (brandMode === 'specific' && selectedBrands.length === 0) {
      alert('Please select at least one brand to continue.');
      return;
    }
    setStep('questionnaire');
  };

  // Shared Background Component with Video + Fallback
const Background = ({ imageUrl }) => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
      poster={imageUrl} // This shows the Unsplash image if the video fails
    >
      {/* UPDATE THIS LINE BELOW */}
      <source src="/snow-background.mp4" type="video/mp4" />
      
      {/* Fallback for very old browsers */}
      <img 
        src={imageUrl} 
        className="w-full h-full object-cover" 
        alt="background fallback" 
      />
    </video>
    <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm z-10"></div>
  </div>
);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading gear inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-900 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-bold mb-2">Error Loading Products</h2>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={handleRefresh} className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto">
            <RefreshCw className="w-5 h-5" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (step === 'landing') {
    return (
      <div className="min-h-screen text-white relative flex items-center justify-center">
        <Background imageUrl="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80&fm=webp" />
        <div className="max-w-4xl mx-auto px-6 py-16 relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Green Room Gear Finder" className="w-[300px] h-auto object-contain" />
          </div>
          <div className="space-y-4 max-w-md mx-auto">
            <button onClick={() => { setBrandMode('all'); setStep('questionnaire'); }} className="w-full bg-white text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-2xl">
              All Brands <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => { setBrandMode('specific'); setStep('brandSelection'); }} className="w-full bg-white/20 text-white border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all flex items-center justify-center gap-2 shadow-2xl backdrop-blur-sm">
              Choose Specific Brands <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button onClick={handleRefresh} className="mt-8 text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto">
            <RefreshCw className="w-4 h-4" /> Refresh Inventory
          </button>
        </div>
      </div>
    );
  }

  if (step === 'brandSelection') {
    return (
      <div className="min-h-screen text-white relative">
        <Background imageUrl="https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1920&q=80&fm=webp" />
        <div className="sticky top-0 z-20 bg-blue-900/80 backdrop-blur-md border-b border-white/20">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <button onClick={proceedToQuestionnaire} className="w-full bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl">
              Find Your Gear ({selectedBrands.length} selected) <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-8 relative z-20">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Brands</h2>
            {['snowboarding', 'skiing'].map(sport => availableBrands[sport].length > 0 && (
              <div key={sport} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold capitalize">{sport}</h3>
                  <button onClick={sport === 'snowboarding' ? handleSelectAllSnowboarding : handleSelectAllSkiing} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded">
                    Select All
                  </button>
                </div>
                <div className="space-y-2">
                  {availableBrands[sport].map(brand => (
                    <label key={brand} className="flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-4 cursor-pointer">
                      <span className="font-medium">{brand}</span>
                      <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandToggle(brand)} className="hidden" />
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${selectedBrands.includes(brand) ? 'bg-white border-white' : 'border-white/50'}`}>
                        {selectedBrands.includes(brand) && <Check className="w-4 h-4 text-blue-900" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep('landing')} className="mt-6 text-blue-200 hover:text-white">← Back</button>
        </div>
      </div>
    );
  }

  if (step === 'questionnaire') {
    const currentQ = QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    return (
      <div className="min-h-screen text-white relative flex items-center justify-center">
        <Background imageUrl="https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1920&q=80&fm=webp" />
        <div className="max-w-2xl mx-auto px-6 py-16 relative z-20 w-full">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-blue-200 mb-2">
              <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-blue-700 rounded-full h-2">
              <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-8">{currentQ.question}</h2>
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button key={option.id} onClick={() => handleAnswer(option.id)} className="w-full bg-white/10 hover:bg-white/25 border border-white/30 rounded-lg p-4 text-left transition-all backdrop-blur-sm">
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {currentQuestion > 0 && <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="mt-6 text-blue-200 hover:text-white">← Back</button>}
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen text-white relative">
        <Background imageUrl="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80&fm=webp" />
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Perfect Match</h1>
            <p className="text-xl text-blue-100">Based on your answers, here are our top recommendations</p>
          </div>

          {summaryItems.length > 0 && (
            <div className="mb-12 bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg max-w-md mx-auto md:mx-0">
              <h3 className="text-sm font-bold mb-3 text-blue-100 uppercase tracking-wider">Your Profile</h3>
              <ul className="text-sm space-y-2">
                {summaryItems.map((item) => <li key={item.label}><strong>{item.label}:</strong> {item.value}</li>)}
                {sizeRecommendation && <li className="pt-3 border-t border-white/20 mt-2 font-bold text-yellow-300">{sizeRecommendation}</li>}
              </ul>
            </div>
          )}

          {/* OVERALL TOP PICKS */}
          {topPicks.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-300" /> Top 3 Overall Picks
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {topPicks.map((product) => (
                  <div key={product.name} className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col border-t-4 border-blue-600">
                    <div className="h-64 bg-gray-100">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-sm text-blue-600 font-semibold mb-1">{product.category}</div>
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-blue-600 mb-4">{product.price}</p>
                      <div className="space-y-3 mb-6 flex-1 text-sm text-gray-700 leading-relaxed">
                        <p>{product.reason}</p>
                        {product.matches.length > 0 && (
                          <div className="rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-2">
                            ✓ Matched on: {product.matches.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <a href={product.affiliate} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors">Buy Now →</a>
                        <a href={product.productLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700">Details <ExternalLink className="w-3 h-3" /></a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BRAND-SPECIFIC SECTIONS */}
          {brandMode === 'specific' && Object.entries(secondaryBrandPicks).map(([brand, items]) => (
            <div key={brand} className="mb-16">
              <h2 className="text-2xl font-bold mb-6 border-b border-white/30 pb-3 flex items-center justify-between">
                <span>More from {brand}</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {items.map((product) => (
                  <div key={product.name} className="bg-white/15 backdrop-blur-md rounded-xl p-5 flex flex-col border border-white/20 shadow-xl">
                    <div className="h-40 mb-4 rounded-lg overflow-hidden bg-white/10">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                    <p className="text-yellow-300 font-bold mb-3">{product.price}</p>
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      <a href={product.affiliate} target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:text-yellow-300 transition-colors uppercase">Shop Now →</a>
                      <a href={product.productLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 hover:text-white">Details</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-16 text-center space-y-8">
            <button onClick={restartQuiz} className="bg-white/20 hover:bg-white/35 px-8 py-4 rounded-full font-bold transition-all border border-white/30 backdrop-blur-sm">Start Over</button>
            <p className="text-xs text-blue-200">* Disclosure: We may earn a commission if you purchase through our links.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
