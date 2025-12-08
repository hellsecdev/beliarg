
import React, { useMemo } from 'react';
import { Ritual } from '../types';
import { translations, Language } from '../translations';

interface RitualCardProps {
  ritual: Ritual;
  onPerform: (id: string) => void;
  lang: Language;
}

export const RitualCard: React.FC<RitualCardProps> = ({ ritual, onPerform, lang }) => {
  const t = useMemo(() => translations[lang], [lang]);
  
  const lastPerformedDate = new Date(ritual.lastPerformed);
  const today = new Date();
  const isPerformedToday = lastPerformedDate.getDate() === today.getDate() && 
                           lastPerformedDate.getMonth() === today.getMonth() && 
                           lastPerformedDate.getFullYear() === today.getFullYear();

  return (
    <div 
        onClick={() => !isPerformedToday && onPerform(ritual.id)}
        className={`relative p-3 border flex justify-between items-center transition-all cursor-pointer select-none ${isPerformedToday ? 'bg-hell-800/30 border-hell-gold/50' : 'bg-bg-panel border-hell-700 hover:border-hell-lava hover:bg-hell-800/50'}`}
    >
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${isPerformedToday ? 'border-hell-gold bg-hell-gold/20 text-hell-gold' : 'border-hell-600 text-hell-600'}`}>
                {isPerformedToday ? '🔥' : '⚪'}
            </div>
            <div>
                <h4 className={`font-cinzel text-sm ${isPerformedToday ? 'text-hell-gold' : 'text-text-primary'}`}>{ritual.title}</h4>
                <p className="text-[10px] text-text-muted">{isPerformedToday ? t.ritualDone : t.ritualCooldown}</p>
            </div>
        </div>
        
        <div className="flex flex-col items-end">
            <span className="text-xs font-horror text-hell-lava">{ritual.streak} 🔥</span>
            <span className="text-[9px] text-text-secondary uppercase tracking-widest">{t.streak}</span>
        </div>
    </div>
  );
};
