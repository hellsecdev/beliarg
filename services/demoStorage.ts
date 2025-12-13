
import { Task, Transaction, Note, Ritual, Sigil, Achievement, Difficulty, TransactionType } from '../types';

const DEMO_STORAGE_KEY = 'beliarg_demo_data';

// Generate demo data
const generateDemoData = () => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    // Sigils
    const sigils: Sigil[] = [
        { id: 'sigil-1', title: 'Работа', color: '#ef4444' },
        { id: 'sigil-2', title: 'Личное', color: '#3b82f6' },
        { id: 'sigil-3', title: 'Здоровье', color: '#10b981' },
        { id: 'sigil-4', title: 'Финансы', color: '#f59e0b' },
        { id: 'sigil-5', title: 'Обучение', color: '#8b5cf6' }
    ];

    // Tasks
    const tasks: Task[] = [
        {
            id: 'task-1',
            title: 'Завершить проект Beliarg',
            description: 'Доделать все фичи и задеплоить на GitHub Pages',
            deadline: new Date(now + 3 * dayMs).toISOString().split('T')[0],
            difficulty: Difficulty.INFERNO,
            isCompleted: false,
            createdAt: now - 5 * dayMs,
            sigilId: 'sigil-1',
            subtasks: [
                { id: 'sub-1', title: 'Создать демо-режим', isCompleted: true },
                { id: 'sub-2', title: 'Настроить GitHub Pages', isCompleted: false }
            ]
        },
        {
            id: 'task-2',
            title: 'Изучить TypeScript',
            description: 'Пройти курс по продвинутому TypeScript',
            deadline: new Date(now + 7 * dayMs).toISOString().split('T')[0],
            difficulty: Difficulty.EMBER,
            isCompleted: false,
            createdAt: now - 2 * dayMs,
            sigilId: 'sigil-5'
        },
        {
            id: 'task-3',
            title: 'Тренировка в спортзале',
            description: 'Силовая тренировка + кардио',
            deadline: new Date(now).toISOString().split('T')[0],
            difficulty: Difficulty.ASH,
            isCompleted: true,
            createdAt: now - 1 * dayMs,
            completedAt: now - 12 * 60 * 60 * 1000,
            sigilId: 'sigil-3'
        },
        {
            id: 'task-4',
            title: 'Оплатить счета',
            description: 'Коммунальные услуги и интернет',
            deadline: new Date(now + 2 * dayMs).toISOString().split('T')[0],
            difficulty: Difficulty.ASH,
            isCompleted: false,
            createdAt: now - 3 * dayMs,
            sigilId: 'sigil-4'
        },
        {
            id: 'task-5',
            title: 'Подготовить презентацию',
            description: 'Слайды для выступления на конференции',
            deadline: new Date(now + 10 * dayMs).toISOString().split('T')[0],
            difficulty: Difficulty.EMBER,
            isCompleted: false,
            createdAt: now - 4 * dayMs,
            sigilId: 'sigil-1'
        },
        {
            id: 'task-6',
            title: 'Прочитать книгу',
            description: 'Завершить "Clean Code"',
            deadline: new Date(now + 14 * dayMs).toISOString().split('T')[0],
            difficulty: Difficulty.ASH,
            isCompleted: false,
            createdAt: now - 6 * dayMs,
            sigilId: 'sigil-5'
        },
        {
            id: 'task-7',
            title: 'Рефакторинг кода',
            description: 'Улучшить архитектуру проекта',
            deadline: new Date(now + 5 * dayMs).toISOString().split('T')[0],
            difficulty: Difficulty.INFERNO,
            isCompleted: false,
            createdAt: now - 7 * dayMs,
            sigilId: 'sigil-1'
        }
    ];

    // Rituals
    const rituals: Ritual[] = [
        {
            id: 'ritual-1',
            title: 'Утренняя медитация',
            streak: 12,
            lastPerformed: now - 1 * dayMs
        },
        {
            id: 'ritual-2',
            title: 'Чтение кода',
            streak: 5,
            lastPerformed: now - 0.5 * dayMs
        },
        {
            id: 'ritual-3',
            title: 'Вечерняя прогулка',
            streak: 8,
            lastPerformed: now - 2 * dayMs
        }
    ];

    // Transactions
    const transactions: Transaction[] = [
        { id: 'trans-1', title: 'Зарплата', amount: 50000, type: TransactionType.TRIBUTE, date: new Date(now - 5 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-1' },
        { id: 'trans-2', title: 'Аренда квартиры', amount: -15000, type: TransactionType.SACRIFICE, date: new Date(now - 3 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-4' },
        { id: 'trans-3', title: 'Продукты', amount: -5000, type: TransactionType.SACRIFICE, date: new Date(now - 2 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-2' },
        { id: 'trans-4', title: 'Фриланс проект', amount: 20000, type: TransactionType.TRIBUTE, date: new Date(now - 1 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-1' },
        { id: 'trans-5', title: 'Транспорт', amount: -2000, type: TransactionType.SACRIFICE, date: new Date(now - 1 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-2' },
        { id: 'trans-6', title: 'Подписка на сервисы', amount: -1500, type: TransactionType.SACRIFICE, date: new Date(now).toISOString().split('T')[0], sigilId: 'sigil-1' },
        { id: 'trans-7', title: 'Бонус', amount: 10000, type: TransactionType.TRIBUTE, date: new Date(now - 4 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-1' },
        { id: 'trans-8', title: 'Одежда', amount: -8000, type: TransactionType.SACRIFICE, date: new Date(now - 6 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-2' },
        { id: 'trans-9', title: 'Ресторан', amount: -3000, type: TransactionType.SACRIFICE, date: new Date(now - 2 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-2' },
        { id: 'trans-10', title: 'Инвестиции', amount: 5000, type: TransactionType.TRIBUTE, date: new Date(now - 7 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-4' },
        { id: 'trans-11', title: 'Коммунальные услуги', amount: -4000, type: TransactionType.SACRIFICE, date: new Date(now - 8 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-4' },
        { id: 'trans-12', title: 'Курсы', amount: -6000, type: TransactionType.SACRIFICE, date: new Date(now - 9 * dayMs).toISOString().split('T')[0], sigilId: 'sigil-5' }
    ];

    // Notes
    const notes: Note[] = [
        {
            id: 'note-1',
            title: 'Идея для проекта',
            content: 'Создать систему управления задачами с геймификацией. Использовать темную тему и мистическую атмосферу.',
            createdAt: now - 10 * dayMs,
            updatedAt: now - 10 * dayMs,
            sigilId: 'sigil-1'
        },
        {
            id: 'note-2',
            title: 'Рефлексия',
            content: 'Сегодня был продуктивный день. Завершил несколько важных задач и чувствую прогресс.',
            createdAt: now - 3 * dayMs,
            updatedAt: now - 3 * dayMs,
            sigilId: 'sigil-2'
        },
        {
            id: 'note-3',
            title: 'Планы на неделю',
            content: '1. Завершить проект 2. Изучить новый фреймворк 3. Встретиться с командой',
            createdAt: now - 5 * dayMs,
            updatedAt: now - 5 * dayMs,
            sigilId: 'sigil-1'
        },
        {
            id: 'note-4',
            title: 'Мотивация',
            content: 'Каждый день - это возможность стать лучше. Не останавливайся на достигнутом.',
            createdAt: now - 7 * dayMs,
            updatedAt: now - 7 * dayMs,
            sigilId: 'sigil-2'
        },
        {
            id: 'note-5',
            title: 'Технические заметки',
            content: 'Использовать React 19, TypeScript, PostgreSQL. Добавить PWA поддержку для офлайн работы.',
            createdAt: now - 8 * dayMs,
            updatedAt: now - 8 * dayMs,
            sigilId: 'sigil-5'
        },
        {
            id: 'note-6',
            title: 'Финансовые цели',
            content: 'К концу года накопить 100000. Сократить расходы на развлечения. Увеличить доходы.',
            createdAt: now - 12 * dayMs,
            updatedAt: now - 12 * dayMs,
            sigilId: 'sigil-4'
        },
        {
            id: 'note-7',
            title: 'Здоровье',
            content: 'Регулярные тренировки дают энергию. Важно не пропускать и поддерживать режим.',
            createdAt: now - 4 * dayMs,
            updatedAt: now - 4 * dayMs,
            sigilId: 'sigil-3'
        }
    ];

    // Achievements
    const achievements: Achievement[] = [
        {
            id: 'ach-1',
            userId: 'demo-user',
            type: 'first_task',
            unlockedAt: now - 30 * dayMs,
            progress: 1,
            target: 1
        },
        {
            id: 'ach-2',
            userId: 'demo-user',
            type: 'tasks_10',
            unlockedAt: now - 15 * dayMs,
            progress: 10,
            target: 10
        },
        {
            id: 'ach-3',
            userId: 'demo-user',
            type: 'tasks_50',
            progress: 25,
            target: 50
        },
        {
            id: 'ach-4',
            userId: 'demo-user',
            type: 'ritual_streak_7',
            unlockedAt: now - 5 * dayMs,
            progress: 7,
            target: 7
        },
        {
            id: 'ach-5',
            userId: 'demo-user',
            type: 'notes_10',
            progress: 7,
            target: 10
        }
    ];

    return {
        tasks,
        transactions,
        rituals,
        notes,
        sigils,
        achievements
    };
};

// Load demo data from localStorage or generate new
const getDemoData = () => {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse demo data:', e);
        }
    }
    const data = generateDemoData();
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
    return data;
};

// Save demo data to localStorage
const saveDemoData = (data: any) => {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
};

export const demoStorage = {
    loadAllData() {
        const data = getDemoData();
        return Promise.resolve({
            tasks: data.tasks || [],
            transactions: data.transactions || [],
            rituals: data.rituals || [],
            notes: data.notes || [],
            sigils: data.sigils || [],
            achievements: data.achievements || []
        });
    },

    saveTask(task: Task) {
        const data = getDemoData();
        const index = data.tasks.findIndex((t: Task) => t.id === task.id);
        if (index >= 0) {
            data.tasks[index] = task;
        } else {
            data.tasks.push(task);
        }
        saveDemoData(data);
        return Promise.resolve();
    },

    deleteTask(id: string) {
        const data = getDemoData();
        data.tasks = data.tasks.filter((t: Task) => t.id !== id);
        saveDemoData(data);
        return Promise.resolve();
    },

    saveTransaction(trans: Transaction) {
        const data = getDemoData();
        const index = data.transactions.findIndex((t: Transaction) => t.id === trans.id);
        if (index >= 0) {
            data.transactions[index] = trans;
        } else {
            data.transactions.push(trans);
        }
        saveDemoData(data);
        return Promise.resolve();
    },

    deleteTransaction(id: string) {
        const data = getDemoData();
        data.transactions = data.transactions.filter((t: Transaction) => t.id !== id);
        saveDemoData(data);
        return Promise.resolve();
    },

    saveNote(note: Note) {
        const data = getDemoData();
        const index = data.notes.findIndex((n: Note) => n.id === note.id);
        if (index >= 0) {
            data.notes[index] = note;
        } else {
            data.notes.push(note);
        }
        saveDemoData(data);
        return Promise.resolve();
    },

    deleteNote(id: string) {
        const data = getDemoData();
        data.notes = data.notes.filter((n: Note) => n.id !== id);
        saveDemoData(data);
        return Promise.resolve();
    },

    saveRitual(ritual: Ritual) {
        const data = getDemoData();
        const index = data.rituals.findIndex((r: Ritual) => r.id === ritual.id);
        if (index >= 0) {
            data.rituals[index] = ritual;
        } else {
            data.rituals.push(ritual);
        }
        saveDemoData(data);
        return Promise.resolve();
    },

    saveSigil(sigil: Sigil) {
        const data = getDemoData();
        const index = data.sigils.findIndex((s: Sigil) => s.id === sigil.id);
        if (index >= 0) {
            data.sigils[index] = sigil;
        } else {
            data.sigils.push(sigil);
        }
        saveDemoData(data);
        return Promise.resolve();
    },

    // Reset demo data to initial state
    resetDemoData() {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        return Promise.resolve();
    }
};


