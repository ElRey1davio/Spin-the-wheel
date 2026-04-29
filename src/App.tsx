import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, X, ChefHat, MapPin } from 'lucide-react';
import Wheel from './components/Wheel';

export default function App() {
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <MapPin className="absolute -top-20 -left-20 w-96 h-96 rotate-12" />
        <Utensils className="absolute top-1/2 -right-40 w-80 h-80 -rotate-12" />
        <ChefHat className="absolute -bottom-20 left-1/4 w-72 h-72 rotate-45" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-black text-[#1a1a1a] tracking-tight uppercase mb-2">
          Unilag Grub Wheel
        </h1>
        <p className="text-gray-500 font-medium tracking-wide">
          Can't decide where to eat? Let destiny choose.
        </p>
      </motion.div>

      <Wheel 
        onResult={setResult} 
        isSpinning={isSpinning} 
        setIsSpinning={setIsSpinning} 
      />

      <AnimatePresence>
        {result && !isSpinning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border-4 border-[#1a1a1a]"
            >
              <button 
                onClick={() => setResult(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                id="close-modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a1a1a] text-white rounded-2xl mb-6 rotate-3 shadow-lg">
                  <Utensils className="w-8 h-8" />
                </div>
                
                <h2 className="text-3xl font-black text-[#1a1a1a] uppercase leading-tight mb-2">
                  Destiny Has Spoken!
                </h2>
                
                <div className="text-5xl font-black text-[#1a1a1a] mb-6 tracking-tighter">
                  {result}
                </div>

                <p className="text-gray-500 mb-8 italic">
                  Enjoy your meal at UNILAG! 🍽️
                </p>

                <button
                  onClick={() => setResult(null)}
                  className="w-full py-4 bg-[#1a1a1a] text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95"
                >
                  SPIN AGAIN!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-16 text-gray-400 text-sm font-mono uppercase tracking-widest">
        UNILAG Foodies Edition • 2026
      </footer>
    </div>
  );
}
