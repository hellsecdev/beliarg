
import React, { useState, useMemo } from 'react';
import { Task, Ritual, Transaction, Note } from '../types';
import { translations, Language } from '../translations';

interface CalendarViewProps {
  tasks: Task[];
  rituals: Ritual[];
  transactions: Transaction[];
  notes: Note[];
  lang: Language;
}

interface DayData {
  date: Date;
  tasks: Task[];
  rituals: Ritual[];
  transactions: Transaction[];
  notes: Note[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, rituals, transactions, notes, lang }) => {
  const t = useMemo(() => translations[lang], [lang]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Normalize date to YYYY-MM-DD format using local time
  const normalizeDateKey = (date: Date | string | number): string => {
    let dateObj: Date;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = new Date(date);
    }
    
    // Use local time to avoid timezone issues
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Group data by date for the current month
  const dataByDate = useMemo(() => {
    const map = new Map<string, DayData>();

    // Process tasks
    tasks.forEach(task => {
      // For completed tasks, use completedAt if available, otherwise deadline
      // For incomplete tasks, use deadline
      let taskDate: Date;
      if (task.isCompleted && task.completedAt) {
        taskDate = new Date(task.completedAt);
      } else {
        taskDate = new Date(task.deadline);
      }
      
      // Filter by current month and year
      if (taskDate.getMonth() === month && taskDate.getFullYear() === year) {
        const dateKey = normalizeDateKey(taskDate);
        if (!map.has(dateKey)) {
          map.set(dateKey, {
            date: taskDate,
            tasks: [],
            rituals: [],
            transactions: [],
            notes: []
          });
        }
        map.get(dateKey)!.tasks.push(task);
      }
    });

    // Process rituals
    rituals.forEach(ritual => {
      const ritualDate = new Date(ritual.lastPerformed);
      // Filter by current month and year
      if (ritualDate.getMonth() === month && ritualDate.getFullYear() === year) {
        const dateKey = normalizeDateKey(ritualDate);
        if (!map.has(dateKey)) {
          map.set(dateKey, {
            date: ritualDate,
            tasks: [],
            rituals: [],
            transactions: [],
            notes: []
          });
        }
        map.get(dateKey)!.rituals.push(ritual);
      }
    });

    // Process transactions
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      // Filter by current month and year
      if (transactionDate.getMonth() === month && transactionDate.getFullYear() === year) {
        const dateKey = normalizeDateKey(transactionDate);
        if (!map.has(dateKey)) {
          map.set(dateKey, {
            date: transactionDate,
            tasks: [],
            rituals: [],
            transactions: [],
            notes: []
          });
        }
        map.get(dateKey)!.transactions.push(transaction);
      }
    });

    // Process notes
    notes.forEach(note => {
      const noteDate = new Date(note.createdAt);
      // Filter by current month and year
      if (noteDate.getMonth() === month && noteDate.getFullYear() === year) {
        const dateKey = normalizeDateKey(noteDate);
        if (!map.has(dateKey)) {
          map.set(dateKey, {
            date: noteDate,
            tasks: [],
            rituals: [],
            transactions: [],
            notes: []
          });
        }
        map.get(dateKey)!.notes.push(note);
      }
    });

    return map;
  }, [tasks, rituals, transactions, notes, month, year]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{ date: Date; isCurrentMonth: boolean; dateKey: string }> = [];

    // Add previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        dateKey: normalizeDateKey(date)
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dateKey: normalizeDateKey(date)
      });
    }

    // Add next month's leading days to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        dateKey: normalizeDateKey(date)
      });
    }

    return days;
  }, [year, month]);

  const monthNames = lang === 'ru'
    ? ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    : lang === 'he'
    ? ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = lang === 'ru'
    ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    : lang === 'he'
    ? ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (dateKey: string, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      setSelectedDay(dateKey);
    }
  };

  const selectedDayData = selectedDay ? dataByDate.get(selectedDay) : null;

  return (
    <div className="animate-flicker">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6 border-b border-hell-700 pb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="text-hell-gold hover:text-hell-lava text-xl font-bold px-3 py-1"
        >
          ←
        </button>
        <h2 className="text-xl font-cinzel text-hell-gold uppercase tracking-widest">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="text-hell-gold hover:text-hell-lava text-xl font-bold px-3 py-1"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-bg-panel border border-hell-700 p-4 rounded-sm">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, idx) => (
            <div key={idx} className="text-center text-xs text-hell-500 font-cinzel uppercase py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const dayData = dataByDate.get(day.dateKey);
            const hasEvents = dayData && (
              dayData.tasks.length > 0 ||
              dayData.rituals.length > 0 ||
              dayData.transactions.length > 0 ||
              dayData.notes.length > 0
            );

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(day.dateKey, day.isCurrentMonth)}
                className={`
                  aspect-square border border-hell-700 p-1 rounded-sm
                  ${day.isCurrentMonth ? 'bg-bg-app hover:bg-hell-800/50 cursor-pointer' : 'bg-hell-900/30 opacity-50'}
                  ${hasEvents ? 'border-hell-gold/50' : ''}
                  transition-all
                `}
              >
                <div className="text-xs text-text-secondary mb-1">
                  {day.date.getDate()}
                </div>
                {hasEvents && day.isCurrentMonth && (
                  <div className="flex flex-wrap gap-0.5">
                    {dayData!.tasks.length > 0 && (
                      <div className="w-1.5 h-1.5 bg-hell-lava rounded-full" title={`${dayData!.tasks.length} tasks`} />
                    )}
                    {dayData!.rituals.length > 0 && (
                      <div className="w-1.5 h-1.5 bg-hell-gold rounded-full" title={`${dayData!.rituals.length} rituals`} />
                    )}
                    {dayData!.transactions.length > 0 && (
                      <div className="w-1.5 h-1.5 bg-hell-500 rounded-full" title={`${dayData!.transactions.length} transactions`} />
                    )}
                    {dayData!.notes.length > 0 && (
                      <div className="w-1.5 h-1.5 bg-hell-700 rounded-full" title={`${dayData!.notes.length} notes`} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Modal */}
      {selectedDay && selectedDayData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDay(null)}>
          <div
            className="bg-bg-panel border border-hell-gold p-6 rounded-sm max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-hell-gold font-cinzel text-lg uppercase">
                {new Date(selectedDay).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'he' ? 'he-IL' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-hell-gold hover:text-hell-lava text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Tasks */}
              {selectedDayData.tasks.length > 0 && (
                <div>
                  <h4 className="text-hell-lava font-cinzel text-sm uppercase mb-2">
                    {lang === 'ru' ? 'Задачи' : lang === 'he' ? 'משימות' : 'Tasks'} ({selectedDayData.tasks.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDayData.tasks.map(task => (
                      <div key={task.id} className="p-2 border border-hell-800 rounded-sm">
                        <div className="text-sm text-text-primary">{task.title}</div>
                        {task.isCompleted && (
                          <div className="text-xs text-hell-gold mt-1">
                            {lang === 'ru' ? 'Выполнено' : lang === 'he' ? 'הושלם' : 'Completed'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rituals - View only, no click */}
              {selectedDayData.rituals.length > 0 && (
                <div>
                  <h4 className="text-hell-gold font-cinzel text-sm uppercase mb-2">
                    {lang === 'ru' ? 'Ритуалы' : lang === 'he' ? 'טקסים' : 'Rituals'} ({selectedDayData.rituals.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDayData.rituals.map(ritual => (
                      <div
                        key={ritual.id}
                        className="p-2 border border-hell-800 rounded-sm"
                      >
                        <div className="text-sm text-text-primary">{ritual.title}</div>
                        <div className="text-xs text-text-muted mt-1">
                          {lang === 'ru' ? 'Серия' : lang === 'he' ? 'רצף' : 'Streak'}: {ritual.streak}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {selectedDayData.transactions.length > 0 && (
                <div>
                  <h4 className="text-hell-500 font-cinzel text-sm uppercase mb-2">
                    {lang === 'ru' ? 'Транзакции' : lang === 'he' ? 'עסקאות' : 'Transactions'} ({selectedDayData.transactions.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDayData.transactions.map(transaction => (
                      <div key={transaction.id} className="p-2 border border-hell-800 rounded-sm">
                        <div className="text-sm text-text-primary">{transaction.title}</div>
                        <div className={`text-xs mt-1 ${transaction.type === 'TRIBUTE' ? 'text-hell-gold' : 'text-red-500'}`}>
                          {transaction.type === 'TRIBUTE' ? '+' : '-'}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedDayData.notes.length > 0 && (
                <div>
                  <h4 className="text-hell-700 font-cinzel text-sm uppercase mb-2">
                    {lang === 'ru' ? 'Заметки' : lang === 'he' ? 'הערות' : 'Notes'} ({selectedDayData.notes.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDayData.notes.map(note => (
                      <div key={note.id} className="p-2 border border-hell-800 rounded-sm">
                        <div className="text-sm text-text-primary">{note.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDayData.tasks.length === 0 &&
                selectedDayData.rituals.length === 0 &&
                selectedDayData.transactions.length === 0 &&
                selectedDayData.notes.length === 0 && (
                  <div className="text-center text-text-muted text-sm py-4">
                    {lang === 'ru' ? 'Нет событий в этот день' : lang === 'he' ? 'אין אירועים ביום זה' : 'No events on this day'}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



