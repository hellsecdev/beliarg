

import React, { useRef } from 'react';
import { HellButton } from './HellButton';
import { translations, Language } from '../translations';
import { Theme } from '../types';
import { audioService } from '../services/audioService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
  onSetLang: (l: Language) => void;
  onSetTheme: (t: Theme) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, lang, theme, onSetLang, onSetTheme, onExport, onImport 
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const triggerImport = () => {
      fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <div className="bg-bg-panel border border-hell-gold w-full max-w-md shadow-[0_0_50px_rgba(251,191,36,0.15)] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-hell-900 p-4 border-b border-hell-gold/30 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl font-cinzel text-hell-gold uppercase tracking-widest flex gap-2 items-center">
               <span>⚙️</span> {t.settingsTitle}
            </h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl">✕</button>
        </div>

        <div className="p-6 space-y-8">
            
            {/* Section 1: Visuals */}
            <div>
                <h3 className="text-xs font-bold text-hell-500 uppercase tracking-widest mb-3 border-b border-hell-700/50 pb-1">
                    {t.settingsVisual}
                </h3>
                
                <div className="grid gap-4">
                    {/* Language */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-serif text-text-primary">Language / Язык</span>
                        <div className="flex border border-hell-700 rounded overflow-hidden">
                            <button 
                                onClick={() => onSetLang('ru')}
                                className={`px-3 py-1 text-xs font-bold transition ${lang === 'ru' ? 'bg-hell-gold text-black' : 'bg-transparent text-text-secondary hover:bg-hell-800'}`}
                            >
                                RU
                            </button>
                            <button 
                                onClick={() => onSetLang('en')}
                                className={`px-3 py-1 text-xs font-bold transition ${lang === 'en' ? 'bg-hell-gold text-black' : 'bg-transparent text-text-secondary hover:bg-hell-800'}`}
                            >
                                EN
                            </button>
                        </div>
                    </div>

                    {/* Theme */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-serif text-text-primary">Theme / Тема</span>
                        <div className="flex flex-col gap-1">
                            <button 
                                onClick={() => onSetTheme('dark')} 
                                className={`text-[10px] uppercase tracking-wider text-right transition ${theme === 'dark' ? 'text-hell-lava font-bold' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                {t.themeDark}
                            </button>
                            <button 
                                onClick={() => onSetTheme('light')} 
                                className={`text-[10px] uppercase tracking-wider text-right transition ${theme === 'light' ? 'text-hell-ash font-bold' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                {t.themeLight}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Data (Soul Vessel) */}
            <div>
                <h3 className="text-xs font-bold text-hell-500 uppercase tracking-widest mb-3 border-b border-hell-700/50 pb-1">
                    {t.settingsData}
                </h3>
                <p className="text-xs text-text-muted mb-4 italic font-serif">
                    {t.backupDesc}
                </p>
                
                <div className="grid gap-3">
                    <HellButton onClick={onExport} variant="gold" className="w-full text-xs">
                        💾 {t.btnExport}
                    </HellButton>

                    <input 
                        type="file" 
                        accept=".json" 
                        ref={fileInputRef}
                        onChange={onImport}
                        className="hidden" 
                    />
                    
                    <HellButton onClick={triggerImport} variant="secondary" className="w-full text-xs">
                        ♻️ {t.btnImport}
                    </HellButton>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};