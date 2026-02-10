import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Mountain, Award, TrendingUp, DollarSign, ExternalLink, User, Ruler, Scale, RefreshCw, Check } from 'lucide-react';
import { QUESTIONS } from './data/questions';
import { getAnswerLabel, getRecommendations, getSizeRecommendation, extractBrands } from './utils/helpers';
import { fetchProducts, getCachedProducts } from './services/googleSheets';

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

  // BOTPRESS NATIVE INJECTION
  useEffect(() => {
    if (showChat && !document.getElementById('botpress-inject')) {
      const injectScript = document.createElement('script');
      injectScript.id = 'botpress-inject';
      injectScript.src = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
      injectScript.async = true;
      document.body.appendChild(injectScript);

      const configScript = document.createElement('script');
      configScript.id = 'botpress-config';
      configScript.src = "https://files.bpcontent.cloud/2026/02/10/01/20260210012639-9Z2Z05ZX.js";
      configScript.defer = true;
      document.body.appendChild(configScript);

      injectScript.onload = () => {
        if (window.botpressWebChat) {
          window.botpressWebChat.init({
            "configUrl": "https://files.bpcontent.cloud/2026/02/10/01/20260210012639-5UUL1MVZ.json",
            "showWidget": true,
            "openByDefault": true,
            "botName": "Gear Finder Stevo",
            "additionalStylesheet": `
              .bpw-header-container { background: #1b4332 !important; border-bottom: 3px solid #ff6b00 !important; }
              .bpw-from-user .bpw-chat-bubble { background-color: #ff6b00 !important; color: white !important; }
              .bpw-floating-button { background: #ff6b00 !important; }
              .bpw-send-button { color: #ff6b00 !important; }
            `
          });
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
    if (window.botpressWebChat && typeof window.botpressWebChat.sendEvent === 'function') {
      window.botpressWebChat.sendEvent({ type: 'hide' });
    }
    setStep('landing');
    setCurrentQuestion(0);
    setAnswers({});
    setBrandMode('all');
    setSelectedBrands([]);
    setShowChat(false);
  };

  const Background = ({ imageUrl }) => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover" poster={imageUrl}>
        <source src="/snow-background.mp4" type="video/mp4" />
        <img src={imageUrl} className="w-full h-full object-cover" alt="bg" />
      </video>
      <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] z-10"></div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center text-white text-xl font-bold">
      <div className="animate-pulse">LOADING GEAR...</div>
    </div>
  );

  if (step === 'landing') return (
    <div className="min-h-screen text-white relative flex items-center justify-center overflow-hidden">
      <Background imageUrl="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80&fm=webp" />
      <div className="max-w-4xl mx-auto px-6 py-16 relative z-20 text-center">
        <img src="/logo.png" alt="Green Room" className="w-[300px] mx-auto mb-12 drop-shadow-2xl" />
        <div className="space-y-6 max-w-md mx-auto">
          <button onClick={() => { setBrandMode('all'); setStep('questionnaire'); }} className="w-full bg-white text-blue-900 px-8 py-5 rounded-full font-black text-xl shadow-2xl hover:bg-blue-50 transition-all active:scale-95 uppercase">ALL BRANDS</button>
          <button onClick={() => { setBrandMode('specific'); setStep('brandSelection'); }} className="w-full bg-transparent border-4 border-white text-white px-8 py-4 rounded-full font-black text-xl backdrop-blur-md hover:bg-white/10 transition-all active:scale-95 uppercase">SPECIFIC BRANDS</button>
        </div>
      </div>
    </div>
  );

  if (step === 'brandSelection') return (
    <div className="min-h-screen text-white relative flex flex-col overflow-x-hidden">
      <Background imageUrl="https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1920&q=80&fm=webp" />
      <div className="sticky top-0 z-30 bg-blue-900/90 backdrop-blur-md border-b border-white/20 p-6">
        <button onClick={() => setStep('questionnaire')} className="w-full max-w-2xl mx-auto bg-white text-blue-900 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl uppercase">
          START FINDER ({selectedBrands.length} SELECTED) <ChevronRight strokeWidth={3} />
        </button>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-12 relative z-20 w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-black mb-8 text-center italic uppercase">Pick Your Brands</h2>
          {['snowboarding', 'skiing'].map(sport => availableBrands[sport].length > 0 && (
            <div key={sport} className="mb-10">
              <h3 className="text-xl font-black uppercase mb-4 text-blue-300 border-b border-blue-300/30 pb-2">{sport}</h3>
              <div className="grid gap-3">
                {availableBrands[sport].map(brand => (
                  <label key={brand} className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border-2 ${selectedBrands.includes(brand) ? 'bg-white text-blue-900 border-white' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}`}>
                    <span className="font-black uppercase italic">{brand}</span>
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])} className="hidden" />
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedBrands.includes(brand) ? 'bg-blue-600 border-blue-600' : 'border-white/30'}`}>
                      {selectedBrands.includes(brand) && <Check className="w-5 h-5 text-white" strokeWidth={4} />}
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
      <div className="min-h-screen text-white relative flex items-center justify-center overflow-hidden">
        <Background imageUrl="https://images.unsplash.com/photo-1551524164-687a55dd1126?w=1920&q=80&fm=webp" />
        <div className="max-w-2xl mx-auto px-6 py-16 relative z-20 w-full">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-black mb-10 italic uppercase tracking-tighter leading-tight">{q.question}</h2>
            <div className="space-y-4">
              {q.options.map((opt) => (
                <button key={opt.id} onClick={() => handleAnswer(opt.id)} className="w-full bg-white/5 hover:bg-white text-white hover:text-blue-900 border-2 border-white/30 hover:border-white rounded-2xl p-6 text-left font-black uppercase italic transition-all text-lg shadow-lg">
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
    <div className="min-h-screen text-white relative flex flex-col overflow-x-hidden">
      <Background imageUrl="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80&fm=webp" />
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-20 w-full">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4 italic uppercase tracking-tighter">Your Setup</h1>
          <div className="h-2 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-20">
          {topPicks.map((product) => (
            <div key={product.name} className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border-b-8 border-blue-600 transition-all hover:-translate-y-2">
              <div className="relative h-72">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full font-black text-xs uppercase italic">Top Pick</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-blue-600 font-black uppercase italic text-sm mb-1 tracking-widest">{product.brand}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic leading-none">{product.name}</h3>
                <p className="text-3xl font-black text-blue-600 mb-6">{product.price}</p>
                <p className="text-gray-600 font-medium mb-8 flex-1 leading-relaxed">{product.reason}</p>
                <a href={product.affiliate} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 py-5 rounded-2xl font-black text-center text-white text-xl shadow-xl hover:bg-blue-700 transition-colors uppercase italic">Get It Now</a>
              </div>
            </div>
          ))}
        </div>

        {brandMode === 'specific' && Object.entries(secondaryBrandPicks).map(([brand, items]) => (
          <div key={brand} className="mb-20">
            <h2 className="text-3xl font-black mb-10 border-b-4 border-white/20 pb-4 italic uppercase tracking-tighter">More {brand} Gear</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {items.map((product) => (
                <div key={product.name} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all group">
                  <div className="h-48 rounded-2xl overflow-hidden mb-6">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-black mb-1 italic uppercase">{product.name}</h3>
                  <p className="text-blue-300 font-black mb-6 text-2xl">{product.price}</p>
                  <a href={product.affiliate} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-black text-white hover:text-blue-300 uppercase italic tracking-widest transition-colors">Shop Item →</a>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pt-10">
          <button onClick={restartQuiz} className="bg-white/10 border-4 border-white px-12 py-5 rounded-full font-black text-2xl hover:bg-white hover:text-blue-900 transition-all uppercase italic tracking-tighter shadow-2xl">Start Over</button>
        </div>
      </div>
    </div>
  );
};

export default App;
