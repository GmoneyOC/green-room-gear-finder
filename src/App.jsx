import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Mountain, Award, TrendingUp, DollarSign, ExternalLink, User, Ruler, Scale, RefreshCw, Check } from 'lucide-react';
import { QUESTIONS, OPTION_LABELS } from './data/questions';
import { getAnswerLabel, getRecommendations, getSizeRecommendation, extractBrands } from './utils/helpers';
import { fetchProducts, getCachedProducts, cacheProducts } from './services/googleSheets';

const App = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [brandMode, setBrandMode] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  // CHATBOT TRIGGER LOGIC
  useEffect(() => {
    let timer;
    if (step === 'results') {
      timer = setTimeout(() => setShowChat(true), 8000);
      const handleScroll = () => {
        if (window.scrollY > 400) {
          setShowChat(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [step]);

  // BOTPRESS INJECTION
  useEffect(() => {
    if (showChat) {
      // 1. Inject the Main Botpress Library (v3.5)
      const injectScript = document.createElement('script');
      injectScript.src = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
      injectScript.async = true;
      document.body.appendChild(injectScript);

      // 2. Inject your specific Bot Configuration script
      const configScript = document.createElement('script');
      configScript.src = "https://files.bpcontent.cloud/2026/02/10/01/20260210012639-9Z2Z05ZX.js";
      configScript.defer = true;
      document.body.appendChild(configScript);

      injectScript.onload = () => {
        // Initialize with your specific JSON config
        if (window.botpressWebChat) {
          window.botpressWebChat.init({
            "configUrl": "https://files.bpcontent.cloud/2026/02/10/01/20260210012639-5UUL1MVZ.json",
            "showWidget": true,
            "openByDefault": true
          });
        }
      };

      return () => {
        // Hide bot if user restarts
        if (window.botpressWebChat) {
          window.botpressWebChat.sendEvent({ type: 'hide' });
        }
      };
    }
  }, [showChat]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const cached = getCachedProducts();
      if (cached) { setProducts(cached.products); setLoading(false); return; }
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  const handleRefresh = async () => {
    setLoading(true);
    localStorage.removeItem('grgf_products');
    localStorage.removeItem('grgf_products_timestamp');
    loadProducts();
  };

  const availableBrands = useMemo(() => products ? extractBrands(products) : { snowboarding: [], skiing: [] }, [products]);

  const recommendations = useMemo(() => {
    if (step !== 'results' || !products) return [];
    return getRecommendations(answers, products, brandMode === 'specific' ? selectedBrands : null);
  }, [answers, products, step, brandMode, selectedBrands]);

  const topPicks = recommendations.slice(0, 3);
  
  const secondaryBrandPicks = useMemo(() => {
    if (brandMode !== 'specific' || step !== 'results') return {};
    const topNames = topPicks.map(p => p.name);
    const pool = recommendations.filter(p => !topNames.includes(p.name));
    const grouped = {};
    selectedBrands.forEach(brand => {
      const matches = pool.filter(p => p.brand === brand).slice(0, 3);
      if (matches.length > 0) grouped[brand] = matches;
    });
    return grouped;
  }, [recommendations, topPicks, brandMode, selectedBrands, step]);

  const sizeRecommendation = useMemo(() => getSizeRecommendation(answers), [answers]);

  const handleAnswer = (optionId) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: optionId };
    setAnswers(newAnswers);
    if (currentQuestion < QUESTIONS.length - 1) setCurrentQuestion(currentQuestion + 1);
    else setStep('results');
  };

  const restartQuiz = () => {
    if (window.botpressWebChat) window.botpressWebChat.sendEvent({ type: 'hide' });
    setStep('landing');
    setCurrentQuestion(0);
    setAnswers({});
    setBrandMode('all');
    setSelectedBrands([]);
  };

  const Background = ({ imageUrl }) => (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover" poster={imageUrl}>
        <source src="http://googleusercontent.com/generated_video_content/17535164558139445137" type="video/mp4" />
        <img src={imageUrl} className="w-full h-full object-cover" alt="bg" />
      </video>
      <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm z-10"></div>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-blue-900 flex items-center justify-center text-white text-xl">Loading gear...</div>;

  if (step === 'landing') return (
    <div className="min-h-screen text-white relative flex items-center justify-center">
      <Background imageUrl="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80&fm=webp" />
      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10 text-center">
        <img src="/logo.png" alt="Logo" className="w-[300px] mx-auto mb-8" />
        <div className="space-y-4 max-w-md mx-auto">
          <button onClick={() => { setBrandMode('all'); setStep('questionnaire'); }} className="w-full bg-white text-blue-900 px-8 py-4 rounded-full font-bold shadow-2xl">All Brands</button>
          <button onClick={() => { setBrandMode('specific'); setStep('brandSelection'); }} className="w-full bg-white/20 border-2 border-white px-8 py-4 rounded-full font-bold backdrop-blur-sm">Choose Specific Brands</button>
        </div>
      </div>
    </div>
  );

  if (step === 'brandSelection') return (
    <div className="min-h-screen text-white relative">
      <Background imageUrl="https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1920&q=80&fm=webp" />
      <div className="sticky top-0 z-20 bg-blue-900/80 backdrop-blur-md border-b border-white/20 p-4">
        <button onClick={() => setStep('questionnaire')} className="w-full max-w-2xl mx-auto bg-white text-blue-900 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
          Find Your Gear ({selectedBrands.length} selected) <ChevronRight />
        </button>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-8 relative z-20">
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Brands</h2>
          {['snowboarding', 'skiing'].map(sport => availableBrands[sport].length > 0 && (
            <div key={sport} className="mb-8">
              <h3 className="text-xl font-bold capitalize mb-4">{sport}</h3>
              <div className="space-y-2">
                {availableBrands[sport].map(brand => (
                  <label key={brand} className="flex items-center justify-between bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                    <span>{brand}</span>
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])} className="hidden" />
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${selectedBrands.includes(brand) ? 'bg-white' : 'border-white/50'}`}>
                      {selectedBrands.includes(brand) && <Check className="w-4 h-4 text-blue-900" />}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (step === 'questionnaire') {
    const q = QUESTIONS[currentQuestion];
    return (
      <div className="min-h-screen text-white relative flex items-center justify-center">
        <Background imageUrl="https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1920&q=80&fm=webp" />
        <div className="max-w-2xl mx-auto px-6 py-16 relative z-20 w-full">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-8">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt) => (
                <button key={opt.id} onClick={() => handleAnswer(opt.id)} className="w-full bg-white/10 hover:bg-white/25 border border-white/30 rounded-lg p-4 text-left font-medium transition-all">
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') return (
    <div className="min-h-screen text-white relative pb-20">
      <Background imageUrl="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80&fm=webp" />
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Perfect Match</h1>
          <p className="text-xl text-blue-100">Tailored for your specific riding style.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {topPicks.map((product) => (
            <div key={product.name} className="bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col border-t-4 border-blue-600 transition-transform hover:scale-[1.02]">
              <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-sm text-blue-600 font-bold uppercase mb-1">{product.brand}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">{product.price}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-6 flex-1">{product.reason}</p>
                <a href={product.affiliate} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 py-3 rounded-lg font-bold text-center text-white">Shop Now</a>
              </div>
            </div>
          ))}
        </div>

        {brandMode === 'specific' && Object.entries(secondaryBrandPicks).map(([brand, items]) => (
          <div key={brand} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 border-b border-white/30 pb-3">More from {brand}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((product) => (
                <div key={product.name} className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl hover:bg-white/25 transition-all">
                  <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-lg mb-4" />
                  <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                  <p className="text-yellow-300 font-bold mb-3">{product.price}</p>
                  <a href={product.affiliate} target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:text-yellow-300 uppercase transition-colors">View Product →</a>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <button onClick={restartQuiz} className="bg-white/20 border border-white/30 px-8 py-4 rounded-full font-bold hover:bg-white/35 transition-all">Start Over</button>
        </div>
      </div>
    </div>
  );
};

export default App;
