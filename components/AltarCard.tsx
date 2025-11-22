
import React, { useState } from 'react';
import { Altar } from '../types';
import { translations, Language } from '../translations';
import { HellButton } from './HellButton';

interface AltarCardProps {
  altar: Altar;
  onContribute: (id: string, amount: number) => void;
  currentGold: number;
  lang: Language;
}

export const AltarCard: React.FC<AltarCardProps> = ({ altar, onContribute, currentGold, lang }) => {
  const t = translations[lang];
  const [amount, setAmount] = useState('');
  
  const progress = Math.min(100, (altar.currentAmount / altar.targetAmount) * 100);
  const isFull = altar.currentAmount >= altar.targetAmount;

  const handleContribute = () => {
      const val = parseFloat(amount);
      if (val > 0 && val <= currentGold) {
          onContribute(altar.id, val);
          setAmount('');
      }
  };

  return (
    <div className="bg-bg-panel border border-hell-700 p-4 relative overflow-hidden group hover:border-hell-gold transition-all">
        {/* Liquid Fill Effect */}
        <div 
            className="absolute bottom-0 left-0 w-full bg-hell-gold/10 transition-all duration-1000 ease-out"
            style={{ height: `${progress}%` }}
        ></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-cinzel text-hell-gold text-lg">{altar.title}</h4>
                <span className="font-mono text-xs text-text-muted">
                    {altar.currentAmount.toFixed(0)} / {altar.targetAmount.toFixed(0)}
                </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-hell-900 rounded-full overflow-hidden mb-4 border border-hell-800">
                <div className="h-full bg-hell-gold shadow-[0_0_10px_var(--hell-gold)] transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            {!isFull ? (
                <div className="flex gap-2">
                    <input 
                        type="number" 
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-20 bg-bg-app border border-hell-700 text-xs p-1 text-center text-text-primary focus:border-hell-gold outline-none"
                    />
                    <HellButton variant="gold" onClick={handleContribute} disabled={!amount || parseFloat(amount) > currentGold} className="text-[10px] py-1 px-2">
                        {t.contribute}
                    </HellButton>
                </div>
            ) : (
                <div className="text-center text-xs font-horror text-hell-lava uppercase tracking-widest py-1">
                    {t.altarFull}
                </div>
            )}
        </div>
    </div>
  );
};
