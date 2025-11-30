
import React from 'react';
import { Achievement } from '../types';
import { translations, Language } from '../translations';

interface AchievementsViewProps {
  achievements: Achievement[];
  lang: Language;
}

interface AchievementDefinition {
  type: string;
  title: {
    ru: string;
    en: string;
    he: string;
  };
  description: {
    ru: string;
    en: string;
    he: string;
  };
  icon: string;
}

const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    type: 'first_task',
    title: { ru: 'Первая Цепь', en: 'First Chain', he: 'השרשרת הראשונה' },
    description: { ru: 'Выполните первую задачу', en: 'Complete your first task', he: 'השלם את המשימה הראשונה' },
    icon: '🔗'
  },
  {
    type: 'task_streak_7',
    title: { ru: 'Неделя Огня', en: 'Week of Fire', he: 'שבוע של אש' },
    description: { ru: 'Выполняйте задачи 7 дней подряд', en: 'Complete tasks for 7 days in a row', he: 'השלם משימות 7 ימים ברצף' },
    icon: '🔥'
  },
  {
    type: 'task_streak_30',
    title: { ru: 'Месяц Пламени', en: 'Month of Flame', he: 'חודש של להבה' },
    description: { ru: 'Выполняйте задачи 30 дней подряд', en: 'Complete tasks for 30 days in a row', he: 'השלם משימות 30 ימים ברצף' },
    icon: '⚡'
  },
  {
    type: 'complete_10_tasks',
    title: { ru: 'Десять Звеньев', en: 'Ten Links', he: 'עשרה קישורים' },
    description: { ru: 'Выполните 10 задач', en: 'Complete 10 tasks', he: 'השלם 10 משימות' },
    icon: '🔟'
  },
  {
    type: 'complete_50_tasks',
    title: { ru: 'Мастер Цепей', en: 'Chain Master', he: 'אדון השרשראות' },
    description: { ru: 'Выполните 50 задач', en: 'Complete 50 tasks', he: 'השלם 50 משימות' },
    icon: '👑'
  },
  {
    type: 'complete_100_tasks',
    title: { ru: 'Легенда Кузницы', en: 'Forge Legend', he: 'אגדת הנפחייה' },
    description: { ru: 'Выполните 100 задач', en: 'Complete 100 tasks', he: 'השלם 100 משימות' },
    icon: '💀'
  },
  {
    type: 'ritual_streak_7',
    title: { ru: 'Ритуальная Сила', en: 'Ritual Power', he: 'כוח טקסי' },
    description: { ru: 'Выполняйте ритуалы 7 дней подряд', en: 'Perform rituals for 7 days in a row', he: 'בצע טקסים 7 ימים ברצף' },
    icon: '🕯️'
  },
  {
    type: 'ritual_streak_30',
    title: { ru: 'Великий Ритуал', en: 'Great Ritual', he: 'טקס גדול' },
    description: { ru: 'Выполняйте ритуалы 30 дней подряд', en: 'Perform rituals for 30 days in a row', he: 'בצע טקסים 30 ימים ברצף' },
    icon: '🌟'
  },
  {
    type: 'create_10_notes',
    title: { ru: 'Скриб', en: 'Scribe', he: 'סופר' },
    description: { ru: 'Создайте 10 заметок', en: 'Create 10 notes', he: 'צור 10 הערות' },
    icon: '📜'
  },
  {
    type: 'create_50_notes',
    title: { ru: 'Хранитель Знаний', en: 'Keeper of Knowledge', he: 'שומר הידע' },
    description: { ru: 'Создайте 50 заметок', en: 'Create 50 notes', he: 'צור 50 הערות' },
    icon: '📚'
  },
  {
    type: 'total_gold_1000',
    title: { ru: 'Богатство', en: 'Wealth', he: 'עושר' },
    description: { ru: 'Накопите 1000 золота', en: 'Accumulate 1000 gold', he: 'צבור 1000 זהב' },
    icon: '💰'
  },
  {
    type: 'total_gold_10000',
    title: { ru: 'Король Золота', en: 'Gold King', he: 'מלך הזהב' },
    description: { ru: 'Накопите 10000 золота', en: 'Accumulate 10000 gold', he: 'צבור 10000 זהב' },
    icon: '👑'
  }
];

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements, lang }) => {
  const t = translations[lang];

  console.log('[AchievementsView] Received achievements:', achievements.length, achievements);

  const getAchievement = (type: string): Achievement | undefined => {
    return achievements.find(a => a.type === type);
  };

  const isUnlocked = (achievement: Achievement | undefined): boolean => {
    return achievement !== undefined && achievement.unlockedAt !== undefined && achievement.unlockedAt > 0;
  };

  const getProgress = (achievement: Achievement | undefined, target: number): number => {
    if (!achievement) return 0;
    const actualTarget = achievement.target || target;
    return Math.min(100, (achievement.progress / actualTarget) * 100);
  };
  
  // Get target for achievement type
  const getTargetForType = (type: string): number => {
    if (type === 'first_task') return 1;
    if (type === 'complete_10_tasks') return 10;
    if (type === 'complete_50_tasks') return 50;
    if (type === 'complete_100_tasks') return 100;
    if (type === 'create_10_notes') return 10;
    if (type === 'create_50_notes') return 50;
    if (type === 'ritual_streak_7') return 7;
    if (type === 'ritual_streak_30') return 30;
    if (type === 'task_streak_7') return 7;
    if (type === 'task_streak_30') return 30;
    if (type === 'total_gold_1000') return 1000;
    if (type === 'total_gold_10000') return 10000;
    return 0;
  };

  return (
    <div className="animate-flicker">
      <div className="mb-6 border-b border-hell-700 pb-4">
        <h2 className="text-xl font-cinzel text-hell-gold uppercase tracking-widest">
          {lang === 'ru' ? 'Достижения' : lang === 'he' ? 'הישגים' : 'Achievements'}
        </h2>
        <p className="text-sm text-text-muted mt-2">
          {lang === 'ru' 
            ? 'Откройте все достижения, чтобы доказать свою преданность Кузнице'
            : lang === 'he'
            ? 'פתח את כל ההישגים כדי להוכיח את נאמנותך לנפחייה'
            : 'Unlock all achievements to prove your devotion to the Forge'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENT_DEFINITIONS.map(def => {
          const achievement = getAchievement(def.type);
          const unlocked = isUnlocked(achievement);
          const target = getTargetForType(def.type);
          const progress = getProgress(achievement, target);

          return (
            <div
              key={def.type}
              className={`
                bg-bg-panel border p-4 rounded-sm transition-all
                ${unlocked 
                  ? 'border-hell-gold shadow-[0_0_15px_rgba(251,191,36,0.2)]' 
                  : 'border-hell-700 opacity-60'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  text-3xl
                  ${unlocked ? '' : 'grayscale opacity-50'}
                `}>
                  {def.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`
                    font-cinzel text-sm uppercase mb-1
                    ${unlocked ? 'text-hell-gold' : 'text-text-muted'}
                  `}>
                    {def.title[lang]}
                  </h3>
                  <p className="text-xs text-text-secondary mb-3">
                    {def.description[lang]}
                  </p>
                  
                  {!unlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-text-muted mb-1">
                        <span>
                          {lang === 'ru' ? 'Прогресс' : lang === 'he' ? 'התקדמות' : 'Progress'}
                        </span>
                        <span>
                          {achievement ? `${achievement.progress} / ${achievement.target || target}` : `0 / ${target}`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-hell-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-hell-lava transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {unlocked && achievement && (
                    <div className="text-xs text-hell-gold mt-2">
                      {lang === 'ru' 
                        ? `Разблокировано: ${new Date(achievement.unlockedAt!).toLocaleDateString('ru-RU')}`
                        : lang === 'he'
                        ? `נפתח: ${new Date(achievement.unlockedAt!).toLocaleDateString('he-IL')}`
                        : `Unlocked: ${new Date(achievement.unlockedAt!).toLocaleDateString('en-US')}`
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

