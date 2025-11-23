

import React, { useState, useEffect, useRef } from 'react';
import { Task, Difficulty, Subtask, Sigil } from '../types';
import { HellButton } from './HellButton';
import { translations, Language } from '../translations';

interface AddSoulModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'isCompleted' | 'createdAt'> & { id?: string }, newSigil?: {title: string, color: string}) => void;
  editingTask?: Task | null;
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

export const AddSoulModal: React.FC<AddSoulModalProps> = ({ isOpen, onClose, onSave, editingTask, sigils, lang }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.ASH);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [selectedSigilId, setSelectedSigilId] = useState<string>('');
  
  // New Sigil State
  const [isCreatingSigil, setIsCreatingSigil] = useState(false);
  const [newSigilName, setNewSigilName] = useState('');
  const [newSigilColor, setNewSigilColor] = useState(SIGIL_COLORS[0].hex);
  
  const dateInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.originalDescription || editingTask.description);
      const date = new Date(editingTask.deadline);
      const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setDeadline(isoString);
      setDifficulty(editingTask.difficulty);
      setSubtasks(editingTask.subtasks || []);
      setSelectedSigilId(editingTask.sigilId || '');
    } else {
      resetForm();
    }
  }, [editingTask, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setDifficulty(Difficulty.ASH);
    setSubtasks([]);
    setNewSubtaskTitle('');
    setSelectedSigilId('');
    setIsCreatingSigil(false);
    setNewSigilName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newSigilData = undefined;
    if (isCreatingSigil && newSigilName.trim()) {
        newSigilData = { title: newSigilName, color: newSigilColor };
    }

    onSave({
      id: editingTask?.id,
      title,
      description,
      originalDescription: editingTask ? editingTask.originalDescription : description, 
      deadline: new Date(deadline).toISOString(),
      difficulty,
      subtasks,
      sigilId: isCreatingSigil ? undefined : (selectedSigilId || undefined)
    }, newSigilData);
    onClose();
  };

  const handleAddSubtask = () => {
      if (newSubtaskTitle.trim()) {
          setSubtasks([...subtasks, { id: crypto.randomUUID(), title: newSubtaskTitle, isCompleted: false }]);
          setNewSubtaskTitle('');
      }
  };

  const removeSubtask = (id: string) => {
      setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
        try {
            (dateInputRef.current as any).showPicker();
        } catch (e) {
            dateInputRef.current.focus();
        }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-bg-panel border border-hell-600 w-[95%] sm:w-full max-w-md relative shadow-[0_0_50px_rgba(138,28,28,0.3)] my-auto">
        
        <div className="bg-hell-800 p-3 sm:p-4 border-b border-hell-600 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-horror text-hell-gold uppercase tracking-widest truncate">
            {editingTask ? t.modalEditTitle : t.modalNewTitle}
            </h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-hell-500 text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-wider">{t.labelTitle}</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-app text-text-primary border border-hell-700 p-2 sm:p-3 focus:border-hell-lava focus:ring-1 focus:ring-hell-lava outline-none font-serif placeholder-text-muted text-sm sm:text-base"
              placeholder={t.placeholderTitle}
            />
          </div>

          <div>
            <label className="block text-hell-500 text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-wider">{t.labelDesc}</label>
            <div className="relative">
                <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-bg-app text-text-primary border border-hell-700 p-2 sm:p-3 focus:border-hell-lava outline-none resize-none font-serif text-sm placeholder-text-muted"
                placeholder="..."
                />
            </div>
          </div>
          
          {/* Sigil Selector */}
          <div>
            <label className="block text-hell-500 text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-wider">{t.labelSigil}</label>
            {!isCreatingSigil ? (
                <div className="flex gap-2">
                    <select 
                        value={selectedSigilId} 
                        onChange={(e) => setSelectedSigilId(e.target.value)}
                        className="flex-1 bg-bg-app text-text-primary border border-hell-700 p-2 text-sm focus:border-hell-lava outline-none"
                    >
                        <option value="">{t.noSigil}</option>
                        {sigils.map(s => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                    </select>
                    <button 
                        type="button" 
                        onClick={() => setIsCreatingSigil(true)}
                        className="bg-hell-800 text-hell-gold px-2 text-xs border border-hell-700 hover:bg-hell-700 whitespace-nowrap"
                    >
                        {t.createSigil}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-2 bg-hell-800/30 p-2 border border-hell-700">
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
          
          {/* Subtasks Input */}
          <div>
             <label className="block text-hell-500 text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-wider">{t.subtasks}</label>
             <div className="flex gap-2 mb-2">
                 <input 
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                    className="flex-1 bg-bg-app border border-hell-700 p-2 text-xs text-text-primary"
                    placeholder={t.labelSubtask}
                 />
                 <button type="button" onClick={handleAddSubtask} className="bg-hell-800 text-hell-gold px-3 text-xs border border-hell-700 hover:bg-hell-700">
                     +
                 </button>
             </div>
             <div className="max-h-24 overflow-y-auto space-y-1">
                 {subtasks.map(s => (
                     <div key={s.id} className="flex justify-between items-center bg-bg-app/50 p-1 px-2 border border-hell-700/50">
                         <span className="text-xs text-text-secondary">{s.title}</span>
                         <button type="button" onClick={() => removeSubtask(s.id)} className="text-red-500 text-xs hover:text-red-400">×</button>
                     </div>
                 ))}
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-hell-500 text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-wider">{t.labelDeadline}</label>
              <div className="flex gap-2">
                  <div className="flex-1 bg-bg-app border border-hell-700 flex items-center">
                    <input
                        ref={dateInputRef}
                        type="datetime-local"
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-transparent text-text-primary p-2 text-sm focus:outline-none rounded-sm font-medium placeholder-gray-500 min-w-0"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={openDatePicker}
                    className="bg-hell-800 border border-hell-700 text-hell-gold px-3 hover:bg-hell-700 transition flex items-center justify-center"
                    title="Open Calendar"
                  >
                    📅
                  </button>
              </div>
            </div>

            <div>
              <label className="block text-hell-500 text-[10px] sm:text-xs font-bold mb-1 uppercase tracking-wider">{t.labelDifficulty}</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-bg-app text-text-primary border border-hell-700 p-2 text-sm focus:border-hell-lava outline-none h-[38px] sm:h-[42px]"
              >
                <option value={Difficulty.ASH}>{t.diffAsh}</option>
                <option value={Difficulty.EMBER}>{t.diffEmber}</option>
                <option value={Difficulty.INFERNO}>{t.diffInferno}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6 sm:mt-8 pt-4 border-t border-hell-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent border border-hell-700 text-text-secondary py-2 hover:text-text-primary hover:border-hell-600 transition font-horror text-xs sm:text-sm"
            >
              {t.btnRefuse}
            </button>
            <HellButton type="submit" className="flex-1 text-xs sm:text-sm" variant="gold">
              {editingTask ? t.btnForge : t.btnSeal}
            </HellButton>
          </div>
        </form>
      </div>
    </div>
  );
};