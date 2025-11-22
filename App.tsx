
import React, { useState, useEffect, useMemo } from 'react';
import { Task, Difficulty, PlayerStats, AppView, Transaction, TransactionType, Language, Theme, Ritual, Sigil, Note } from './types';
import { TaskCard } from './components/TaskCard';
import { AddSoulModal } from './components/AddSoulModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AnalyticsView } from './components/AnalyticsView';
import { RitualCard } from './components/RitualCard';
import { AddRitualModal } from './components/AddRitualModal';
import { GrimoireCard } from './components/GrimoireCard';
import { AddGrimoireModal } from './components/AddGrimoireModal';
import { HellButton } from './components/HellButton';
import { BeliargSeal } from './components/BeliarghSeal'; 
import { ConfirmationModal } from './components/ConfirmationModal';
import { CritModal } from './components/CritModal';
import { SettingsModal } from './components/SettingsModal'; // NEW IMPORT
import { getDemonComment } from './services/geminiService';
import { audioService } from './services/audioService';
import { translations } from './translations';

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sigils, setSigils] = useState<Sigil[]>([]);
  
  const [stats, setStats] = useState<PlayerStats>({ 
      soulsCollected: 0,
      gold: 0,
      unlockedEffects: ['fire'],
      activeEffect: 'fire'
  });
  const [view, setView] = useState<AppView>('active');
  
  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilterDiff, setTaskFilterDiff] = useState<Difficulty | 'ALL'>('ALL');
  const [taskSort, setTaskSort] = useState<'DEADLINE' | 'NEWEST' | 'MANUAL'>('DEADLINE');
  const [finFilterType, setFinFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [finSort, setFinSort] = useState<'DATE_DESC' | 'AMT_DESC' | 'AMT_ASC'>('DATE_DESC');

  // Settings State
  const [lang, setLang] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>('dark');
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isRitualModalOpen, setIsRitualModalOpen] = useState(false);
  const [isGrimoireModalOpen, setIsGrimoireModalOpen] = useState(false);
  const [isCritModalOpen, setIsCritModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // NEW STATE
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'transaction' | 'note' } | null>(null);

  const [demonMessage, setDemonMessage] = useState<string>('');
  const [showDemonMessage, setShowDemonMessage] = useState(false);
  
  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const t = translations[lang];

  // --- Effects ---

  useEffect(() => {
    const savedTasks = localStorage.getItem('beliarg_tasks');
    const savedTrans = localStorage.getItem('beliarg_trans');
    const savedStats = localStorage.getItem('beliarg_stats');
    const savedRituals = localStorage.getItem('beliarg_rituals');
    const savedNotes = localStorage.getItem('beliarg_notes');
    const savedSigils = localStorage.getItem('beliarg_sigils');
    const savedLang = localStorage.getItem('beliarg_lang');
    const savedTheme = localStorage.getItem('beliarg_theme');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedTrans) setTransactions(JSON.parse(savedTrans));
    if (savedRituals) setRituals(JSON.parse(savedRituals));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedSigils) setSigils(JSON.parse(savedSigils));
    
    if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats({
            soulsCollected: parsed.soulsCollected || 0,
            gold: parsed.gold || 0,
            unlockedEffects: parsed.unlockedEffects || ['fire'],
            activeEffect: parsed.activeEffect || 'fire'
        });
    }
    if (savedLang) setLang(savedLang as Language);
    if (savedTheme) setTheme(savedTheme as Theme);
    
    // Check Ritual Streaks on load
    checkRitualStreaks(savedRituals ? JSON.parse(savedRituals) : []);

    const enableAudio = () => {
        audioService.playHover(); 
        window.removeEventListener('click', enableAudio);
    };
    window.addEventListener('click', enableAudio);
  }, []);

  useEffect(() => {
    localStorage.setItem('beliarg_tasks', JSON.stringify(tasks));
    localStorage.setItem('beliarg_trans', JSON.stringify(transactions));
    localStorage.setItem('beliarg_stats', JSON.stringify(stats));
    localStorage.setItem('beliarg_rituals', JSON.stringify(rituals));
    localStorage.setItem('beliarg_notes', JSON.stringify(notes));
    localStorage.setItem('beliarg_sigils', JSON.stringify(sigils));
    localStorage.setItem('beliarg_lang', lang);
    localStorage.setItem('beliarg_theme', theme);
    
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    }
  }, [tasks, transactions, stats, rituals, notes, sigils, lang, theme]);

  // --- Logic ---
  
  // Calculate REAL Balance from history
  const realBalance = useMemo(() => {
      return transactions.reduce((acc, curr) => {
          if (curr.type === TransactionType.TRIBUTE) {
              return acc + curr.amount;
          } else {
              return acc - curr.amount;
          }
      }, 0);
  }, [transactions]);

  const checkRitualStreaks = (currentRituals: Ritual[]) => {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const updatedRituals = currentRituals.map(r => {
          if (r.lastPerformed > 0 && (now - r.lastPerformed) > (oneDay * 2)) {
              return { ...r, streak: 0 }; // Reset streak
          }
          return r;
      });
      setRituals(updatedRituals);
  };

  const triggerDemonMessage = async (msg?: string) => {
    const message = msg || await getDemonComment(stats.soulsCollected, realBalance, lang);
    setDemonMessage(message);
    setShowDemonMessage(true);
    setTimeout(() => setShowDemonMessage(false), 6000);
  };
  
  // --- Data Management (Export/Import) ---
  const handleExportData = () => {
      const data = {
          tasks,
          transactions,
          rituals,
          notes,
          sigils,
          stats,
          theme,
          lang,
          version: '1.0'
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beliarg_soul_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              if (json.tasks) setTasks(json.tasks);
              if (json.transactions) setTransactions(json.transactions);
              if (json.rituals) setRituals(json.rituals);
              if (json.notes) setNotes(json.notes);
              if (json.sigils) setSigils(json.sigils);
              if (json.stats) setStats(json.stats);
              if (json.theme) setTheme(json.theme);
              if (json.lang) setLang(json.lang);
              
              triggerDemonMessage(t.importSuccess);
              setIsSettingsOpen(false);
          } catch (err) {
              console.error("Import failed", err);
              alert(t.importError);
          }
      };
      reader.readAsText(file);
      e.target.value = ''; // Reset input
  };


  // --- Handlers: Sigils ---
  const handleCreateSigil = (title: string, color: string) => {
      const newSigil: Sigil = { id: crypto.randomUUID(), title, color };
      setSigils(prev => [...prev, newSigil]);
      return newSigil.id;
  };

  // --- Handlers: Tasks ---
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'isCompleted' | 'createdAt'> & { id?: string }, newSigil?: {title: string, color: string}) => {
    audioService.playClick();
    
    let sigilId = taskData.sigilId;
    if (newSigil) {
        sigilId = handleCreateSigil(newSigil.title, newSigil.color);
    }

    const finalTaskData = { ...taskData, sigilId };

    if (taskData.id) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...finalTaskData } : t));
    } else {
      const newTask: Task = {
        ...finalTaskData,
        id: crypto.randomUUID(),
        isCompleted: false,
        createdAt: Date.now(),
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const handleCompleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.isCompleted) {
      audioService.playChainBreak();
      setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: true, completedAt: Date.now() } : t));
      
      setStats(prev => ({
        ...prev,
        soulsCollected: prev.soulsCollected + 1,
      }));
      
      // Critical Success Logic (10% Chance)
      if (Math.random() > 0.90) {
          setIsCritModalOpen(true);
          if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 500]); // Heavy vibration
      } else {
          if (Math.random() > 0.6) triggerDemonMessage();
      }
    }
  };

  const handleDeleteTask = (id: string) => {
    audioService.playClick();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
      setTasks(prev => prev.map(t => {
          if(t.id === taskId && t.subtasks) {
              return {
                  ...t,
                  subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s)
              }
          }
          return t;
      }));
  };
  
  // --- Drag & Drop Logic (Manual Sort) ---
  const onDragStart = (e: React.DragEvent, id: string) => {
      if (taskSort !== 'MANUAL') return;
      setDraggedTaskId(id);
      e.dataTransfer.effectAllowed = 'move';
      // Invisible drag image
      const img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      e.dataTransfer.setDragImage(img, 0, 0);
  };

  const onDragOver = (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      if (!draggedTaskId || draggedTaskId === targetId || taskSort !== 'MANUAL') return;

      const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
      const targetIndex = tasks.findIndex(t => t.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return;

      // Reorder logic
      const newTasks = [...tasks];
      const [removed] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, removed);
      
      setTasks(newTasks);
  };

  const onDragEnd = () => {
      setDraggedTaskId(null);
  };


  // --- Handlers: Finance ---
  const handleSaveTransaction = (transData: Omit<Transaction, 'id'> & { id?: string }, isRecurring: boolean, newSigil?: {title: string, color: string}) => {
    
    let sigilId = transData.sigilId;
    if (newSigil) {
        sigilId = handleCreateSigil(newSigil.title, newSigil.color);
    }
    const finalTransData = { ...transData, sigilId };

    if (transData.id) {
        // Edit mode
        setTransactions(prev => prev.map(t => t.id === transData.id ? { ...t, ...finalTransData } : t));
    } else {
        // Create mode
        const newTransactions: Transaction[] = [];
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        newTransactions.push({ ...finalTransData, id: crypto.randomUUID() });
        
        if (isRecurring && transData.type === TransactionType.SACRIFICE) {
           for (let m = currentMonth + 1; m < 12; m++) {
               const recurringDate = new Date(currentYear, m, now.getDate());
               newTransactions.push({
                   ...finalTransData,
                   date: recurringDate.toISOString(),
                   id: crypto.randomUUID(),
                   title: `${transData.title} (Recurring)`
               });
           }
        }
        setTransactions(prev => [...newTransactions, ...prev]);
    }
    
    if (transData.type === TransactionType.TRIBUTE) audioService.playGold();
  };

  const requestDeleteItem = (id: string, type: 'transaction' | 'note') => {
      setItemToDelete({ id, type });
  };

  const confirmDeleteItem = () => {
      if (itemToDelete) {
          audioService.playClick();
          if (itemToDelete.type === 'transaction') {
              setTransactions(prev => prev.filter(t => t.id !== itemToDelete.id));
          } else if (itemToDelete.type === 'note') {
              setNotes(prev => prev.filter(n => n.id !== itemToDelete.id));
          }
          setItemToDelete(null);
      }
  };

  const openEditTransaction = (trans: Transaction) => {
      setEditingTransaction(trans);
      setIsFinanceModalOpen(true);
  };

  // --- Handlers: Rituals ---
  const handleAddRitual = (title: string) => {
      setRituals(prev => [...prev, { id: crypto.randomUUID(), title, streak: 0, lastPerformed: 0 }]);
  };

  const handlePerformRitual = (id: string) => {
      audioService.playLevelUp(); // Use sound only
      setRituals(prev => prev.map(r => {
          if (r.id === id) {
              return { ...r, streak: r.streak + 1, lastPerformed: Date.now() };
          }
          return r;
      }));
  };

  // --- Handlers: Grimoire (Notes) ---
  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, newSigil?: {title: string, color: string}) => {
    audioService.playClick();
    
    let sigilId = noteData.sigilId;
    if (newSigil) {
        sigilId = handleCreateSigil(newSigil.title, newSigil.color);
    }

    if (noteData.id) {
        setNotes(prev => prev.map(n => n.id === noteData.id ? {
            ...n, 
            title: noteData.title,
            content: noteData.content,
            sigilId,
            updatedAt: Date.now()
        } : n));
    } else {
        setNotes(prev => [{
            id: crypto.randomUUID(),
            title: noteData.title,
            content: noteData.content,
            sigilId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }, ...prev]);
    }
  };

  // --- Derived Data with Filters & Search ---
  const matchesSearch = (text: string, sigilId?: string) => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      const sigil = sigils.find(s => s.id === sigilId);
      const sigilMatch = sigil ? sigil.title.toLowerCase().includes(q) : false;
      return text.toLowerCase().includes(q) || sigilMatch;
  };

  // Task Filtering
  const filteredTasks = useMemo(() => {
      let result = tasks
        .filter(t => !t.isCompleted)
        .filter(t => taskFilterDiff === 'ALL' || t.difficulty === taskFilterDiff)
        .filter(t => matchesSearch(t.title + ' ' + t.description, t.sigilId));
      
      // Only sort if not in MANUAL mode
      if (taskSort === 'DEADLINE') {
          result = result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      } else if (taskSort === 'NEWEST') {
          result = result.sort((a, b) => b.createdAt - a.createdAt);
      }
      // If MANUAL, we respect the array index order in 'tasks' which is preserved by not sorting
      
      return result;
  }, [tasks, taskFilterDiff, taskSort, searchQuery, sigils]);


  const historyTasks = tasks
    .filter(t => t.isCompleted)
    .filter(t => matchesSearch(t.title + ' ' + t.description, t.sigilId))
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  
  const filteredTransactions = transactions
    .filter(tr => finFilterType === 'ALL' || tr.type === finFilterType)
    .filter(tr => matchesSearch(tr.title, tr.sigilId))
    .sort((a, b) => {
        if (finSort === 'AMT_DESC') return b.amount - a.amount;
        if (finSort === 'AMT_ASC') return a.amount - b.amount;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const filteredNotes = notes
    .filter(n => matchesSearch(n.title + ' ' + n.content, n.sigilId))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const getNavClass = (viewName: AppView) => {
      const isActive = view === viewName;
      return `flex-1 py-2 font-cinzel uppercase text-[9px] sm:text-[10px] tracking-widest transition-all duration-300 ${
          isActive 
          ? 'text-hell-gold bg-hell-800/50 border-b-2 border-hell-gold shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
          : 'text-text-secondary hover:text-text-primary'
      }`;
  };

  const getSigil = (id?: string) => sigils.find(s => s.id === id);

  return (
    <div className="min-h-screen pb-24 font-sans text-text-primary relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-overlay"></div>
      
      {/* Demon Message */}
      <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-700 w-[90%] max-w-lg ${showDemonMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className="bg-bg-panel border-y-2 border-hell-lava text-hell-lava font-serif italic px-4 py-4 shadow-[0_0_30px_rgba(249,115,22,0.6)] text-center">
           <span className="text-2xl block mb-1">❝</span>
           {demonMessage}
           <span className="text-2xl block mt-1 text-right">❞</span>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-bg-panel/95 backdrop-blur-md border-b border-hell-700 shadow-md sticky top-0">
        <div className="bg-hell-900 py-1 text-center border-b border-hell-800">
            <p className="text-[8px] sm:text-[10px] text-hell-500 font-runic tracking-[0.2em] uppercase opacity-80 animate-pulse-slow truncate px-2">
            {t.summonSpell}
            </p>
        </div>

        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          {/* CLEANED UP HEADER: Settings Button Only */}
          <div className="flex justify-end gap-4 mb-1 text-[10px] uppercase tracking-widest font-cinzel">
             <button onClick={() => setIsSettingsOpen(true)} className="text-hell-gold hover:text-hell-lava p-1 text-lg transition-transform hover:rotate-90">
               ⚙️
             </button>
          </div>

          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <BeliargSeal className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-cinzel text-hell-lava tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                  {t.appTitle}
                </h1>
                <p className="text-[10px] sm:text-xs text-text-muted font-serif tracking-widest uppercase hidden sm:block">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <div className="bg-bg-input px-3 py-1 rounded border border-hell-700 flex items-center gap-2 cursor-default">
                   <span className="text-xs text-hell-500">🪙</span>
                   <div className={`font-mono text-sm sm:text-lg drop-shadow-sm ${realBalance >= 0 ? 'text-hell-gold' : 'text-red-500'}`}>
                      {realBalance.toFixed(0)} 
                   </div>
                </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex justify-center gap-1 mt-3 sm:mt-4 border-t border-hell-700 pt-2 overflow-x-auto no-scrollbar">
            <button onClick={() => { setView('active'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('active')}>{t.navChains}</button>
            <button onClick={() => { setView('history'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('history')}>{t.navAsh}</button>
            <button onClick={() => { setView('finance'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('finance')}>{t.navTreasury}</button>
            <button onClick={() => { setView('analytics'); audioService.playClick(); }} className={getNavClass('analytics')}>{t.navAnalytics}</button>
            <button onClick={() => { setView('grimoire'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('grimoire')}>{t.navGrimoire}</button>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-3 sm:p-4 mt-2 sm:mt-4 relative z-10">
        
        {/* Search Bar (Global for Active/History/Finance/Grimoire) */}
        {view !== 'analytics' && (
           <div className="mb-4 relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span className="text-hell-500 text-lg">👁</span>
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-bg-panel border border-hell-700 text-text-primary py-2 pl-10 pr-4 text-sm focus:border-hell-gold focus:ring-1 focus:ring-hell-gold outline-none transition-all placeholder-hell-700/50 font-serif"
              />
           </div>
        )}

        {/* VIEW: ACTIVE */}
        {view === 'active' && (
          <>
            {/* Rituals Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4 border-b border-hell-700 pb-2">
                    <h3 className="text-lg text-hell-gold font-cinzel uppercase">{t.ritualsHeader}</h3>
                    <button onClick={() => setIsRitualModalOpen(true)} className="text-[10px] text-hell-gold uppercase border border-hell-700 px-2 py-1 hover:bg-hell-800">
                        {t.newRitual}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rituals.map(r => (
                        <RitualCard key={r.id} ritual={r} onPerform={handlePerformRitual} lang={lang} />
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
               <div>
                <h2 className="text-xl text-hell-gold font-cinzel">{t.activeHeader}</h2>
                <div className="flex gap-2 mt-2">
                    <select value={taskFilterDiff} onChange={(e) => setTaskFilterDiff(e.target.value as any)} className="bg-bg-panel border border-hell-700 text-[10px] uppercase text-text-secondary p-1 outline-none focus:border-hell-gold">
                        <option value="ALL">{t.filterAll}</option>
                        <option value={Difficulty.ASH}>Ash</option>
                        <option value={Difficulty.EMBER}>Ember</option>
                        <option value={Difficulty.INFERNO}>Inferno</option>
                    </select>
                    <select value={taskSort} onChange={(e) => setTaskSort(e.target.value as any)} className="bg-bg-panel border border-hell-700 text-[10px] uppercase text-text-secondary p-1 outline-none focus:border-hell-gold">
                        <option value="DEADLINE">{t.sortDeadline}</option>
                        <option value="NEWEST">{t.sortNewest}</option>
                        <option value="MANUAL">{t.sortManual}</option>
                    </select>
                </div>
               </div>
              <HellButton onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }} className="text-xs sm:text-base">
                 {t.newChain}
              </HellButton>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-hell-700 rounded-lg bg-bg-panel/50 relative overflow-hidden min-h-[250px] flex flex-col items-center justify-center group">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.05),transparent_70%)] pointer-events-none"></div>
                 
                 {/* DEMONIC EYE ANIMATION */}
                 <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                     <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                         
                         <defs>
                             <radialGradient id="irisGrad">
                                 <stop offset="10%" stopColor="#ffea00" />
                                 <stop offset="60%" stopColor="#ff4500" />
                                 <stop offset="90%" stopColor="#500000" />
                             </radialGradient>
                             <radialGradient id="scleraGrad">
                                 <stop offset="0%" stopColor="#500000" />
                                 <stop offset="100%" stopColor="#000000" />
                             </radialGradient>
                         </defs>

                         {/* Background Spikes/Teeth Rotating */}
                         <g className="origin-center animate-spin-slow opacity-50">
                             {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                                 <path key={deg} d="M50 10 L55 25 L45 25 Z" fill="var(--hell-900)" stroke="var(--hell-700)" strokeWidth="0.5" transform={`rotate(${deg} 50 50)`} />
                             ))}
                             <circle cx="50" cy="50" r="35" fill="none" stroke="var(--hell-600)" strokeWidth="0.5" strokeDasharray="3 2" />
                         </g>
                         
                         {/* Reverse Ring */}
                         <g className="origin-center animate-spin-reverse opacity-40">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--hell-500)" strokeWidth="1" strokeDasharray="10 10" />
                         </g>

                         {/* THE EYE */}
                         <g className="animate-pulse-demonic">
                             {/* Sclera */}
                             <ellipse cx="50" cy="50" rx="28" ry="18" fill="url(#scleraGrad)" stroke="var(--hell-600)" strokeWidth="1" />
                             
                             {/* Iris & Pupil Container (Moves) */}
                             <g className="animate-pupil-move">
                                 {/* Iris */}
                                 <circle cx="50" cy="50" r="11" fill="url(#irisGrad)" className="animate-flicker" />
                                 
                                 {/* Pupil (Slit) */}
                                 <ellipse cx="50" cy="50" rx="2" ry="10" fill="#000000" />
                                 
                                 {/* Glint */}
                                 <circle cx="54" cy="46" r="2" fill="#ffffff" opacity="0.8" />
                             </g>
                             
                             {/* Eyelids (Shadows) */}
                             <path d="M22 50 Q 50 25 78 50" fill="none" stroke="var(--bg-app)" strokeWidth="3" opacity="0.5" />
                             <path d="M22 50 Q 50 75 78 50" fill="none" stroke="var(--bg-app)" strokeWidth="3" opacity="0.5" />
                         </g>
                     </svg>
                 </div>

                 <p className="text-hell-500 font-cinzel text-lg animate-pulse tracking-widest">{t.emptyStateTitle}</p>
                 <p className="text-text-secondary text-xs mt-2 uppercase tracking-widest font-serif">{t.emptyStateDesc}</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {filteredTasks.map(task => (
                  <div 
                    key={task.id}
                    draggable={taskSort === 'MANUAL'}
                    onDragStart={(e) => onDragStart(e, task.id)}
                    onDragOver={(e) => onDragOver(e, task.id)}
                    onDragEnd={onDragEnd}
                    className={draggedTaskId === task.id ? 'opacity-30' : ''}
                  >
                    <TaskCard 
                        task={task} 
                        sigil={getSigil(task.sigilId)}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteTask}
                        onEdit={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
                        onToggleSubtask={handleToggleSubtask}
                        isDraggable={taskSort === 'MANUAL'}
                        lang={lang}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* VIEW: HISTORY */}
        {view === 'history' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-hell-gold font-cinzel">{t.historyHeader}</h2>
              {historyTasks.length > 0 && (
                  <button onClick={() => setTasks(prev => prev.filter(t => !t.isCompleted))} className="text-[10px] text-red-600 underline font-bold font-cinzel">
                      {t.burnArchive}
                  </button>
              )}
            </div>
            <div className="opacity-80 grayscale-[50%] pointer-events-none select-none grid gap-3">
               {historyTasks.map(task => (
                  <TaskCard key={task.id} task={task} sigil={getSigil(task.sigilId)} onComplete={()=>{}} onDelete={()=>{}} onEdit={()=>{}} isHistoryView={true} lang={lang} />
                ))}
            </div>
          </>
        )}

        {/* VIEW: FINANCE */}
        {view === 'finance' && (
            <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl text-hell-gold font-cinzel">{t.financeHeader}</h2>
                        <div className="flex gap-2 mt-2">
                            <select value={finFilterType} onChange={(e) => setFinFilterType(e.target.value as any)} className="bg-bg-panel border border-hell-700 text-[10px] uppercase text-text-secondary p-1 outline-none focus:border-hell-gold">
                                <option value="ALL">{t.filterAll}</option>
                                <option value={TransactionType.TRIBUTE}>{t.tribute}</option>
                                <option value={TransactionType.SACRIFICE}>{t.sacrifice}</option>
                            </select>
                             <select value={finSort} onChange={(e) => setFinSort(e.target.value as any)} className="bg-bg-panel border border-hell-700 text-[10px] uppercase text-text-secondary p-1 outline-none focus:border-hell-gold">
                                <option value="DATE_DESC">{t.sortNewest}</option>
                                <option value="AMT_DESC">{t.sortGoldDesc}</option>
                                <option value="AMT_ASC">{t.sortGoldAsc}</option>
                            </select>
                        </div>
                    </div>
                    <HellButton variant="gold" onClick={() => { setEditingTransaction(null); setIsFinanceModalOpen(true); }} className="text-xs">
                        {t.addRecord}
                    </HellButton>
                </div>

                <div className="bg-bg-panel border border-hell-700 rounded overflow-hidden mb-6 shadow-lg overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[300px]">
                        <thead className="bg-hell-800 text-hell-500 font-cinzel uppercase tracking-wider text-xs">
                            <tr>
                                <th className="p-3">{t.tableDate}</th>
                                <th className="p-3">{t.tableDesc}</th>
                                <th className="p-3 text-right">{t.tableGold}</th>
                                <th className="p-3 w-16 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-hell-700/50 text-xs sm:text-sm">
                            {filteredTransactions.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-text-secondary italic">{t.emptyFinance}</td></tr>
                            )}
                            {filteredTransactions.map(tr => {
                                const sigil = getSigil(tr.sigilId);
                                return (
                                    <tr key={tr.id} className="group hover:bg-hell-800/30 transition">
                                        <td className="p-3 text-text-muted font-mono whitespace-nowrap">
                                            {new Date(tr.date).toLocaleDateString()}
                                            {sigil && (
                                                <div className="mt-1 text-[9px] px-1 rounded w-fit text-bg-app font-bold" style={{backgroundColor: sigil.color}}>
                                                    {sigil.title}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 text-text-primary font-medium truncate max-w-[150px]">{tr.title}</td>
                                        <td className={`p-3 text-right font-mono font-bold ${tr.type === TransactionType.TRIBUTE ? 'text-hell-gold' : 'text-red-500'}`}>
                                            {tr.type === TransactionType.TRIBUTE ? '+' : '-'}{tr.amount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => openEditTransaction(tr)} className="text-text-secondary hover:text-hell-gold mr-2">✏️</button>
                                            <button onClick={() => requestDeleteItem(tr.id, 'transaction')} className="text-text-secondary hover:text-red-600">✖</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        )}
        
        {/* VIEW: ANALYTICS */}
        {view === 'analytics' && (
            <AnalyticsView 
                transactions={transactions} 
                completedTasks={historyTasks} // Pass completed tasks for Heatmap
                lang={lang} 
            />
        )}

        {/* VIEW: GRIMOIRE */}
        {view === 'grimoire' && (
            <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl text-hell-gold font-cinzel">{t.grimoireHeader}</h2>
                    <HellButton variant="gold" onClick={() => { setEditingNote(null); setIsGrimoireModalOpen(true); }} className="text-xs">
                        {t.newScroll}
                    </HellButton>
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="text-center py-12 border border-hell-700/50 bg-bg-panel/30">
                         <div className="text-4xl mb-2 opacity-50">📜</div>
                         <p className="text-text-secondary font-serif italic text-sm">{t.emptyGrimoire}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNotes.map(note => (
                            <GrimoireCard 
                                key={note.id} 
                                note={note} 
                                sigil={getSigil(note.sigilId)} 
                                onEdit={(n) => { setEditingNote(n); setIsGrimoireModalOpen(true); }}
                                onDelete={(id) => requestDeleteItem(id, 'note')}
                                lang={lang}
                            />
                        ))}
                    </div>
                )}
            </>
        )}

      </main>

      <footer className="fixed bottom-0 w-full bg-bg-panel py-2 text-center border-t border-hell-800 z-20 shadow-lg">
          <p className="text-[9px] text-text-muted font-cinzel uppercase opacity-70 px-4 truncate">{t.footerSpell}</p>
      </footer>

      <AddSoulModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSave={handleSaveTask}
        editingTask={editingTask}
        sigils={sigils}
        lang={lang}
      />
      
      <AddTransactionModal
        isOpen={isFinanceModalOpen}
        onClose={() => setIsFinanceModalOpen(false)}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        sigils={sigils}
        lang={lang}
      />
      
      <AddRitualModal
        isOpen={isRitualModalOpen}
        onClose={() => setIsRitualModalOpen(false)}
        onSave={handleAddRitual}
        lang={lang}
      />

      <AddGrimoireModal 
        isOpen={isGrimoireModalOpen}
        onClose={() => setIsGrimoireModalOpen(false)}
        onSave={handleSaveNote}
        editingNote={editingNote}
        sigils={sigils}
        lang={lang}
      />

      <ConfirmationModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDeleteItem}
        message={itemToDelete?.type === 'note' ? t.deleteNoteConfirm : t.deleteTransConfirm}
        lang={lang}
      />

      <CritModal 
        isOpen={isCritModalOpen}
        onClose={() => setIsCritModalOpen(false)}
        lang={lang}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        theme={theme}
        onSetLang={setLang}
        onSetTheme={setTheme}
        onExport={handleExportData}
        onImport={handleImportData}
      />

    </div>
  );
};

export default App;
