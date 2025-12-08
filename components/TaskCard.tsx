
import React, { useState, useRef, useMemo } from 'react';
import { Task, Difficulty, Sigil } from '../types';
import { HellButton } from './HellButton';
import { translations, Language } from '../translations';

interface TaskCardProps {
  task: Task;
  sigil?: Sigil;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  isHistoryView?: boolean;
  isDraggable?: boolean;
  lang: Language;
}

const difficultyColor = {
  [Difficulty.ASH]: 'text-text-muted border-hell-700',
  [Difficulty.EMBER]: 'text-hell-lava border-hell-600',
  [Difficulty.INFERNO]: 'text-hell-500 border-hell-500 animate-pulse',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, sigil, onComplete, onDelete, onEdit, onToggleSubtask, isHistoryView = false, isDraggable = false, lang }) => {
  const isOverdue = !task.isCompleted && new Date(task.deadline).getTime() < Date.now();
  const t = useMemo(() => translations[lang], [lang]);
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.isCompleted).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;

  // --- Swipe Logic ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const SWIPE_THRESHOLD = 100;

  const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
      if (touchStart === null) return;
      const currentTouch = e.targetTouches[0].clientX;
      const diff = currentTouch - touchStart;
      
      // Only limit drag to reasonable bounds visually
      if (diff > -150 && diff < 150) {
          setTranslateX(diff);
      }
  };

  const onTouchEnd = () => {
      if (!touchStart) return;
      
      if (translateX > SWIPE_THRESHOLD && !isHistoryView) {
          // Swipe Right -> Complete
          if (navigator.vibrate) navigator.vibrate(50);
          onComplete(task.id);
      } else if (translateX < -SWIPE_THRESHOLD && !isHistoryView) {
          // Swipe Left -> Delete
          if (navigator.vibrate) navigator.vibrate(100);
          if (confirm(t.confirmDelete)) {
              onDelete(task.id);
          }
      }

      setTouchStart(null);
      setTouchEnd(null);
      setTranslateX(0);
  };
  
  const swipeOpacity = Math.min(Math.abs(translateX) / SWIPE_THRESHOLD, 1);
  const swipeColor = translateX > 0 ? 'bg-green-900' : 'bg-red-900';
  const swipeText = translateX > 0 ? t.slideComplete : t.slideDelete;

  return (
    <div className="relative overflow-hidden rounded-sm shadow-sm">
        {/* Swipe Background Layer */}
        {!isHistoryView && (
            <div 
                className={`absolute inset-0 flex items-center px-6 justify-between ${swipeColor} transition-colors`}
                style={{ opacity: swipeOpacity }}
            >
                <span className={`font-cinzel font-bold text-white ${translateX > 0 ? 'opacity-100' : 'opacity-0'}`}>{t.slideComplete}</span>
                <span className={`font-cinzel font-bold text-white ${translateX < 0 ? 'opacity-100' : 'opacity-0'}`}>{t.slideDelete}</span>
            </div>
        )}

        <div 
            ref={cardRef}
            onTouchStart={isDraggable ? undefined : onTouchStart}
            onTouchMove={isDraggable ? undefined : onTouchMove}
            onTouchEnd={isDraggable ? undefined : onTouchEnd}
            style={{ transform: `translateX(${translateX}px)` }}
            className={`relative group bg-bg-panel border ${isOverdue ? 'border-red-600' : 'border-hell-700'} p-3 sm:p-4 transition-transform duration-200 hover:border-hell-gold overflow-hidden ${isDraggable ? 'cursor-move active:cursor-grabbing' : ''}`}
        >
            
            {/* Corner Accents (Titan Bones) */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-hell-ash opacity-50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-hell-ash opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-hell-ash opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-hell-ash opacity-50"></div>

            {/* Lava Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-hell-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Drag Handle for Manual Sort */}
            {isDraggable && (
                <div className="absolute right-2 top-2 text-hell-700 opacity-50 group-hover:opacity-100 transition-opacity z-20">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="8" cy="6" r="1" />
                        <circle cx="8" cy="12" r="1" />
                        <circle cx="8" cy="18" r="1" />
                        <circle cx="16" cy="6" r="1" />
                        <circle cx="16" cy="12" r="1" />
                        <circle cx="16" cy="18" r="1" />
                    </svg>
                </div>
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-1 w-full pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-horror text-base sm:text-lg font-bold tracking-wide break-words leading-tight ${task.isCompleted ? 'text-text-muted line-through decoration-hell-500' : 'text-text-primary'}`}>
                        {task.title}
                        </h3>
                        {isOverdue && !task.isCompleted && (
                        <span className="text-[9px] sm:text-[10px] font-bold text-red-500 border border-red-900 px-1 bg-bg-app">{t.overdue}</span>
                        )}
                    </div>
                    <div className="flex gap-2 mt-1">
                        <span className={`text-[9px] sm:text-[10px] w-fit px-2 py-0.5 border rounded-sm uppercase tracking-widest ${difficultyColor[task.difficulty]}`}>
                            {task.difficulty}
                        </span>
                        {sigil && (
                            <span className="text-[9px] sm:text-[10px] w-fit px-2 py-0.5 border border-transparent rounded-sm uppercase tracking-widest text-bg-app font-bold" style={{ backgroundColor: sigil.color }}>
                                {sigil.title}
                            </span>
                        )}
                    </div>
                </div>
                </div>
                
                <p className={`text-xs sm:text-sm mb-4 font-serif italic break-words ${task.isCompleted ? 'text-text-muted' : 'text-hell-lava'}`}>
                    "{task.description}"
                </p>

                {/* Subtasks Section */}
                {subtasks.length > 0 && !isHistoryView && (
                    <div className="mb-4 border-t border-hell-700/50 pt-2">
                        <div className="flex justify-between text-[10px] text-hell-gold uppercase mb-1">
                            <span>{t.subtasks}</span>
                            <span>{completedSubtasks} / {subtasks.length}</span>
                        </div>
                        <div className="h-1 bg-hell-900 w-full mb-2 rounded overflow-hidden">
                            <div className="h-full bg-hell-lava transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="space-y-1">
                            {subtasks.map(st => (
                                <div key={st.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-hell-800/30 p-1 rounded" onClick={(e) => { e.stopPropagation(); onToggleSubtask && onToggleSubtask(task.id, st.id); }}>
                                    <div className={`w-3 h-3 border border-hell-600 flex items-center justify-center ${st.isCompleted ? 'bg-hell-600' : 'bg-transparent'}`}>
                                        {st.isCompleted && <span className="text-white text-[8px]">✓</span>}
                                    </div>
                                    <span className={`${st.isCompleted ? 'text-text-muted line-through' : 'text-text-secondary'}`}>{st.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 border-t border-hell-700 pt-2">
                    <div className="text-[10px] sm:text-xs text-text-muted">
                        <span className="block">⏳ {new Date(task.deadline).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}</span>
                    </div>

                    {!isHistoryView ? (
                    <div className="flex gap-2 w-full sm:w-auto z-20">
                        <HellButton variant="danger" onClick={(e) => { e.stopPropagation(); confirm(t.confirmDelete) && onDelete(task.id); }} className="!py-2 !px-3 text-xs flex-1 sm:flex-initial flex justify-center">
                        ❌
                        </HellButton>
                        <HellButton variant="secondary" onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="!py-2 !px-3 text-xs flex-1 sm:flex-initial flex justify-center">
                        ✏️
                        </HellButton>
                        <HellButton variant="primary" onClick={(e) => { e.stopPropagation(); onComplete(task.id); }} className="!py-2 !px-3 text-xs flex-[2] sm:flex-initial whitespace-nowrap flex justify-center">
                        {t.execute}
                        </HellButton>
                    </div>
                    ) : (
                    <span className="text-hell-gold text-xs font-bold uppercase self-end">
                        {t.sealStamped}
                    </span>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
