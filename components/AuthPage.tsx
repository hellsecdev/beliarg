

import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { HellButton } from './HellButton';
import { authService } from '../services/authService';
import { User } from '../types';
import { BeliargSeal } from './BeliarghSeal';

interface AuthPageProps {
    onLogin: (user: User) => void;
    lang: Language;
    onSetLang: (l: Language) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, lang, onSetLang }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Added for registration
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const t = translations[lang];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Check password match for registration
        if (!isLogin && password !== confirmPassword) {
            setError(t.passwordMismatch);
            setIsLoading(false);
            return;
        }

        try {
            let data;
            if (isLogin) {
                data = await authService.login(email, password);
            } else {
                data = await authService.register(email, password);
            }
            onLogin(data.user);
        } catch (err: any) {
            setError(err.message || t.authError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTelegramLogin = async () => {
        setError('');
        setIsLoading(true);
        
        try {
            const data = await authService.loginWithTelegram();
            onLogin(data.user);
        } catch (err: any) {
            setError(err.message || 'Failed to authenticate with Telegram');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-app p-4 relative overflow-hidden">
            <div className="fixed inset-0 bg-noise z-0"></div>
            <div className="fixed inset-0 vignette z-0"></div>

            {/* Fixed Language Selector */}
            <div className="fixed top-4 right-4 z-50 flex gap-2 bg-bg-panel/80 border border-hell-700 p-1 rounded backdrop-blur-sm shadow-lg">
                 <button onClick={() => onSetLang('ru')} className={`px-2 py-1 text-xs font-bold rounded transition ${lang === 'ru' ? 'bg-hell-gold text-black' : 'text-text-muted hover:text-text-primary'}`}>RU</button>
                 <button onClick={() => onSetLang('en')} className={`px-2 py-1 text-xs font-bold rounded transition ${lang === 'en' ? 'bg-hell-gold text-black' : 'text-text-muted hover:text-text-primary'}`}>EN</button>
                 <button onClick={() => onSetLang('he')} className={`px-2 py-1 text-xs font-bold rounded transition ${lang === 'he' ? 'bg-hell-gold text-black' : 'text-text-muted hover:text-text-primary'}`}>HE</button>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8 animate-float">
                    <BeliargSeal className="w-24 h-24 mx-auto mb-4" />
                    <h1 className="text-3xl font-cinzel text-hell-gold uppercase tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                        {t.authTitle}
                    </h1>
                </div>

                <div className="bg-bg-panel border border-hell-700 p-8 shadow-[0_0_50px_rgba(185,28,28,0.1)] relative">
                     {/* Tabs */}
                     <div className="flex border-b border-hell-700 mb-6">
                         <button 
                            onClick={() => setIsLogin(true)} 
                            className={`flex-1 py-2 font-cinzel uppercase text-sm transition-colors ${isLogin ? 'text-hell-gold border-b-2 border-hell-gold' : 'text-text-muted hover:text-text-primary'}`}
                         >
                             {t.loginBtn}
                         </button>
                         <button 
                            onClick={() => setIsLogin(false)} 
                            className={`flex-1 py-2 font-cinzel uppercase text-sm transition-colors ${!isLogin ? 'text-hell-gold border-b-2 border-hell-gold' : 'text-text-muted hover:text-text-primary'}`}
                         >
                             {t.registerBtn}
                         </button>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-5">
                         {error && (
                             <div className="bg-red-900/20 border border-red-600 p-2 text-red-500 text-xs text-center font-bold">
                                 {error}
                             </div>
                         )}

                         <div>
                             <label className="block text-hell-500 text-[10px] font-bold mb-1 uppercase tracking-wider">{t.emailLabel}</label>
                             <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-bg-app text-text-primary border border-hell-700 p-3 focus:border-hell-gold outline-none font-sans"
                             />
                         </div>
                         <div>
                             <label className="block text-hell-500 text-[10px] font-bold mb-1 uppercase tracking-wider">{t.passwordLabel}</label>
                             <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-bg-app text-text-primary border border-hell-700 p-3 focus:border-hell-gold outline-none font-sans"
                             />
                         </div>
                         
                         {/* Confirm Password Field (Registration Only) */}
                         {!isLogin && (
                             <div>
                                 <label className="block text-hell-500 text-[10px] font-bold mb-1 uppercase tracking-wider">{t.confirmPasswordLabel}</label>
                                 <input 
                                    type="password" 
                                    required 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-bg-app text-text-primary border border-hell-700 p-3 focus:border-hell-gold outline-none font-sans"
                                 />
                             </div>
                         )}

                         <HellButton type="submit" variant="gold" className="w-full mt-4" isLoading={isLoading}>
                             {t.authSubmit}
                         </HellButton>
                     </form>

                     <div className="mt-6 pt-6 border-t border-hell-700/50">
                         <button 
                            type="button" 
                            onClick={handleTelegramLogin}
                            disabled={isLoading}
                            className="w-full bg-bg-app border border-hell-700 text-text-secondary py-2 text-xs font-bold uppercase hover:border-hell-gold hover:text-hell-gold hover:bg-hell-900 transition flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                             <span className="text-white group-hover:text-hell-gold transition-colors">✈</span> {t.socialTelegram}
                         </button>
                     </div>
                </div>
                
                <div className="mt-4 text-center">
                     <button onClick={() => setIsLogin(!isLogin)} className="text-text-secondary text-xs hover:text-hell-gold underline">
                         {isLogin ? t.authSwitchToReg : t.authSwitchToLogin}
                     </button>
                </div>

                {/* Developer Footer */}
                <div className="mt-4 text-center pb-4">
                    <a href="https://github.com/D371L" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/80 hover:text-hell-gold font-mono transition-colors flex items-center justify-center gap-1">
                        {t.devBy} D371L
                    </a>
                </div>
            </div>
        </div>
    );
};