
import React, { useEffect } from 'react';
import { translations, Language } from '../translations';

interface CritModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CritModal: React.FC<CritModalProps> = ({ isOpen, onClose, lang }) => {
  const t = translations[lang];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 pointer-events-none animate-flicker">
      <div className="relative w-full text-center">
         {/* Background Burst */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-hell-lava/50 via-hell-500/20 to-transparent animate-spin-slow"></div>
         
         <div className="relative z-10 animate-crit-shake">
             <h1 className="text-4xl sm:text-6xl font-horror text-hell-gold uppercase tracking-widest drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] mb-4">
                 {t.critSuccess}
             </h1>
             <p className="text-lg sm:text-2xl font-cinzel text-white uppercase tracking-wide">
                 {t.critDesc}
             </p>
             <div className="text-6xl mt-8 animate-bounce">🔥</div>
         </div>
      </div>
    </div>
  );
};
