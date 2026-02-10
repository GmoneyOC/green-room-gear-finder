import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Option A: Timer trigger (appears after 5 seconds)
    const timer = setTimeout(() => setIsVisible(true), 5000);

    // Option B: Scroll trigger (appears after scrolling 300px)
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-4">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold">Gear Assistant</h3>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-50 text-gray-800 text-sm">
            <p className="bg-blue-100 p-2 rounded-lg mb-2">
              Hi! Do you have any questions about these recommendations or our current store inventory?
            </p>
          </div>
          <div className="p-3 border-t flex gap-2">
            <input 
              type="text" 
              placeholder="Ask a question..." 
              className="flex-1 text-sm border rounded-full px-3 py-2 outline-none focus:border-blue-600 text-black"
            />
            <button className="bg-blue-600 text-white p-2 rounded-full">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2"
        >
          <MessageCircle />
          <span className="font-semibold">Questions?</span>
        </button>
      )}
    </div>
  );
};

export default ChatPopup;
