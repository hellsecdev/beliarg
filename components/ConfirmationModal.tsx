
import React from 'react';
import { HellButton } from './HellButton';
import { translations, Language } from '../translations';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  lang: Language;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message, lang }) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <div className="bg-hell-900 border-2 border-hell-500 w-full max-w-sm relative shadow-[0_0_50px_rgba(185,28,28,0.5)] animate-flicker">
        
        <div className="bg-hell-500/20 p-4 border-b border-hell-500/50 text-center">
            <h2 className="text-xl font-horror text-hell-500 uppercase tracking-widest drop-shadow-sm">
               {t.modalConfirmTitle}
            </h2>
        </div>

        <div className="p-6 text-center">
            <p className="text-text-primary font-serif text-sm mb-6 leading-relaxed">
                {message}
            </p>

            <div className="flex gap-4">
                <button
                    onClick={onClose}
                    className="flex-1 py-2 border border-hell-600 text-text-secondary hover:text-text-primary hover:bg-hell-800 font-cinzel uppercase text-xs tracking-wider transition-all"
                >
                    {t.btnCancel}
                </button>
                <HellButton 
                    onClick={() => { onConfirm(); onClose(); }} 
                    variant="danger"
                    className="flex-1 text-xs"
                >
                    {t.btnDelete}
                </HellButton>
            </div>
        </div>
        
        {/* Decorative warning corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-600"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-600"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-600"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-600"></div>
      </div>
    </div>
  );
};
