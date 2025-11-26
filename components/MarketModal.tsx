import React from 'react';
import { PlayerStats, ParticleEffectType } from '../types';
import { HellButton } from './HellButton';
import { translations, Language } from '../translations';
import { audioService } from '../services/audioService';

interface MarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  lang: Language;
}

const ITEMS: { id: ParticleEffectType, cost: number }[] = [
    { id: 'fire', cost: 0 },
    { id: 'soul', cost: 50 },
    { id: 'void', cost: 150 },
    { id: 'blood', cost: 300 },
    { id: 'gold', cost: 1000 },
];

export const MarketModal: React.FC<MarketModalProps> = ({ isOpen, onClose, stats, onUpdateStats, lang }) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const handleBuy = (item: { id: ParticleEffectType, cost: number }) => {
    if (stats.gold >= item.cost) {
      audioService.playGold();
      onUpdateStats({
        ...stats,
        gold: stats.gold - item.cost,
        unlockedEffects: [...stats.unlockedEffects, item.id]
      });
    } else {
      // Shake animation or error sound could go here
    }
  };

  const handleEquip = (id: ParticleEffectType) => {
    audioService.playClick();
    onUpdateStats({
      ...stats,
      activeEffect: id
    });
  };

  const getItemName = (id: ParticleEffectType) => {
      switch(id) {
          case 'fire': return t.effectFire;
          case 'soul': return t.effectSoul;
          case 'void': return t.effectVoid;
          case 'blood': return t.effectBlood;
          case 'gold': return t.effectGold;
          default: return id;
      }
  };

  const getColor = (id: ParticleEffectType) => {
    switch(id) {
        case 'soul': return 'bg-blue-500';
        case 'void': return 'bg-purple-600';
        case 'blood': return 'bg-red-700';
        case 'gold': return 'bg-yellow-400';
        default: return 'bg-orange-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      <div className="bg-hell-900 border-2 border-hell-gold/50 w-full max-w-lg relative shadow-[0_0_100px_rgba(180,83,9,0.2)] max-h-[80vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-hell-800 p-4 border-b border-hell-gold/30 flex justify-between items-center z-10">
            <div>
                <h2 className="text-2xl font-horror text-hell-gold uppercase tracking-widest shadow-black drop-shadow-md">
                {t.marketTitle}
                </h2>
                <p className="text-[10px] text-text-muted uppercase">{t.marketDesc}</p>
            </div>
            <div className="text-right">
                <div className="text-xl text-hell-gold font-mono">{(typeof stats.gold === 'number' ? stats.gold : 0).toFixed(0)} 🪙</div>
                <button onClick={onClose} className="text-xs text-hell-500 hover:text-red-500 uppercase mt-1">[X] {t.financeClose}</button>
            </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ITEMS.map(item => {
                const isUnlocked = stats.unlockedEffects.includes(item.id);
                const isEquipped = stats.activeEffect === item.id;
                const canAfford = stats.gold >= item.cost;

                return (
                    <div key={item.id} className={`relative p-4 border ${isEquipped ? 'border-hell-gold bg-hell-gold/10' : 'border-hell-700 bg-bg-app'} flex flex-col items-center text-center transition-all group hover:border-hell-lava`}>
                        <div className={`w-12 h-12 rounded-full ${getColor(item.id)} blur-sm mb-3 animate-pulse-slow group-hover:scale-110 transition-transform`}></div>
                        <h3 className="text-hell-lava font-horror uppercase text-lg">{getItemName(item.id)}</h3>
                        
                        {!isUnlocked && (
                            <p className="text-hell-gold font-mono mb-4">{t.cost}: {item.cost}</p>
                        )}

                        <div className="mt-auto w-full">
                            {isEquipped ? (
                                <span className="block w-full py-2 text-xs font-bold bg-hell-800 text-text-muted cursor-default border border-hell-800">
                                    {t.equipped}
                                </span>
                            ) : isUnlocked ? (
                                <HellButton variant="secondary" onClick={() => handleEquip(item.id)} className="w-full text-xs">
                                    {t.equip}
                                </HellButton>
                            ) : (
                                <HellButton 
                                    variant="gold" 
                                    onClick={() => handleBuy(item)} 
                                    disabled={!canAfford}
                                    className="w-full text-xs"
                                >
                                    {canAfford ? t.buy : t.insufficientFunds}
                                </HellButton>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};