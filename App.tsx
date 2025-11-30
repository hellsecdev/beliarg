
import React, { useState, useEffect, useMemo } from 'react';
import { Task, Difficulty, PlayerStats, AppView, Transaction, TransactionType, Language, Theme, Ritual, Sigil, Note, User, Achievement } from './types';
import { TaskCard } from './components/TaskCard';
import { AddSoulModal } from './components/AddSoulModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { RitualCard } from './components/RitualCard';
import { AddRitualModal } from './components/AddRitualModal';
import { GrimoireCard } from './components/GrimoireCard';
import { AddGrimoireModal } from './components/AddGrimoireModal';
import { HellButton } from './components/HellButton';
import { BeliargSeal } from './components/BeliarghSeal'; 
import { ConfirmationModal } from './components/ConfirmationModal';
import { CritModal } from './components/CritModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthPage } from './components/AuthPage'; // NEW
import { getDemonComment } from './services/geminiService';
import { audioService } from './services/audioService';
import { storageService, AuthenticationError } from './services/storage'; 
import { authService } from './services/authService';
import { translations } from './translations';

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null); // NEW User State
  const [isLoading, setIsLoading] = useState(true);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sigils, setSigils] = useState<Sigil[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  
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
  const [financePage, setFinancePage] = useState(1);
  const [grimoirePage, setGrimoirePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  // Settings State
  const [lang, setLang] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>('dark');
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isRitualModalOpen, setIsRitualModalOpen] = useState(false);
  const [isGrimoireModalOpen, setIsGrimoireModalOpen] = useState(false);
  const [isCritModalOpen, setIsCritModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'transaction' | 'note' } | null>(null);

  const [demonMessage, setDemonMessage] = useState<string>('');
  const [showDemonMessage, setShowDemonMessage] = useState(false);
  
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const t = translations[lang];

  // --- Initialization ---

  useEffect(() => {
      // Check for token
      const token = authService.getToken();
      if (token) {
          // In a real app we would validate the token here or fetch the user profile
          // For now, assume if token exists we try to load data. 
          // Ideally we decode JWT to get email for UI.
          try {
              // Validate JWT format (should have 3 parts separated by dots)
              if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
                  throw new Error('Invalid token format');
              }
              const base64Url = token.split('.')[1];
              if (!base64Url) {
                  throw new Error('Token missing payload');
              }
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
              const decoded = JSON.parse(jsonPayload);
              if (!decoded.id || !decoded.email) {
                  throw new Error('Token missing required fields');
              }
              setUser({ id: decoded.id, email: decoded.email });
          } catch (e) {
              // Invalid token - clear it but don't reload to avoid infinite loop
              console.error('Invalid token format:', e);
              authService.clearToken();
              setUser(null);
              setIsLoading(false);
          }
      } else {
          setIsLoading(false);
      }
      
      // Load local preferences
      const savedLang = localStorage.getItem('beliarg_lang') as Language;
      const savedTheme = localStorage.getItem('beliarg_theme') as Theme;
      if (savedLang) setLang(savedLang);
      if (savedTheme) setTheme(savedTheme);
  }, []);

  // Load Data when User changes
  useEffect(() => {
    const loadData = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        try {
            console.log('[App] Loading data from server...');
            const data = await storageService.loadAllData();
            console.log('[App] Data loaded:', {
                tasks: data.tasks?.length || 0,
                transactions: data.transactions?.length || 0,
                rituals: data.rituals?.length || 0,
                notes: data.notes?.length || 0,
                sigils: data.sigils?.length || 0,
                achievements: data.achievements?.length || 0
            });
            
            const loadedTasks = data.tasks || [];
            const completedTasksCount = loadedTasks.filter(t => t.isCompleted).length;
            console.log('[App] Completed tasks:', completedTasksCount, 'out of', loadedTasks.length);
            
            setTasks(loadedTasks);
            // Ensure amount is always a number for transactions
            const normalizedTransactions = (data.transactions || []).map(tr => ({
                ...tr,
                amount: typeof tr.amount === 'number' ? tr.amount : (typeof tr.amount === 'string' ? parseFloat(tr.amount) : 0) || 0
            }));
            setTransactions(normalizedTransactions);
            setRituals(data.rituals || []);
            setNotes(data.notes || []);
            setSigils(data.sigils || []);
            const initialAchievements = data.achievements || [];
            console.log('[App] Initial achievements loaded:', initialAchievements.length);
            setAchievements(initialAchievements);
            
            if (data.stats) setStats(data.stats);

            checkRitualStreaks(data.rituals || []);
            
            // Check achievements for existing data
            console.log('[App] Starting checkAllAchievements...');
            await checkAllAchievements(data.tasks || [], data.rituals || [], data.notes || [], data.transactions || []);
        } catch (error) {
            console.error('Failed to load data:', error);
            // Handle authentication errors - clear token and reset user
            if (error instanceof AuthenticationError) {
                console.warn('Authentication failed, clearing session');
                authService.clearToken();
                setUser(null);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    loadData();
  }, [user]);

  // Reset finance page when filters or sort change
  useEffect(() => {
    setFinancePage(1);
  }, [finFilterType, finSort, searchQuery]);

  // Reset grimoire and history pages when search changes
  useEffect(() => {
    setGrimoirePage(1);
    setHistoryPage(1);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('beliarg_theme', theme);
    localStorage.setItem('beliarg_lang', lang);
    
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    }

    if (lang === 'he') {
      html.setAttribute('dir', 'rtl');
      html.lang = 'he';
    } else {
      html.setAttribute('dir', 'ltr');
      html.lang = lang;
    }

  }, [theme, lang]);

  // Online/Offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      syncOfflineData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync offline data when coming back online
  const syncOfflineData = async () => {
    if (!isOnline || !user) return;
    
    setIsSyncing(true);
    try {
      // Import offlineStorage dynamically to avoid issues if IndexedDB is not available
      const { offlineStorage } = await import('./services/offlineStorage');
      const pendingOps = await offlineStorage.getPendingOperations();
      
      if (pendingOps.length > 0) {
        // Send batch sync request
        const res = await fetch('/api/sync/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
          },
          body: JSON.stringify({ operations: pendingOps })
        });

        if (res.ok) {
          // Clear pending operations
          for (const op of pendingOps) {
            await offlineStorage.removePendingOperation(op.id);
          }
          
          // Reload data from server
          const data = await storageService.loadAllData();
          setTasks(data.tasks || []);
          setTransactions(data.transactions || []);
          setRituals(data.rituals || []);
          setNotes(data.notes || []);
          setSigils(data.sigils || []);
          setAchievements(data.achievements || []);
        }
      }
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Check achievements
  const checkAchievements = async (type: string, progress: number, target: number) => {
    if (!user) return;
    
    try {
      const res = await fetch('/api/achievements/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ type, progress, target })
      });

      if (res.ok) {
        // Reload achievements
        const achievementsRes = await fetch('/api/achievements', {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });
        if (achievementsRes.ok) {
          const achievementsData = await achievementsRes.json();
          setAchievements(achievementsData);
        }
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  // Check achievement without reloading (for batch operations)
  const checkAchievementSilent = async (type: string, progress: number, target: number): Promise<void> => {
    if (!user) {
      console.warn(`[Achievements] No user, skipping ${type}`);
      return;
    }
    
    try {
      console.log(`[Achievements] Checking ${type}: progress=${progress}, target=${target}`);
      const res = await fetch('/api/achievements/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ type, progress, target })
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Achievements] Failed to check achievement ${type}:`, res.status, errorText);
      } else {
        console.log(`[Achievements] Successfully checked ${type}`);
      }
    } catch (error) {
      console.error(`[Achievements] Error checking achievement ${type}:`, error);
    }
  };

  // Check all achievements based on current data
  const checkAllAchievements = async (tasks: Task[], rituals: Ritual[], notes: Note[], transactions: Transaction[]) => {
    if (!user) return;
    
    try {
      console.log('[Achievements] Checking all achievements...');
      
      // Task achievements
      const completedTasks = tasks.filter(t => t.isCompleted);
      const completedCount = completedTasks.length;
      
      console.log('[Achievements] Completed tasks count:', completedCount);
      
      // Always check task achievements, even if count is 0 (to create records)
      await checkAchievementSilent('first_task', Math.min(completedCount, 1), 1);
      await checkAchievementSilent('complete_10_tasks', completedCount, 10);
      await checkAchievementSilent('complete_50_tasks', completedCount, 50);
      await checkAchievementSilent('complete_100_tasks', completedCount, 100);
      
      // Note achievements
      const notesCount = notes.length;
      console.log('[Achievements] Notes count:', notesCount);
      // Always check note achievements
      await checkAchievementSilent('create_10_notes', notesCount, 10);
      await checkAchievementSilent('create_50_notes', notesCount, 50);
      
      // Ritual streak achievements
      const maxRitualStreak = rituals.length > 0 ? Math.max(...rituals.map(r => r.streak)) : 0;
      console.log('[Achievements] Max ritual streak:', maxRitualStreak);
      // Always check ritual streak achievements
      await checkAchievementSilent('ritual_streak_7', Math.min(maxRitualStreak, 7), 7);
      await checkAchievementSilent('ritual_streak_30', Math.min(maxRitualStreak, 30), 30);
      
      // Gold achievements (calculate from transactions)
      let totalGold = 0;
      transactions.forEach(t => {
        if (t.type === TransactionType.TRIBUTE) {
          totalGold += typeof t.amount === 'number' ? t.amount : parseFloat(t.amount) || 0;
        }
      });
      console.log('[Achievements] Total gold:', totalGold);
      // Always check gold achievements
      await checkAchievementSilent('total_gold_1000', Math.min(totalGold, 1000), 1000);
      await checkAchievementSilent('total_gold_10000', Math.min(totalGold, 10000), 10000);
      
      // Task streak achievements (calculate from completed tasks)
      let maxTaskStreak = 0;
      if (completedTasks.length > 0) {
        // Group by completion date and find longest streak
        const completionDates = completedTasks
          .map(t => t.completedAt || t.createdAt)
          .filter(d => d)
          .map(d => new Date(d).toISOString().split('T')[0])
          .sort()
          .filter((v, i, a) => a.indexOf(v) === i); // unique dates
        
        // Calculate streak (consecutive days)
        let currentStreak = 1;
        for (let i = 1; i < completionDates.length; i++) {
          const prevDate = new Date(completionDates[i - 1]);
          const currDate = new Date(completionDates[i]);
          const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            currentStreak++;
          } else {
            maxTaskStreak = Math.max(maxTaskStreak, currentStreak);
            currentStreak = 1;
          }
        }
        maxTaskStreak = Math.max(maxTaskStreak, currentStreak);
      }
      console.log('[Achievements] Max task streak:', maxTaskStreak);
      // Always check task streak achievements
      await checkAchievementSilent('task_streak_7', Math.min(maxTaskStreak, 7), 7);
      await checkAchievementSilent('task_streak_30', Math.min(maxTaskStreak, 30), 30);
      
      // Reload achievements once at the end
      console.log('[Achievements] Reloading achievements...');
      try {
        const achievementsRes = await fetch('/api/achievements', {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });
        if (achievementsRes.ok) {
          const achievementsData = await achievementsRes.json();
          console.log('[Achievements] Loaded achievements:', achievementsData.length);
          console.log('[Achievements] Achievements data:', achievementsData);
          setAchievements(achievementsData);
        } else {
          const errorText = await achievementsRes.text();
          console.error('[Achievements] Failed to reload achievements:', achievementsRes.status, errorText);
        }
      } catch (fetchError) {
        console.error('[Achievements] Error fetching achievements:', fetchError);
      }
    } catch (error) {
      console.error('Failed to check all achievements:', error);
    }
  };

  const handleLogin = (u: User) => {
      setUser(u);
  };

  // ... [Rest of the handlers: handleSaveTask, handleCompleteTask, etc. remain effectively the same]
  // ... But for brevity I will re-output the critical parts and keep the component logic intact

  const realBalance = useMemo(() => {
      return transactions.reduce((acc, curr) => {
          const amount = typeof curr.amount === 'number' ? curr.amount : parseFloat(curr.amount) || 0;
          if (curr.type === TransactionType.TRIBUTE) {
              return acc + amount;
          } else {
              return acc - amount;
          }
      }, 0);
  }, [transactions]);

  const checkRitualStreaks = (currentRituals: Ritual[]) => {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const updatedRituals = currentRituals.map(r => {
          if (r.lastPerformed > 0 && (now - r.lastPerformed) > (oneDay * 2)) {
              return { ...r, streak: 0 }; 
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
  
  const handleCreateSigil = async (title: string, color: string) => {
      const newSigil: Sigil = { id: crypto.randomUUID(), title, color };
      setSigils(prev => [...prev, newSigil]);
      await storageService.saveSigil(newSigil);
      return newSigil.id;
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'isCompleted' | 'createdAt'> & { id?: string }, newSigil?: {title: string, color: string}) => {
    audioService.playClick();
    let sigilId = taskData.sigilId;
    if (newSigil) sigilId = await handleCreateSigil(newSigil.title, newSigil.color);

    const finalTaskData = { ...taskData, sigilId };
    let newTask: Task;

    if (taskData.id) {
        const existing = tasks.find(t => t.id === taskData.id);
        newTask = { ...existing!, ...finalTaskData };
        setTasks(prev => prev.map(t => t.id === taskData.id ? newTask : t));
    } else {
        newTask = { ...finalTaskData, id: crypto.randomUUID(), isCompleted: false, createdAt: Date.now() };
        setTasks(prev => [newTask, ...prev]);
    }
    await storageService.saveTask(newTask);
  };

  const handleCompleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.isCompleted) {
      audioService.playChainBreak();
      const updatedTask = { ...task, isCompleted: true, completedAt: Date.now() };
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      setStats(prev => ({ ...prev, soulsCollected: prev.soulsCollected + 1 }));
      await storageService.saveTask(updatedTask);
      
      // Check achievements
      const completedCount = tasks.filter(t => t.isCompleted).length + 1;
      await checkAchievements('complete_10_tasks', completedCount, 10);
      await checkAchievements('complete_50_tasks', completedCount, 50);
      await checkAchievements('complete_100_tasks', completedCount, 100);
      if (completedCount === 1) {
        await checkAchievements('first_task', 1, 1);
      }
      
      if (Math.random() > 0.90) {
          setIsCritModalOpen(true);
          if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 500]);
      } else {
          if (Math.random() > 0.6) triggerDemonMessage();
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    audioService.playClick();
    setTasks(prev => prev.filter(t => t.id !== id));
    await storageService.deleteTask(id);
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.subtasks) return;
      const updatedSubtasks = task.subtasks.map(s => s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s);
      const updatedTask = { ...task, subtasks: updatedSubtasks };
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      await storageService.saveTask(updatedTask);
  };
  
  const onDragStart = (e: React.DragEvent, id: string) => {
      if (taskSort !== 'MANUAL') return;
      setDraggedTaskId(id);
      e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      if (!draggedTaskId || draggedTaskId === targetId || taskSort !== 'MANUAL') return;
      const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
      const targetIndex = tasks.findIndex(t => t.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return;
      const newTasks = [...tasks];
      const [removed] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, removed);
      setTasks(newTasks);
  };

  const onDragEnd = () => { setDraggedTaskId(null); };

  const handleSaveTransaction = async (transData: Omit<Transaction, 'id'> & { id?: string }, isRecurring: boolean, newSigil?: {title: string, color: string}) => {
    let sigilId = transData.sigilId;
    if (newSigil) sigilId = await handleCreateSigil(newSigil.title, newSigil.color);
    const finalTransData = { ...transData, sigilId };

    if (transData.id) {
        const updated = { ...finalTransData, id: transData.id } as Transaction;
        setTransactions(prev => prev.map(t => t.id === transData.id ? updated : t));
        await storageService.saveTransaction(updated);
    } else {
        const newTransactions: Transaction[] = [];
        const now = new Date();
        const primary = { ...finalTransData, id: crypto.randomUUID() } as Transaction;
        newTransactions.push(primary);
        await storageService.saveTransaction(primary);
        
        if (isRecurring && transData.type === TransactionType.SACRIFICE) {
           const currentYear = now.getFullYear();
           const currentMonth = now.getMonth();
           for (let m = currentMonth + 1; m < 12; m++) {
               const recurringDate = new Date(currentYear, m, now.getDate());
               const rec = { ...finalTransData, date: recurringDate.toISOString(), id: crypto.randomUUID(), title: `${transData.title} (Recurring)` } as Transaction;
               newTransactions.push(rec);
               await storageService.saveTransaction(rec);
           }
        }
        setTransactions(prev => [...newTransactions, ...prev]);
    }
    if (transData.type === TransactionType.TRIBUTE) audioService.playGold();
  };

  const requestDeleteItem = (id: string, type: 'transaction' | 'note') => { setItemToDelete({ id, type }); };

  const confirmDeleteItem = async () => {
      if (itemToDelete) {
          audioService.playClick();
          if (itemToDelete.type === 'transaction') {
              setTransactions(prev => prev.filter(t => t.id !== itemToDelete.id));
              await storageService.deleteTransaction(itemToDelete.id);
          } else if (itemToDelete.type === 'note') {
              setNotes(prev => prev.filter(n => n.id !== itemToDelete.id));
              await storageService.deleteNote(itemToDelete.id);
          }
          setItemToDelete(null);
      }
  };

  const openEditTransaction = (trans: Transaction) => { setEditingTransaction(trans); setIsFinanceModalOpen(true); };

  const handleAddRitual = async (title: string) => {
      const newRitual = { id: crypto.randomUUID(), title, streak: 0, lastPerformed: 0 };
      setRituals(prev => [...prev, newRitual]);
      await storageService.saveRitual(newRitual);
  };

  const handlePerformRitual = async (id: string) => {
      audioService.playLevelUp();
      const ritual = rituals.find(r => r.id === id);
      if (ritual) {
          const updated = { ...ritual, streak: ritual.streak + 1, lastPerformed: Date.now() };
          setRituals(prev => prev.map(r => r.id === id ? updated : r));
          await storageService.saveRitual(updated);
      }
  };

  const handleSaveNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, newSigil?: {title: string, color: string}) => {
    audioService.playClick();
    let sigilId = noteData.sigilId;
    if (newSigil) sigilId = await handleCreateSigil(newSigil.title, newSigil.color);

    let newNote: Note;
    if (noteData.id) {
        const existing = notes.find(n => n.id === noteData.id)!;
        newNote = { ...existing, title: noteData.title, content: noteData.content, sigilId, updatedAt: Date.now() };
        setNotes(prev => prev.map(n => n.id === noteData.id ? newNote : n));
    } else {
        newNote = { id: crypto.randomUUID(), title: noteData.title, content: noteData.content, sigilId, createdAt: Date.now(), updatedAt: Date.now() };
        setNotes(prev => [newNote, ...prev]);
    }
    await storageService.saveNote(newNote);
  };

  const matchesSearch = (text: string, sigilId?: string) => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      const sigil = sigils.find(s => s.id === sigilId);
      const sigilMatch = sigil ? sigil.title.toLowerCase().includes(q) : false;
      return text.toLowerCase().includes(q) || sigilMatch;
  };

  const filteredTasks = useMemo(() => {
      let result = tasks
        .filter(t => !t.isCompleted)
        .filter(t => taskFilterDiff === 'ALL' || t.difficulty === taskFilterDiff)
        .filter(t => matchesSearch(t.title + ' ' + t.description, t.sigilId));
      
      if (taskSort === 'DEADLINE') result = result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      else if (taskSort === 'NEWEST') result = result.sort((a, b) => b.createdAt - a.createdAt);
      
      return result;
  }, [tasks, taskFilterDiff, taskSort, searchQuery, sigils]);

  const historyTasks = tasks.filter(t => t.isCompleted).filter(t => matchesSearch(t.title + ' ' + t.description, t.sigilId)).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  
  // All completed tasks for analytics (without search filter)
  const allCompletedTasks = useMemo(() => {
    const completed = tasks.filter(t => t.isCompleted).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
    console.log('[App] allCompletedTasks calculated:', completed.length, 'out of', tasks.length, 'total tasks');
    if (completed.length > 0) {
      console.log('[App] Sample completed task:', {
        id: completed[0].id,
        title: completed[0].title,
        isCompleted: completed[0].isCompleted,
        completedAt: completed[0].completedAt,
        createdAt: completed[0].createdAt
      });
    }
    return completed;
  }, [tasks]);
  
  // Pagination for history tasks
  const ITEMS_PER_PAGE = 10;
  const totalHistoryPages = Math.ceil(historyTasks.length / ITEMS_PER_PAGE);
  const paginatedHistoryTasks = useMemo(() => {
    const startIndex = (historyPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return historyTasks.slice(startIndex, endIndex);
  }, [historyTasks, historyPage]);
  
  const filteredTransactions = transactions.filter(tr => finFilterType === 'ALL' || tr.type === finFilterType).filter(tr => matchesSearch(tr.title, tr.sigilId)).sort((a, b) => {
        if (finSort === 'AMT_DESC') return b.amount - a.amount;
        if (finSort === 'AMT_ASC') return a.amount - b.amount;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Pagination for transactions
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (financePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, financePage]);

  const filteredNotes = notes.filter(n => matchesSearch(n.title + ' ' + n.content, n.sigilId)).sort((a, b) => b.updatedAt - a.updatedAt);
  
  // Pagination for notes
  const totalNotesPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);
  const paginatedNotes = useMemo(() => {
    const startIndex = (grimoirePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredNotes.slice(startIndex, endIndex);
  }, [filteredNotes, grimoirePage]);
  
  const getNavClass = (viewName: AppView) => {
      const isActive = view === viewName;
      return `flex-1 py-2 font-cinzel uppercase text-[9px] sm:text-[10px] tracking-widest transition-all duration-300 ${isActive ? 'text-hell-gold bg-hell-800/50 border-b-2 border-hell-gold shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'text-text-secondary hover:text-text-primary'}`;
  };
  const getSigil = (id?: string) => sigils.find(s => s.id === id);

  // --- Render Auth or App ---

  if (!user) {
      return <AuthPage onLogin={handleLogin} lang={lang} onSetLang={setLang} />;
  }

  // Show loading only on initial load, not when switching views
  const isInitialLoad = isLoading && tasks.length === 0 && transactions.length === 0;

  return (
    <div className="min-h-screen pb-24 font-sans text-text-primary relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-overlay"></div>
      
      {/* ... Demon Message Overlay ... */}
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
            <p className="text-[8px] sm:text-[10px] text-hell-500 font-runic tracking-[0.2em] uppercase opacity-80 animate-pulse-slow truncate px-2">{t.summonSpell}</p>
        </div>

        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="flex justify-end gap-4 mb-1 text-[10px] uppercase tracking-widest font-cinzel">
             <button onClick={() => setIsSettingsOpen(true)} className="text-hell-gold hover:text-hell-lava p-1 text-lg transition-transform hover:rotate-90">⚙️</button>
          </div>

          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <BeliargSeal className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-cinzel text-hell-lava tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{t.appTitle}</h1>
                <p className="text-[10px] sm:text-xs text-text-muted font-serif tracking-widest uppercase hidden sm:block">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <div className="bg-bg-input px-3 py-1 rounded border border-hell-700 flex items-center gap-2 cursor-default">
                   <span className="text-xs text-hell-500">🪙</span>
                   <div className={`font-mono text-sm sm:text-lg drop-shadow-sm ${realBalance >= 0 ? 'text-hell-gold' : 'text-red-500'}`}>
                      {(typeof realBalance === 'number' ? realBalance : 0).toFixed(0)} 
                   </div>
                </div>
            </div>
          </div>

          <nav className="flex justify-center gap-1 mt-3 sm:mt-4 border-t border-hell-700 pt-2 overflow-x-auto no-scrollbar">
            <button onClick={() => { setView('active'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('active')}>{t.navChains}</button>
            <button onClick={() => { setView('history'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('history')}>{t.navAsh}</button>
            <button onClick={() => { setView('finance'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('finance')}>{t.navTreasury}</button>
            <button onClick={() => { setView('analytics'); audioService.playClick(); }} className={getNavClass('analytics')}>{t.navAnalytics}</button>
            <button onClick={() => { setView('calendar'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('calendar')}>{t.navCalendar}</button>
            <button onClick={() => { setView('grimoire'); audioService.playClick(); setSearchQuery(''); }} className={getNavClass('grimoire')}>{t.navGrimoire}</button>
          </nav>
        </div>
      </header>

      {/* Main Content Rendering ... Same as before but using view state */}
      <main className="max-w-3xl mx-auto p-3 sm:p-4 mt-2 sm:mt-4 relative z-10">
        
        {isInitialLoad ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-hell-gold font-cinzel animate-pulse text-xl mb-4">SUMMONING THE FORGE...</div>
              <div className="text-text-muted text-sm">Loading your data from the abyss...</div>
            </div>
          </div>
        ) : (
          <>
            {view !== 'analytics' && (
               <div className="mb-4 relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none rtl:right-3 rtl:left-auto"><span className="text-hell-500 text-lg">👁</span></div>
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-bg-panel border border-hell-700 text-text-primary py-2 pl-10 pr-4 rtl:pr-10 rtl:pl-4 text-sm focus:border-hell-gold focus:ring-1 focus:ring-hell-gold outline-none transition-all placeholder-hell-700/50 font-serif" />
               </div>
            )}

        {/* ... (Existing Views Render Logic - Task List, Finance, Analytics, Grimoire - No changes needed to the logic, just ensuring it's inside) ... */}
        {/* I will assume the render logic from the previous file is preserved here for brevity, as it depends on 'view' state */}
        {/* Active Tasks View */}
        {view === 'active' && (
          <>
             <div className="mb-8">
                <div className="flex justify-between items-center mb-4 border-b border-hell-700 pb-2">
                    <h3 className="text-lg text-hell-gold font-cinzel uppercase">{t.ritualsHeader}</h3>
                    <button onClick={() => setIsRitualModalOpen(true)} className="text-[10px] text-hell-gold uppercase border border-hell-700 px-2 py-1 hover:bg-hell-800">{t.newRitual}</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rituals.map(r => (<RitualCard key={r.id} ritual={r} onPerform={handlePerformRitual} lang={lang} />))}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
               <div>
                <h2 className="text-xl text-hell-gold font-cinzel">{t.activeHeader}</h2>
                <div className="flex gap-2 mt-2">
                    <select value={taskFilterDiff} onChange={(e) => setTaskFilterDiff(e.target.value as any)} className="bg-bg-panel border border-hell-700 text-[10px] uppercase text-text-secondary p-1 outline-none focus:border-hell-gold"><option value="ALL">{t.filterAll}</option><option value={Difficulty.ASH}>{t.diffAsh}</option><option value={Difficulty.EMBER}>{t.diffEmber}</option><option value={Difficulty.INFERNO}>{t.diffInferno}</option></select>
                    <select value={taskSort} onChange={(e) => setTaskSort(e.target.value as any)} className="bg-bg-panel border border-hell-700 text-[10px] uppercase text-text-secondary p-1 outline-none focus:border-hell-gold"><option value="DEADLINE">{t.sortDeadline}</option><option value="NEWEST">{t.sortNewest}</option><option value="MANUAL">{t.sortManual}</option></select>
                </div>
               </div>
              <HellButton onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }} className="text-xs sm:text-base">{t.newChain}</HellButton>
            </div>
            {filteredTasks.length === 0 ? (
               <div className="text-center py-12 border-2 border-dashed border-hell-700 rounded-lg bg-bg-panel/50 relative overflow-hidden min-h-[250px] flex flex-col items-center justify-center group">
                 {/* Eye Animation SVG */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.05),transparent_70%)] pointer-events-none"></div>
                 <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                     <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                         <g className="origin-center animate-spin-slow opacity-50">{[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (<path key={deg} d="M50 10 L55 25 L45 25 Z" fill="var(--hell-900)" stroke="var(--hell-700)" strokeWidth="0.5" transform={`rotate(${deg} 50 50)`} />))}<circle cx="50" cy="50" r="35" fill="none" stroke="var(--hell-600)" strokeWidth="0.5" strokeDasharray="3 2" /></g>
                         <g className="origin-center animate-spin-reverse opacity-40"><circle cx="50" cy="50" r="42" fill="none" stroke="var(--hell-500)" strokeWidth="1" strokeDasharray="10 10" /></g>
                         <g className="animate-pulse-demonic"><ellipse cx="50" cy="50" rx="28" ry="18" fill="#000000" stroke="var(--hell-600)" strokeWidth="1" /><g className="animate-pupil-move"><circle cx="50" cy="50" r="11" fill="#ff4500" className="animate-flicker" /><ellipse cx="50" cy="50" rx="2" ry="10" fill="#000000" /><circle cx="54" cy="46" r="2" fill="#ffffff" opacity="0.8" /></g></g>
                     </svg>
                 </div>
                 <p className="text-hell-500 font-cinzel text-lg animate-pulse tracking-widest">{t.emptyStateTitle}</p>
                 <p className="text-text-secondary text-xs mt-2 uppercase tracking-widest font-serif">{t.emptyStateDesc}</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {filteredTasks.map(task => (
                  <div key={task.id} draggable={taskSort === 'MANUAL'} onDragStart={(e) => onDragStart(e, task.id)} onDragOver={(e) => onDragOver(e, task.id)} onDragEnd={onDragEnd} className={draggedTaskId === task.id ? 'opacity-30' : ''}>
                    <TaskCard task={task} sigil={getSigil(task.sigilId)} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onEdit={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }} onToggleSubtask={handleToggleSubtask} isDraggable={taskSort === 'MANUAL'} lang={lang} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Other views (history, finance, analytics, grimoire) are rendered similarly */}
        {view === 'history' && (
             <>
                <div className="flex justify-between items-center mb-6"><h2 className="text-xl text-hell-gold font-cinzel">{t.historyHeader}</h2></div>
                {historyTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-hell-500 font-cinzel text-lg animate-pulse tracking-widest">{t.emptyStateTitle}</p>
                        <p className="text-text-secondary text-xs mt-2 uppercase tracking-widest font-serif">{t.emptyStateDesc}</p>
                    </div>
                ) : (
                    <>
                        <div className="opacity-80 grayscale-[50%] pointer-events-none select-none grid gap-3">{paginatedHistoryTasks.map(task => (<TaskCard key={task.id} task={task} sigil={getSigil(task.sigilId)} onComplete={()=>{}} onDelete={()=>{}} onEdit={()=>{}} isHistoryView={true} lang={lang} />))}</div>
                        {totalHistoryPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-4 mb-6">
                                <button
                                    onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
                                    disabled={historyPage === 1}
                                    className={`px-3 py-1 text-xs border border-hell-700 font-cinzel uppercase transition ${
                                        historyPage === 1
                                            ? 'opacity-30 cursor-not-allowed text-text-muted'
                                            : 'text-hell-gold hover:bg-hell-800 hover:border-hell-gold'
                                    }`}
                                >
                                    ← {t.previous}
                                </button>
                                <span className="text-text-secondary text-xs font-cinzel uppercase">
                                    {t.page} {historyPage} {t.of} {totalHistoryPages}
                                </span>
                                <button
                                    onClick={() => setHistoryPage(prev => Math.min(totalHistoryPages, prev + 1))}
                                    disabled={historyPage === totalHistoryPages}
                                    className={`px-3 py-1 text-xs border border-hell-700 font-cinzel uppercase transition ${
                                        historyPage === totalHistoryPages
                                            ? 'opacity-30 cursor-not-allowed text-text-muted'
                                            : 'text-hell-gold hover:bg-hell-800 hover:border-hell-gold'
                                    }`}
                                >
                                    {t.next} →
                                </button>
                            </div>
                        )}
                    </>
                )}
             </>
        )}
        {view === 'finance' && (
            <>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl text-hell-gold font-cinzel">{t.financeHeader}</h2>
                        <div className="flex gap-2 mt-2">
                            <select value={finFilterType} onChange={(e) => setFinFilterType(e.target.value as any)} className="bg-bg-panel border border-hell-700 text-[10px] uppercase text-text-secondary p-1 outline-none focus:border-hell-gold"><option value="ALL">{t.filterAll}</option><option value={TransactionType.TRIBUTE}>{t.tribute}</option><option value={TransactionType.SACRIFICE}>{t.sacrifice}</option></select>
                             <select value={finSort} onChange={(e) => setFinSort(e.target.value as any)} className="bg-bg-panel border border-hell-700 text-[10px] uppercase text-text-secondary p-1 outline-none focus:border-hell-gold"><option value="DATE_DESC">{t.sortNewest}</option><option value="AMT_DESC">{t.sortGoldDesc}</option><option value="AMT_ASC">{t.sortGoldAsc}</option></select>
                        </div>
                    </div>
                    <HellButton variant="gold" onClick={() => { setEditingTransaction(null); setIsFinanceModalOpen(true); }} className="text-xs">{t.addRecord}</HellButton>
                </div>
                <div className="bg-bg-panel border border-hell-700 rounded overflow-hidden mb-6 shadow-lg overflow-x-auto"><table className="w-full text-left text-sm min-w-[300px]"><thead className="bg-hell-800 text-hell-500 font-cinzel uppercase tracking-wider text-xs"><tr><th className="p-3 rtl:text-right">{t.tableDate}</th><th className="p-3 rtl:text-right">{t.tableDesc}</th><th className="p-3 text-right rtl:text-left">{t.tableGold}</th><th className="p-3 w-16 text-center"></th></tr></thead><tbody className="divide-y divide-hell-700/50 text-xs sm:text-sm">{filteredTransactions.length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-text-secondary italic">{t.emptyFinance}</td></tr>)}{paginatedTransactions.map(tr => { const sigil = getSigil(tr.sigilId); const amount = typeof tr.amount === 'number' ? tr.amount : parseFloat(tr.amount) || 0; return (<tr key={tr.id} className="group hover:bg-hell-800/30 transition"><td className="p-3 text-text-muted font-mono whitespace-nowrap">{new Date(tr.date).toLocaleDateString()}{sigil && (<div className="mt-1 text-[9px] px-1 rounded w-fit text-bg-app font-bold" style={{backgroundColor: sigil.color}}>{sigil.title}</div>)}</td><td className="p-3 text-text-primary font-medium truncate max-w-[150px]">{tr.title}</td><td className={`p-3 text-right rtl:text-left font-mono font-bold ${tr.type === TransactionType.TRIBUTE ? 'text-hell-gold' : 'text-red-500'}`}>{tr.type === TransactionType.TRIBUTE ? '+' : '-'}{amount.toFixed(2)}</td><td className="p-3 text-center"><button onClick={() => openEditTransaction(tr)} className="text-text-secondary hover:text-hell-gold mr-2">✏️</button><button onClick={() => requestDeleteItem(tr.id, 'transaction')} className="text-text-secondary hover:text-red-600">✖</button></td></tr>);})}</tbody></table></div>
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-4 mb-6">
                        <button
                            onClick={() => setFinancePage(prev => Math.max(1, prev - 1))}
                            disabled={financePage === 1}
                            className={`px-3 py-1 text-xs border border-hell-700 font-cinzel uppercase transition ${
                                financePage === 1
                                    ? 'opacity-30 cursor-not-allowed text-text-muted'
                                    : 'text-hell-gold hover:bg-hell-800 hover:border-hell-gold'
                            }`}
                        >
                            ← {t.previous}
                        </button>
                        <span className="text-text-secondary text-xs font-cinzel uppercase">
                            {t.page} {financePage} {t.of} {totalPages}
                        </span>
                        <button
                            onClick={() => setFinancePage(prev => Math.min(totalPages, prev + 1))}
                            disabled={financePage === totalPages}
                            className={`px-3 py-1 text-xs border border-hell-700 font-cinzel uppercase transition ${
                                financePage === totalPages
                                    ? 'opacity-30 cursor-not-allowed text-text-muted'
                                    : 'text-hell-gold hover:bg-hell-800 hover:border-hell-gold'
                            }`}
                        >
                            {t.next} →
                        </button>
                    </div>
                )}
            </>
        )}
        {view === 'analytics' && (<AnalyticsView transactions={transactions} completedTasks={allCompletedTasks} rituals={rituals} notes={notes} achievements={achievements} lang={lang} />)}
        {view === 'calendar' && (<CalendarView tasks={tasks} rituals={rituals} transactions={transactions} notes={notes} lang={lang} />)}
        {view === 'grimoire' && (
            <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"><h2 className="text-xl text-hell-gold font-cinzel">{t.grimoireHeader}</h2><HellButton variant="gold" onClick={() => { setEditingNote(null); setIsGrimoireModalOpen(true); }} className="text-xs">{t.newScroll}</HellButton></div>
                {filteredNotes.length === 0 ? (<div className="text-center py-12 border border-hell-700/50 bg-bg-panel/30"><div className="text-4xl mb-2 opacity-50">📜</div><p className="text-text-secondary font-serif italic text-sm">{t.emptyGrimoire}</p></div>) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{paginatedNotes.map(note => (<GrimoireCard key={note.id} note={note} sigil={getSigil(note.sigilId)} onEdit={(n) => { setEditingNote(n); setIsGrimoireModalOpen(true); }} onDelete={(id) => requestDeleteItem(id, 'note')} lang={lang} />))}</div>
                        {totalNotesPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-4 mb-6">
                                <button
                                    onClick={() => setGrimoirePage(prev => Math.max(1, prev - 1))}
                                    disabled={grimoirePage === 1}
                                    className={`px-3 py-1 text-xs border border-hell-700 font-cinzel uppercase transition ${
                                        grimoirePage === 1
                                            ? 'opacity-30 cursor-not-allowed text-text-muted'
                                            : 'text-hell-gold hover:bg-hell-800 hover:border-hell-gold'
                                    }`}
                                >
                                    ← {t.previous}
                                </button>
                                <span className="text-text-secondary text-xs font-cinzel uppercase">
                                    {t.page} {grimoirePage} {t.of} {totalNotesPages}
                                </span>
                                <button
                                    onClick={() => setGrimoirePage(prev => Math.min(totalNotesPages, prev + 1))}
                                    disabled={grimoirePage === totalNotesPages}
                                    className={`px-3 py-1 text-xs border border-hell-700 font-cinzel uppercase transition ${
                                        grimoirePage === totalNotesPages
                                            ? 'opacity-30 cursor-not-allowed text-text-muted'
                                            : 'text-hell-gold hover:bg-hell-800 hover:border-hell-gold'
                                    }`}
                                >
                                    {t.next} →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </>
        )}
          </>
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-bg-panel py-2 text-center border-t border-hell-800 z-20 shadow-lg">
          <p className="text-[9px] text-text-muted font-cinzel uppercase opacity-70 px-4 truncate">{t.footerSpell}</p>
      </footer>

      {/* Modals */}
      <AddSoulModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onSave={handleSaveTask} editingTask={editingTask} sigils={sigils} lang={lang} />
      <AddTransactionModal isOpen={isFinanceModalOpen} onClose={() => setIsFinanceModalOpen(false)} onSave={handleSaveTransaction} editingTransaction={editingTransaction} sigils={sigils} lang={lang} />
      <AddRitualModal isOpen={isRitualModalOpen} onClose={() => setIsRitualModalOpen(false)} onSave={handleAddRitual} lang={lang} />
      <AddGrimoireModal isOpen={isGrimoireModalOpen} onClose={() => setIsGrimoireModalOpen(false)} onSave={handleSaveNote} editingNote={editingNote} sigils={sigils} lang={lang} />
      <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={confirmDeleteItem} message={itemToDelete?.type === 'note' ? t.deleteNoteConfirm : t.deleteTransConfirm} lang={lang} />
      <CritModal isOpen={isCritModalOpen} onClose={() => setIsCritModalOpen(false)} lang={lang} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} lang={lang} theme={theme} onSetLang={setLang} onSetTheme={setTheme} user={user} />
      
      {/* Offline Indicator */}
      <OfflineIndicator isOnline={isOnline} isSyncing={isSyncing} lang={lang} />
    </div>
  );
};

export default App;
