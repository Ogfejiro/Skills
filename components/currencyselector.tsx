'use client';

import { motion } from 'framer-motion';
import { Coins, CreditCard } from 'lucide-react';

interface CurrencySelectorProps {
  currency: 'USD' | 'NGN';
  setCurrency: (currency: 'USD' | 'NGN') => void;
}

export default function CurrencySelector({ currency, setCurrency }: CurrencySelectorProps) {
  return (
    <div className="flex items-center gap-4 bg-black/50 rounded-full p-1 border border-gold/30">
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrency('USD')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          currency === 'USD' 
          ? 'bg-gold text-black' 
          : 'text-gray-400 hover:text-gold'
        }`}
      >
        <Coins className="w-4 h-4" />
        <span className="font-bold">USD</span>
      </motion.button>
      
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrency('NGN')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          currency === 'NGN' 
          ? 'bg-gold text-black' 
          : 'text-gray-400 hover:text-gold'
        }`}
      >
        <CreditCard className="w-4 h-4" />
        <span className="font-bold">NGN</span>
      </motion.button>
    </div>
  );
}