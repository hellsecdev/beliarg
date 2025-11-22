
import React, { useState, useEffect } from 'react';
import { Note, Sigil } from '../types';
import { HellButton } from './HellButton';
import { translations, Language } from '../translations';

interface AddGrimoireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, newSigil?: {title: string, color: string}) => void;
  editingNote?: Note | null;
  sigils: Sigil[];
  lang: Language;
}

const SIGIL_COLORS = [
    { name: 'Blood', hex: '#ef4444' },
    { name: 'Gold', hex: '#f59e0b' },
    { name: 'Void', hex: '#a855f7' },
    { name: 'Pest', hex: '#22c55e' },
    { name: 'Frost', hex: '#3b82f6' },
    { name: 'Ash', hex: '#6b7280' }
];

export const AddGrimoireModal: React.FC<AddGrimoireModalProps> = ({ isOpen, onClose, onSave, editingNote, sigils, lang }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSigilId, setSelectedSigilId] = useState<string>('');
  
  // Sigil Creation
  const [isCreatingSigil, setIsCreatingSigil] = useState(false);
  const [newSigilName, setNewSigilName] = useState('');
  const [newSigilColor, setNewSigilColor] = useState(SIGIL_COLORS[0].hex);

  const t = translations[lang];

  useEffect(() => {
    if (isOpen) {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
            setSelectedSigilId(editingNote.sigilId || '');
        } else {
            setTitle('');
            setContent('');
            setSelectedSigilId('');
        }
        setIsCreatingSigil(false);
        setNewSigilName('');
    }
  }, [isOpen, editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newSigilData = undefined;
    if (isCreatingSigil && newSigilName.trim()) {
        newSigilData = { title: newSigilName, color: newSigilColor };
    }

    onSave({
      id: editingNote?.id,
      title,
      content,
      sigilId: isCreatingSigil ? undefined : (selectedSigilId || undefined)
    }, newSigilData);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4">
      <div className="bg-bg-panel border border-hell-gold/40 w-full max-w-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] h-[80vh] flex flex-col">
        
        <div className="bg-hell-900 p-4 border-b border-hell-gold/30 flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-cinzel text-hell-gold uppercase tracking-widest">
               {t.modalGrimoireTitle}
            </h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-4 flex-1 flex flex-col">
              
            {/* Title Input */}
            <div>
                <label className="block text-hell-500 text-[10px] font-bold mb-1 uppercase tracking-wider">{t.labelNoteTitle}</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-bg-app text-hell-gold text-lg sm:text-xl border-b border-hell-700 p-2 focus:border-hell-gold outline-none font-cinzel placeholder-hell-700/50"
                    placeholder={t.placeholderNoteTitle}
                />
            </div>

            {/* Sigil Selector */}
            <div>
                <label className="block text-hell-500 text-[10px] font-bold mb-1 uppercase tracking-wider">{t.labelSigil}</label>
                {!isCreatingSigil ? (
                    <div className="flex gap-2">
                        <select 
                            value={selectedSigilId} 
                            onChange={(e) => setSelectedSigilId(e.target.value)}
                            className="bg-bg-app text-text-primary border border-hell-700 p-2 text-xs sm:text-sm focus:border-hell-gold outline-none min-w-[150px]"
                        >
                            <option value="">{t.noSigil}</option>
                            {sigils.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>
                        <button 
                            type="button" 
                            onClick={() => setIsCreatingSigil(true)}
                            className="bg-hell-800 text-hell-gold px-3 text-xs border border-hell-700 hover:bg-hell-700 whitespace-nowrap"
                        >
                            {t.createSigil}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 bg-hell-800/30 p-2 border border-hell-700 w-full sm:w-2/3">
                        <input 
                            type="text"
                            value={newSigilName}
                            onChange={(e) => setNewSigilName(e.target.value)}
                            className="bg-bg-app border border-hell-700 p-2 text-xs text-text-primary"
                            placeholder={t.newSigilName}
                            autoFocus
                        />
                        <div className="flex gap-2 justify-between">
                            <div className="flex gap-1">
                                {SIGIL_COLORS.map(c => (
                                    <div 
                                        key={c.hex}
                                        onClick={() => setNewSigilColor(c.hex)}
                                        className={`w-5 h-5 rounded-full cursor-pointer border ${newSigilColor === c.hex ? 'border-white scale-110' : 'border-transparent'}`}
                                        style={{backgroundColor: c.hex}}
                                    />
                                ))}
                            </div>
                            <button type="button" onClick={() => setIsCreatingSigil(false)} className="text-xs text-text-secondary underline">
                                {t.btnRefuse}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Textarea - Takes remaining space */}
            <div className="flex-1 flex flex-col min-h-[200px]">
                <label className="block text-hell-500 text-[10px] font-bold mb-1 uppercase tracking-wider">{t.labelNoteContent}</label>
                <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full bg-bg-app text-text-primary border border-hell-700 p-4 focus:border-hell-gold outline-none resize-none font-serif text-sm sm:text-base placeholder-hell-700/30 leading-relaxed"
                    placeholder={t.placeholderNoteContent}
                />
            </div>
          </div>

          <div className="flex gap-3 mt-6 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-text-secondary hover:text-text-primary transition font-horror text-sm border border-transparent hover:border-hell-700 py-2"
            >
              {t.btnRefuse}
            </button>
            <HellButton type="submit" className="flex-1" variant="gold">
              {editingNote ? t.btnUpdate : t.btnCreate}
            </HellButton>
          </div>
        </form>
      </div>
    </div>
  );
};
