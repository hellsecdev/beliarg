
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Transaction, TransactionType, Sigil } from '../types';
import { HellButton } from './HellButton';
import { translations, Language } from '../translations';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> & { id?: string }, isRecurring: boolean, newSigil?: {title: string, color: string}) => void;
  editingTransaction?: Transaction | null;
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

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave, editingTransaction, sigils, lang }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.SACRIFICE);
  const [date, setDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedSigilId, setSelectedSigilId] = useState<string>('');
  
  // New Sigil State
  const [isCreatingSigil, setIsCreatingSigil] = useState(false);
  const [newSigilName, setNewSigilName] = useState('');
  const [newSigilColor, setNewSigilColor] = useState(SIGIL_COLORS[0].hex);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
      if (isOpen) {
          if (editingTransaction) {
              setTitle(editingTransaction.title);
              setAmount(editingTransaction.amount.toString());
              setType(editingTransaction.type);
              // Convert ISO string to local datetime-local format
              const dateObj = new Date(editingTransaction.date);
              const isoString = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
              setDate(isoString);
              setSelectedSigilId(editingTransaction.sigilId || '');
          } else {
              // Initialize with current local date-time
              const now = new Date();
              const isoString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
              setDate(isoString);
              setTitle('');
              setAmount('');
              setIsRecurring(false);
              setSelectedSigilId('');
          }
          setIsCreatingSigil(false);
          setNewSigilName('');
      }
  }, [isOpen, editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newSigilData = undefined;
    if (isCreatingSigil && newSigilName.trim()) {
        newSigilData = { title: newSigilName, color: newSigilColor };
    }

    onSave({
      id: editingTransaction?.id,
      title,
      amount: parseFloat(amount),
      type,
      date: new Date(date).toISOString(),
      sigilId: isCreatingSigil ? undefined : (selectedSigilId || undefined)
    }, isRecurring, newSigilData);
    
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-bg-panel border border-hell-gold/30 w-full max-w-md shadow-[0_0_30px_rgba(251,191,36,0.2)] backdrop-blur-sm">
        
        <div className="bg-bg-app p-4 border-b border-hell-gold/30 text-center flex justify-between items-center">
            <h2 className="text-xl font-cinzel text-hell-gold uppercase tracking-widest flex-1">
               {editingTransaction ? t.modalEditFinanceTitle : t.treasury}
            </h2>
             <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex gap-4 justify-center mb-4">
                <button
                    type="button"
                    onClick={() => setType(TransactionType.TRIBUTE)}
                    className={`flex-1 py-2 border ${type === TransactionType.TRIBUTE ? 'bg-hell-gold text-black border-hell-gold font-bold' : 'bg-transparent text-text-secondary border-hell-700'} transition-all uppercase text-xs tracking-widest font-cinzel`}
                >
                    ✚ {t.tribute}
                </button>
                <button
                    type="button"
                    onClick={() => setType(TransactionType.SACRIFICE)}
                    className={`flex-1 py-2 border ${type === TransactionType.SACRIFICE ? 'bg-hell-500 text-white border-hell-500 font-bold' : 'bg-transparent text-text-secondary border-hell-700'} transition-all uppercase text-xs tracking-widest font-cinzel`}
                >
                    ✖ {t.sacrifice}
                </button>
            </div>

          <div>
            <label className="block text-hell-gold text-xs font-bold mb-1 uppercase tracking-wider">{t.financeSource}</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-app text-text-primary border border-hell-700 p-3 focus:border-hell-gold focus:ring-1 focus:ring-hell-gold outline-none font-serif placeholder-text-muted"
              placeholder="..."
            />
          </div>
          
          {/* Sigil Selector */}
          <div>
            <label className="block text-hell-gold text-xs font-bold mb-1 uppercase tracking-wider">{t.labelSigil}</label>
            {!isCreatingSigil ? (
                <div className="flex gap-2">
                    <select 
                        value={selectedSigilId} 
                        onChange={(e) => setSelectedSigilId(e.target.value)}
                        className="flex-1 bg-bg-app text-text-primary border border-hell-700 p-2 text-sm focus:border-hell-gold outline-none"
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
          
          {/* Amount Input */}
          <div>
              <label className="block text-hell-gold text-xs font-bold mb-1 uppercase tracking-wider">{t.financeAmount}</label>
              <input
              type="number"
              required
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-bg-app text-hell-gold border border-hell-700 p-3 focus:border-hell-gold outline-none font-mono text-lg placeholder-text-muted"
              placeholder="0.00"
              />
          </div>
          
          {/* Date Input */}
          <div>
              <label className="block text-hell-gold text-xs font-bold mb-1 uppercase tracking-wider">{t.financeDate}</label>
              <div className="flex gap-2">
                  <div className="flex-1 bg-bg-app border border-hell-700 flex items-center min-w-0">
                      <input
                          ref={dateInputRef}
                          type="datetime-local"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-transparent text-text-primary p-3 text-xs focus:outline-none font-medium placeholder-gray-500 min-w-0"
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

          {type === TransactionType.SACRIFICE && !editingTransaction && (
             <div className="flex items-center gap-2 pt-2">
                <input 
                    type="checkbox" 
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 accent-hell-500 bg-bg-app border-hell-700 rounded"
                />
                <label htmlFor="recurring" className="text-xs text-text-secondary uppercase tracking-wider cursor-pointer hover:text-hell-lava">
                    {t.recurring}
                </label>
             </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-text-secondary hover:text-text-primary transition font-horror text-sm border border-transparent hover:border-hell-700"
            >
              {t.financeClose}
            </button>
            <HellButton type="submit" className="flex-1" variant="gold">
              {editingTransaction ? t.btnUpdate : t.financeSave}
            </HellButton>
          </div>
        </form>
      </div>
    </div>
  );
};
