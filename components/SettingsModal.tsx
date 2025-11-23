
import React from 'react';
import { translations, Language } from '../translations';
import { Theme, User } from '../types';
import { authService } from '../services/authService';
import { HellButton } from './HellButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme: Theme;
  onSetLang: (l: Language) => void;
  onSetTheme: (t: Theme) => void;
  user?: User | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, lang, theme, onSetLang, onSetTheme, user 
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <div className="bg-bg-panel border border-hell-gold w-full max-w-md shadow-[0_0_50px_rgba(251,191,36,0.15)]">
        
        {/* Header */}
        <div className="bg-hell-900 p-4 border-b border-hell-gold/30 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl font-cinzel text-hell-gold uppercase tracking-widest flex gap-2 items-center">
               <span>⚙️</span> {t.settingsTitle}
            </h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl">✕</button>
        </div>

        <div className="p-6 space-y-8">
            
            {/* Profile Settings */}
            {user && (
                <div>
                    <h3 className="text-xs font-bold text-hell-500 uppercase tracking-widest mb-3 border-b border-hell-700/50 pb-1">
                        {t.profile}
                    </h3>
                    <div className="flex flex-col gap-3">
                        <div className="text-text-primary font-mono text-sm break-all">
                            {user.email}
                        </div>
                        <HellButton variant="danger" onClick={() => authService.logout()} className="text-xs">
                            {t.logout}
                        </HellButton>
                    </div>
                </div>
            )}

            {/* Visuals Settings */}
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
                            <button 
                                onClick={() => onSetLang('he')}
                                className={`px-3 py-1 text-xs font-bold transition ${lang === 'he' ? 'bg-hell-gold text-black' : 'bg-transparent text-text-secondary hover:bg-hell-800'}`}
                            >
                                HE
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
        </div>
      </div>
    </div>
  );
};
