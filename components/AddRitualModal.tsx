
import React, { useState } from 'react';
import { HellButton } from './HellButton';
import { translations, Language } from '../translations';

interface AddRitualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  lang: Language;
}

export const AddRitualModal: React.FC<AddRitualModalProps> = ({ isOpen, onClose, onSave, lang }) => {
  const [title, setTitle] = useState('');
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(title.trim()) {
        onSave(title);
        setTitle('');
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-bg-panel border border-hell-gold/50 w-full max-w-md shadow-[0_0_30px_rgba(251,191,36,0.2)]">
        <div className="bg-hell-800 p-4 border-b border-hell-gold/30 flex justify-between items-center">
            <h2 className="text-xl font-cinzel text-hell-gold uppercase">{t.modalRitualTitle}</h2>
            <button onClick={onClose} className="text-text-secondary">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-hell-500 text-xs font-bold mb-1 uppercase tracking-wider">{t.labelTitle}</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-bg-app text-text-primary border border-hell-700 p-3 focus:border-hell-gold outline-none"
                    placeholder="..."
                />
            </div>
            <div className="flex gap-3 mt-4">
                <HellButton type="submit" variant="gold" className="w-full">{t.btnCreate}</HellButton>
            </div>
        </form>
      </div>
    </div>
  );
};
