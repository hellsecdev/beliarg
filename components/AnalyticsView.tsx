
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Task } from '../types';
import { translations, Language } from '../translations';

interface AnalyticsViewProps {
  transactions: Transaction[];
  completedTasks: Task[]; // NEW PROP: Need task history for Heatmap
  lang: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions, completedTasks, lang }) => {
  const t = translations[lang];
  
  // --- HEATMAP LOGIC ---
  const heatmapData = useMemo(() => {
      // Debug logging
      console.log('[Heatmap] Total completed tasks:', completedTasks.length);
      const tasksWithCompletedAt = completedTasks.filter(t => t.completedAt);
      const tasksWithoutCompletedAt = completedTasks.filter(t => !t.completedAt);
      console.log('[Heatmap] Tasks with completedAt:', tasksWithCompletedAt.length);
      console.log('[Heatmap] Tasks without completedAt (will use createdAt):', tasksWithoutCompletedAt.length);
      
      // Generate last 365 days
      const days = [];
      const today = new Date();
      const activityMap = new Map<string, number>();
      
      // Map completed tasks to YYYY-MM-DD
      // Use completedAt if available, otherwise fallback to createdAt for old tasks
      completedTasks.forEach(task => {
          const timestamp = task.completedAt || task.createdAt;
          if (timestamp) {
              try {
                  const date = new Date(timestamp);
                  if (!isNaN(date.getTime())) {
                      const dateStr = date.toISOString().split('T')[0];
                      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
                  } else {
                      console.warn('[Heatmap] Invalid timestamp for task:', task.id, timestamp);
                  }
              } catch (e) {
                  console.error('[Heatmap] Error processing task date:', task.id, e);
              }
          }
      });

      console.log('[Heatmap] Activity map entries:', activityMap.size);
      const totalCount = Array.from(activityMap.values()).reduce((sum, count) => sum + count, 0);
      console.log('[Heatmap] Total activity count:', totalCount);

      // Fill last 364 days + today
      for (let i = 364; i >= 0; i--) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          days.push({
              date: dateStr,
              count: activityMap.get(dateStr) || 0
          });
      }
      return days;
  }, [completedTasks]);

  const getHeatmapColor = (count: number) => {
      if (count === 0) return 'bg-hell-900/50';
      if (count === 1) return 'bg-hell-700';
      if (count <= 3) return 'bg-hell-lava';
      return 'bg-hell-gold';
  };

  // --- FINANCE LOGIC ---
  // Get available years from transactions, default to current year
  const availableYears = useMemo(() => {
    const years = new Set<number>(transactions.map(t => new Date(t.date).getFullYear()));
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a: number, b: number) => b - a);
  }, [transactions]);

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  // Aggregate data for the selected year
  const { monthlyStats, yearlyIncome, yearlyExpense, maxMonthlyValue } = useMemo(() => {
      const stats = Array.from({ length: 12 }, (_, i) => ({
          monthIndex: i,
          income: 0,
          expense: 0,
          net: 0,
          transactions: [] as Transaction[]
      }));

      let yIncome = 0;
      let yExpense = 0;
      let maxVal = 0;

      transactions.forEach(tr => {
          const date = new Date(tr.date);
          if (date.getFullYear() === selectedYear) {
              const m = date.getMonth();
              const amount = typeof tr.amount === 'number' ? tr.amount : parseFloat(tr.amount) || 0;
              stats[m].transactions.push(tr);
              if (tr.type === TransactionType.TRIBUTE) {
                  stats[m].income += amount;
                  stats[m].net += amount;
                  yIncome += amount;
              } else {
                  stats[m].expense += amount;
                  stats[m].net -= amount;
                  yExpense += amount;
              }
          }
      });
      
      // Find max value for chart scaling
      stats.forEach(s => {
          maxVal = Math.max(maxVal, s.income, s.expense);
      });
      
      // Sort detail transactions by date
      stats.forEach(s => s.transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

      return { monthlyStats: stats, yearlyIncome: yIncome, yearlyExpense: yExpense, maxMonthlyValue: maxVal };
  }, [transactions, selectedYear]);

  const yearlyNet = yearlyIncome - yearlyExpense;
  const monthNames = lang === 'ru' 
    ? ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const toggleMonth = (idx: number) => {
      setExpandedMonth(expandedMonth === idx ? null : idx);
  };

  const changeYear = (delta: number) => {
      const currentIndex = availableYears.indexOf(selectedYear);
      const newIndex = currentIndex + delta;
      if (newIndex >= 0 && newIndex < availableYears.length) {
          setSelectedYear(availableYears[newIndex]);
          setExpandedMonth(null); // Close expansions on year change
      }
  };

  return (
    <div className="animate-flicker">
        
        {/* HEATMAP SECTION */}
        <div className="mb-8 bg-bg-panel border border-hell-700 p-4 rounded-sm">
            <h3 className="text-xs font-cinzel text-hell-gold uppercase tracking-widest mb-4 flex justify-between items-center">
                {t.heatmapTitle}
                <span className="text-[9px] text-text-muted font-mono">365 DAYS</span>
            </h3>
            <div className="flex flex-wrap gap-1 justify-center">
                {heatmapData.map((day, i) => (
                    <div 
                        key={i} 
                        title={`${day.date}: ${day.count}`}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-[1px] ${getHeatmapColor(day.count)}`}
                    />
                ))}
            </div>
            <div className="flex justify-end items-center gap-2 mt-2 text-[9px] text-text-muted uppercase">
                <span>{t.less}</span>
                <div className="w-2 h-2 bg-hell-900/50"></div>
                <div className="w-2 h-2 bg-hell-700"></div>
                <div className="w-2 h-2 bg-hell-lava"></div>
                <div className="w-2 h-2 bg-hell-gold"></div>
                <span>{t.more}</span>
            </div>
        </div>

        {/* Header with Year Selector */}
        <div className="flex justify-between items-center mb-6 border-b border-hell-700 pb-4">
            <h2 className="text-xl font-cinzel text-hell-gold uppercase tracking-widest">{t.analyticsHeader}</h2>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => changeYear(1)} 
                    disabled={availableYears.indexOf(selectedYear) >= availableYears.length - 1}
                    className="text-hell-gold hover:text-hell-lava disabled:opacity-20 disabled:cursor-not-allowed text-xl font-bold p-1"
                >
                    &lt;
                </button>
                <span className="font-horror text-2xl text-text-primary min-w-[80px] text-center">{selectedYear}</span>
                <button 
                    onClick={() => changeYear(-1)}
                    disabled={availableYears.indexOf(selectedYear) <= 0}
                    className="text-hell-gold hover:text-hell-lava disabled:opacity-20 disabled:cursor-not-allowed text-xl font-bold p-1"
                >
                    &gt;
                </button>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2 mb-8 text-center">
             <div className="bg-bg-panel border border-hell-700 p-3 rounded-sm">
                 <div className="text-[10px] uppercase text-hell-500 tracking-widest mb-1">{t.income}</div>
                 <div className="text-hell-gold font-mono text-sm font-bold">+{(typeof yearlyIncome === 'number' ? yearlyIncome : 0).toFixed(0)}</div>
             </div>
             <div className="bg-bg-panel border border-hell-700 p-3 rounded-sm">
                 <div className="text-[10px] uppercase text-text-muted tracking-widest mb-1">{t.expense}</div>
                 <div className="text-red-500 font-mono text-sm font-bold">-{(typeof yearlyExpense === 'number' ? yearlyExpense : 0).toFixed(0)}</div>
             </div>
             <div className="bg-bg-panel border border-hell-gold/50 p-3 rounded-sm shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                 <div className="text-[10px] uppercase text-hell-lava tracking-widest mb-1">{t.net}</div>
                 <div className={`font-mono text-sm font-bold ${yearlyNet >= 0 ? 'text-hell-gold' : 'text-red-500'}`}>
                     {yearlyNet >= 0 ? '+' : ''}{(typeof yearlyNet === 'number' ? yearlyNet : 0).toFixed(0)}
                 </div>
             </div>
        </div>
        
        {/* Visual Charts */}
        <div className="mb-8 bg-bg-panel border border-hell-700 p-4 rounded-sm">
            <h3 className="text-xs font-cinzel text-hell-gold uppercase tracking-widest mb-4 text-center">{t.chartTitle}</h3>
            <div className="flex justify-between items-end h-32 sm:h-40 gap-1 sm:gap-2 pb-2 border-b border-hell-700">
                {monthlyStats.map((stat, idx) => {
                    const incomeH = maxMonthlyValue > 0 ? (stat.income / maxMonthlyValue) * 100 : 0;
                    const expenseH = maxMonthlyValue > 0 ? (stat.expense / maxMonthlyValue) * 100 : 0;
                    
                    return (
                        <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full gap-[1px] group">
                            {/* Bars Container */}
                            <div className="w-full flex justify-center items-end gap-[1px] h-full px-[1px]">
                                {stat.income > 0 && (
                                    <div 
                                        className="w-1.5 sm:w-3 bg-hell-gold transition-all duration-700 hover:opacity-80" 
                                        style={{ height: `${Math.max(5, incomeH)}%` }} 
                                        title={`${t.income}: ${stat.income}`}
                                    />
                                )}
                                {stat.expense > 0 && (
                                    <div 
                                        className="w-1.5 sm:w-3 bg-red-600 transition-all duration-700 hover:opacity-80" 
                                        style={{ height: `${Math.max(5, expenseH)}%` }}
                                        title={`${t.expense}: ${stat.expense}`}
                                    />
                                )}
                            </div>
                            <div className="mt-1 text-[8px] sm:text-[10px] text-text-muted uppercase font-mono">
                                {monthNames[idx][0]}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Monthly Table */}
        <div className="bg-bg-panel border border-hell-700 rounded overflow-hidden shadow-lg">
            <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-hell-800 text-hell-500 font-cinzel uppercase tracking-wider text-xs">
                    <tr>
                        <th className="p-3 pl-4">{t.month}</th>
                        <th className="p-3 text-right text-hell-gold hidden sm:table-cell">{t.income}</th>
                        <th className="p-3 text-right text-red-400 hidden sm:table-cell">{t.expense}</th>
                        <th className="p-3 text-right pr-4">{t.net}</th>
                    </tr>
                </thead>
                <tbody className="text-xs sm:text-sm">
                    {monthlyStats.map((stat, idx) => {
                        const isExpanded = expandedMonth === idx;
                        return (
                            <React.Fragment key={idx}>
                                <tr 
                                    onClick={() => toggleMonth(idx)} 
                                    className={`transition cursor-pointer border-b border-hell-700/30 ${isExpanded ? 'bg-hell-800/50 border-hell-gold/30' : 'hover:bg-hell-800/30'}`}
                                >
                                    <td className="p-3 pl-4 flex items-center gap-2">
                                        <span className={`text-[10px] transition-transform duration-300 ${isExpanded ? 'rotate-90 text-hell-gold' : 'text-text-muted'}`}>▶</span>
                                        <span className={`font-cinzel uppercase ${stat.monthIndex === new Date().getMonth() && selectedYear === new Date().getFullYear() ? 'text-hell-lava' : 'text-text-secondary'}`}>
                                            {monthNames[idx]}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right text-hell-gold/80 font-mono opacity-80 hidden sm:table-cell">
                                        {stat.income > 0 ? `+${(typeof stat.income === 'number' ? stat.income : 0).toFixed(0)}` : '-'}
                                    </td>
                                    <td className="p-3 text-right text-red-500/80 font-mono opacity-80 hidden sm:table-cell">
                                        {stat.expense > 0 ? `-${(typeof stat.expense === 'number' ? stat.expense : 0).toFixed(0)}` : '-'}
                                    </td>
                                    <td className={`p-3 pr-4 text-right font-mono font-bold ${stat.net > 0 ? 'text-hell-gold' : stat.net < 0 ? 'text-red-500' : 'text-text-muted'}`}>
                                        {(typeof stat.net === 'number' ? stat.net : 0).toFixed(0)}
                                    </td>
                                </tr>
                                
                                {/* Expanded Details Row */}
                                {isExpanded && (
                                    <tr>
                                        <td colSpan={4} className="bg-black/40 p-0 shadow-inner">
                                            <div className="p-3 sm:p-4 border-l-2 border-hell-gold/30 ml-1 sm:ml-2">
                                                {stat.transactions.length === 0 ? (
                                                    <p className="text-text-muted italic text-xs text-center py-2">{t.noTransInMonth}</p>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        {stat.transactions.map(tr => (
                                                            <div key={tr.id} className="flex justify-between items-center text-xs border-b border-white/5 pb-1 last:border-0">
                                                                <div className="flex flex-col">
                                                                    <span className="text-text-primary font-medium">{tr.title}</span>
                                                                    <span className="text-[10px] text-text-muted font-mono">{new Date(tr.date).toLocaleDateString()}</span>
                                                                </div>
                                                                <span className={`font-mono font-bold ${tr.type === TransactionType.TRIBUTE ? 'text-hell-gold' : 'text-red-500'}`}>
                                                                    {tr.type === TransactionType.TRIBUTE ? '+' : '-'}{(typeof tr.amount === 'number' ? tr.amount : parseFloat(tr.amount) || 0).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
        
        <div className="mt-8 text-center">
             <p className="text-xs font-serif italic text-text-muted opacity-60">
                 {yearlyNet >= 0 ? `"${t.yearlySurplus}"` : `"${t.yearlyDebt}"`}
             </p>
        </div>
    </div>
  );
};
